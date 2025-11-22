# OpenProof — RPO v0.1  
**Rapport Probatoire Ouvert (Open Proof Report)**  
A minimal, open, verifiable evidence standard.

The RPO (Rapport Probatoire Ouvert) defines a structured, machine-readable and
human-readable format for representing narrative-based evidence in a verifiable,
auditable, and tamper-evident way.

It addresses a gap in existing probatory standards:  
traditional norms (DNA, metadata chains, ISO information integrity) do not
handle **narratives**, **coercive dynamics**, **manipulation**, or **interpretive coherence**.
RPO provides a minimal foundation for making narrative evidence measurable,
traceable, and independently verifiable.

---

## What this repository contains

### **1. Specification (`/spec`)**
- `rpo-format.md` — the human-readable definition of the RPO bundle  
- `rpo-schema.json` — machine validation schema (JSON Schema 2020-12)  
- `rpo-architecture.md` — architectural and verification model

These files define the core of **RPO v0.1**.

### **2. Documentation (`/docs`)**
- `overview.md` — simple introduction for readers and implementers

### **3. Examples (`/examples`)**
- `example-minimal/` — a minimal, valid RPO bundle:
  - `rpo.json` — structured evidence bundle  
  - `rpo.pdf.txt` — human-readable narrative placeholder  
  - `README.md` — explanation of the example

### **4. Tests (`/tests`)**
Illustrative tests for:
- schema validation  
- hash integrity  
- PDF output structure  
These prepare the ground for full automated verification in future versions.

---

## Core Principles

RPO is built on three principles:

1. **Integrity**  
   Every RPO bundle includes stable hashing and signature fields.

2. **Readability**  
   Every JSON bundle must have a linked human-readable narrative (PDF).

3. **Verifiability**  
   Any third party must be able to validate the RPO without trusting the issuer:
   schema → hash → PDF → registry entry.

These principles guide all future versions of the standard.

---

## Roadmap

### **v0.1 (this version) — Minimal Standard**  
- Core JSON bundle format  
- Minimal schema  
- Architecture overview  
- Example bundle  
- Baseline tests (non-strict)  

### **v0.2 — Canonicalisation & Strict Validation**  
- Canonical JSON  
- Strict hash matching  
- Full PDF generation tests  
- Registry API draft  
- `example-full/` with multi-evidence timelines

### **v1.0 — Production Standard**  
- Multi-algorithm hashing  
- Multi-signer format  
- Full registry protocol  
- Deployment guidance for institutions

---

## License

Open standard, free to implement and extend.  
License will be finalised before v1.0.

---

## Contact & Governance

The RPO standard is developed within the **OpenProof** initiative, in
collaboration with research partners.

Contributions, comments, and reviews are welcome.
