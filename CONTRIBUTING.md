# Contributing to OpenProof

**Project lead: Gersende Ryard de Parcey.** Start at [Build OpenProof together](COMMUNITY.md) and [introduce your proposed contribution](https://github.com/openproof-net/rpo-spec-v0.1/issues/43).

The first challenge combines source reading, research/evaluation, report design and technical interface proposals. Read the [fictional Cedar pack](examples/community-cedar/README.md) and choose [one bounded task](COMMUNITY.md#first-tasks). These activities inform the existing Legal product; they do not require access to the private engine.

The [five-minute Atlas exercise](START_HERE.md) remains available for an introduction to the public format and integrity checker.

## How your contribution moves forward

1. Propose a task and a realistic scope in its issue; French and English are welcome.
2. Gersende confirms its priority and coordinates contributors. Agree applicable rights before reusable material is incorporated.
3. Submit a deliverable link, the version you examined, evidence and limits.
4. Record review questions and revisions. Gersende makes acceptance decisions with appropriate specialist review; technical integration requires reproducible checks and a competent reviewer.
5. Credit the contributor's accepted work and distinguish accepted feedback/design from a released product feature.

Task states: available → proposed → in review → accepted. No external participant or specialist is appointed automatically. See [responsibility and review](COMMUNITY.md#responsibility-and-review).

## Useful contributions

| Contribution | Include | Submit |
| --- | --- | --- |
| First-use feedback | What you tried, where you stopped, one useful next step | [First-use report](https://github.com/openproof-net/rpo-spec-v0.1/issues/new?template=first-use.md) |
| Verification bug | Public version, command, synthetic input, expected and observed output | [Reproducible bug](https://github.com/openproof-net/rpo-spec-v0.1/issues/new?template=verification-bug.md) |
| Fictional scenario | A claim, conflicting references, an unresolved question and an observable acceptance check | [Synthetic scenario](https://github.com/openproof-net/rpo-spec-v0.1/issues/new?template=synthetic-scenario.md) |

No coding is required for feedback or a scenario. A GitHub account is required to post an issue. Check existing issues first.

## Scope and review

Gersende Ryard de Parcey maintains this repository and the product direction. Opening an issue or pull request does not guarantee acceptance or a response deadline. Contributions are assessed for reproducibility, usefulness to documentary review and consistency with the stated limits.

Public scope: the draft format, synthetic source packs, evaluation criteria, report design, interface proposals, checker, documentation and tests. Use invented material only: removing a name alone does not make a real case safe to publish. Keep feedback respectful and focused on the work.

Before implementing a change, describe the problem and proposed result in an issue. **Licensing metadata is incomplete.** Agree applicable rights with the maintainer before submitting code intended for redistribution. These instructions neither assign contributor rights nor introduce a licence.

## Before opening a pull request

1. Describe the problem in an issue, using synthetic data only.
2. Keep the change scoped to the agreed public task. For source-pack or report proposals, verify every cited document and paragraph and state any unresolved review question.
3. For changes affecting the checker or walkthrough, run `node --test tests/public-verification.test.cjs tests/campaign-walkthrough.test.cjs` with Node.js 22 or later. Documentation-only proposals should include a link/citation check; do not claim product tests were run.
4. State what changed, what was verified and what remains unverified.

Do not silently regenerate reference hashes to make a failing comparison pass. An intentional fixture change requires an explanation and review of the corresponding reference change.

Never submit personal dossiers, confidential source documents, tokens or credentials. The private TruthX engine and production deployment are outside this repository's public contribution scope.

Licensing metadata is incomplete; see the README before proposing code for redistribution. No contributor rights assignment or new licensing terms are introduced here.

For a private use case, use [case qualification](https://openproof.net/qualify?intent=case) without uploading evidence. For other enquiries, contact [Gersende](https://www.linkedin.com/in/gryard/).
