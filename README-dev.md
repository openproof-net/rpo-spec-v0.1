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

  ## 8. 🏗 Architecture Overview — RPO Pipeline v0.1

---

### 8.1 🔹 High-Level Pipeline

┌──────────────────────────┐
│ 1. Input Narrative │
│ (text, metadata) │
└─────────────┬────────────┘
│
▼
┌──────────────────────────┐
│ 2. Normalization Layer │
│ - trim + sanitize text │
│ - unify encoding (UTF-8) │
│ - ensure JSON-safe │
└─────────────┬────────────┘
│
▼
┌──────────────────────────┐
│ 3. RPO JSON Builder │
│ - rpo_version │
│ - bundle_id (UUID4) │
│ - created_at (ISO-8601) │
│ - issuer / subject │
│ - narrative title/text │
└─────────────┬────────────┘
│
▼
┌──────────────────────────┐
│ 4. Hash Engine (SHA-256) │
│ - deterministic concat │
│ - compute public_hash │
└─────────────┬────────────┘
│
▼
┌──────────────────────────┐
│ 5. Registry Layer │
│ - attach public_hash │
│ - attach registry_hint │
└─────────────┬────────────┘
│
▼
┌──────────────────────────┐
│ 6. Validation Suite │
│ - schema checks │
│ - ISO-date check │
│ - hash recomputation │
│ - structural coherence │
└─────────────┬────────────┘
│
▼
┌──────────────────────────┐
│ 7. Final RPO Bundle │
│ - JSON + public_hash │
│ - PDF hash optional │
│ - ready for storage │
└──────────────────────────┘


---

### 8.2 🔹 Deterministic Concatenation Model

rpo_version=<v>|
bundle_id=<id>|
created_at=<iso>|
issuer=<label>|
subject=<label>|
title=<title>|
narrative=<text>


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

---

### 8.5 🔹 Lifecycle Summary


Input → Normalize → Build JSON → Compute Hash → Attach Registry → Validate → Publish


