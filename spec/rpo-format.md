# RPO v0.1 — JSON + PDF Format

The RPO (Rapport Probatoire Ouvert) is a dual-format probatory bundle:

- **Signed JSON** — machine-readable, structured evidence bundle  
- **Human-readable PDF** — coherent narrative view for humans  
- **Public hash** — integrity anchor for audit and verification

The goal is to make truth **measurable**, power **traceable**, and coherence **verifiable**.

---

## 1. Top-level JSON structure

An RPO bundle is a single JSON object with the following top-level fields:

- `rpo_version` (string, required)  
- `type` (string, required)  
- `bundle_id` (string, required, UUID)  
- `created_at` (string, required, ISO 8601 date-time)  
- `issuer` (object, required)  
- `subject` (object, required)  
- `jurisdiction` (string, optional)  
- `language` (string, optional, BCP-47 code, e.g. `"fr-FR"`)  
- `evidence` (array, required)  
- `narrative` (object, required)  
- `registry` (object, optional but recommended)  
- `signatures` (array, required)

Minimal constraints:

- `rpo_version` **MUST** be `"0.1"` for this specification.
- `type` **MUST** be `"evidence_bundle"`.

---

## 2. Identity and context fields

### 2.1 `issuer`

Information about the entity issuing the RPO.

```jsonc
"issuer": {
  "name": "CNRS – GREYC / TruthX",
  "id": "did:example:issuer-1234",
  "role": "research_consoritum"
}
"subject": {
  "name": "Case-001 – Coercive control",
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
  "public_hash": "sha256:...",
  "timestamp": "2025-01-01T12:00:00Z"
}
"signatures": [
  {
    "algorithm": "ed25519",
    "value": "base64-encoded-signature",
    "signer_id": "did:example:issuer-1234",
    "created_at": "2025-01-01T12:00:00Z"
  }
]
{
  "rpo_version": "0.1",
  "type": "evidence_bundle",
  "bundle_id": "1c9adf54-8d62-4f0b-9f3b-0d0c1fe21abc",
  "created_at": "2025-01-01T12:00:00Z",
  "issuer": { "...": "..." },
  "subject": { "...": "..." },
  "evidence": [],
  "narrative": {
    "summary": "Minimal bundle with no attached evidence yet.",
    "pdf_hash": "sha256:placeholder"
  },
  "registry": {
    "registry_id": "openproof-registry",
    "entry_id": "rpo-2025-0001",
    "public_hash": "sha256:placeholder"
  },
  "signatures": []
}

Puis **Commit changes**.

---

## 2️⃣ `spec/rpo-architecture.md` — architecture RPO

Même opération : éditer le fichier et coller ceci.

```markdown
# RPO v0.1 — Architecture Overview

The RPO (Rapport Probatoire Ouvert) is an open, verifiable standard for digital evidence.  
It sits between **evidence producers**, **registries**, and **verifiers**.

---

## 1. High-level components

1. **Producer**
   - Collects and structures the evidence
   - Builds the RPO JSON bundle
   - Generates the human-readable PDF
   - Computes hashes and signatures

2. **Registry**
   - Receives the public hash + minimal metadata
   - Anchors the entry (timestamp, registry id, entry id)
   - Exposes a verification interface (API, UI)

3. **Verifier**
   - Receives the JSON + PDF bundle
   - Recomputes hashes
   - Checks alignment with the registry
   - Validates coherence with the RPO schema

---

## 2. Data flow (simplified)

1. **Evidence collection**
   - Raw evidence: files, logs, messages, transcripts, timelines, etc.
   - Normalisation and mapping into structured `evidence[]` entries.

2. **Bundle construction**
   - Create top-level JSON object according to `rpo-format.md`.
   - Attach `issuer`, `subject`, `evidence`, `narrative`, `registry` (optional), `signatures`.

3. **Narrative generation (PDF)**
   - Transform structured data into a coherent narrative report.
   - Export as PDF.
   - Compute `pdf_hash` and store it under `narrative.pdf_hash`.

4. **Hashing and signatures**
   - Compute a canonical hash of the JSON bundle (and optionally the PDF).
   - Store the hash in `registry.public_hash`.
   - Apply cryptographic signatures and store them in `signatures[]`.

5. **Registry anchoring**
   - Send `{ public_hash, bundle_id, issuer, subject, created_at }` to the registry.
   - Registry returns `registry_id` and `entry_id`.
   - Producer stores them under `registry`.

6. **Verification**
   - Verifier receives RPO JSON + PDF.
   - Steps:
     1. Validate JSON against `rpo-schema.json`.
     2. Recompute bundle hash and compare with `registry.public_hash`.
     3. Optionally query the registry to confirm the entry.
     4. Check that PDF content is consistent with the JSON (narrative vs evidence).

---

## 3. Integrity • Readability • Verifiability

The architecture is explicitly designed around three pillars:

1. **Integrity**
   - Hashes, signatures, registry anchoring.
   - Goal: detect any modification of the bundle.

2. **Readability**
   - Human-readable PDF linked to the JSON.
   - Goal: allow judges, lawyers, institutions to read and understand the narrative.

3. **Verifiability**
   - JSON Schema, tests, and public registry.
   - Goal: allow independent verification of the structure and the integrity of the proof.

---

## 4. Relation to OpenProof and TruthX

- RPO is the **open standard** used by different engines (including TruthX) to export probatory reports.
- OpenProof Registry provides:
  - public hash anchoring,
  - long-term verifiability,
  - compatibility across tools and institutions.

Implementation details may vary, but any system claiming RPO compliance **MUST**:

- produce JSON bundles respecting `rpo-format.md` and `rpo-schema.json`,
- anchor a public hash in a verifiable registry,
- provide a human-readable PDF linked to the JSON through `narrative.pdf_hash`.

