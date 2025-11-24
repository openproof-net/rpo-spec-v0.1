OpenProof — RPO Specification v0.1

Integrity • Readability • Verifiability

OpenProof defines a public, testable and deterministic standard for digital evidence.
Its core object, the RPO (Rapport Probatoire Ouvert), provides a dual-format bundle designed so that:

machines can verify integrity,

humans can read coherence,

institutions can trust the structure of evidence.

OpenProof does not determine truth or falsity.
It ensures that nothing can be altered without detection.

1. What OpenProof is

OpenProof is a minimal but enforceable framework for structuring any narrative into a verifiable evidence bundle.

It provides three guarantees:

Integrity — A signed JSON whose fields can be re-computed and validated.

Readability — A human-readable PDF that mirrors the narrative.

Verifiability — A public SHA-256 hash anchoring immutability.

This acts as a civil code for digital evidence:
any RPO, from any system or jurisdiction, must follow the same structural rules.

2. The RPO “Civil Code” — Minimal Profile (v0.1)
{
  "rpo_version": "0.1",
  "bundle_id": "string",
  "created_at": "ISO-8601 timestamp",
  "issuer": { "label": "string" },
  "subject": { "label": "string" },
  "narrative": {
    "title": "string",
    "text": "string",
    "pdf_hash": "string"
  },
  "evidence": [
    {
      "id": "E1",
      "type": "narrative_block",
      "source": "user_input",
      "description": "Raw narrative",
      "text_ref": "narrative.text"
    }
  ],
  "registry": {
    "public_hash": "sha256 hex",
    "registry_hint": "string"
  },
  "meta": {
    "playground": true,
    "heuristic_scores": {
      "coherence_score": "int",
      "evidence_markers": "int",
      "sentence_count": "int"
    },
    "heuristic_anchors": {
      "dates": [],
      "places": [],
      "temporal_markers": "int"
    }
  }
}


This is the canonical baseline of the open RPO bundle.

3. Hashing Algorithm (public_hash)

RPO v0.1 uses SHA-256 over a strict concatenation of the core fields:

rpo_version=<v>|
bundle_id=<id>|
created_at=<iso>|
issuer=<label>|
subject=<label>|
title=<title>|
narrative=<text>


This guarantees deterministic validation across all implementations.

Example (Python)
import hashlib

def compute_public_hash(bundle):
    payload = (
        f"rpo_version={bundle['rpo_version']}|"
        f"bundle_id={bundle['bundle_id']}|"
        f"created_at={bundle['created_at']}|"
        f"issuer={bundle['issuer']['label']}|"
        f"subject={bundle['subject']['label']}|"
        f"title={bundle['narrative']['title']}|"
        f"narrative={bundle['narrative']['text']}"
    )
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()

4. Validating an RPO Bundle

To validate any RPO:

Parse JSON

Validate required fields

Check ISO-8601 timestamps

Recompute and compare public_hash

Reject any mismatch

(Optional) validate pdf_hash

(Optional) validate against a JSON Schema

Example:
def validate_public_hash(bundle):
    expected = compute_public_hash(bundle)
    return expected == bundle["registry"]["public_hash"]

5. Generating a New RPO Bundle
import uuid
from datetime import datetime

def new_rpo(title, text, issuer, subject):
    return {
        "rpo_version": "0.1",
        "bundle_id": f"rpo-{uuid.uuid4()}",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "issuer": { "label": issuer },
        "subject": { "label": subject },
        "narrative": {
            "title": title,
            "text": text,
            "pdf_hash": "placeholder"
        },
        "evidence": [],
        "registry": {
            "public_hash": "",
            "registry_hint": "No registry anchor in v0.1"
        },
        "meta": { "playground": False }
    }

6. Try It — RPO Sandbox (open, deterministic)

The sandbox shows how the RPO “civil code” behaves when applied to real narratives:

minimal rpo.json

heuristic scores

deterministic SHA-256 public hash

👉 https://rpo.openproof.net/sandbox.html

Runs locally in your browser — no AI, no registry, no server.

7. Examples

Example RPO bundles are available in the /examples folder.

They include:

minimal profiles

narrative variations

validation tests

8. What OpenProof does not assume

It does not decide truth or falsity

It does not replace legal analysis

It does not embed AI in the open version

It guarantees immutability, not authenticity

The open version establishes structure, not judgment.

9. Scientific Pilot — CNRS × TruthX

For advanced psycho-forensic layers (interpretive coherence, narrative inversion, coercive control markers), access is restricted to research pilots.

👉 https://www.truthx.co/truthx-pilote-form

This layer extends beyond the open standard.

10. Contribute

OpenProof welcomes collaboration from:

engineers

legal teams

OSINT & forensic analysts

researchers in cognition, narratives, and bias

institutions seeking interoperability

Maintainer

Gersende Ryard de Parcey
Specification Editor

Email: openproof@truthx.co

LinkedIn: https://www.linkedin.com/in/gryard/

License

MIT License — see /LICENSE.
