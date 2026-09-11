# OpenProof RPO — Specification & Reference Examples

This repository contains the **draft RPO specification, fictional reference examples and the supported local integrity checker**. It is not the hosted OpenProof Legal application or the private TruthX Engine. The public format remains **version 0.1**; the permanent repository name and the format version are separate concerns. No certification, recognised-standard status or external adoption is asserted.

**Start with the [public integrity exercise](START_HERE.md)**, then examine the format or propose a bounded contribution. The Atlas and Cedar examples are fictional; their observations do not demonstrate automatic contradiction detection. A fingerprint checks a change against a retained reference, not the truth of a dossier.

**SCATTERED DOCUMENTS · CONFLICTING CLAIMS · A DECISION TO JUSTIFY**

<table>
<tr>
<td width="150" valign="top"><a href="https://github.com/Gersenderdp"><img src="docs/images/gersende-de-parcey.png" width="140" alt="Portrait of Gersende Ryard de Parcey, founder of TruthX and OpenProof"></a></td>
<td valign="middle">
<strong>Gersende Ryard de Parcey</strong><br>
Founder & project lead — TruthX / OpenProof<br>
Transformation COO · Interim Executive
<p>I design the product and review workflow: find the source, preserve uncertainty and keep responsibility for decisions visible.</p>
<a href="https://github.com/Gersenderdp">Meet the founder</a> · <a href="https://www.linkedin.com/in/gryard/">Professional background</a>
</td>
</tr>
</table>

**RESEARCH COLLABORATION SINCE 2025 · GREYC / UNIVERSITÉ DE CAEN NORMANDIE**

**Conceived and led by Gersende Ryard de Parcey. Developed through research with Professor [Gaël Dias](https://dias.users.greyc.fr/), Lucy Martin and Clément Correia-Peltier.**

Gersende designed the initial thirteen-module architecture. Under Gaël Dias's academic supervision, Lucy and Clément developed a multi-agent research prototype and delivered code, a report and a presentation in May 2026. Their work spans document extraction, consistency checks, structured analysis and report generation.

**A research foundation already exists. Help turn it into a clearer, more useful document review experience.** The student prototype's integration into the current engine remains to be done.

[Meet the research team and see what was delivered](RESEARCH_COLLABORATION.md).

**Find the source. Keep uncertainty visible. Retain human review.**

OpenProof Legal is being piloted for people who examine and hand over complex documentary cases. **Try today:** a fictional record and a local check that detects a change against a retained reference. Automated document analysis is not part of this public exercise.

### [Build OpenProof with us →](COMMUNITY.md)

**SOURCE TRACEABILITY · HUMAN REVIEW · OPEN COLLABORATION**

Gersende leads the project and is forming its first circle of researchers, developers and documentary professionals. Start with [three fictional documents](examples/community-cedar/README.md), then help evaluate observations, improve report readability or specify citation checks. Each task has a clear deliverable; no coding is required for a first review.

[Join the shared challenge](COMMUNITY.md) · [Try the five-minute integrity exercise](START_HERE.md) · [What is available](#what-is-available-today)

## The problem we want to solve

| In your work | Consequence to investigate | Control being designed |
| --- | --- | --- |
| A summary makes a claim, but its source is hard to find | A reviewer has to repeat the search | Explicit links between claims and sources |
| Two documents disagree | An unresolved point can disappear in the handover | Preserve the discrepancy and the question for human review |
| A record changes after review | People may be discussing different versions | Compare it with a separately retained reference |

These are needs to test with users, not measured savings. **Only the record comparison is implemented in the supported public checker.** The fictional example illustrates the other controls; it does not discover contradictions automatically.

## The design behind the product

Gersende brings experience in organisational transformation, executive operations and crisis work to the product's design. The review workflow connects sources, uncertainty, competing interpretations and human responsibility. The public code makes specific controls examinable; it does not establish product performance.

> Do not stop trusting. Stop trusting what cannot be reconstructed.

## What is available today

The fictional record and local JSON comparison below are available. The public checker does **not** ingest your PDFs, find missing pieces, reconstruct your dossier or detect its contradictions. The complete application and TruthX Engine remain private; Legal is being piloted.

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

## Help shape the next useful step

The [first collaborative challenge](COMMUNITY.md) is now open: a short report based on three invented source documents, with precise citations and visible unanswered questions. The [proposed review reference](examples/community-cedar/REVIEW_REFERENCE.md) is available for critique; it is not product-generated or externally validated.

Researchers and practitioners can [challenge its observations](https://github.com/openproof-net/rpo-spec-v0.1/issues/44), readers can [improve the report layout](https://github.com/openproof-net/rpo-spec-v0.1/issues/45), and developers can [specify citation checks](https://github.com/openproof-net/rpo-spec-v0.1/issues/46). Gersende is responsible for priorities, coordination and acceptance; specialist reviewers are confirmed for defined tasks.

This public work informs the existing Legal product. It does not start a replacement engine. The community invitation is published, but external participation, a complete open-source release and improved product performance are not yet established. See [contribution scope and rights](CONTRIBUTING.md).

## Work with Gersende

[OpenProof website](https://openproof.net/) · [Contact Gersende](https://openproof.net/#contact) · [Workspace sign-in](https://app.openproof.net/)


For a possible Legal pilot, [describe the need](https://openproof.net/qualify?intent=case) without confidential evidence. Scope, deliverable, prerequisites, timing, acceptance criteria and price must be agreed before an engagement; the public exercise is not delivery of that service.

For transformation or interim executive assignments, [contact Gersende](https://www.linkedin.com/in/gryard/). [TruthX](https://openproof.net/technology) presents the broader method and architecture.

## Attribution and licensing status

Maintained by **Gersende Ryard de Parcey**, founder of TruthX / OpenProof. Citation metadata is in [CITATION.cff](CITATION.cff).

That metadata currently names MIT, but this repository has no accompanying LICENSE file. This update does not establish or change licensing terms. Clarify the applicable rights with the maintainer before redistribution or commercial integration; public access alone is not a complete open-source release.
