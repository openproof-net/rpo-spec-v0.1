# Your first five minutes with OpenProof

**Question:** can you distinguish what a record says, what remains unresolved and whether the record has changed?

This exercise uses the fictional Atlas case. It does not process a real dossier or require a paid AI service. Choose the browser or command-line route, then report one finding.

## 1. Inspect the fictional case

Open the [90-second walkthrough](https://rpo.openproof.net/walkthrough.html). Read it at your own pace or play the sequence.

Three references are described: a contract requires a final ventilation test, meeting minutes declare readiness, and a subsequent inspection says the test is outstanding.

Ask yourself: **which source would you need before concluding that the test was completed?** The example preserves this unanswered question. It does not supply source documents or automatically detect their disagreement.

## 2. Observe a record change

**In the browser:** use the walkthrough's interactive change exercise. Compare the displayed record with its retained reference before and after modification.

**From a terminal:** use Git and Node.js 22 or later. No package installation or API key is needed.

```sh
git clone https://github.com/openproof-net/rpo-spec-v0.1.git
cd rpo-spec-v0.1
node tools/verify-demo.cjs examples/public-demo/rpo-en.json examples/public-demo/rpo-en.sha256
```

Expected: `basic_structure_present: true`, `reference_matches: true`, exit code `0`.

Create an edited copy; this command leaves the original fixture and reference intact:

```sh
node -e 'const fs = require("node:fs"); const r = JSON.parse(fs.readFileSync("examples/public-demo/rpo-en.json", "utf8")); r.narrative.summary += " EDITED FOR THIS EXERCISE."; fs.writeFileSync("atlas-edited.local.json", JSON.stringify(r, null, 2), {flag: "wx"});'
node tools/verify-demo.cjs atlas-edited.local.json examples/public-demo/rpo-en.sha256
```

Expected: `basic_structure_present: true`, `reference_matches: false`, exit code `1`. That exit code is intended. If the copy already exists, the creation command refuses to overwrite it; inspect or remove your previous exercise copy before repeating.

**What you established:** the edited record differs from the unchanged reference. You did not establish which account is true, that a source is authentic or that a legal conclusion is justified. Replacing both the record and its reference defeats this comparison.

## 3. Contribute one observation

**[Report your first-use result](https://github.com/openproof-net/rpo-spec-v0.1/issues/new?template=first-use.md)**:

- Which route you tried and what happened.
- Which part was difficult to understand or reproduce.
- One result you would need before using this in your work.

A short report is useful even if you stopped before finishing. Posting requires a GitHub account. Use invented material only, never confidential evidence or identifiable case details.

For a technical failure or proposed fictional example, see the [other contribution formats](CONTRIBUTING.md). Completing this exercise does not enrol you in a paid pilot.
