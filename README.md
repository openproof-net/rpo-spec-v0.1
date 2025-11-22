📘 OpenProof — RPO Specification v0.1

Integrity • Readability • Verifiability

Overview

OpenProof defines an open, verifiable standard for digital evidence.
The RPO (Rapport Probatoire Ouvert) is a dual-format bundle combining:

Signed JSON — structured, machine-readable data

Human-readable PDF — coherent narrative output

Public hash — anchor for audit, integrity, and long-term verification

The goal: make truth measurable, power traceable, and coherence verifiable across legal, institutional, and research systems.

Core Principles

Integrity — any modification becomes detectable

Readability — humans and institutions interpret the same narrative

Verifiability — a public, testable JSON structure enforces accountability

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

OpenProof welcomes scientific, legal, and institutional contributors interested in strengthening the RPO standard.

Participants may:

Review or comment on specification files

Submit anonymized case schemas or validation tests

Engage in discussions via the OpenProof Governance repository

📩 To request participation: https://www.openproof.net/join

Licenses

This repository is released under a dual-license model:

CC BY-NC 4.0 — documentation, content, schema descriptions

Apache-2.0 — code, JSON schemas, software components

© 2025 OpenProof Consortium
Technical site: https://www.openproof.net

Governance: https://truthx-openproof.org

Roadmap — RPO Specification
Phase	Description	Status
v0.1 — Draft	Initial specification (JSON + PDF bundle).	✔️ Published
v0.5 — Public Comment	Integration of feedback from CNRS / GREYC / legal experts.	⏳ In progress
v1.0 — Stable Release	Finalized RPO + registry integration + governance signatures.	🔒 Planned Q2 2026

🧭 Next milestone: Integration of the OpenProof Registry & RPO signature verification module.
