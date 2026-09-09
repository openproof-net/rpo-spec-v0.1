export class Walkthrough {
  constructor() { this.elapsed = 0; this.playing = false; }
  get step() { return Math.min(4, Math.floor(this.elapsed / 18)); }
  get complete() { return this.elapsed >= 90; }
  play() { if (this.complete) this.elapsed = 0; this.playing = true; }
  pause() { this.playing = false; }
  select(step) { this.elapsed = Math.max(0, Math.min(4, step)) * 18; this.pause(); }
  advance(seconds) {
    if (!this.playing || !Number.isFinite(seconds) || seconds < 0) return;
    this.elapsed = Math.min(90, this.elapsed + seconds);
    if (this.complete) this.pause();
  }
}
export function stable(value) {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
export async function fingerprint(value, cryptoProvider = globalThis.crypto) {
  const bytes = new TextEncoder().encode(stable(value));
  return [...new Uint8Array(await cryptoProvider.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
}

function mount() {
  const model = new Walkthrough();
  const byId = id => document.getElementById(id);
  const panels = [...document.querySelectorAll('[data-panel]')];
  const stepButtons = [...document.querySelectorAll('[data-step]')];
  const play = byId('play');
  const status = byId('play-status');
  const progress = byId('progress');
  const previous = byId('previous');
  const next = byId('next');
  let displayed = -1;
  for (const element of [play, progress, document.querySelector('.steps'), document.querySelector('.navigation')]) element.hidden = false;

  function render() {
    if (displayed !== model.step) {
      displayed = model.step;
      panels.forEach((p, i) => { p.hidden = i !== displayed; });
      stepButtons.forEach((b, i) => {
        if (i === displayed) b.setAttribute('aria-current', 'step');
        else b.removeAttribute('aria-current');
      });
      byId('step-count').textContent = `0${displayed + 1} / 05`;
    }
    progress.value = model.elapsed;
    play.textContent = model.playing ? 'Pause walkthrough' : model.complete ? 'Replay walkthrough' : model.elapsed > 0 ? 'Resume walkthrough' : 'Play 90-second walkthrough';
    play.setAttribute('aria-pressed', String(model.playing));
    const message = model.complete ? 'Walkthrough complete. You can replay it or explore a pilot below.' : model.playing ? `Playing step ${model.step + 1} of 5. Pause at any time.` : `Step ${model.step + 1} of 5. Read at your own pace.`;
    if (status.textContent !== message) status.textContent = message;
    previous.disabled = model.step === 0;
    next.disabled = model.step === 4;
  }
  let last = performance.now();
  play.addEventListener('click', () => { if (model.playing) model.pause(); else { model.play(); last = performance.now(); } render(); });
  stepButtons.forEach(button => button.addEventListener('click', () => { model.select(Number(button.dataset.step)); render(); }));
  previous.addEventListener('click', () => { model.select(model.step - 1); render(); });
  next.addEventListener('click', () => { model.select(model.step + 1); render(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { model.pause(); render(); } last = performance.now(); });
  document.querySelector('.panels').addEventListener('focusin', () => { model.pause(); render(); });
  const clock = window.setInterval(() => {
    const now = performance.now();
    if (!document.hidden) model.advance(Math.max(0, (now - last) / 1000));
    last = now;
    render();
  }, 250);
  window.addEventListener('pagehide', () => { window.clearInterval(clock); model.pause(); });
  window.addEventListener('pageshow', event => { if (event.persisted) window.location.reload(); });
  render();

  const change = byId('change');
  const restore = byId('restore');
  const checkStatus = byId('verify-status');
  let original;
  let reference;
  async function compare(changed) {
    model.pause(); render();
    change.disabled = restore.disabled = true;
    try {
      const current = JSON.parse(JSON.stringify(original));
      if (changed) current.narrative.summary += ' [DETAIL CHANGED FOR THIS DEMONSTRATION]';
      const hash = await fingerprint(current);
      byId('current-hash').textContent = hash;
      checkStatus.textContent = hash === reference ? 'Identical to the loaded reference copy.' : 'Change detected against the loaded reference copy.';
      byId('change-note').textContent = changed ? 'The summary now includes: [DETAIL CHANGED FOR THIS DEMONSTRATION]. Only the local demonstration copy changed.' : 'The original demonstration summary has been restored.';
      change.disabled = changed;
      restore.disabled = !changed;
    } catch {
      checkStatus.textContent = 'The local comparison is unavailable. Please use the full public check.';
      byId('current-hash').textContent = 'Unavailable';
    }
  }
  change.addEventListener('click', () => compare(true));
  restore.addEventListener('click', () => compare(false));
  (async () => {
    try {
      const response = await fetch('/examples/public-demo/rpo-en.json', {cache: 'no-store'});
      if (!response.ok) throw new Error('Example unavailable');
      original = await response.json();
      if (typeof original?.narrative?.summary !== 'string') throw new Error('Unexpected example');
      reference = await fingerprint(original);
      byId('reference-hash').textContent = reference;
      // Initial verification must not interrupt the guided sequence if it has started.
      byId('current-hash').textContent = reference;
      checkStatus.textContent = 'Identical to the loaded reference copy.';
      change.disabled = false;
    } catch {
      checkStatus.textContent = 'The example or local hashing is unavailable. Read the case brief or use the full public check.';
    }
  })();
}
if (typeof document !== 'undefined') mount();
