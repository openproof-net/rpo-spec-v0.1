
# ⚖️ OpenProof — RPO Specification v0.1  
Integrity · Readability · Verifiability

A civil code for digital evidence in an age ruled by narratives.

OpenProof defines a public, deterministic and testable format for structuring digital evidence.  
Its core artifact, the RPO (Rapport Probatoire Ouvert), is a dual-format bundle ensuring:

- machines can verify **integrity**,  
- humans can read **coherence**,  
- institutions can trust the **structure** of evidence.

OpenProof does **not** determine truth or falsity.  
It guarantees that **nothing can be altered without detection**.

══════════════════════════════════

## 1. 🎯 Why OpenProof Exists — The Crisis We Are Fixing

Digital evidence is collapsing.

Today, “evidence” often means:

- screenshots no system can authenticate,  
- PDFs whose origin no one can verify,  
- AI-generated narratives with no traceability,  
- fragmented logs scattered across institutions,  
- internal formats that die with each organisation.

Everyone talks about *truth*.  
Very few artifacts are *verifiable*.

**OpenProof is born from this failure.**  
It establishes a minimal, deterministic and testable foundation that any institution, auditor or registry can check — independently and predictably.

> If machines can verify integrity, and humans can read coherence, society can trust evidence again.

══════════════════════════════════

## 2. 🏛️ What OpenProof Is — A Minimal, Enforceable Standard

The RPO guarantees three invariants:

### ✔ Integrity  
A signed JSON whose fields can be recomputed and validated.

### ✔ Readability  
A human-readable PDF mirroring the narrative.

### ✔ Verifiability  
A deterministic SHA-256 public hash anchoring immutability.

OpenProof does not adjudicate truth.  
It ensures that **any change becomes detectable**.

══════════════════════════════════

## 3. 📘 The RPO “Civil Code” — Minimal Profile (v0.1)

This is the canonical baseline of a compliant RPO bundle:

```json
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
    }
  }
}


══════════════════════════════════

4. 🔐 Hashing Algorithm (SHA-256)

The public hash is computed through a strict deterministic concatenation:

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
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


══════════════════════════════════

5. 🧪 Validating an RPO Bundle

A system must reject an RPO if:

mandatory fields are missing

timestamp is not ISO-8601

hash is not a 64-char hex

narrative structure is invalid

recomputed hash does not match

def validate_public_hash(bundle):
    expected = compute_public_hash(bundle)
    return expected == bundle["registry"]["public_hash"]


══════════════════════════════════

6. 🛠️ Generating a New RPO (Developer Example)
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


══════════════════════════════════

7. 🧭 Try the Engine — RPO Playground

Open, deterministic, no AI, no registry.

Transform any narrative into:

a minimal RPO JSON,

heuristic markers,

a deterministic SHA-256 hash.

🔗 https://rpo.openproof.net/playground.html

══════════════════════════════════

8. 🔬 Scientific Pilot (CNRS × TruthX)

The open standard does not include interpretive or psycho-forensic analysis.
These modules live in the scientific pilot:

narrative inversion,

coercive control signals,

interpretive coherence,

structure-level markers.

🔗 https://www.truthx.co/truthx-pilote-form

══════════════════════════════════

9. 🤝 Contributing

OpenProof welcomes contributions from:

engineers (validation, hashing, schema),

legal teams (probatory constraints),

researchers (structures, bias, narrative logic),

OSINT & forensic analysts (field use cases).

══════════════════════════════════

10. 📬 Contact

openproof@truthx.co

LinkedIn: https://www.linkedin.com/in/gryard/

══════════════════════════════════

11. 👤 Maintainer

This specification is maintained by Gersende Ryard de Parcey.
