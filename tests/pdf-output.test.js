/**
 * RPO v0.1 — PDF Output Test
 *
 * This test ensures:
 *  - the minimal PDF placeholder exists,
 *  - the narrative summary can be extracted,
 *  - the PDF hash in the JSON matches a SHA-256 of the placeholder (not enforced yet).
 *
 * This is not a full PDF test: it prepares the ground for v0.2 where
 * real PDF generation and hashing will be automated.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

// Paths
const pdfPath = path.resolve("./examples/example-minimal/rpo.pdf.txt");
const jsonPath = path.resolve("./examples/example-minimal/rpo.json");

// Load files
const pdfContent = fs.readFileSync(pdfPath, "utf8");
const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

// Tests

// 1. File exists
if (!pdfContent || pdfContent.length === 0) {
  console.error("❌ PDF placeholder is missing or empty.");
  process.exit(1);
}

// 2. Required headers are present
const requiredHeaders = [
  "RPO Minimal Example",
  "Summary",
  "Narrative",
  "Evidence Reference",
  "PDF Hash"
];

for (const header of requiredHeaders) {
  if (!pdfContent.includes(header)) {
    console.error(`❌ PDF placeholder missing required section: ${header}`);
    process.exit(1);
  }
}

// 3. Hash check (optional for v0.1)
const pdfHash = crypto
  .createHash("sha256")
  .update(pdfContent)
  .digest("hex");

// Not strict yet:
console.log("ℹ️  PDF hash (computed):", pdfHash);
console.log("ℹ️  PDF hash (JSON):   ", json.narrative.pdf_hash);

console.log("✅ PDF output test completed (non-strict in v0.1).");
