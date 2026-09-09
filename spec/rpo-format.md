# RPO v0.1 — draft format guide

RPO means **Registered Probative Object**. The machine-readable field contract is [rpo-schema.json](rpo-schema.json). This guide explains the existing schema without changing it.

## Fields

| Field | Required by the schema? | Purpose |
| --- | --- | --- |
| `rpo_version` | Yes | Version `0.1` |
| `type` | Yes | `evidence_bundle` |
| `bundle_id` | Yes | UUID identifier |
| `created_at` | Yes | Date-time |
| `issuer`, `subject` | Yes | Objects containing `name`, `id`, `role` |
| `evidence` | Yes | Array of references containing `id` and `type` |
| `narrative` | Yes | `summary` and `pdf_hash` strings, with optional references |
| `jurisdiction`, `language` | No | Context metadata |
| `registry` | No | If present: `registry_id`, `entry_id`, `public_hash` |
| `signatures` | No | If present: signature entries with algorithm, value and creation time |

The schema rejects additional properties in the defined objects. Several hash fields are currently unconstrained strings: passing schema validation alone cannot establish a real digest, signature, registration or linked file. Format validation also depends on the chosen validator and its configuration.

## Supported public example

See [Project Atlas](../examples/public-demo/README.md). It is fictional and contains illustrative source hashes, a PDF placeholder and no signatures. It is not a production Legal export.

The [local checker](../tools/verify-demo.cjs) performs **basic field inspection**, not full JSON Schema validation. Its fingerprint covers the entire parsed JSON object, including registry fields, using the same recursive ordering as the browser demonstration. The expected digest is kept in a separate file; it is not written into the object it hashes.

This demonstration does not define a production signing, PDF sealing or registry protocol. Any implementation making those claims must specify its protected bytes, trust anchors and verification procedure separately.

## Interpretation boundary

Integrity comparison can detect a difference from a retained reference. It cannot establish the truth of an assertion, the authenticity of an underlying source, professional approval or legal admissibility.
