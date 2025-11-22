OpenProof — RPO Specification v0.1

Integrity • Readability • Verifiability

1. Overview

OpenProof defines an open, verifiable standard for digital evidence.
The RPO (Rapport Probatoire Ouvert) is a dual-format probatory bundle combining:

Signed JSON — machine-readable, structured evidence

Human-readable PDF — coherent narrative mirror

Public hash — audit anchor ensuring immutability

The objective is to make truth measurable, power traceable and coherence verifiable across legal, institutional and research contexts.

2. Core Principles
Integrity

Any modification becomes detectable via hashing and signatures.

Readability

Humans and institutions interpret exactly the same narrative.

Verifiability

The JSON structure is public, testable and enforceable.

3. Minimal Technical Object (RPO JSON)
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

4. Participation & Contribution

OpenProof welcomes contributors from research, law, engineering, and institutional governance.

Participants may:

review or comment on the specification files

submit anonymized test cases or validation schemas

join discussions in the Governance repository

Join the consortium:
👉 https://www.openproof.net/join

5. Licensing

This repository is released under a dual-license model:

CC BY-NC 4.0 — documentation, schema descriptions

Apache-2.0 — code, JSON schemas, software components

© 2025 OpenProof Consortium
Technical site: https://www.openproof.net

Governance: https://truthx-openproof.org

6. Roadmap — RPO Standard Evolution
Phase	Description	Status
v0.1 — Draft	Initial JSON + PDF specification	✅ Published
v0.5 — Public Comment	Feedback integration (CNRS / GREYC / Legal)	⏳ In progress
v1.0 — Stable Release	Final RPO + registry integration + governance signatures	🔒 Planned Q2 2026

📌 Next milestone: integration of registry + signature verification module.

7. Maintainers

OpenProof Consortium
Research Collaboration: CNRS — GREYC — Université de Caen Normandie
📩 Contact: openproof@truthx.co

OpenProof — because integrity deserves an infrastructure.
