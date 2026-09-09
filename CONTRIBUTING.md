# Contributing to the public RPO example

Start with the [README](README.md) and the [fictional Atlas case](examples/public-demo/README.md).

## Useful contributions

- Reproducible bugs in the public verification path.
- Clearer explanations of structure, integrity and their limits.
- Fictional examples with explicit reservations.
- Tests showing whether a proposed change preserves the documented behaviour.

## Before opening a pull request

1. Describe the problem in an issue, using synthetic data only.
2. Keep the change scoped to the public specification or demonstration.
3. Run `node --test tests/public-verification.test.cjs` with Node.js 22 or later.
4. State what changed, what was verified and what remains unverified.

Do not silently regenerate reference hashes to make a failing comparison pass. An intentional fixture change requires an explanation and review of the corresponding reference change.

Never submit personal dossiers, confidential source documents, tokens or credentials. The private TruthX engine and production deployment are outside this repository's public contribution scope.

Licensing metadata is incomplete; see the README before proposing code for redistribution. No contributor rights assignment or new licensing terms are introduced here.

For a private use case, use [case qualification](https://openproof.net/qualify?intent=case) without uploading evidence. For other enquiries, contact [Gersende](https://www.linkedin.com/in/gryard/).
