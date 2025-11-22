# RPO v0.1 — Developer Guide  
Minimal JSON profile • Hashing • Validation • Integration

---

## 1. Minimal RPO JSON structure

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

## 2. Hashing algorithm (public_hash)

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

## 3. Validating a bundle

```python
def validate_public_hash(bundle):
    expected = compute_public_hash(bundle)
    return expected == bundle["registry"]["public_hash"]
```

Required validations:

- presence of mandatory fields  
- ISO-8601 timestamp  
- 64-char hex hash  
- correct narrative structure  
- deterministic hash match  

---

## 4. Generating a new RPO bundle

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

## 5. CLI validator tool

```python
#!/usr/bin/env python3

import sys, json
from rpo_lib import compute_public_hash

def main(path):
    data = json.load(open(path))
    expected = compute_public_hash(data)
    if expected == data["registry"]["public_hash"]:
        print("✔ RPO bundle is valid")
    else:
        print("✘ INVALID RPO BUNDLE")
        print("expected:", expected)
        print("found:   ", data["registry"]["public_hash"])

if __name__ == "__main__":
    main(sys.argv[1])
```

---

## 6. Developer checklist

- [ ] Parse JSON  
- [ ] Validate minimal fields  
- [ ] Validate ISO timestamp  
- [ ] Recompute and compare public hash  
- [ ] Reject on mismatch  
- [ ] Optional: validate PDF hash  
- [ ] Optional: validate bundle_id uniqueness  
- [ ] Optional: JSON Schema validation  

---

## 7. Contact  
openproof@truthx.co
