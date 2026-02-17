/* assets/sandbox.js
   Deterministic Sandbox engine (no AI). Robust, null-safe, context-aware.
   Works with existing DOM ids provided by Gersende.
*/

(() => {
  "use strict";

  // ---------------------------
  // Small utilities
  // ---------------------------
  const $ = (id) => document.getElementById(id);
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn, { passive: true });
  const setText = (el, txt) => { if (el) el.textContent = String(txt ?? "—"); };
  const show = (el, yes) => { if (el) el.style.display = yes ? "" : "none"; };

  // stable stringify (deterministic key order)
  function stableStringify(obj) {
    const seen = new WeakSet();
    const sort = (v) => {
      if (v && typeof v === "object") {
        if (seen.has(v)) return v;
        seen.add(v);
        if (Array.isArray(v)) return v.map(sort);
        const out = {};
        Object.keys(v).sort().forEach((k) => out[k] = sort(v[k]));
        return out;
      }
      return v;
    };
    return JSON.stringify(sort(obj), null, 2);
  }

  async function sha256Hex(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    const bytes = Array.from(new Uint8Array(digest));
    return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function nowISO() {
    return new Date().toISOString();
  }

  // ---------------------------
  // Context plumbing (optional)
  // ---------------------------
  // Supported sources:
  // - window.__RPO_CONTEXT__ set by simulator or contexts loader
  // - window.Sandbox.setContext(ctx) called by page
  //
  // What we store:
  // - window.__RPO_CONTEXT__
  // - window.__RPO_WEIGHTS__
  // - window.__RPO_LABELS__
  // - window.__RPO_SUMMARY_TEMPLATE__
  //
  // Important: this file works even without contexts.
  window.Sandbox = window.Sandbox || {};

  window.Sandbox.setContext = function setContext(ctx) {
    window.__RPO_CONTEXT__ = ctx || null;

    if (ctx && ctx.summary && typeof ctx.summary.template === "function") {
      window.__RPO_SUMMARY_TEMPLATE__ = ctx.summary.template;
    }
    if (ctx && ctx.weights) {
      window.__RPO_WEIGHTS__ = ctx.weights;
    }
    if (ctx && ctx.ui && ctx.ui.labels) {
      window.__RPO_LABELS__ = ctx.ui.labels;
    }

    // If UI already mounted, apply immediately
    try { applyContextToUI(); } catch (_) {}
  };

  function getLabels() {
    return window.__RPO_LABELS__ || {};
  }

  // ---------------------------
  // DOM bindings (your IDs)
  // ---------------------------
  const els = {
    generateBtn: $("generate-btn"),
    resetBtn: $("reset-btn"),
    loadExampleBtn: $("load-example-btn"),

    titleInput: $("case-title"),
    issuerInput: $("issuer"),
    subjectInput: $("subject"),
    narrativeInput: $("narrative"),

    taglineEl: $("result-tagline"),
    metricsEl: $("metrics"),
    sentencesEl: $("metric-sentences"),
    markersEl: $("metric-markers"),
    scoreEl: $("metric-score"),
    datesEl: $("metric-dates"),
    placesEl: $("metric-places"),
    densityEl: $("metric-density"),
    chronoEl: $("metric-chrono"),

    hashBlockEl: $("hash-block"),
    hashValueEl: $("hash-value"),

    anchorsBlockEl: $("anchors-block"),
    anchorsDatesEl: $("anchors-dates"),
    anchorsPlacesEl: $("anchors-places"),
    anchorsTemporalEl: $("anchors-temporal"),

    jsonEl: $("rpo-json"),
    outputActions: $("output-actions"),
    copyBtn: $("copy-json-btn"),
    downloadBtn: $("download-json-btn"),
  };

  function applyContextToUI() {
    // This is deliberately minimal because I don’t know your full sandbox.html,
    // but we can still update visible labels if they exist.
    const L = getLabels();

    // If you have label placeholders, you can extend this.
    // For now: tagline gets a context hint.
    if (els.taglineEl && window.__RPO_CONTEXT__ && window.__RPO_CONTEXT__.name) {
      setText(els.taglineEl, `Deterministic bundle — context: ${window.__RPO_CONTEXT__.name}`);
    }
  }

  // ---------------------------
  // Deterministic extraction (lightweight)
  // ---------------------------
  function tokenizeSentences(text) {
    const t = String(text || "").trim();
    if (!t) return [];
    // Split on . ! ? (keep it simple, deterministic)
    return t.split(/[\.\!\?]+/g).map(s => s.trim()).filter(Boolean);
  }

  function extractDates(text) {
    const t = String(text || "");
    // ISO / FR / common: 2026-02-10, 10/02/2026, 10-02-2026
    const re = /\b(\d{4}-\d{2}-\d{2}|\d{2}[\/-]\d{2}[\/-]\d{4})\b/g;
    return Array.from(new Set((t.match(re) || [])));
  }

  function extractPlaces(text) {
    // Deterministic heuristic: capitalized tokens longer than 2 that look like locations.
    // (No AI, no geo DB.)
    const t = String(text || "");
    const candidates = t.match(/\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,}){0,2})\b/g) || [];
    const blacklist = new Set(["I", "We", "The", "This", "That", "And", "But", "For", "With"]);
    const cleaned = candidates
      .map(x => x.trim())
      .filter(x => !blacklist.has(x))
      .slice(0, 12);
    return Array.from(new Set(cleaned));
  }

  function markerCount(text) {
    const t = String(text || "");
    // Count explicit anchors like [A], [1], (evidence), "Exhibit", "Annex"
    const bracket = (t.match(/\[[^\]]+\]/g) || []).length;
    const exhibit = (t.match(/\b(exhibit|annex|appendix|evidence|proof)\b/gi) || []).length;
    return bracket + exhibit;
  }

  function density(sentences, markers) {
    if (!sentences) return 0;
    return sentences.length ? Math.round((markers / sentences.length) * 100) / 100 : 0;
  }

  function computeScore({ sentences, markers, dates, places }) {
    // Purely deterministic scoring, tuned for “coherence of anchors”
    // Not truth, not interpretation.
    let score = 0;

    // sentences: 0..25
    score += Math.min(25, sentences * 2);

    // markers: 0..25
    score += Math.min(25, markers * 3);

    // dates: 0..25
    score += Math.min(25, dates * 8);

    // places: 0..15
    score += Math.min(15, places * 3);

    // density bonus: 0..10 if enough anchoring
    const d = density(sentences, markers);
    if (d >= 0.6) score += 10;
    else if (d >= 0.35) score += 6;
    else if (d >= 0.2) score += 3;

    // clamp
    score = Math.max(0, Math.min(100, Math.round(score)));

    // If there are weights from context, apply them *only* as a deterministic multiplier
    // (still no AI). If not present, do nothing.
    const W = window.__RPO_WEIGHTS__;
    if (W && typeof W === "object") {
      // Keep it conservative: small adjustment only.
      const w =
        (Number(W.timestamp_rigor || 1) +
         Number(W.attribution || 1) +
         Number(W.chain_of_custody || 1)) / 3;
      score = Math.max(0, Math.min(100, Math.round(score * Math.min(1.15, Math.max(0.85, w)))));
    }

    return score;
  }

  function chronoHint(dates) {
    // Deterministic: if multiple dates, say “multi-point timeline”
    if (!dates || dates.length === 0) return "No explicit timeline anchors";
    if (dates.length === 1) return "Single time anchor";
    return "Multi-point timeline (reconstructible)";
  }

  function buildBundle() {
    const title = (els.titleInput?.value || "").trim();
    const issuer = (els.issuerInput?.value || "").trim();
    const subject = (els.subjectInput?.value || "").trim();
    const narrative = (els.narrativeInput?.value || "").trim();

    const sentences = tokenizeSentences(narrative);
    const dates = extractDates(narrative);
    const places = extractPlaces(narrative);
    const markers = markerCount(narrative);

    const score = computeScore({
      sentences: sentences.length,
      markers,
      dates: dates.length,
      places: places.length
    });

    const core = {
      standard: "OpenProof RPO v0.1",
      artifact_type: "SANDBOX_NARRATIVE_BUNDLE",
      context_frame: window.__RPO_CONTEXT__?.key || "default",
      generated_at: nowISO(),
      case: {
        title: title || "—",
        issuer: issuer || "—",
        subject: subject || "—",
      },
      narrative: {
        text: narrative || "—",
        stats: {
          sentences: sentences.length,
          markers,
          dates: dates.length,
          places: places.length,
          density: density(sentences.length, markers),
          chrono: chronoHint(dates),
        }
      },
      deterministic_outputs: {
        coherence_score_pct: score, // YOUR “% score” requirement, deterministic
        note: "Deterministic proxies only. No AI. No truth claim."
      }
    };

    // Optional: custom summary template (if provided by context)
    let summary = null;
    const tpl = window.__RPO_SUMMARY_TEMPLATE__;
    if (typeof tpl === "function") {
      try { summary = tpl(core, { score }); } catch (_) { summary = null; }
    }

    return { core, summary };
  }

  async function render() {
    const { core, summary } = buildBundle();
    const coreJson = stableStringify(core);
    const hash = await sha256Hex(coreJson);

    const bundle = {
      sealed_core: core,
      meta: {
        sealed_core_hash_sha256: hash,
        note: "Meta is not part of sealed core hash."
      },
      summary: summary
    };

    const fullJson = stableStringify(bundle);
    window.__SANDBOX_JSON__ = fullJson;
    window.__SANDBOX_HASH__ = hash;

    // Tagline + metrics
    setText(els.taglineEl, "Bundle generated — deterministic anchors extracted");
    show(els.metricsEl, true);

    setText(els.sentencesEl, core.narrative.stats.sentences);
    setText(els.markersEl, core.narrative.stats.markers);
    setText(els.scoreEl, `${core.deterministic_outputs.coherence_score_pct}%`);
    setText(els.datesEl, core.narrative.stats.dates);
    setText(els.placesEl, core.narrative.stats.places);
    setText(els.densityEl, core.narrative.stats.density);
    setText(els.chronoEl, core.narrative.stats.chrono);

    // Hash
    show(els.hashBlockEl, true);
    setText(els.hashValueEl, hash);

    // Anchors block (optional)
    show(els.anchorsBlockEl, true);
    setText(els.anchorsDatesEl, extractDates(core.narrative.text).join(", ") || "—");
    setText(els.anchorsPlacesEl, extractPlaces(core.narrative.text).join(", ") || "—");
    setText(els.anchorsTemporalEl, chronoHint(extractDates(core.narrative.text)));

    // JSON output
    if (els.jsonEl) els.jsonEl.textContent = fullJson;
    show(els.outputActions, true);
  }

  function reset() {
    if (els.titleInput) els.titleInput.value = "";
    if (els.issuerInput) els.issuerInput.value = "";
    if (els.subjectInput) els.subjectInput.value = "";
    if (els.narrativeInput) els.narrativeInput.value = "";

    setText(els.taglineEl, "—");
    show(els.metricsEl, false);
    show(els.hashBlockEl, false);
    show(els.anchorsBlockEl, false);
    if (els.jsonEl) els.jsonEl.textContent = "{}";
    show(els.outputActions, false);

    window.__SANDBOX_JSON__ = null;
    window.__SANDBOX_HASH__ = null;
  }

  function loadExample() {
    if (els.titleInput) els.titleInput.value = "Case — Company X (decision trace)";
    if (els.issuerInput) els.issuerInput.value = "HR Governance Office";
    if (els.subjectInput) els.subjectInput.value = "Decision defensibility — reconstructible perimeter";

    const sample =
`On 10/02/2026, a nomination decision was prepared for a sensitive role.
Evidence perimeter included HRIS trace, training records, and formal performance review.
Two entities were involved (multi-site). Definitions were frozen at Moment T. [Annex A]
Paris and Toulouse stakeholders validated the decision perimeter on 2026-02-10.`;

    if (els.narrativeInput) els.narrativeInput.value = sample;
  }

  async function copyToClipboard(text) {
    if (!text) return false;
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        ta.remove();
        return ok;
      } catch (__) {
        return false;
      }
    }
  }

  function downloadJson() {
    const json = window.__SANDBOX_JSON__;
    if (!json) return;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sandbox_bundle.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ---------------------------
  // Wire events + init
  // ---------------------------
  function init() {
    // If a context was preloaded (by another script), apply it.
    applyContextToUI();

    on(els.generateBtn, "click", () => { render(); });
    on(els.resetBtn, "click", () => { reset(); });
    on(els.loadExampleBtn, "click", () => { loadExample(); render(); });

    on(els.copyBtn, "click", async () => {
      const ok = await copyToClipboard(window.__SANDBOX_JSON__);
      if (els.copyBtn) {
        const old = els.copyBtn.textContent;
        els.copyBtn.textContent = ok ? "Copied" : old;
        setTimeout(() => { els.copyBtn.textContent = old; }, 900);
      }
    });

    on(els.downloadBtn, "click", () => { downloadJson(); });

    // Optional: live re-render when typing (if you want)
    // on(els.narrativeInput, "input", () => { /* quick preview could be added */ });

    // Default UI state
    reset();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


