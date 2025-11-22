RPO v0.1 — Developer Guide

Minimal JSON profile • Hashing • Validation • Integration

The RPO (Rapport Probatoire Ouvert) standard defines a minimal, verifiable structure for digital evidence.
This guide focuses on the developer essentials needed to parse, validate, hash, and integrate RPO bundles.

1. Minimal RPO JSON structure (v0.1)

A valid RPO v0.1 bundle contains the following top-level fields:

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
      "id": "string",
      "type": "string",
      "source": "string",
      "description": "string",
      "text_ref": "string"
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
      "years": [],
      "places": []
    },
    "psycho_forensic": {
      "available": false,
      "note": "string"
    }
  }
}


This is the canonical minimal profile for the open version of RPO.

2. Hashing (public_hash)
Algorithm

RPO v0.1 uses SHA-256.
The public_hash is computed over a deterministic string concatenation of the minimal fields:

rpo_version=<v>|
bundle_id=<id>|
created_at=<iso>|
issuer=<string>|
subject=<string>|
title=<string>|
narrative=<text>

Example (pseudo-code)
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

Validation
def validate_public_hash(bundle):
    expected = compute_public_hash(bundle)
    return expected == bundle["registry"]["public_hash"]

3. How to integrate an RPO bundle into your system
a) Parse JSON

There is no special format, just standard JSON:

import json

with open("rpo.json") as f:
    rpo = json.load(f)

b) Validate required fields

Implementers should validate:

presence of the top-level fields

presence of narrative title & text

bundle_id uniqueness (your responsibility)

correct SHA-256 format (64 hex characters)

ISO timestamp correctness

Minimal check (Python):

def validate_structure(rpo):
    required = [
        "rpo_version", "bundle_id", "created_at",
        "issuer", "subject", "narrative",
        "evidence", "registry", "meta"
    ]
    for k in required:
        if k not in rpo:
            raise ValueError(f"Missing field: {k}")

4. Generating your own RPO bundle programmatically

Basic example:

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
            "registry_hint": "No registry anchor in minimal profile"
        },
        "meta": {
            "playground": False
        }
    }


Add hash:

bundle = new_rpo(...)
bundle["registry"]["public_hash"] = compute_public_hash(bundle)

5. Validating an RPO bundle in CI/CD

You can add a step in GitHub Actions:

- name: Validate RPO JSON
  run: |
    python3 validate_rpo.py docs/examples/example-minimal/rpo.json

6. Common developer questions
Q1. Can I add custom fields?

Yes, as long as:

you do not modify the minimal required fields,

custom fields are placed under a namespace such as:

"extensions": {
  "my_org": { ... }
}

Q2. Does the public_hash sign the PDF?

No. It signs the narrative text + metadata.
PDF integrity is checked via pdf_hash.

Q3. Is the registry required?

Not in v0.1.
A later version will define remote anchoring.

7. What developers should NOT assume

RPO does not determine truth or falsity.

RPO does not replace legal analysis.

RPO does not embed AI models in the open version.

RPO does not guarantee authenticity of the narrative — only immutability.

8. Minimal implementation checklist (copy/paste)

To accept RPO bundles in your system, you must:

 Parse JSON

 Validate minimal fields

 Enforce ISO timestamp

 Recompute public_hash and compare

 Reject bundle if fields missing or hash mismatch

 (Optional) Validate pdf_hash

 (Optional) Validate bundle_id uniqueness

 (Optional) Validate schemas if using JSON Schema

9. Example: command-line validation tool
#!/usr/bin/env python3

import sys, json
from rpo_lib import compute_public_hash

def main(path):
    data = json.load(open(path))
    expected = compute_public_hash(data)
    if expected == data["registry"]["public_hash"]:
        print("✔ RPO bundle is valid")
    else:
        print("✘ INVALID RPO BUNDLE")
        print("expected:", expected)
        print("found:   ", data["registry"]["public_hash"])

if __name__ == "__main__":
    main(sys.argv[1])

10. Contact

For technical questions, implementations or interoperability:

openproof@truthx.co


