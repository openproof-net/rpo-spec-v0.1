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
