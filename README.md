# 🔵 OpenProof — RPO Specification v0.1  

Integrity · Readability · Verifiability  

A civil code for digital evidence in an age ruled by narratives.

OpenProof defines a public, deterministic and testable format for structuring digital evidence.  
Its core artifact, the **RPO (Rapport Probatoire Ouvert)**, is a dual-format bundle allowing:

- machines to verify integrity,  
- humans to read coherence,  
- institutions to trust the structure of evidence.  

OpenProof does not adjudicate truth.  
It ensures that nothing can be altered without detection.

---

## 1. 💙 Why OpenProof Exists — The Crisis We Are Fixing  

Digital evidence is collapsing.

Today, “evidence” often means:

- screenshots no system can authenticate,  
- PDFs whose origin no one can verify,  
- AI-generated narratives with no traceability,  
- fragmented logs scattered across institutions,  
- internal formats that die with each organisation.  

Everyone talks about truth. Very few artifacts are verifiable.

OpenProof is born from this failure.  
It provides a minimal, deterministic and testable foundation that any machine, institution or jurisdiction can check — independently, predictably, transparently.

If machines can verify integrity, and humans can read coherence, society can trust evidence again.

---

## 2. 🏛 What OpenProof Is — A Minimal, Enforceable Standard  

The RPO guarantees three invariants:

### ✔ Integrity  
A signed JSON whose fields can be recomputed and validated.

### ✔ Readability  
A human-readable PDF mirroring the narrative.

### ✔ Verifiability  
A deterministic **SHA-256 public hash** anchoring immutability.

OpenProof does not determine what is “true”.  
It ensures that any modification becomes detectable.

---

## 3. 📦 Minimal RPO JSON Structure (v0.1)  

This is the canonical baseline of a compliant RPO bundle:

```json
{
  "rpo_version": "0.1",
  "bundle_id": "string",
  "created_at": "ISO-8601 timestamp",
  "issuer":  { "label": "string" },
  "subject": { "label": "string" },
  "narrative": {
    "title": "string",
    "text": "string",
    "pdf_hash": "string"
  },
  "evidence": [],
  "registry": {
    "public_hash": "sha256 hex",
    "registry_hint": "string"
  },
  "meta": {
    "playground": false
  }
}
4. 🔐 Hashing Algorithm (public_hash)
RPO v0.1 uses SHA-256 over a deterministic concatenation of core fields:

text
Copier le code
rpo_version=<v>|
bundle_id=<id>|
created_at=<iso>|
issuer=<label>|
subject=<label>|
title=<title>|
narrative=<text>
Example (Python)
python
Copier le code
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
This guarantees deterministic validation across implementations.

5. ✅ Validating an RPO Bundle
Minimal validation helper (Python)
python
Copier le code
def validate_public_hash(bundle):
    expected = compute_public_hash(bundle)
    return expected == bundle["registry"]["public_hash"]
Required validations
At minimum, any implementation SHOULD:

check presence of mandatory fields,

validate an ISO-8601 created_at timestamp,

ensure public_hash is a 64-character hex string,

verify that the narrative structure matches the schema,

recompute the hash and reject on mismatch.

Optional validations (recommended)
validate pdf_hash,

enforce bundle_id uniqueness in the target registry,

run a full JSON Schema validation of the RPO structure.

6. 🧩 Generating a New RPO Bundle
This is a minimal example for creating a new bundle in Python:

python
Copier le code
import uuid
from datetime import datetime

def new_rpo(title, text, issuer, subject):
    bundle = {
        "rpo_version": "0.1",
        "bundle_id": f"rpo-{uuid.uuid4()}",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "issuer":  { "label": issuer },
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
        "meta": {
            "playground": False
        }
    }

    # Compute and attach public hash
    bundle["registry"]["public_hash"] = compute_public_hash(bundle)
    return bundle
7. 🎯 Try the Engine — RPO Sandbox
Open, deterministic, no AI, no registry.

The Sandbox lets you transform any narrative into:

a minimal RPO JSON,

heuristic markers,

a deterministic SHA-256 hash.

🔗 https://rpo.openproof.net/sandbox.html

Use it to prototype, test integrations and sanity-check your own RPO implementation.

8. 🔬 Scientific Pilot (CNRS × TruthX)
The open standard does not include interpretive or psycho-forensic analysis.
These modules live in the scientific pilot:

narrative inversion,

coercive control signals,

interpretive coherence,

structure-level markers.

This pilot extends the open standard for legal, research and institutional partners.

🔗 https://www.truthx.co/truthx-pilote-form

9. 🤝 Contributing
OpenProof welcomes contributions from:

engineers (validation, hashing, schema),

legal teams (probatory constraints),

researchers (structures, bias, narrative logic),

OSINT & forensic analysts (field use cases).

Issues, pull requests and spec discussions are encouraged in this repository.

10. 📫 Contact
Email: openproof@truthx.co

LinkedIn: https://www.linkedin.com/in/gryard/

11. 🛡 Maintainer
This specification is maintained by Gersende Ryard de Parcey.
