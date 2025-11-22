/**
 * RPO v0.1 — Schema Validation Test
 *
 * Ensures that the minimal example JSON bundle conforms
 * to the RPO schema defined in `rpo-schema.json`.
 */

import fs from "fs";
import path from "path";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

const schemaPath = path.resolve("./spec/rpo-schema.json");
const examplePath = path.resolve("./examples/example-minimal/rpo.json");

const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const example = JSON.parse(fs.readFileSync(examplePath, "utf8"));

const validate = ajv.compile(schema);

const valid = validate(example);

if (!valid) {
  console.error("❌ Schema validation failed:");
  console.error(validate.errors);
  process.exit(1);
} else {
  console.log("✅ Schema validation passed.");
}
