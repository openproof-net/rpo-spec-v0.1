# OpenProof: product architecture and public verification boundary

OpenProof is the application and review workflow. TruthX Engine structures information. The Registered Probative Object (RPO) describes a record and its references. The first product pilot is Legal; the broader direction is reconstruction and decision traceability in complex situations.

## Intended product workflow

Sources enter a bounded case. Proposed events, assertions and relationships remain distinct from their sources. A human reviews and may accept, correct, contest, reject or request additional material. A versioned output preserves the reviewed record and its reservations.

This describes the product architecture, not a workflow that this public repository can execute end to end. The private application and engine are not included.

## Available public verification

The supported public entry point is the [Atlas example](../examples/public-demo/README.md). The local checker performs basic field inspection and compares a fingerprint with a separately supplied reference. It needs no private service.

| Check | What it establishes | What it does not establish |
| --- | --- | --- |
| Basic structure | Selected expected fields and types are present | Full schema conformance or completeness of a case |
| Fingerprint comparison | The parsed object matches the retained reference under the documented serialisation | Authenticity if both the object and reference can be replaced |
| Evidence references | The example declares sources | That the files exist or support the assertions |
| Human-readable explanation | A person can inspect the example and its limits | That a professional has validated the case |

No PDF, digital signature or external registry is verified by the public checker. Source fingerprints and the PDF field in the fixture are illustrative placeholders. The browser demonstration compares against the reference it loads from the website; the CLI accepts a retained digest file.

## Integrity and human judgement

A hash is not a truth score. A citation is not proof that the cited source supports a statement. An intact object may contain errors. Verification therefore needs an explicit scope and, where authenticity matters, an independently trusted reference or signing mechanism.

The public tests exercise the example and comparison logic. They do not attest the private runtime, deployment, security of a real case or legal admissibility.
