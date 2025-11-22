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
