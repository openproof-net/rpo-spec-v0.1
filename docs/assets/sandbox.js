/* docs/assets/sandbox.js
   OpenProof RPO Sandbox engine (safe to load on any page).
   - Exposes window.Sandbox.setContext(ctx)
   - Optionally binds a dropdown via window.Sandbox.bindContextDropdown(...)
   - Generates a deterministic draft RPO JSON from a narrative form (if present)
*/
(() => {
  "use strict";

  // -------------------------
  // Safe DOM helpers
  // -------------------------
  const byId = (id) => document.getElementById(id);
  const setText = (el, txt) => { if (el) el.textContent = String(txt ?? ""); };
  const setDisplay = (el, val) => { if (el) el.style.display = val; };

  // -------------------------
  // Public API namespace
  // -------------------------
  window.Sandbox = window.Sandbox || {};

  // Persisted context slots (read by sandbox + can be read by other scripts)
  window.__RPO_CONTEXT__ = window.__RPO_CONTEXT__ || null;
  window.__RPO_SUMMARY_TEMPLATE__ = window.__RPO_SUMMARY_TEMPLATE__ || null;
  window.__RPO_WEIGHTS__ = window.__RPO_WEIGHTS__ || null;
  window.__RPO_LABELS__ = window.__RPO_LABELS__ || null;

  // Core: called by Simulator when dropdown changes
  window.Sandbox.setContext = function setContext(ctx) {
    window.__RPO_CONTEXT__ = ctx || null;

    if (ctx && ctx.summary && ctx.summary.template) {
      window.__RPO_SUMMARY_TEMPLATE__ = ctx.summary.template;
    }
    if (ctx && ctx.weights) {
      window.__RPO_WEIGHTS__ = ctx.weights;
    }
    if (ctx && ctx.ui && ctx.ui.labels) {
      window.__RPO_LABELS__ = ctx.ui.labels;
    }

    // Optional: emit an event so Simulator/UI can react
    try {
      window.dispatchEvent(new CustomEvent("rpo:context-changed", { detail: { ctx } }));
    } catch (_) {
      // ignore
    }
  };

  // Optional helper: bind a dropdown to setContext in one line.
  // Usage (from simulator/page JS):
  //   Sandbox.bindContextDropdown("context-select", window.RPO_CONTEXTS, "defaultKey");
  window.Sandbox.bindContextDropdown = function bindContextDropdown(selectOrId, contexts, defaultKey) {
    const selectEl = typeof selectOrId === "string" ? byId(selectOrId) : selectOrId;
    if (!selectEl || !contexts) return false;

    const apply = (key) => {
      const ctx = contexts[key] || contexts[defaultKey] || null;
      window.Sandbox.setContext(ctx);
    };

    // init
    const initKey = selectEl.value || defaultKey;
    apply(initKey);

    // on change
    selectEl.addEventListener("change", () => apply(selectEl.value));
    return true;
  };

  // -------------------------
  // Utilities (deterministic-ish heuristics)
  // -------------------------
  function normaliseText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function countSentences(text) {
    const cleaned = normaliseText(text);
    if (!cleaned) return 0;
    return cleaned
      .split(/[.!?]+/g)
      .map((s) => s.trim())
      .filter(Boolean).length;
  }

  function countEvidenceMarkers(text) {
    const digits = (text.match(/\b\d{2,}\b/g) || []).length;
    const markers = (text.match(/\b(on|at|since|because|when|where|witness|email|report|contract|invoice)\b/gi) || []).length;
    return digits + markers;
  }

  function detectDates(text) {
    const months = "january february march april may june july august september october november december".split(" ");
    const lower = (text || "").toLowerCase();
    const found = new Set();

    months.forEach((m) => {
      if (lower.includes(m)) found.add(m.charAt(0).toUpperCase() + m.slice(1));
    });

    // years like 2024 etc
    (text.match(/\b(19|20)\d{2}\b/g) || []).forEach((y) => found.add(y));
    return Array.from(found);
  }

  function detectPlaces(text) {
    const placeWords =
      "office headquarters store shop factory plant school university court hospital paris lyon marseille london berlin brussels new york sydney"
        .split(" ");
    const lower = (text || "").toLowerCase();
    const found = new Set();
    placeWords.forEach((p) => { if (lower.includes(p)) found.add(p); });
    return Array.from(found);
  }

  function countTemporalMarkers(text) {
    const markers = (text.match(/\b(yesterday|today|tomorrow|morning|evening|night|week|month|year|before|after|during)\b/gi) || []);
    return markers.length;
  }

  function computeCoherenceScore(sentences, markers) {
    const base = Math.min(40, sentences * 6);
    const detail = Math.min(40, markers * 4);
    const floor = 20;
    return Math.max(0, Math.min(100, floor + base + detail));
  }

  function computeChronologyConfidence(datesCount, temporalMa
