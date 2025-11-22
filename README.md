📘 OpenProof — RPO Specification v0.1

Integrity • Readability • Verifiability

Overview

OpenProof defines an open, verifiable standard for digital evidence.
The RPO (Rapport Probatoire Ouvert) is a dual-format bundle combining:

Signed JSON — structured, machine-readable integrity

Human-readable PDF — coherent, timestamped narrative

Public hash — audit anchor for long-term verification

The goal is simple :
Make truth measurable, power traceable, and coherence verifiable across legal, institutional, and research environments.

Core Principles
1. Integrity

Every modification of the proof object must be detectable.

2. Readability

Humans and institutions must interpret the same narrative.

3. Verifiability

A public, testable JSON structure enforces accountability.

Technical Schema (RPO Object)
{
  "version": "0.1",
  "issuer": "OpenProof Consortium",
  "timestamp": "2025-11-11T00:00:00Z",
  "format": {
    "json": "signed-object.json",
    "pdf": "human-readable-report.pdf"
  },
  "hash": {
    "algorithm": "SHA3-512",
    "value": "bf73a4c8e9f2...e73d1c2"
  },
  "signatures": [
    {
      "type": "ed25519",
      "issuer": "OpenProof Authority",
      "signature": "Zs0k20D...9fae"
    }
  ]
}

Contributing

OpenProof welcomes scientific, legal, and institutional collaborators interested in strengthening the RPO standard.

Participants may:

Review or comment on specification files

Submit anonymized case schemas or validation tests

Engage in technical discussions via the Governance repository

📩 Request participation: https://www.openproof.net/join

Licenses

This repository is released under a dual-license model :

CC BY-NC 4.0 — documentation, content, schema descriptions

Apache-2.0 — code, JSON schemas, software components

© 2025 OpenProof Consortium
Technical site : https://www.openproof.net

Governance : https://truthx-openproof.org

RPO Specification Roadmap
Phase	Description	Status
v0.1 — Draft	Initial specification (JSON + PDF bundle)	✔️ Published
v0.5 — Public Comment	Integration of feedback from CNRS / GREYC / legal experts	⏳ In progress
v1.0 — Stable Release	Finalized RPO standard with registry integration + governance signatures	🔒 Planned Q2 2026

🧭 Next milestone: Integration of the OpenProof Registry and the RPO signature verification module.

Maintained by the OpenProof Consortium

Research collaboration: CNRS — GREYC — Université de Caen Normandie
Contact : openproof@truthx.co
