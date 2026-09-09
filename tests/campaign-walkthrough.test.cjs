const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {webcrypto} = require('node:crypto');
const root = path.resolve(__dirname, '..');
const load = () => import('../docs/assets/campaign-walkthrough.mjs');
test('guided sequence requires a start, completes at 90 seconds and can replay', async () => {
  const {Walkthrough} = await load(); const m = new Walkthrough();
  m.advance(100); assert.equal(m.elapsed, 0);
  m.play(); m.advance(18); assert.equal(m.step, 1);
  m.advance(100); assert.equal(m.elapsed, 90); assert.equal(m.step, 4); assert.equal(m.playing, false);
  m.play(); assert.equal(m.elapsed, 0); assert.equal(m.playing, true);
});
test('manual navigation pauses the sequence and paused time is not counted', async () => {
  const {Walkthrough} = await load(); const m = new Walkthrough();
  m.play(); m.advance(22); m.select(3); m.advance(20);
  assert.equal(m.elapsed, 54); assert.equal(m.playing, false);
  m.play(); m.advance(2); m.pause(); m.advance(30); assert.equal(m.elapsed, 56);
  m.select(-1); assert.equal(m.step, 0); m.select(9); assert.equal(m.step, 4);
});
test('browser fingerprint matches the published reference and detects the demonstrated edit', async () => {
  const {fingerprint} = await load();
  const original = JSON.parse(fs.readFileSync(path.join(root, 'examples/public-demo/rpo-en.json'), 'utf8'));
  const expected = fs.readFileSync(path.join(root, 'examples/public-demo/rpo-en.sha256'), 'utf8').trim();
  assert.equal(await fingerprint(original, webcrypto), expected);
  const changed = structuredClone(original); changed.narrative.summary += ' [DETAIL CHANGED FOR THIS DEMONSTRATION]';
  assert.notEqual(await fingerprint(changed, webcrypto), expected);
  assert.equal(await fingerprint(original, webcrypto), expected);
});
