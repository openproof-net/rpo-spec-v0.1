# OpenProof — RPO Specification v0.1

**RPO** (Rapport Probatoire Ouvert) is an open standard for structuring digital evidence into a dual bundle:

- a **signed JSON** file (`rpo.json`), machine-readable and verifiable,
- a **human-readable PDF**, aligned with the JSON content,
- plus a **public hash** used as an integrity anchor.

This repository hosts the **v0.1 specification** of the RPO standard, examples, tests and an **open playground** implemented entirely in the browser (no backend, no AI model).

> 🇫🇷 RPO = Rapport Probatoire Ouvert : un format unifié pour transformer un récit, des pièces et des métadonnées en un lot de preuve structuré, traçable et vérifiable.

---

## Repository structure

- `docs/`
  - `overview.html` – high-level introduction to RPO
  - `index.html` – **formal v0.1 specification**
  - `examples.html` – example bundles and use cases
  - `tests.html` – conformance and validation tests
  - `playground.html` – **RPO Playground**, from narrative to draft `rpo.json`
- `schema/` (optional, if present)
  - JSON Schemas or auxiliary definitions for tooling
- `examples/` (optional, if present)
  - Sample `rpo.json` bundles and associated artefacts

The `docs/` folder is designed to be published as a static site (e.g. GitHub Pages).

---

## What is an RPO bundle?

An **RPO bundle** minimally contains:

- `rpo_version` — specification version (e.g. `"0.1"`)
- `bundle_id` — unique identifier for this bundle
- `created_at` — ISO 8601 timestamp
- `issuer` — who issues the report (person / organisation)
- `subject` — who / what the report is about
- `narrative` — human-readable account of the situation
- `evidence[]` — references to exhibits, documents, logs, etc.
- `registry.public_hash` — public hash used as integrity anchor
- `meta` — additional metadata and heuristics

The goal is to make **truth measurable, power traceable and coherence verifiable** without locking users into a proprietary format or a single vendor.

---

## RPO Playground (docs/playground.html)

The **RPO Playground** is an open, minimal implementation of the standard:

- runs **entirely in the browser** (pure HTML/CSS/JS),
- requires **no backend**, **no database**, **no AI model**,
- generates a **draft `rpo.json`** bundle from a free-text narrative,
- computes simple **heuristics** to illustrate narrative structure.

### Heuristics

From the narrative you enter, the playground computes:

- `sentence_count` – number of sentences detected,
- `evidence_markers` – count of numbers and basic markers (dates, time/causality words),
- `coherence_score` – a simple 0–100 score derived from length and markers,
- `heuristic_anchors`:
  - `dates` – explicit dates,
  - `years` – years like `2023`, `2024`, …
  - `places` – simple location patterns (experimental).

These are stored under:

```json
"meta": {
  "playground": true,
  "heuristic_scores": {
    "coherence_score": 72,
    "evidence_markers": 9,
    "sentence_count": 7
  },
  "heuristic_anchors": {
    "dates": ["12 March 2024"],
    "years": ["2024"],
    "places": ["Paris"]
  },
  "psycho_forensic": {
    "available": false,
    "note": "In the CNRS × TruthX pilot, this block will be populated by psycho-forensic models."
  }
}
The psycho_forensic block is intentionally disabled (available: false) in the open version.
It documents where advanced CNRS × TruthX models would later attach their analysis.

Public hash
The playground computes a public_hash using SHA-256 over a deterministic concatenation of:

rpo_version

bundle_id

created_at

issuer

subject

title

narrative

This hash is exposed as:

json
Copier le code
"registry": {
  "public_hash": "…sha256…",
  "registry_hint": "Open playground — no official registry anchor yet."
}
In v0.1, the playground does not register the bundle anywhere. It only shows how a hash could be produced, inspected, and later anchored in a registry.

Running the docs & playground
Because everything is static, you can:

Option 1 — Open locally
Clone the repository

Open docs/overview.html or docs/playground.html directly in your browser

Note: some browsers restrict crypto.subtle on file:// URLs.
If the public hash is not computed, run a tiny local server instead.

Option 2 — Run a tiny local server
From the repository root:

bash
Copier le code
# Python 3
python -m http.server 8000

# or
npx serve docs
Then open:

http://localhost:8000/docs/overview.html

http://localhost:8000/docs/playground.html

The playground will generate:

a draft rpo.json (displayed in the interface),

a SHA-256 public_hash,

heuristic scores and anchors.

You can copy the JSON or download it as rpo.json directly from the page.

Relationship with CNRS × TruthX pilot
This repository and its playground are deliberately simple:

open, inspectable, reproducible,

no hidden backend,

no claim of legal or probatory value on their own.

The CNRS × TruthX pilot builds on top of the standard RPO bundle and adds:

narrative interpretation and interpretive coherence,

psycho-forensic heuristics (e.g. coercive control, inverted narratives),

richer probatory coherence scores,

controlled infrastructure and governance.

If you are a researcher, lawyer, magistrate, compliance officer or institution interested in testing the scientific pilot, you can request access here:

👉 https://www.truthx.co/truthx-pilote-form

Status and scope of v0.1
RPO v0.1 is:

An open technical baseline, not a binding legal framework.

A minimal profile, suitable for experimentation, prototyping and tooling.

Designed to evolve toward richer versions (v0.2, v1.0…) with:

profiles per domain (justice, governance, audit, protection),

stronger registry requirements,

compatibility with external standards and infrastructures.

Contributions, comments and critiques about the structure, fields or heuristics are welcome.

Contributing
For now, contributions can focus on:

improving the clarity and robustness of the specification text,

proposing additional examples (anonymised),

refining heuristics used in the Playground (without turning it into a full AI system),

suggesting interoperability hooks (e.g. with existing legal / evidence standards).

Typical workflow:

bash
Copier le code
git clone https://github.com/openproof-net/rpo-spec-v0.1.git
cd rpo-spec-v0.1
# create a branch, edit docs/schema/examples, then:
git add .
git commit -m "Improve RPO v0.1 docs/playground heuristics"
git push origin <your-branch>
Then open a Pull Request describing:

what changed,

why it improves the clarity, safety or interoperability of the RPO standard.

License
Unless otherwise stated in individual files, the RPO v0.1 specification and the documentation in this repository are released under an open documentation license (to be confirmed by the OpenProof governance body).

Please check the LICENSE file when it is added, or contact:

openproof@truthx.co

for clarification about reuse in commercial, academic or institutional projects.


