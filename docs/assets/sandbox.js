/* assets/sandbox.js
   Purpose:
   - Provide a stable Sandbox API for simulator.html
   - Allow simulator.html (or Console) to inject a context object (governance / justice / cyber / etc.)
   - Store the context into globals and APPLY it to the UI safely (no hard crashes if an element is missing)
*/

(() => {
  "use strict";

  // -----------------------------
  // Small helpers
  // -----------------------------
  const byId = (id) => document.getElementById(id);
  const setText = (el, txt) => { if (el) el.textContent = txt ?? ""; };
  const setHTML = (el, html) => { if (el) el.innerHTML = html ?? ""; };
  const setAttr = (el, k, v) => { if (el) el.setAttribute(k, v); };
  const setPlaceholder = (el, v) => { if (el) el.placeholder = v ?? ""; };
  const safeJson = (obj) => {
    try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
  };

  // -----------------------------
  // Global state (public)
  // -----------------------------
  window.Sandbox = window.Sandbox || {};

  // Internal state (single source)
  const STATE = {
    context: null,     // full ctx object
    template: null,    // ctx.summary.template
    weights: null,     // ctx.weights
    labels: null       // ctx.ui.labels
  };

  // -----------------------------
  // UI references (lazy-bound)
  // -----------------------------
  const UI = {
    // Inputs
    generateBtn: null,
    resetBtn: null,
    loadExampleBtn: null,

    titleInput: null,
    issuerInput: null,
    subjectInput: null,
    narrativeInput: null,

    // Output (some may not exist on your page; we never crash)
    taglineEl: null,
    metricsEl: null,

    sentencesEl: null,
    markersEl: null,
    scoreEl: null,
    datesEl: null,
    placesEl: null,
    densityEl: null,
    chronoEl: null,

    hashBlockEl: null,
    hashValueEl: null,

    anchorsBlockEl: null,
    anchorsDatesEl: null,
    anchorsPlacesEl: null,
    anchorsTemporalEl: null,

    jsonEl: null,
    outputActions: null,
    copyBtn: null,
    downloadBtn: null,

    // Optional “context display” elements (if you have them)
    contextNameEl: null,     // e.g. id="context-name"
    contextDescEl: null      // e.g. id="context-desc"
  };

  function bindUIOnce() {
    // Buttons
    UI.generateBtn = byId("generate-btn");
    UI.resetBtn = byId("reset-btn");
    UI.loadExampleBtn = byId("load-example-btn");

    // Inputs
    UI.titleInput = byId("case-title");
    UI.issuerInput = byId("issuer");
    UI.subjectInput = byId("subject");
    UI.narrativeInput = byId("narrative");

    // Output
    UI.taglineEl = byId("result-tagline");
    UI.metricsEl = byId("metrics");

    UI.sentencesEl = byId("metric-sentences");
    UI.markersEl = byId("metric-markers");
    UI.scoreEl = byId("metric-score");
    UI.datesEl = byId("metric-dates");
    UI.placesEl = byId("metric-places");
    UI.densityEl = byId("metric-density");
    UI.chronoEl = byId("metric-chrono");

    UI.hashBlockEl = byId("hash-block");
    UI.hashValueEl = byId("hash-value");

    UI.anchorsBlockEl = byId("anchors-block");
    UI.anchorsDatesEl = byId("anchors-dates");
    UI.anchorsPlacesEl = byId("anchors-places");
    UI.anchorsTemporalEl = byId("anchors-temporal");

    UI.jsonEl = byId("rpo-json");
    UI.outputActions = byId("output-actions");
    UI.copyBtn = byId("copy-json-btn");
    UI.downloadBtn = byId("download-json-btn");

    // Optional (only if you added them in HTML)
    UI.contextNameEl = byId("context-name");
    UI.contextDescEl = byId("context-desc");

    // Wire generic actions safely (won’t break if some controls don’t exist)
    if (UI.copyBtn) {
      UI.copyBtn.addEventListener("click", async () => {
        const txt = UI.jsonEl ? UI.jsonEl.textContent : "";
        try { await navigator.clipboard.writeText(txt || ""); } catch {}
      });
    }

    if (UI.downloadBtn) {
      UI.downloadBtn.addEventListener("click", () => {
        const txt = UI.jsonEl ? UI.jsonEl.textContent : "{}";
        const blob = new Blob([txt], { type: "application/json;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "rpo_bundle.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 300);
      });
    }
  }

  // -----------------------------
  // Context application (the point)
  // -----------------------------
  function applyContextToSimulator() {
    // Make sure UI is bound
    bindUIOnce();

    const ctx = STATE.context;
    if (!ctx) return;

    // 1) Update optional context header spots (if present)
    if (UI.contextNameEl) setText(UI.contextNameEl, ctx.key || "");
    if (UI.contextDescEl) setText(UI.contextDescEl, ctx.description || "");

    // 2) Apply label mapping (if provided)
    // Expected format: ctx.ui.labels = { "case-title": "Case title", "issuer": "...", ... }
    // We support both:
    // - mapping by element id
    // - mapping by "logical keys" if you prefer
    const labels = STATE.labels || {};
    Object.entries(labels).forEach(([k, v]) => {
      // Strategy A: "k" is an element id → update any label tied to it
      const input = byId(k);
      if (input) {
        // If there is a <label for="k">
        const lab = document.querySelector(`label[for="${CSS.escape(k)}"]`);
        if (lab) setText(lab, v);
        return;
      }

      // Strategy B: "k" is a data hook → [data-label="k"]
      const el = document.querySelector(`[data-label="${CSS.escape(k)}"]`);
      if (el) setText(el, v);
    });

    // 3) Apply placeholders (optional): ctx.ui.placeholders = { issuer: "...", narrative: "..." }
    const placeholders = (ctx.ui && ctx.ui.placeholders) ? ctx.ui.placeholders : {};
    if (placeholders["case-title"]) setPlaceholder(UI.titleInput, placeholders["case-title"]);
    if (placeholders["issuer"]) setPlaceholder(UI.issuerInput, placeholders["issuer"]);
    if (placeholders["subject"]) setPlaceholder(UI.subjectInput, placeholders["subject"]);
    if (placeholders["narrative"]) setPlaceholder(UI.narrativeInput, placeholders["narrative"]);

    // 4) Apply tagline template (if you display it)
    // You can keep it dead simple: just display the template string for now
    if (UI.taglineEl && STATE.template) {
      setText(UI.taglineEl, STATE.template);
    }

    // 5) Fire an event so other scripts (if any) can react without tight coupling
    window.dispatchEvent(new CustomEvent("rpo:context", { detail: ctx }));

    // Debug log (kept lightweight)
    console.log("[applyContextToSimulator] done");
  }

  // -----------------------------
  // Public API: setContext(ctx)
  // -----------------------------
  window.Sandbox.setContext = function setContext(ctx) {
    STATE.context = ctx || null;

    // mirror to globals (your simulator.html expects those sometimes)
    window.__RPO_CONTEXT__ = STATE.context;

    if (ctx && ctx.summary && typeof ctx.summary.template === "string") {
      STATE.template = ctx.summary.template;
      window.__RPO_SUMMARY_TEMPLATE__ = STATE.template;
    }

    if (ctx && ctx.weights) {
      STATE.weights = ctx.weights;
      window.__RPO_WEIGHTS__ = STATE.weights;
    }

    if (ctx && ctx.ui && ctx.ui.labels) {
      STATE.labels = ctx.ui.labels;
      window.__RPO_LABELS__ = STATE.labels;
    }

    console.log("[Sandbox.setContext]", ctx);
    applyContextToSimulator();
  };

  // -----------------------------
  // Auto-apply if something set globals before this file loads
  // -----------------------------
  function bootstrap() {
    // bind UI once DOM is ready
    bindUIOnce();

    // If simulator.html already put a context in window.__RPO_CONTEXT__, apply it.
    if (window.__RPO_CONTEXT__ && !STATE.context) {
      // If the page set global context first, we still treat it as the source
      window.Sandbox.setContext(window.__RPO_CONTEXT__);
      return;
    }

    // Otherwise: nothing to do; simulator.html will call Sandbox.setContext(...)
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();



