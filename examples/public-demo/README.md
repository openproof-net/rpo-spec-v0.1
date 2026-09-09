# Project Atlas — a fictional record you can inspect

**Educational example. No personal case, source documents or Legal production export.**

## The situation

A fictional building handover depends on a final ventilation test. Three references tell different parts of the story:

| Reference | What the example declares |
| --- | --- |
| `ev-001` — contract requirement | A final test is required before handover. |
| `ev-002` — meeting minutes | On 15 July, the building is declared ready. |
| `ev-003` — inspection report | On 16 July, the final airflow test is still outstanding. |

The record preserves a gap between the declaration and the inspection finding. It does not determine liability, intention or whether the test was performed later. A reviewer would need the underlying documents and any missing test report.

## Files

- `rpo-en.json` / `rpo-fr.json`: existing English and French demonstration objects.
- `rpo-en.sha256` / `rpo-fr.sha256`: retained fingerprints for local comparison.

The JSON files are also published under `docs/examples/public-demo/`. The tests check that these copies agree.

## Reproduce the comparison

From the repository root, using Node.js 22 or later:

```sh
node tools/verify-demo.cjs examples/public-demo/rpo-en.json examples/public-demo/rpo-en.sha256
```

The original matches its reference. Edit the summary in a copy and compare that copy against the **unchanged original reference**: the command exits with code `1` and reports `reference_matches: false`.

Preserve the reference separately if you intend to detect later changes. A reference obtained from the same compromised source as an object cannot authenticate that object.

## What is deliberately not demonstrated

The source hashes are illustrative; no source files are supplied. `pdf_hash` is a placeholder, not the digest of an attached PDF. The registry value is a demonstration marker, not an independent registration. There are no signatures. Neither the command nor the readable scenario proves that the declared events occurred.

The CLI inspects basic fields and compares the full parsed object under documented serialisation. It does not perform full JSON Schema validation or verify a production RPO.

[Read the example online](https://rpo.openproof.net/examples.html) · [Try browser verification](https://rpo.openproof.net/tests.html) · [Qualify a pilot case](https://openproof.net/qualify?intent=case)
