# Why OpenProof exists

Modern institutions make high-stakes decisions every day.

These decisions may later be questioned, audited, challenged, or litigated.

Yet the reasoning behind those decisions is rarely preserved in a structured and verifiable form.

Most organisations rely on fragmented artefacts:

- emails  
- reports  
- dashboards  
- meeting notes  
- internal documentation  

These artefacts describe decisions, but they do not make them defensible.

---

## The hidden gap

Modern information systems are designed to store data.

They are not designed to preserve the reasoning that links evidence to a decision.

As a result:

- decisions become contestable  
- accountability becomes fragile  
- governance becomes narrative-driven  

When decisions are reviewed months or years later, the structure of reasoning is often lost.

---

## The OpenProof approach

OpenProof introduces a new class of decision artefact:

**The Registered Probative Object (RPO).**

An RPO is a deterministic evidential bundle designed to make institutional decisions:

- traceable  
- auditable  
- defensible  

Instead of relying on scattered documents, the decision reasoning is preserved as a structured object.

---

## Structure of an RPO

Each RPO contains three layers:

1. A canonical JSON core describing the structured reasoning  
2. A human-readable representation of the decision artefact  
3. A public integrity hash enabling independent verification

This structure ensures that the reasoning behind a decision remains preserved and verifiable over time.

---

## Design principles

OpenProof is built on three fundamental principles.

### Integrity

Evidence and reasoning must remain tamper-evident.

### Readability

Humans must be able to understand the reasoning structure.

### Verifiability

Third parties must be able to validate the artefact independently.

---

## Architecture

OpenProof is the probative infrastructure.

TruthX Engine is the deterministic structuring engine powering it.

The RPO is the registered probative object produced by this engine.

OpenProof provides the infrastructure for storing, verifying and sharing these artefacts.

---

## Example domains

OpenProof can support decision defensibility in domains such as:

- cybersecurity incident response  
- regulatory compliance  
- institutional governance  
- legal investigations  
- high-stakes operational decisions  

---

## Resources

Specification  
https://github.com/openproof-net/rpo-spec-v0.1

Reference implementation  
https://github.com/Gersenderdp/rpo-reference

Interactive simulator  
https://rpo.openproof.net/simulator.html

---

## Final note

OpenProof does not replace human judgement.

It preserves the structure of reasoning so that decisions remain accountable over time.

---

## From narrative decisions to probative decisions

Traditional governance relies on narrative reconstruction of decisions.

Evidence → Reports → Decisions → Disputes

In this model, the reasoning behind the decision is rarely preserved.

OpenProof introduces a different model.

Evidence → TruthX Engine → RPO → OpenProof → Verifiable Decision

Instead of reconstructing reasoning after the fact, the reasoning structure is preserved as a verifiable artefact.

This enables a shift from narrative accountability to probative accountability.

