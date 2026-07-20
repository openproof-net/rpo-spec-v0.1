"""Public boundary adapter: normalized CNRS-style output -> OpenProof RPO v0.1.

The adapter deliberately keeps interpretive analysis outside the RPO core. The
public RPO records the evidence perimeter and a bounded summary; the simulator
renders signals and reservations as a separate human-readable view.
"""

from __future__ import annotations

from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
from uuid import UUID, uuid4


def _sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _canonical_core(bundle: dict) -> str:
    registry = bundle["registry"]
    return "|".join(
        [
            f"rpo_version={bundle['rpo_version']}",
            f"type={bundle['type']}",
            f"bundle_id={bundle['bundle_id']}",
            f"created_at={bundle['created_at']}",
            f"issuer={bundle['issuer']['name']}",
            f"subject={bundle['subject']['name']}",
            f"summary={bundle['narrative']['summary']}",
            f"pdf_hash={bundle['narrative']['pdf_hash']}",
            f"registry_id={registry['registry_id']}",
            f"entry_id={registry['entry_id']}",
        ]
    )


def build_rpo(agent_output: dict, *, created_at: str | None = None, bundle_id: str | None = None) -> dict:
    """Build a schema-shaped RPO from a normalized, synthetic agent output."""

    bundle_id = bundle_id or str(uuid4())
    UUID(bundle_id)  # fail early if the public bundle id is not a UUID
    created_at = created_at or datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    evidence = []
    for item in agent_output.get("evidence", []):
        description = str(item.get("description", ""))
        evidence.append(
            {
                "id": str(item["id"]),
                "type": str(item["type"]),
                "description": description,
                "hash": _sha256(description),
            }
        )

    bundle = {
        "rpo_version": "0.1",
        "type": "evidence_bundle",
        "bundle_id": bundle_id,
        "created_at": created_at,
        "jurisdiction": agent_output.get("jurisdiction", "demo"),
        "language": agent_output.get("language", "en"),
        "issuer": {
            "name": "OpenProof public reference implementation",
            "id": "openproof-public-demo",
            "role": "probative infrastructure",
        },
        "subject": {
            "name": agent_output.get("case_title", "Synthetic case"),
            "id": agent_output.get("case_id", "synthetic-case"),
            "role": "demo subject",
        },
        "evidence": evidence,
        "narrative": {
            "summary": agent_output.get("case_summary", ""),
            "pdf_hash": "not-generated-in-public-demo",
            "timeline_ref": f"timeline:{agent_output.get('case_id', 'synthetic-case')}",
        },
        "registry": {
            "registry_id": "openproof-public-demo",
            "entry_id": bundle_id,
            "public_hash": "",
        },
    }
    bundle["registry"]["public_hash"] = _sha256(_canonical_core(bundle))
    return bundle


if __name__ == "__main__":
    fixture = Path(__file__).parents[1] / "student-output.json"
    output = json.loads(fixture.read_text(encoding="utf-8"))
    print(json.dumps(build_rpo(output), indent=2, ensure_ascii=False))
