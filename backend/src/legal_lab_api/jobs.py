from __future__ import annotations

import shutil
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Callable

from .config import Settings


@dataclass
class Job:
    id: str
    directory: Path
    created_at: datetime
    expires_at: datetime
    status: str = "queued"
    error: str | None = None
    artifacts: dict[str, Path] = field(default_factory=dict)


class JobManager:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.settings.data_dir.mkdir(parents=True, exist_ok=True)
        self._jobs: dict[str, Job] = {}
        self._lock = threading.RLock()
        self._executor = ThreadPoolExecutor(max_workers=settings.worker_count, thread_name_prefix="openproof-job")

    def create(self) -> Job:
        with self._lock:
            active = sum(job.status in {"queued", "running"} for job in self._jobs.values())
            if active >= self.settings.max_queue:
                raise RuntimeError("The processing queue is full.")
            now = datetime.now(timezone.utc)
            job_id = uuid.uuid4().hex
            directory = self.settings.data_dir / job_id
            directory.mkdir(mode=0o700)
            job = Job(job_id, directory, now, now + timedelta(seconds=self.settings.retention_seconds))
            self._jobs[job_id] = job
            return job

    def get(self, job_id: str) -> Job | None:
        with self._lock:
            return self._jobs.get(job_id)

    def submit(self, job: Job, processor: Callable[[Job], dict[str, Path]]) -> None:
        def run() -> None:
            with self._lock:
                if job.status == "deleted":
                    return
                job.status = "running"
            try:
                artifacts = processor(job)
                with self._lock:
                    job.artifacts = artifacts
                    job.status = "completed"
            except Exception as exc:  # keep details out of the public response
                with self._lock:
                    job.error = type(exc).__name__
                    job.status = "failed"

        self._executor.submit(run)

    def delete(self, job_id: str) -> bool:
        with self._lock:
            job = self._jobs.get(job_id)
            if not job or job.status == "running":
                return False
            self._jobs.pop(job_id, None)
            job.status = "deleted"
        shutil.rmtree(job.directory, ignore_errors=True)
        return True

    def purge_expired(self) -> int:
        now = datetime.now(timezone.utc)
        with self._lock:
            expired = [job.id for job in self._jobs.values() if job.expires_at <= now and job.status not in {"queued", "running"}]
        return sum(self.delete(job_id) for job_id in expired)

    def shutdown(self) -> None:
        self._executor.shutdown(wait=True, cancel_futures=True)
        for job_id in list(self._jobs):
            self.delete(job_id)
