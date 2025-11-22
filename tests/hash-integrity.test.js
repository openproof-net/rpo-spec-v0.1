/**
 * RPO v0.1 — Hash Integrity Test
 *
 * Goal:
 *  - Compute a canonical SHA-256 hash of the minimal RPO JSON bundle.
 *  - Detect any unexpected modification of the JSON structure or content.
 *
 * This test is illustrative: update the EXPECTED_HASH value
 * if you intentionally change the minimal example.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const examplePath = path.resolve("./examples/example-minimal/rpo.json");

// 1. Load JSON and stringify in a stable way
const raw = fs.readFileSync(examplePath, "utf8");
const json = JSON.parse(raw);

// Simple canonicalisation: stringify with sorted keys
function stableStringify(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort(), 2);
}

const canonical = stableStringify(json);

// 2. Compute SHA-256 hash
const hash = crypto.createHash("sha256").update(canonical).digest("hex");

// ⚠️ À METTRE À JOUR si tu changes rpo.json volontairement.
// Pour l’instant, on laisse un placeholder.
const EXPECTED_HASH = "sha256-placeholder-minimal-rpo";

if (hash !== EXPECTED_HASH) {
  console.error("❌ Hash mismatch for minimal RPO bundle.");
  console.error("Computed :", hash);
  console.error("Expected :", EXPECTED_HASH);
  process.exit(1);
} else {
  console.log("✅ Hash integrity OK for minimal RPO bundle.");
}

