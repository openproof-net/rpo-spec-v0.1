# OPENPROOF — RPO Specification v0.1  
**Integrity • Readability • Verifiability**

---

## 🧭 What OpenProof is
OpenProof defines an open, verifiable structure for digital evidence.  
The **RPO (Rapport Probatoire Ouvert)** is a dual-format probatory bundle designed to make:

- **truth measurable**,  
- **power traceable**,  
- **coherence verifiable**  

across legal, institutional and research contexts.

The objective is simple:  
**If machines can verify integrity, and humans can read coherence, society can trust evidence again.**

---

# 🟡 PANEL — The RPO “Civil Code”
> The RPO v0.1 acts as a **minimal civil code for digital evidence**.

It defines a set of rules that every RPO bundle must respect:

- a **signed JSON** that machines can validate;  
- a **human-readable PDF** that mirrors the narrative;  
- a **public hash** that anchors immutability;  
- a deterministic structure that any implementation can test.

This guarantees that **any story transformed into an RPO follows the same laws** —  
the same fields, the same structure, the same verifiable logic.

OpenProof does **not** decide truth or falsity.  
It guarantees that **nothing can be modified without detection**.

---

# 🚀 TRY THE ENGINE — Launch the RPO Playground  
*(open, deterministic, no AI, no registry)*

The **RPO Playground** transforms any short narrative into:

- a minimal `rpo.json` object  
- heuristic scores (sentences, indicators, coherence)  
- a deterministic **public_hash** (SHA-256)

👉 **Try it instantly:**  
https://rpo.openproof.net/playground.html

This open engine demonstrates how the RPO “civil code” behaves when applied to real narratives.

---

# 🟡 PANEL — Minimal JSON Profile (v0.1)

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
    "playground": true,
    "heuristic_scores": {
      "coherence_score": "int",
      "evidence_markers": "int",
      "sentence_count": "int"
    }
  }
}
This is the canonical minimal profile for the open version of RPO.

🔐 Hashing Algorithm (SHA-256)
The public hash is computed over the deterministic string concatenation:

ini
Copier le code
rpo_version=|bundle_id=|created_at=|issuer=|subject=|title=|narrative=
A later version (v1.0) will define remote anchoring, registries, and multi-signature authority.

🧪 Test & Validate RPO Bundles
To accept any RPO in your system, you must:

Parse JSON

Validate minimal fields

Enforce ISO timestamps

Recompute public_hash and compare

Reject bundle if any mismatch

(Optional) Validate pdf_hash

(Optional) Validate schema (JSON Schema)

A command-line validator example is included in /tests.

🧠 What OpenProof does NOT assume
RPO does not determine truth or falsity

RPO does not replace legal analysis

RPO does not embed AI in the open version

RPO guarantees immutability, not authenticity of the narrative

🧬 Scientific Pilot (CNRS × TruthX)
For advanced modules — interpretive coherence, psycho-forensic markers, narrative inversion, coercive control — request access to the scientific pilot:

👉 https://www.truthx.co/truthx-pilote-form

This layer is operated with CNRS research partners and goes beyond the open standard.

📘 Examples
Minimal RPO bundles and test cases live in the /examples folder.

🛠 Contribute
OpenProof welcomes contributions from:

engineers (validation, schema, hashing)

researchers (structures of narratives & bias)

legal teams (probatory constraints)

OSINT & forensic analysts (field use cases)

📬 Contact
Technical questions, implementations, or interoperability:
openproof@truthx.co
