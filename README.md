# OpenProof

**SCATTERED DOCUMENTS · CONFLICTING CLAIMS · A DECISION TO JUSTIFY**

<table>
<tr>
<td width="150" valign="top"><a href="https://github.com/Gersenderdp"><img src="docs/images/gersende-de-parcey.png" width="140" alt="Portrait of Gersende Ryard de Parcey, founder of TruthX and OpenProof"></a></td>
<td valign="middle">
<strong>Gersende Ryard de Parcey</strong><br>
Founder of TruthX / OpenProof<br>
Transformation COO · Interim Executive
<p>I design the product and review workflow: find the source, preserve uncertainty and keep responsibility for decisions visible.</p>
<a href="https://github.com/Gersenderdp">Meet the founder</a> · <a href="https://www.linkedin.com/in/gryard/">Professional background</a>
</td>
</tr>
</table>

**Find the source. Keep uncertainty visible. Retain human review.**

OpenProof Legal is being piloted for people who examine and hand over complex documentary cases. **Try today:** a fictional record and a local check that detects a change against a retained reference. Automated document analysis is not part of this public exercise.

### [Try OpenProof in five minutes →](START_HERE.md)

Inspect the example. Change a copy. Report what you found. No paid AI service or account needed to try it; a GitHub account is needed to post feedback.

[How to contribute](CONTRIBUTING.md) · [What is available](#what-is-available-today)

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

We are seeking first users and contributors. You can help without writing code:

| Your perspective | A useful first contribution |
| --- | --- |
| Legal or other documentary work | Try the example and identify one question you still could not answer |
| Development | Reproduce a checker issue with a minimal synthetic input and expected output |
| Research or evaluation | Propose a fictional counterexample that separates integrity from factual accuracy |

Follow the [first-use guide](START_HERE.md), then the [contribution instructions](CONTRIBUTING.md). Reports, critique and proposals are welcome; licensing must be clarified before a reusable code release. No contributor count, institutional endorsement or external adoption is claimed.

**Next capability to assess, not released:** a local dossier inventory that compares supplied files with an expected list and reports missing entries, duplicate contents and changes. It must reuse existing Legal work, have reproducible acceptance checks and have its publication rights resolved before release. Feedback should tell us whether this would solve a real handover problem.

## Work with Gersende

For a possible Legal pilot, [describe the need](https://openproof.net/qualify?intent=case) without confidential evidence. Scope, deliverable, prerequisites, timing, acceptance criteria and price must be agreed before an engagement; the public exercise is not delivery of that service.

For transformation or interim executive assignments, [contact Gersende](https://www.linkedin.com/in/gryard/). [TruthX](https://truthx.co/) presents the broader method and architecture.

## Attribution and licensing status

Maintained by **Gersende Ryard de Parcey**, founder of TruthX / OpenProof. Citation metadata is in [CITATION.cff](CITATION.cff).

That metadata currently names MIT, but this repository has no accompanying LICENSE file. This update does not establish or change licensing terms. Clarify the applicable rights with the maintainer before redistribution or commercial integration; public access alone is not a complete open-source release.
