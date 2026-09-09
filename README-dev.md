> **Historical design material.** This page is retained for context and may contain superseded claims or instructions. Use the [current public entry point](README.md) and its documented verification limits.

# RPO v0.1 — Developer Guide  
Minimal JSON profile · Hashing · Validation · Integration

---

## 1. 📦 Minimal RPO JSON Structure

```json
{
  "rpo_version": "0.1",
  "bundle_id": "string",
  "created_at": "ISO-8601 timestamp",
  "issuer": { "label": "string" },
  "subject": { "label": "string" },
  "narrative": {
    "title": "string",
    "text": "string",
    "pdf_hash": "string"
  },
  "evidence": [],
  "registry": {
    "public_hash": "sha256 hex",
    "registry_hint": "string"
  },
  "meta": { "playground": true }
}
```
---

## 2. 🔐 Hashing Algorithm (public_hash)

RPO v0.1 uses **SHA-256** over a deterministic concatenation of core fields:

```
rpo_version=<v>|
bundle_id=<id>|
created_at=<iso>|
issuer=<label>|
subject=<label>|
title=<title>|
narrative=<text>
```

### Example (Python)

```python
import hashlib

def compute_public_hash(bundle):
    payload = (
        f"rpo_version={bundle['rpo_version']}|"
        f"bundle_id={bundle['bundle_id']}|"
        f"created_at={bundle['created_at']}|"
        f"issuer={bundle['issuer']['label']}|"
        f"subject={bundle['subject']['label']}|"
        f"title={bundle['narrative']['title']}|"
        f"narrative={bundle['narrative']['text']}"
    )
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()
```

---

## 3. ✅ Validating an RPO Bundle

```python
def validate_public_hash(bundle):
    expected = compute_public_hash(bundle)
    return expected == bundle["registry"]["public_hash"]
```

### Required validations

- presence of mandatory fields  
- ISO-8601 timestamp  
- 64-char hex hash  
- correct narrative structure  
- deterministic hash match  

---

## 4. 🧩 Generating a New RPO Bundle

```python
import uuid
from datetime import datetime

def new_rpo(title, text, issuer, subject):
    return {
        "rpo_version": "0.1",
        "bundle_id": f"rpo-{uuid.uuid4()}",
        "created_at": datetime.utcnow().isoformat() + "Z",
        "issuer": { "label": issuer },
        "subject": { "label": subject },
        "narrative": {
            "title": title,
            "text": text,
            "pdf_hash": "placeholder"
        },
        "evidence": [],
        "registry": {
            "public_hash": "",
            "registry_hint": "No registry anchor in v0.1"
        },
        "meta": { "playground": False }
    }
```

---

## 5. 🖥 CLI Validator Tool

```python
#!/usr/bin/env python3

import sys, json
from rpo_lib import compute_public_hash

def main(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    expected = compute_public_hash(data)
    if expected == data["registry"]["public_hash"]:
        print("✔ RPO bundle is valid")
    else:
        print("✘ INVALID RPO BUNDLE")
        print("expected:", expected)
        print("found:   ", data.get("registry", {}).get("public_hash"))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: validate_rpo.py <path_to_rpo.json>")
        sys.exit(1)
    main(sys.argv[1])
```

---

## 6. ✅ Developer Checklist

- [ ] Parse JSON  
- [ ] Validate minimal fields  
- [ ] Validate ISO-8601 timestamp  
- [ ] Recompute and compare `public_hash`  
- [ ] Reject bundle on mismatch  
- [ ] (Optional) Validate `pdf_hash`  
- [ ] (Optional) Enforce `bundle_id` uniqueness  
- [ ] (Optional) Run JSON Schema validation  

---

## 7. 📫 Contact

For technical questions, integrations or bug reports:

- Email: `openproof@truthx.co`

---


## 8. 🧱 Architecture Overview — RPO Pipeline v0.1


---


### 8.1 🔹 High-Level Pipeline

```text
+----------------------------+
| 1. Input Narrative         |
| (raw text, metadata,       |
|  optional context)         |
+----------------------------+
             |
             v
+----------------------------+
| 2. Normalization Layer     |
| - trim & sanitize text     |
| - unify encoding (UTF-8)   |
| - ensure JSON-safe chars   |
+----------------------------+
             |
             v
+----------------------------+
| 3. JSON Builder            |
| - rpo_version              |
| - bundle_id (UUID4)        |
| - created_at (ISO-8601)    |
| - issuer / subject         |
| - narrative.title / text   |
+----------------------------+
             |
             v
+----------------------------+
| 4. Hash Engine (SHA-256)   |
| - deterministic concat     |
| - compute public_hash      |
+----------------------------+
             |
             v
+----------------------------+
| 5. Registry Layer          |
| - attach public_hash       |
| - attach registry_hint     |
|   (optional)               |
+----------------------------+
             |
             v
+----------------------------+
| 6. Validation Suite        |
| - schema checks            |
| - ISO-date check           |
| - hash recomputation       |
| - structural coherence     |
+----------------------------+
             |
             v
+----------------------------+
| 7. Final RPO Bundle        |
| - JSON + public_hash       |
| - PDF hash optional        |
| - ready for storage /      |
|   publication              |
+----------------------------+
────────────────────────────────────────────────────────────────┘
```

---

### 8.2 🔹 Deterministic Concatenation Model
```
rpo_version=<v>    |
bundle_id=<uuid>   |
created_at=<iso8601> |
issuer=<label>     |
subject=<label>    |
title=<string>     |
narrative=<text>

```
---

### 8.3 🔹 Minimal JSON Responsibilities

```json
{
  "rpo_version": "0.1",
  "bundle_id": "string",
  "created_at": "ISO-8601 timestamp",
  "issuer": { "label": "string" },
  "subject": { "label": "string" },
  "narrative": {
    "title": "string",
    "text": "string",
    "pdf_hash": "string or placeholder"
  },
  "evidence": [],
  "registry": {
    "public_hash": "sha256 hex",
    "registry_hint": "string"
  },
  "meta": { "playground": false }
}
```
---

### 8.4 🔹 Validation Contract

- presence of mandatory fields  
- valid ISO-8601 timestamp  
- 64-char SHA-256 hex  
- correct narrative structure  
- deterministic hash match  
- JSON parseable + UTF-8 clean  
- (optional) pdf_hash validation  
- (optional) schema validation
```
```
---

### 8.5 🔹 Lifecycle Summary

```text
Input → Normalize → Build JSON → Compute Hash → Attach Registry → Validate → Publish
```
---

## 9. 🛠 Developer Responsibilities & Integrations
```
---
```
### 9.1 🔸 API Boundaries

The RPO v0.1 spec defines strict boundaries for any implementation:

- The hash computation must follow the deterministic concatenation model.  
- No additional fields may be injected into the hashing payload.  
- Validation tools must treat missing fields as fatal errors.  
- RPO JSON must remain portable across environments (UTF-8, no BOM).  
- Implementations must not depend on external, mutable APIs for core operations.
  
#### Minimal API Contract

```text
compute_public_hash(bundle) -> sha256_hex
validate_public_hash(bundle) -> bool
new_rpo(title, text, issuer, subject) -> dict

---
```
### 9.2 🔸 Required Developer Guarantees

#### To preserve determinism and cross-implementation compatibility, developers integrating RPO v0.1 must guarantee:

- Stable hashing (no whitespace drift, no locale drift, no reordering).
- Fixed timestamp format (UTC, ISO-8601, trailing “Z”).
- Strict UTF-8 text normalization.
- Immutability of RPO bundles once hashed.
- No auto-formatting of JSON fields by the runtime or editor.
- No additional serialization layers (pretty-print differences must not alter stored JSON).
- Consistent UUID generation (UUID4).
- Rejection of bundles with missing or malformed fields.

Example (Python defensive pattern)
```python
def safe_load(path):
    with open(path, "r", encoding="utf-8") as f:
        raw = f.read()
    # Ensure no BOM, no trailing nulls
    assert raw.encode("utf-8", "strict")
    return json.loads(raw)
```
    
---

### 9.3 🔸 Integration Patterns (CLI, API, Serverless, Local)

RPO v0.1 is intentionally lightweight and can be integrated into multiple architectures.

#### CLI Integration

- Bundle generation and validation via Python or Node scripts.
- Ideal for CI pipelines and researcher tooling.

```bash
$ rpo new "Title" "Narrative..."
$ rpo validate my_bundle.json
```

#### API Integration

- Stateless HTTP endpoint wrapping compute_public_hash() and validators.
- Must not store bundles unless explicit.
- Ensure identical hashing behaviour across deployments.

```Text
POST /compute-hash
POST /validate
POST /new-rpo
```

#### Serverless Integration

- Lambda / Cloud Functions can host hashing logic.
- Must pin runtime versions to avoid drift.
- Must pass full JSON body without modification.

def handler(event, context):
```python
    bundle = json.loads(event["body"])
    return compute_public_hash(bundle)
```

#### Local Library Integration

- Ideal for offline or privacy-preserving workflows.
- No external dependencies beyond standard crypto libraries.
- Recommended for sensitive narratives.

---

### 9.4 🔸 Danger Zone (What Can Break Determinism)

These pitfalls will instantly corrupt the determinism of the RPO bundle and produce mismatched hashes.

🚨 High-Risk Sources of Drift

- Auto-formatters (Prettier, Black) rewriting JSON.
- Automatic newline conversion (LF ↔ CRLF).
- Using localized date formats instead of ISO-8601.
- Adding or reordering JSON fields.
- Using Python dictionaries pre-3.7 (non-ordered).
- Invisible characters (NBSP, zero-width space).
- Changing runtime versions without pinning.
- Encoding drift (UTF-16, ANSI, BOM).
- Mutating text after hashing.

Example of a Drift-Inducing Mistake
```python
# ❌ Dangerous: pretty-printing alters whitespace → hash mismatch
json.dumps(bundle, indent=4)
```

Safe Pattern
```python
# ✔ Safe: preserve original structure & whitespace
json.dumps(bundle, separators=(",", ":"))
```

---

## 10. 🧪 Test Fixtures & CI Hooks

---

#### 10.1 🔸 Local Test Commands

Use a minimal, reproducible set of tests to ensure your implementation stays compatible with RPO v0.1:

```bash
# 1. Run unit tests (hashing, validation, JSON schema)
$ pytest tests/

# 2. Validate all sample bundles in /examples
$ python tools/validate_all.py examples/*.json
```

---

### 10.2 🔸 Golden Bundles & Hashes

#### RPO v0.1 relies on golden fixtures to guarantee deterministic behaviour across implementations.

- /examples/ should contain a small set of reference bundles.
- Each bundle has a known, documented public_hash.
- Any change in code that alters these hashes must be considered breaking.

Example (documentation snippet):

```Texte
examples/rpo-example-001.json  ->  public_hash = <sha256 hex>
examples/rpo-example-002.json  ->  public_hash = <sha256 hex>
```

---

### 10.3 🔸 CI Integration

#### Recommended checks in your CI pipeline:

- parse and validate all RPO JSON files in /examples
- recompute public_hash and compare with stored value
- fail the pipeline on any mismatch or malformed bundle

Example (pseudo GitHub Actions step):

```yaml
- name: Validate RPO examples
  run: |
    python tools/validate_all.py examples/*.json
```
