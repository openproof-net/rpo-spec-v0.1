from __future__ import annotations

import asyncio
import json
import re
import threading
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from .config import Settings
from .jobs import Job, JobManager
from .pipeline import ALLOWED_EXTENSIONS, process_job
from .truthx import TruthXBoundary

_JOB_ID = re.compile(r"^[a-f0-9]{32}$")


def _safe_upload_name(name: str | None) -> str:
    value = name or "unnamed"
    if value != Path(value).name or "\\" in value or value in {".", ".."}:
        raise HTTPException(status_code=400, detail="Invalid filename.")
    if len(value) > 180 or Path(value).suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file type or filename.")
    return value


def _job_payload(job: Job) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "job_id": job.id,
        "status": job.status,
        "created_at": job.created_at.isoformat(),
        "expires_at": job.expires_at.isoformat(),
        "status_url": f"/v1/jobs/{job.id}",
    }
    if job.status == "completed":
        payload["artifacts"] = {
            "rpo": f"/v1/jobs/{job.id}/rpo",
            "analysis_ledger": f"/v1/jobs/{job.id}/ledger",
        }
    if job.error:
        payload["error"] = "processing_failed"
    return payload


def create_app(settings: Settings | None = None) -> FastAPI:
    config = settings or Settings()
    manager = JobManager(config)
    stop_cleaner = threading.Event()

    def cleanup_loop() -> None:
        while not stop_cleaner.wait(60):
            manager.purge_expired()

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        cleaner = threading.Thread(target=cleanup_loop, name="openproof-cleaner", daemon=True)
        cleaner.start()
        try:
            yield
        finally:
            stop_cleaner.set()
            manager.shutdown()

    app = FastAPI(
        title="OpenProof Legal Evidence Lab API",
        version="0.1.0",
        description="Bounded processing boundary for the browser MVP; not a legal decision service.",
        lifespan=lifespan,
    )
    app.state.manager = manager

    @app.get("/healthz")
    async def healthz() -> dict[str, str]:
        return {"status": "ok", "service": "openproof-legal-evidence-lab"}

    @app.post("/v1/jobs", status_code=status.HTTP_202_ACCEPTED)
    async def create_job(files: list[UploadFile] = File(default=[]), note: str = Form(default="")) -> JSONResponse:
        if len(files) > config.max_files:
            raise HTTPException(status_code=413, detail="Too many files.")
        if not files and not note.strip():
            raise HTTPException(status_code=400, detail="Provide at least one supported file or a context note.")
        try:
            job = manager.create()
        except RuntimeError as exc:
            raise HTTPException(status_code=429, detail="The processing queue is full.") from exc
        total = 0
        try:
            for upload in files:
                filename = _safe_upload_name(upload.filename)
                target = job.directory / filename
                if target.exists():
                    raise HTTPException(status_code=400, detail="Duplicate filenames are not accepted.")
                size = 0
                with target.open("wb") as stream:
                    while True:
                        chunk = await upload.read(1024 * 1024)
                        if not chunk:
                            break
                        size += len(chunk)
                        total += len(chunk)
                        if size > config.max_file_bytes or total > config.max_total_bytes:
                            raise HTTPException(status_code=413, detail="Upload exceeds configured size limits.")
                        stream.write(chunk)
                await upload.close()
            if note.strip():
                if len(note.encode("utf-8")) > config.max_file_bytes:
                    raise HTTPException(status_code=413, detail="Context note exceeds configured size limits.")
                (job.directory / "context-note.txt").write_text(note, encoding="utf-8")
        except Exception:
            manager.delete(job.id)
            raise

        truthx = TruthXBoundary(enabled=config.truthx_enabled, endpoint=config.truthx_url)

        def processor(current: Job) -> dict[str, Path]:
            artifacts = process_job(current.id, current.directory, truthx)
            rpo_path = current.directory / "rpo.json"
            ledger_path = current.directory / "analysis-ledger.json"
            rpo_path.write_text(json.dumps(artifacts["rpo"], ensure_ascii=False, indent=2), encoding="utf-8")
            ledger_path.write_text(json.dumps(artifacts["ledger"], ensure_ascii=False, indent=2), encoding="utf-8")
            # Do not retain extracted text or uploaded source files after artifact creation.
            for path in current.directory.iterdir():
                if path not in {rpo_path, ledger_path}:
                    if path.is_file():
                        path.unlink(missing_ok=True)
            return {"rpo": rpo_path, "ledger": ledger_path}

        manager.submit(job, processor)
        return JSONResponse(_job_payload(job), status_code=status.HTTP_202_ACCEPTED)

    def require_job(job_id: str) -> Job:
        if not _JOB_ID.fullmatch(job_id):
            raise HTTPException(status_code=404, detail="Job not found.")
        job = manager.get(job_id)
        if not job or job.status == "deleted":
            raise HTTPException(status_code=404, detail="Job not found.")
        return job

    @app.get("/v1/jobs/{job_id}")
    async def get_job(job_id: str) -> dict[str, Any]:
        return _job_payload(require_job(job_id))

    @app.get("/v1/jobs/{job_id}/rpo")
    async def get_rpo(job_id: str) -> JSONResponse:
        job = require_job(job_id)
        if job.status != "completed":
            raise HTTPException(status_code=409, detail="Job is not completed.")
        return JSONResponse(json.loads(job.artifacts["rpo"].read_text(encoding="utf-8")))

    @app.get("/v1/jobs/{job_id}/ledger")
    async def get_ledger(job_id: str) -> JSONResponse:
        job = require_job(job_id)
        if job.status != "completed":
            raise HTTPException(status_code=409, detail="Job is not completed.")
        return JSONResponse(json.loads(job.artifacts["ledger"].read_text(encoding="utf-8")))

    @app.delete("/v1/jobs/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
    async def delete_job(job_id: str) -> None:
        require_job(job_id)
        if not manager.delete(job_id):
            raise HTTPException(status_code=409, detail="Running jobs cannot be deleted.")

    return app


app = create_app()


def main() -> None:
    import uvicorn

    uvicorn.run("legal_lab_api.app:app", host="127.0.0.1", port=8000, reload=False)
