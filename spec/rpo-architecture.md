# RPO v0.1 — Architecture Overview

The RPO (Rapport Probatoire Ouvert) is an open, verifiable standard for digital evidence.
It sits between **evidence producers**, **registries**, and **verifiers**.

The architecture is built around three guarantees:

- **Integrity** — any modification becomes detectable  
- **Readability** — evidence is linked to a human-readable PDF  
- **Verifiability** — JSON structure is enforceable and testable

---

## 1. Core Components

### **1. Evidence Producer**
The entity (human or system) generating the evidence bundle.

Responsibilities:
- Collects structured evidence
- Produces the RPO JSON bundle
- Generates the human-readable PDF
- Computes hashes and signatures

---

### **2. Registry**
The trusted anchor for the bundle’s public integrity proof.

Responsibilities:
- Receives the public hash + minimal metadata  
- Records: `{ public_hash, bundle_id, issuer, subject, created_at }`
- Provides a verification interface (public API or UI)

---

### **3. Verifier**
Any entity that needs to assess the validity of the proof:
judges, auditors, investigators, compliance teams, researchers.

Responsibilities:
- Receive JSON + PDF  
- Recompute hashes  
- Check alignment with registry entry  
- Validate schema coherence  
- Optionally: compare PDF content vs evidence fields

---

## 2. Data Flow (Detailed)

### **Step 1 — Evidence collection**
- Logs, timelines, transcripts, images, reports, emails, documents  
- Normalisation into structured `evidence[]` entries

---

### **Step 2 — Bundle construction**
- Build the top-level JSON object following `rpo-format.md`  
- Attach required blocks:  
  `issuer`, `subject`, `evidence`, `narrative`, `registry?`, `signatures[]`

---

### **Step 3 — Narrative generation (PDF)**
- Transform structured data → coherent human-readable narrative  
- Export as PDF  
- Compute `pdf_hash` and store under `narrative.pdf_hash`

---

### **Step 4 — Hashing and signatures**
- Compute canonical hash of full JSON bundle  
- Optionally hash the PDF  
- Apply signatures (Ed25519 recommended)  
- Store results in `signatures[]`

---

### **Step 5 — Registry anchoring**
Producer sends the following fields to the registry:

```json
{
  "public_hash": "...",
  "bundle_id": "...",
  "issuer": "...",
  "subject": "...",
  "created_at": "..."
}
### 2.2 Subject

Information about the entity or case the RPO describes.

Required fields:

- **name** — human-readable name of the case, person, or entity.
- **id** — unique identifier (string).
- **role** — describes the type of subject (e.g., "case", "person", "organization").

Example:

```json
"subject": {
  "name": "Case–001 — Coercive control",
  "id": "openproof:case:001",
  "role": "case"
}
"evidence": [
  {
    "id": "ev-001",
    "type": "timeline",
    "description": "Consolidated timeline of events",
    "hash": "sha256:...",
    "uri": "openproof://case-001/timeline.csv"
  }
]
"narrative": {
  "summary": "Pattern of coercive control over 3 years, with escalating isolation and institutional disqualification.",
  "pdf_hash": "sha256:...",
  "pdf_uri": "openproof://case-001/report.pdf",
  "timeline_ref": "ev-001"
}
"registry": {
  "registry_id": "openproof-registry",
  "entry_id": "rpo-2025-0001",
  "public_hash": "sha256:placeholder"
}
"signatures": [
  {
    "algorithm": "ed25519",
    "value": "base64-encoded-signature",
    "signer_id": "did:example:issuer-1234",
    "created_at": "2025-01-01T12:00:00Z"
  }
]
3. Security Considerations

The RPO architecture is designed to preserve probatory integrity under hostile or uncertain conditions.
Security guarantees rely on the separation of components and the use of deterministic, verifiable structures.

3.1 Integrity

Integrity ensures that the RPO bundle cannot be altered without detection.

Mechanisms:

SHA-256 hashing of the full JSON bundle.

Optional PDF hashing to bind narrative and structure.

Canonical JSON serialization to ensure stable hashing across systems.

Cryptographic signatures (e.g., Ed25519) applied to the bundle.

Any modification of JSON fields must produce a hash mismatch.

3.2 Readability

Humans must be able to interpret the narrative without ambiguity.

Principles:

PDF is the human-readable mirror of the JSON.

narrative.summary must reflect the structure of evidence[].

The narrative must not introduce information absent from the JSON.

Hashes bind the PDF to the JSON to prevent tampering.

3.3 Verifiability

A third party must be able to confirm the validity of the proof independently.

Mechanisms:

JSON Schema validation (rpo-schema.json).

Registry anchoring with a public hash.

Re-hashing of the bundle to confirm integrity.

Cross-checking PDF content vs JSON fields.

No trust is required in the issuer; verification is possible offline.

3.4 Separation of concerns

Each layer plays a different role:

JSON → machine verifiable

PDF → human readable

Registry → long-term integrity

Signatures → authenticity of creation

No single component is sufficient on its own; security emerges from the combination.

4. Relation to OpenProof & TruthX

The RPO (Rapport Probatoire Ouvert) is the open standard.
It is intentionally dissociated from implementation choices, tools, or platforms.

Two components interact with the RPO:

4.1 OpenProof — Public Registry & Governance Layer

OpenProof provides the neutral, verifiable, long-term anchor for RPO bundles.

Its responsibilities include:

storing the public hash of each RPO bundle

issuing a registry_id and entry_id

exposing a public verification API

ensuring long-term availability of integrity proofs

offering a governance and versioning model for RPO evolution

The registry never stores the full evidence.
It only stores the integrity anchor required for independent verification.

OpenProof =
Integrity • Retention • Trust-minimized verification

4.2 TruthX — Evidence Engine & Narrative Generator

TruthX (or any other compliant engine) is an implementation, not the standard.

Its responsibilities include:

collecting and structuring evidence

detecting patterns (coherence, dynamics, narrative structures)

generating the RPO JSON bundle

producing the human-readable PDF narrative

applying signatures

anchoring the public hash to an RPO-compliant registry

TruthX outputs RPO.
OpenProof verifies RPO.
The RPO Specification defines how the two must interoperate.

4.3 Interoperability Guarantee

Any evidence engine — institutional, academic, or private — is considered RPO-compatible if it meets the following requirements:

produces a JSON bundle compliant with rpo-format.md

validates against rpo-schema.json

anchors its hash in a registry supporting the RPO standard

binds its PDF narrative to the JSON structure through narrative.pdf_hash

produces at least one cryptographic signature

This separation ensures:

neutrality (the format does not depend on TruthX)

## 5. Architecture Diagram (Conceptual)

The RPO architecture can be viewed as a linear but verifiable pipeline that links
raw evidence, structured data, narrative interpretation, hashing, signatures,
registry anchoring, and independent verification.


auditability (anyone can re-hash and verify)

longevity (registries outlive tools)
