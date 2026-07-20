from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


def _positive_int(name: str, default: int) -> int:
    try:
        value = int(os.getenv(name, str(default)))
    except ValueError:
        return default
    return value if value > 0 else default


@dataclass(frozen=True)
class Settings:
    """Runtime limits. Defaults are deliberately conservative for a public MVP."""

    data_dir: Path = Path(os.getenv("OPENPROOF_DATA_DIR", "/tmp/openproof-legal-evidence-lab"))
    max_files: int = _positive_int("OPENPROOF_MAX_FILES", 20)
    max_file_bytes: int = _positive_int("OPENPROOF_MAX_FILE_BYTES", 10 * 1024 * 1024)
    max_total_bytes: int = _positive_int("OPENPROOF_MAX_TOTAL_BYTES", 50 * 1024 * 1024)
    max_queue: int = _positive_int("OPENPROOF_MAX_QUEUE", 16)
    worker_count: int = _positive_int("OPENPROOF_WORKERS", 2)
    retention_seconds: int = _positive_int("OPENPROOF_RETENTION_SECONDS", 60 * 60)
    truthx_enabled: bool = os.getenv("OPENPROOF_TRUTHX_ENABLED", "false").lower() == "true"
    truthx_url: str = os.getenv("OPENPROOF_TRUTHX_URL", "")
