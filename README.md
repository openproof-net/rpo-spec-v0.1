<div align="center"> <br> <img src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,f_auto,h_130,w_130,q_auto/985447/451167_485103.png" width="115">
OpenProof — RPO Specification v0.1
Integrity • Readability • Verifiability
<br> </div>
1. Overview

OpenProof defines an open, verifiable standard for digital evidence.
The RPO (Rapport Probatoire Ouvert) is a dual-format bundle ensuring that:

Structured JSON preserves the machine-readable integrity

Human-readable PDF mirrors the narrative

Public hash anchors immutable verification

The goal:
Make truth measurable, power traceable, and coherence verifiable across legal, institutional, academic, and forensic contexts.

2. Core Principles
Integrity

Every modification becomes detectable through hashing + signatures.

Readability

Humans and institutions must interpret the same narrative.

Verifiability

JSON structures must be publicly testable, enforceable, and auditable.

3. RPO Technical Object (Minimal Form)
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

OpenProof welcomes researchers, engineers, legal experts, institutions, and forensic professionals.

Participants may:

Review or comment on specification files

Submit anonymized validation tests or case schemas

Engage in discussions in the Governance repository

📩 Join the consortium: https://www.openproof.net/join

5. Licensing

Dual-license model:

CC BY-NC 4.0 — documentation, schema descriptions

Apache-2.0 — code, JSON schemas, software components

© 2025 OpenProof Consortium
Technical site: https://www.openproof.net

Governance: https://truthx-openproof.org

6. Roadmap — RPO Standard Evolution
Phase	Description	Status
v0.1 — Draft	Initial JSON + PDF specification	✔️ Published
v0.5 — Public Comment	Feedback integration (CNRS / GREYC / legal partners)	⏳ In progress
v1.0 — Stable Release	Final RPO with registry integration + governance signatures	🔒 Q2 2026

📌 Next milestone: OpenProof Registry + RPO signature verification module.

7. Maintainers

OpenProof Consortium
Research collaboration: CNRS — GREYC — Université de Caen Normandie
Contact: openproof@truthx.co

<div align="center">

OpenProof — Because integrity deserves an infrastructure.

<br> </div>
