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

