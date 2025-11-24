🌐 OPENPROOF — RPO Standard v0.1

Integrity • Readability • Verifiability

OpenProof defines an open, verifiable format for structuring digital evidence.
The RPO (Rapport Probatoire Ouvert) is a dual-format probatory bundle designed to make:

truth measurable,

power traceable,

coherence verifiable,

across legal, institutional and research environments.

The principle is simple:
machines verify integrity, humans read coherence, society trusts evidence again.

🧨 Why RPO Exists — The Problem We’re Solving

Most digital “evidence” today collapses into probatory chaos:

screenshots, PDFs or exports that no system can validate,

ad-hoc internal formats where every organisation reinvents its own “report”,

AI-generated narratives with no traceability,

logs and datasets that cannot be audited across institutions.

Everyone talks about truth, yet very few artifacts are verifiable.

RPO attacks this failure at the root:
it defines a minimal, deterministic bundle that any registry, auditor, or research team can test the same way, regardless of where it was produced.

🟡 PANEL — The RPO “Civil Code”

RPO v0.1 acts as a civil code for digital evidence.

Every RPO bundle must satisfy four core rules:

Signed JSON
Machines can validate integrity and structure.

Human-readable PDF
The narrative is readable, timestamped, and consistent with the JSON.

Public hash
Immutability anchored through a deterministic SHA-256 digest.

Deterministic structure
Any implementation should reach the same result.

This guarantees that any narrative transformed into an RPO respects the same fields,
the same structure, and the same verifiable logic.

RPO does not decide truth or falsity.
It ensures that nothing can be modified without detection.

🚀 TRY THE ENGINE — Launch the RPO Sandbox

(open, deterministic, no AI, no registry)

The RPO Sandbox transforms any short narrative into:

a minimal rpo.json object,

heuristic indicators (length, anchors, coherence),

a deterministic public_hash.

👉 Try it instantly:
https://rpo.openproof.net/sandbox.html

This open engine demonstrates how the RPO “civil code” behaves when applied to real narratives.

🟡 PANEL — Minimal JSON Profile (v0.1)

This is the canonical minimal RPO bundle required for compliance.

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
    "playground": true
  }
}


This is the minimal core.
Extensions (heuristic scores, anchors, research markers) live in the Sandbox and CNRS pilots.

🔐 Hashing Algorithm (SHA-256)

The public_hash is computed from this deterministic concatenation:

rpo_version=|
bundle_id=|
created_at=|
issuer=|
subject=|
title=|
narrative=


A later version (v1.0) will define multi-signature authorities, registries, and remote anchoring.

🧪 Test & Validate RPO Bundles

To accept any RPO bundle, implementations must:

parse JSON,

validate mandatory fields,

enforce ISO timestamps,

recompute public_hash and compare,

reject the bundle upon mismatch,

(optional) validate pdf_hash,

(optional) validate with JSON Schema.

A command-line validator example is included in /tests.

🧠 What OpenProof Does Not Assume

RPO does not determine truth or falsity.

RPO does not replace legal analysis.

RPO does not embed AI in the open standard.

RPO guarantees immutability, not narrative authenticity.

🧬 Scientific Pilot (CNRS × TruthX)

For advanced modules — interpretive coherence, narrative inversion, coercive control,
probatory markers, psycho-forensic analysis — request access to the scientific pilot:

👉 https://www.truthx.co/truthx-pilote-form

This layer is operated with CNRS research partners and extends beyond the open standard.

📘 Examples

Minimal RPO bundles and test cases live in the /examples folder.

🛠 Contribute

OpenProof welcomes contributions from:

engineers (validation, schema, hashing),

researchers (structures of narratives & bias),

legal teams (probatory constraints),

OSINT & forensic analysts (field use cases).

📬 Contact

Questions, implementations, interoperability:
openproof@truthx.co

👤 Maintainer

This specification is maintained by Gersende Ryard de Parcey.

Email : openproof@truthx.co

LinkedIn : https://www.linkedin.com/in/gryard/
