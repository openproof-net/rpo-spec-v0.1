from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .truthx import TruthXBoundary

TEXT_EXTENSIONS = {".txt", ".md", ".json", ".csv", ".xml"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp"}
PDF_EXTENSIONS = {".pdf"}
ALLOWED_EXTENSIONS = TEXT_EXTENSIONS | IMAGE_EXTENSIONS | PDF_EXTENSIONS


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _extract_text(path: Path) -> tuple[str, str, str | None]:
    suffix = path.suffix.lower()
    if suffix in TEXT_EXTENSIONS:
        return path.read_text(encoding="utf-8", errors="replace"), "text", None
    if suffix in PDF_EXTENSIONS:
        try:
            from pypdf import PdfReader  # type: ignore
        except ImportError:
            return "", "pdf", "PDF extraction is not installed; install the optional ocr extra."
        try:
            text = "\n".join(page.extract_text() or "" for page in PdfReader(str(path)).pages)
            return text, "pdf_text", None if text.strip() else "No text extracted from PDF."
        except Exception as exc:  # pragma: no cover - dependency-specific failures
            return "", "pdf", f"PDF extraction failed: {type(exc).__name__}"
    if suffix in IMAGE_EXTENSIONS:
        try:
            from PIL import Image  # type: ignore
            import pytesseract  # type: ignore
        except ImportError:
            return "", "image_ocr", "OCR is not installed; install the optional ocr extra."
        try:
            text = pytesseract.image_to_string(Image.open(path), config="--psm 6").strip()
            return text, "image_ocr", None if text else "No text detected by OCR."
        except Exception as exc:  # pragma: no cover - dependency-specific failures
            return "", "image_ocr", f"OCR failed: {type(exc).__name__}"
    return "", "unsupported", "Unsupported file extension."


def _unique(items: list[str], value: str) -> None:
    if value not in items:
        items.append(value)


def _analysis(text: str) -> tuple[list[str], list[str], list[str]]:
    dates = list(dict.fromkeys(re.findall(r"\b(?:20\d{2}-\d{2}-\d{2}|\d{2}/\d{2}/20\d{2})\b", text)))
    lower = text.lower()
    signals: list[str] = []
    if re.search(r"dois répondre|répondre maintenant|answer now|immediately|tout de suite", lower):
        _unique(signals, "pression temporelle")
    if re.search(r"inutile|worthless|stupid|idiot|insulte", lower):
        _unique(signals, "langage dépréciatif")
    if re.search(r"partagerai|contenu privé|share private|divulguer|disclose", lower):
        _unique(signals, "menace de divulgation")
    if re.search(r"retirée|exclusion|exclu|accès sera|access will", lower):
        _unique(signals, "pression ou exclusion institutionnelle")
    if re.search(r"nouveau calendrier|confirment|révisé|revised plan|désaccord ordinaire", lower):
        _unique(signals, "contre-signal : désaccord ordinaire")

    reservations: list[str] = []
    if len(dates) < 2:
        _unique(reservations, "peu d’ancrages temporels explicites")
    if not re.search(r"témoin|witness|journal|log|historique|history|joint|attach", lower):
        _unique(reservations, "source corroborante non identifiée")
    if re.search(r"aucun|pas joint|manque|missing|complet", lower):
        _unique(reservations, "jeu documentaire potentiellement incomplet")
    return dates, signals, reservations


def _canonical_hash(bundle: dict[str, Any]) -> str:
    unsigned = json.loads(json.dumps(bundle, ensure_ascii=False))
    unsigned["registry"]["public_hash"] = ""
    payload = json.dumps(unsigned, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def process_job(job_id: str, work_dir: Path, truthx: TruthXBoundary) -> dict[str, dict[str, Any]]:
    """Process only the explicitly-created job directory and return two artifacts."""
    files = sorted(path for path in work_dir.iterdir() if path.is_file() and path.name != "context-note.txt")
    evidence: list[dict[str, Any]] = []
    extracted: list[str] = []
    errors: list[dict[str, str]] = []
    for path in files:
        digest = sha256_file(path)
        text, extractor, error = _extract_text(path)
        if text.strip():
            extracted.append(f"[SOURCE: {path.name}]\n{text.strip()}")
        if error:
            errors.append({"filename": path.name, "error": error})
        evidence.append({
            "id": f"e-{len(evidence) + 1:03d}",
            "type": "document",
            "description": f"Locally submitted source {path.name}.",
            "filename": path.name,
            "extractor": extractor,
            "sha256": digest,
        })

    context_path = work_dir / "context-note.txt"
    context = context_path.read_text(encoding="utf-8", errors="replace") if context_path.exists() else ""
    combined = "\n\n---\n\n".join(extracted + (["[CONTEXT NOTE]\n" + context] if context.strip() else []))
    dates, signals, reservations = _analysis(combined)
    created_at = datetime.now(timezone.utc).isoformat()
    source_set_hash = hashlib.sha256(combined.encode("utf-8")).hexdigest()
    bundle: dict[str, Any] = {
        "rpo_version": "0.1",
        "type": "evidence_bundle",
        "bundle_id": job_id,
        "created_at": created_at,
        "issuer": {"name": "OpenProof Legal Evidence Lab", "id": "openproof-legal-evidence-lab", "role": "probative infrastructure"},
        "subject": {"name": "Submitted evidence review", "id": f"job-{job_id}", "role": "demo subject"},
        "evidence": evidence,
        "narrative": {
            "summary": "Submitted sources structured by the OpenProof public backend boundary. Exploratory signals remain outside the RPO core.",
            "pdf_hash": f"sha256:{source_set_hash}",
            "timeline_ref": f"timeline:{job_id}",
        },
        "registry": {"registry_id": "openproof-public-backend", "entry_id": job_id, "public_hash": ""},
    }
    bundle["registry"]["public_hash"] = _canonical_hash(bundle)
    ledger: dict[str, Any] = {
        "format": "openproof-analysis-ledger-draft",
        "version": "0.1",
        "generated_at": created_at,
        "boundary": "queued-backend-mvp",
        "rpo_bundle_id": job_id,
        "sources": evidence,
        "timeline": dates,
        "signals": signals,
        "reservations": reservations,
        "extraction_errors": errors,
        "interpretation": {
            "status": "reviewable" if signals and "contre-signal : désaccord ordinaire" not in signals else "exploratory",
            "note": "Deterministic exploration only; this service does not produce legal findings, advice or adjudication.",
        },
    }
    ledger["truthx_boundary"] = truthx.enrich(ledger)
    return {"rpo": bundle, "ledger": ledger}
