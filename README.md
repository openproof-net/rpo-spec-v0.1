
<p align="center">
  <img src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_130,w_130,f_auto,q_auto/985447/451167_485103.png" alt="OpenProof Logo" width="120"/><br>
  <b>OpenProof — RPO Specification v0.1</b><br>
  <i>Integrity • Readability • Verifiability</i>
</p>

<p align="center">
  <a href="https://www.openproof.net"><img src="https://img.shields.io/badge/specification-v0.1-gold" alt="spec badge"></a>
  <a href="https://truthx.co"><img src="https://img.shields.io/badge/forensic-engine-TruthX-blue" alt="forensic engine badge"></a>
  <a href="https://truthx-openproof.org"><img src="https://img.shields.io/badge/governance-Consortium-green" alt="governance badge"></a>
</p>



---

# OpenProof — RPO Specification v0.1

**Integrity • Readability • Verifiability**

---

## Overview

**OpenProof** defines an open, verifiable standard for digital evidence:  
**RPO (Rapport Probatoire Ouvert)** — a dual-format proof combining:

- **Signed JSON**: structured and machine-readable data  
- **Human-readable PDF**: traceable, timestamped narrative output  
- **Public hash**: unique integrity key for audit and verification  

This specification aims to make **truth measurable**, **power traceable**, and **coherence verifiable** across legal, institutional, and research contexts.

---

## Core Principles

1. **Integrity** — Every proof object must be cryptographically sealed.  
2. **Readability** — Every human must be able to interpret the same data.  
3. **Verifiability** — Every institution must be able to check it publicly.

---

## Technical Schema (RPO Object)

```json
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
    "value": "b7f3a4c8e9f2...e73d1c2"
  },
  "signatures": [
    {
      "type": "ed25519",
      "issuer": "OpenProof Authority",
      "signature": "Zs0k2JQb...9faQ=="
    }
  ]
}
---

## 🧩 Contributing

OpenProof welcomes scientific and institutional contributors interested in advancing the **RPO (Rapport Probatoire Ouvert)** standard.  
Researchers, legal experts, engineers and data scientists can:
- review or comment on the specification files,  
- submit anonymized case schemas or validation tests,  
- open discussions in the *Governance* repository.

📬 To request participation: [join the OpenProof Beta](https://www.openproof.net/join)

---

## ⚖️ Licenses

This repository and its materials are released under a dual-license model:

- **CC BY-NC 4.0** for content, documentation, and datasets — allowing reuse with attribution, excluding commercial purposes.  
- **Apache 2.0** for code, JSON schemas, and software components — enabling open, verifiable, and auditable use.

© 2025 **OpenProof Consortium**  
Governance: [truthx-openproof.org](https://truthx-openproof.org)  
Technical site: [openproof.net](https://www.openproof.net)

---
