#!/usr/bin/env node
'use strict';

// Public demonstration only; no network access or private engine dependency.
const fs = require('node:fs');
const crypto = require('node:crypto');

function stable(value) {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
  }
  if (typeof value === 'number' && !Number.isSafeInteger(value)) {
    throw new Error('This demonstration supports safe integer JSON numbers only.');
  }
  return JSON.stringify(value);
}

function inspect(object) {
  const errors = [];
  const isObject = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const text = x => typeof x === 'string' && x.trim().length > 0;
  if (!isObject(object)) return ['Expected a JSON object.'];
  if (object.rpo_version !== '0.1') errors.push('rpo_version must be 0.1.');
  if (object.type !== 'evidence_bundle') errors.push('type must be evidence_bundle.');
  for (const key of ['bundle_id', 'created_at']) {
    if (!text(object[key])) errors.push(key + ' must be a non-empty string.');
  }
  for (const key of ['issuer', 'subject']) {
    if (!isObject(object[key]) || !['name', 'id', 'role'].every(k => text(object[key][k]))) {
      errors.push(key + ' must provide name, id and role.');
    }
  }
  if (!Array.isArray(object.evidence) || !object.evidence.every(x => isObject(x) && text(x.id) && text(x.type))) {
    errors.push('evidence must be an array of references with id and type.');
  }
  if (!isObject(object.narrative) || !text(object.narrative.summary) || !text(object.narrative.pdf_hash)) {
    errors.push('narrative must provide summary and pdf_hash strings.');
  }
  return errors;
}

function fingerprint(object) {
  return crypto.createHash('sha256').update(stable(object), 'utf8').digest('hex');
}

function verify(object, expectedHash) {
  if (!/^[a-f0-9]{64}$/.test(expectedHash)) throw new Error('Reference must be a lowercase SHA-256 digest.');
  const errors = inspect(object);
  const actual = fingerprint(object);
  const matches = actual === expectedHash;
  return { basic_structure_present: errors.length === 0, reference_matches: matches, sha256: actual, errors };
}

function main(args) {
  if (args.length !== 2) {
    console.error('Usage: node tools/verify-demo.cjs <bundle.json> <reference.sha256>');
    return 2;
  }
  try {
    const object = JSON.parse(fs.readFileSync(args[0], 'utf8'));
    const expected = fs.readFileSync(args[1], 'utf8').trim();
    const report = verify(object, expected);
    console.log(JSON.stringify(report, null, 2));
    console.log('Scope: basic structure and comparison with the supplied reference.');
    console.log('Not checked: full JSON Schema, source files, PDF, signatures, registry, factual truth or legal validity.');
    return report.basic_structure_present && report.reference_matches ? 0 : 1;
  } catch (error) {
    console.error('Verification failed: ' + error.message);
    return 2;
  }
}

module.exports = { stable, inspect, fingerprint, verify };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
