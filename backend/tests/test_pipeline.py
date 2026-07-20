from pathlib import Path

from legal_lab_api.config import Settings
from legal_lab_api.jobs import JobManager
from legal_lab_api.pipeline import process_job
from legal_lab_api.truthx import TruthXBoundary


def test_pipeline_builds_rpo_and_keeps_signals_out_of_core(tmp_path: Path) -> None:
    work = tmp_path / "job"
    work.mkdir()
    (work / "messages.txt").write_text(
        "2026-01-12 — Personne B écrit : Tu dois répondre maintenant. Tu es inutile.\n"
        "2026-01-15 — Un témoin note la situation.",
        encoding="utf-8",
    )
    artifacts = process_job("a" * 32, work, TruthXBoundary())
    rpo, ledger = artifacts["rpo"], artifacts["ledger"]
    assert rpo["rpo_version"] == "0.1"
    assert len(rpo["registry"]["public_hash"]) == 64
    assert "signals" not in rpo
    assert "pression temporelle" in ledger["signals"]
    assert ledger["truthx_boundary"]["status"] == "disabled"


def test_job_manager_purges_only_expired_completed_job(tmp_path: Path) -> None:
    settings = Settings(data_dir=tmp_path, retention_seconds=1)
    manager = JobManager(settings)
    job = manager.create()
    job.status = "completed"
    job.expires_at = job.created_at
    assert manager.purge_expired() == 1
    assert not job.directory.exists()
    manager.shutdown()
