# OpenProof — public RPO specification and verification example

**From fragmented sources to a verifiable record, under human review.**

OpenProof is being developed to help people and organisations reconstruct complex situations from scattered documents. Its first product pilot is **OpenProof Legal**. The broader direction is reconstruction and decision traceability before, during and after a crisis.

This repository is the public entry point for the **Registered Probative Object (RPO)**: its draft format, fictional examples and a local verification demonstration. It is not the complete OpenProof application or the private TruthX Engine.

[See an example](https://rpo.openproof.net/examples.html) · [Try browser verification](https://rpo.openproof.net/tests.html) · [Qualify a case](https://openproof.net/qualify?intent=case)

## Start here

| Your question | Where to go |
| --- | --- |
| What does a record look like? | [Read the fictional Atlas case](examples/public-demo/README.md) |
| Can I reproduce the integrity check? | Run the local example below |
| What are the technical boundaries? | [Architecture and limitations](docs/architecture.md) |
| What is the data format? | [Format guide](spec/rpo-format.md) and [JSON Schema](spec/rpo-schema.json) |
| Who is building this? | [Gersende de Parcey](https://github.com/Gersenderdp) |
| Can I propose a use case or a pilot? | [Describe the need](https://openproof.net/qualify?intent=case), without confidential documents |

## Verify the public example locally

Requires Node.js 22 or later and Git. No package installation, API key, account or engine access is needed.

```sh
git clone https://github.com/openproof-net/rpo-spec-v0.1.git
cd rpo-spec-v0.1
node tools/verify-demo.cjs examples/public-demo/rpo-en.json examples/public-demo/rpo-en.sha256
node --test tests/public-verification.test.cjs
```

Expected result: `basic_structure_present: true`, `reference_matches: true`, exit code `0`.

To observe a change being detected, copy `rpo-en.json`, edit `narrative.summary`, and run the same command against the edited file **while keeping the original `.sha256` reference**. The comparison returns `reference_matches: false` and exit code `1`.

The checker reads local files only. It inspects basic fields and hashes the entire parsed object, with recursively sorted object keys, preserved array order, compact JSON and UTF-8 encoding. The demonstration accepts safe integer numbers only. This is a documented demonstration serialisation, not a claim of RFC 8785 conformance.

The retained digest represents the copy published in this repository. Preserve or authenticate that reference separately when using it as an integrity anchor: replacing both the object and its reference defeats a comparison. Recomputing an embedded hash alone cannot establish authenticity.

## What this demonstrates

- A readable fictional scenario with explicit evidence references and an unresolved point.
- Reproducible fingerprints and detection of a change relative to a retained reference.
- A distinction between document structure, integrity and the truth of the underlying statements.
- Checks that can be reproduced without the private application.

**It does not verify** the source files, a PDF, signatures, a registry entry, the merits of a case or a legal conclusion. Basic field inspection is not full JSON Schema validation. The example contains illustrative source hashes and a PDF placeholder; it is not a signed or registered production export.

## Product and repository status

| Area | Status |
| --- | --- |
| Public JSON examples and local comparison | Available in this repository |
| Browser demonstration | Public educational example; separate from the Legal application |
| RPO format | Version 0.1 draft; the schema and implementation limits are explicit |
| OpenProof Legal | First product pilot; availability and scope are qualified individually |
| Complete application and TruthX Engine | Private implementation; not distributed here |
| Future professional applications | Direction of development, not released products |

A passing public test does not certify production readiness, factual accuracy or legal admissibility.

## How the parts fit together

**OpenProof** provides the application and review workflow. **TruthX Engine** is the structuring engine. **RPO** describes the resulting record. People review proposals and retain responsibility for decisions. See the [architecture](docs/architecture.md).

The `backend/`, `examples/cnrs-legal-mvp/`, `examples/example-minimal/`, `README-dev.md` and older documentation contain historical prototypes or design material. They are not the supported quick start or evidence of a live deployment. The current public walkthrough is `examples/public-demo/`.

## Contribute or work with us

Useful feedback includes a reproducible verification issue, a clearer explanation or a fictional use case. See [CONTRIBUTING.md](CONTRIBUTING.md). Never include personal case files, credentials or confidential documents in public issues or pull requests.

For pilots, [qualify a case](https://openproof.net/qualify?intent=case). For transformation missions, research or integration, [contact Gersende](https://www.linkedin.com/in/gryard/) or explore [TruthX](https://truthx.co/).

## Attribution and licensing status

Maintained by **Gersende Ryard de Parcey**, founder of TruthX / OpenProof. Citation metadata is in [CITATION.cff](CITATION.cff).

That metadata currently names MIT, but this repository has no accompanying LICENSE file. This update does not establish or change licensing terms. Clarify the applicable rights with the maintainer before redistribution or commercial integration; public access alone is not a complete open-source release.
