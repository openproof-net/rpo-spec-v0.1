'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');
const { inspect, fingerprint, verify } = require('../tools/verify-demo.cjs');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const bundle = JSON.parse(read('examples/public-demo/rpo-en.json'));
const expected = read('examples/public-demo/rpo-en.sha256').trim();

test('published English and French examples match their retained references and website copies', () => {
  for (const lang of ['en', 'fr']) {
    const file = `examples/public-demo/rpo-${lang}.json`;
    const object = JSON.parse(read(file));
    const result = verify(object, read(file.replace('.json', '.sha256')).trim());
    assert.equal(result.basic_structure_present, true);
    assert.equal(result.reference_matches, true);
    assert.deepEqual(object, JSON.parse(read('docs/' + file)));
  }
});
test('a changed nested assertion is detected even if an embedded hash is replaced', () => {
  const changed = structuredClone(bundle);
  changed.narrative.summary += ' The test passed.';
  changed.registry.public_hash = fingerprint(changed);
  assert.equal(verify(changed, expected).reference_matches, false);
});
test('formatting and object key order do not change the fingerprint', () => {
  const reordered = Object.fromEntries(Object.entries(bundle).reverse());
  reordered.issuer = Object.fromEntries(Object.entries(bundle.issuer).reverse());
  assert.equal(fingerprint(JSON.parse(JSON.stringify(reordered, null, 4))), expected);
});
test('array order is preserved and a removed source changes the fingerprint', () => {
  const changed = structuredClone(bundle);
  changed.evidence.reverse();
  assert.notEqual(fingerprint(changed), expected);
  changed.evidence.pop();
  assert.notEqual(fingerprint(changed), expected);
});
test('invalid structures and unsafe numbers cannot silently pass', () => {
  for (const value of [null, [], {}, {...bundle, issuer: null}, {...bundle, evidence: [{}]}]) {
    assert.ok(inspect(value).length > 0);
  }
  assert.throws(() => fingerprint({...bundle, value: 0.5}), /safe integer/);
  assert.throws(() => verify(bundle, 'placeholder'), /SHA-256/);
});
test('matching a reference alone does not make an invalid structure pass', () => {
  const invalid = {rpo_version: '0.1'};
  const result = verify(invalid, fingerprint(invalid));
  assert.equal(result.reference_matches, true);
  assert.equal(result.basic_structure_present, false);
});
test('CLI succeeds for the documented command and fails for an unrelated reference or missing file', () => {
  const run = args => spawnSync(process.execPath, ['tools/verify-demo.cjs', ...args], {cwd: root, encoding: 'utf8'});
  assert.equal(run(['examples/public-demo/rpo-en.json', 'examples/public-demo/rpo-en.sha256']).status, 0);
  assert.equal(run(['examples/public-demo/rpo-en.json', 'examples/public-demo/rpo-fr.sha256']).status, 1);
  assert.equal(run(['missing.json', 'examples/public-demo/rpo-en.sha256']).status, 2);
  assert.equal(run([]).status, 2);
});
test('CLI canonical bytes match the existing browser implementation on both demonstration objects', () => {
  const source = read('docs/assets/rpo-demonstration.js');
  const start = source.indexOf('  const stable =');
  const end = source.indexOf('  const digest =', start);
  assert.ok(start >= 0 && end > start);
  for (const lang of ['en', 'fr']) {
    const object = JSON.parse(read(`examples/public-demo/rpo-${lang}.json`));
    const browserBytes = vm.runInNewContext(source.slice(start, end) + '\nstable(input)', {input: object});
    const digest = require('node:crypto').createHash('sha256').update(browserBytes).digest('hex');
    assert.equal(digest, fingerprint(object));
  }
});
