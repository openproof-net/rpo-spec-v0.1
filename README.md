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
