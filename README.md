# OPENPROOF — RPO v0.1  
Integrity • Readability • Verifiability  
Dual-format standard for structured, verifiable digital evidence.

---

═══════════════════════════════════════════════════════  
🟡 **1. OVERVIEW — WHAT OPENPROOF OFFERS**  
═══════════════════════════════════════════════════════

OpenProof defines the **RPO** (Rapport Probatoire Ouvert),  
a dual-format probatory standard combining:

- **Signed JSON** — machine-readable, structured evidence  
- **Human-readable PDF** — coherent narrative mirror  
- **Public hash** — verifiable integrity anchor

Its objective is simple:  
**make truth measurable, power traceable, and coherence verifiable**  
across legal, institutional and research contexts.

---

═══════════════════════════════════════════════════════  
🟡 **2. WHAT THE RPO SOLVES**  
═══════════════════════════════════════════════════════

Digital evidence is fragmented, unverifiable, and often unreadable.  
The RPO introduces a shared structure allowing:

- Deterministic integrity (hashing)  
- Narrative readability  
- Registry anchoring  
- Cross-system interoperability  
- Audit-friendly JSON structure  

The RPO is **open, testable and public**.

---

═══════════════════════════════════════════════════════  
🟡 **3. MINIMAL RPO STRUCTURE (v0.1)**  
═══════════════════════════════════════════════════════

A minimal RPO v0.1 bundle contains:

```json
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
  "evidence": [],
  "registry": {
    "public_hash": "sha256 hex",
    "registry_hint": "string"
  },
  "meta": { "playground": true }
}
```

This structure ensures **immutability**, **interpretability**, and **verifiability**.

---

═══════════════════════════════════════════════════════  
🟡 **4. THE RPO PLAYGROUND (OPEN VERSION)**  
═══════════════════════════════════════════════════════

The **RPO Playground** is an open, deterministic, non-AI version  
that demonstrates how a narrative becomes a preliminary RPO bundle.

It provides:

- **Sentence count**  
- **Evidence markers**  
- **Coherence score**  
- **Minimal RPO JSON generation**  
- **Local SHA-256 hashing** (public_hash)

Everything runs **locally in the browser**, with no backend.  
It is an educational sandbox illustrating how the RPO standard works.

---

═══════════════════════════════════════════════════════  
🟡 **5. HASHING & INTEGRITY**  
═══════════════════════════════════════════════════════

RPO v0.1 uses **SHA-256**.  
The `public_hash` is derived from a deterministic concatenation of core fields  
(narrative + metadata), ensuring any change becomes detectable.

Integrity check = `compute → compare`.

---

═══════════════════════════════════════════════════════  
🟡 **6. USING THE STANDARD**  
═══════════════════════════════════════════════════════

Engineers, auditors and researchers can:

- Parse and validate RPO JSON  
- Verify integrity via the public hash  
- Generate new RPO bundles  
- Produce narrative-PDF mirrors  
- Integrate the standard into their systems  

For full developer instructions, see:  
👉 **README-dev.md**

---

═══════════════════════════════════════════════════════  
🟡 **7. STATUS OF v0.1**  
═══════════════════════════════════════════════════════

- Minimal deterministic profile  
- Fully open and verifiable  
- PDF hashing supported  
- No remote registry anchoring yet  
- AI psycho-forensic interpretation reserved for the CNRS pilot

---

═══════════════════════════════════════════════════════  
🟡 **8. CONTRIBUTION**  
═══════════════════════════════════════════════════════

The project welcomes contributions from:

- Research  
- Law  
- Engineering  
- Institutional governance  

OpenProof aims to build a **consistent, sovereign** standard  
for verifiable digital evidence.

---

═══════════════════════════════════════════════════════  
🟡 **9. CONTACT**  
═══════════════════════════════════════════════════════

For implementation or technical questions:  
📧 **openproof@truthx.co**

---


