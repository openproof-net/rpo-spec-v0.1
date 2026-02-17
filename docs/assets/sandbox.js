/* docs/assets/sandbox.js
   Purpose:
   - Provide a safe, global Sandbox.setContext(ctx) hook.
   - Store context in window.__RPO_CONTEXT__ (+ derived globals).
   - Optionally apply context to UI if simulator/sandbox elements exist.
*/
(() => {
  "use strict";

  // ---------- small helpers ----------
  const d = document;
  const $ = (id) => d.getElementById(id);
  const page = d.documentElement?.dataset?.page || ""; // e.g. "simulator" or "sandbox"

  function safeText(el, value) {
    if (!el) return;
    el.textContent = value == null ? "" : String(value);
  }

  function safeShow(el, show) {
    if (!el) return;
    el.style.display = show ? "" : "none";
  }

  function debugLog(...args) {
    // Toggle to false if you want silence
    const DEBUG = true;
    if (DEBUG) console.log(...args);
  }

  // ---------- core: setContext ----------
  window.Sandbox = window.Sandbox || {};

  window.Sandbox.setContext = function setContext(ctx) {
    // 0) store raw ctx
    window.__RPO_CONTEXT__ = ctx || {};

    // 1) derive globals used by other scripts (if any)
    if (ctx?.summary?.template) window.__RPO_SUMMARY_TEMPLATE__ = ctx.summary.template;
    if (ctx?.weights) window.__RPO_WEIGHTS__ = ctx.weights;
    if (ctx?.ui?.labels) window.__RPO_LABELS__ = ctx.ui.labels;

    debugLog("[Sandbox.setContext]", ctx);

    // 2) Apply to UI (non-breaking): only if we are on pages that can consume it
    try {
      if (page === "simulator") applyContextToSimulator(window.__RPO_CONTEXT__);
      if (page === "sandbox") applyContextToSandbox(window.__RPO_CONTEXT__);
    } catch (e) {
      console.warn("[Sandbox.setContext] applyContext failed (non-blocking):", e);
    }
  };

  // ---------- apply to SIMULATOR (safe / minimal) ----------
  // We don't assume IDs exist. We only update if found.
  function applyContextToSimulator(ctx) {
    // OPTIONAL hooks (only if you created them in simulator.html):
    // - an element that should display the current context name
    // - an element that should display the context description
    // - any place where template/labels are shown

    // Example: if you add these IDs later, sandbox.js will start updating them automatically.
    safeText($("ctx-name"), ctx?.name || ctx?.id || "");
    safeText($("ctx-description"), ctx?.description || "");

    // If simulator has a "tagline" or "context note" area:
    safeText($("ctx-tagline"), ctx?.tagline || "");

    // If you want a visible proof in the cockpit that context changed:
    // (create <span id="ctx-template-preview"></span> somewhere)
    safeText($("ctx-template-preview"), window.__RPO_SUMMARY_TEMPLATE__ || "");

    // If your simulator has its own engine hook, call it softly:
    // e.g. window.SimulatorEngine.setContext(ctx)
    if (window.SimulatorEngine && typeof window.SimulatorEngine.setContext === "function") {
      window.SimulatorEngine.setContext(ctx);
    }

    debugLog("[applyContextToSimulator] done");
  }

  // ---------- apply to SANDBOX (safe) ----------
  // Only try to bind sandbox-specific DOM if it exists.
  function applyContextToSandbox(ctx) {
    // If you have a sandbox page with these IDs, they will update;
    // otherwise this does nothing and never breaks.
    safeText($("result-tagline"), ctx?.tagline || "");
    safeText($("metric-score"), ctx?.metrics?.score ?? "");
    debugLog("[applyContextToSandbox] done");
  }

  // ---------- optional: auto-load context from URL query param ----------
  // Example: simulator.html?context=governance
  function getQueryParam(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch {
      return null;
    }
  }

  function autoBootFromUrl() {
    const key = getQueryParam("context");
    if (!key) return;

    // contexts.js can expose either window.__RPO_CONTEXTS__ or window.RPO_CONTEXTS
    const contexts =
      window.__RPO_CONTEXTS__ ||
      window.RPO_CONTEXTS ||
      null;

    const ctx = contexts?.[key];
    if (ctx) window.Sandbox.setContext(ctx);
  }

  // Wait for DOM, then boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoBootFromUrl);
  } else {
    autoBootFromUrl();
  }
})();


