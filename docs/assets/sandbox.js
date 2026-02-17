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

  function computeChronologyConfidence(datesCount, temporalMarkers, contradictions = 0) {
    const base = 5;
    const dateWeight = Math.min(40, datesCount * 20);
    const temporalWeight = Math.min(40, temporalMarkers * 8);
    const penalty = contradictions * 15;
    return Math.max(0, Math.min(100, base + dateWeight + temporalWeight - penalty));
  }

  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function safeToFixed(n, digits) {
    return Number.isFinite(n) ? Number(n).toFixed(digits) : "0";
  }

  // -------------------------
  // Wire up UI if the sandbox form exists on the page
  // (If it doesn't exist, sandbox.js becomes "context-only" and does nothing.)
  // -------------------------
  function initIfPresent() {
    const generateBtn = byId("generate-btn");
    const resetBtn = byId("reset-btn");
    const loadExampleBtn = byId("load-example-btn");

    const titleInput = byId("case-title");
    const issuerInput = byId("issuer");
    const subjectInput = byId("subject");
    const narrativeInput = byId("narrative");

    // If page doesn't contain the sandbox form, stop here safely.
    if (!generateBtn || !titleInput || !issuerInput || !subjectInput || !narrativeInput) {
      return;
    }

    const taglineEl = byId("result-tagline");
    const metricsEl = byId("metrics");
    const sentencesEl = byId("metric-sentences");
    const markersEl = byId("metric-markers");
    const scoreEl = byId("metric-score");
    const datesEl = byId("metric-dates");
    const placesEl = byId("metric-places");
    const densityEl = byId("metric-density");
    const chronoEl = byId("metric-chrono");

    const hashBlockEl = byId("hash-block");
    const hashValueEl = byId("hash-value");

    const anchorsBlockEl = byId("anchors-block");
    const anchorsDatesEl = byId("anchors-dates");
    const anchorsPlacesEl = byId("anchors-places");
    const anchorsTemporalEl = byId("anchors-temporal");

    const jsonEl = byId("rpo-json");
    const outputActions = byId("output-actions");
    const copyBtn = byId("copy-json-btn");
    const downloadBtn = byId("download-json-btn");

    async function generateBundle() {
      const title = normaliseText(titleInput.value) || "Untitled case";
      const issuer = normaliseText(issuerInput.value) || "Unknown issuer";
      const subject = normaliseText(subjectInput.value) || "Unspecified subject";
      const narrative = (narrativeInput.value || "").trim();

      if (!normaliseText(narrative)) {
        alert("Please paste a narrative before generating the bundle.");
        return;
      }

      const sentences = countSentences(narrative);
      const markers = countEvidenceMarkers(narrative);
      const dates = detectDates(narrative);
      const places = detectPlaces(narrative);
      const temporalMarkers = countTemporalMarkers(narrative);

      const coherenceScore = computeCoherenceScore(sentences, markers);
      const densityRatio = sentences ? markers / sentences : 0;
      const chronologyConfidence = computeChronologyConfidence(dates.length, temporalMarkers);

      // Canonical content for deterministic sealing (draft)
      const canonicalForHash = [
        "rpo_version:" + "0.1",
        "issuer:" + issuer,
        "subject:" + subject,
        "title:" + title,
        "narrative:" + normaliseText(narrative),
      ].join("|");

      const publicHash = await sha256(canonicalForHash);
      const bundleId = "rpo-" + publicHash.slice(0, 12);
      const createdAt = new Date().toISOString();

      const ctx = window.__RPO_CONTEXT__ || null;

      const rpo = {
        rpo_version: "0.1",
        bundle_id: bundleId,
        created_at: createdAt,

        issuer: { label: issuer },
        subject: { label: subject },

        narrative: {
          title: title,
          text: narrative,
          pdf_hash: null
        },

        evidence: [
          {
            id: "E1",
            type: "narrative_block",
            source: "user_input",
            description: "Raw narrative provided in the open sandbox.",
            text_ref: "narrative.text"
          }
        ],

        seal: {
          public_hash: publicHash,
          method: "sha256",
          scope: "rpo_version|bundle_id|created_at|issuer|subject|title|narrative",
          note: "Open sandbox seal. No registry anchor, no legal effect."
        },

        meta: {
          playground: true,
          engine: {
            kind: "deterministic-heuristics",
            ai: false,
            note: "Open demonstrator. No psycho-forensic model embedded."
          },
          context: ctx || null
        },

        heuristic_scores: {
          coherence_score: coherenceScore,
          evidence_markers: markers,
          sentence_count: sentences,
          dates_detected: dates.length,
          places_detected: places.length,
          density_ratio: Number(safeToFixed(densityRatio, 2)),
          chronology_confidence: chronologyConfidence
        },

        heuristic_anchors: {
          dates,
          places,
          temporal_markers: temporalMarkers
        }
      };

      // UI updates (only if elements exist)
      setText(sentencesEl, sentences);
      setText(markersEl, markers);
      setText(scoreEl, coherenceScore + "%");
      setText(datesEl, dates.length);
      setText(placesEl, places.length);
      setText(densityEl, safeToFixed(densityRatio, 2));
      setText(chronoEl, chronologyConfidence + "%");

      setDisplay(metricsEl, "grid");

      setDisplay(hashBlockEl, "block");
      setText(hashValueEl, publicHash);

      setDisplay(anchorsBlockEl, "block");
      setText(anchorsDatesEl, "Dates: " + (dates.length ? dates.join(", ") : "—"));
      setText(anchorsPlacesEl, "Places: " + (places.length ? places.join(", ") : "—"));
      setText(anchorsTemporalEl, "Temporal markers: " + temporalMarkers);

      setText(taglineEl, "This draft bundle illustrates how a narrative can be structured, sealed and later re-evaluated without rewriting history.");

      if (jsonEl) jsonEl.textContent = JSON.stringify(rpo, null, 2);
      setDisplay(outputActions, "flex");
    }

    generateBtn.addEventListener("click", generateBundle);

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        titleInput.value = "";
        issuerInput.value = "";
        subjectInput.value = "";
        narrativeInput.value = "";

        setText(taglineEl, "Fill the form and click “Generate” to produce a draft RPO bundle.");
        setDisplay(metricsEl, "none");
        setDisplay(hashBlockEl, "none");
        setDisplay(anchorsBlockEl, "none");
        if (jsonEl) jsonEl.textContent = "";
        setDisplay(outputActions, "none");
      });
    }

    if (loadExampleBtn) {
      loadExampleBtn.addEventListener("click", async () => {
        titleInput.value = "Incident in Paris office — March 2024";
        issuerInput.value = "Internal audit team, Company X";
        subjectInput.value = "Employee — Sales department";
        narrativeInput.value =
          "On 14 March 2024, around 10:30 am, an argument broke out in the Paris office between a line manager and a sales employee. " +
          "Several colleagues report that the manager raised his voice, threatened to remove key accounts from the employee and asked him to leave the open space immediately. " +
          "Later that day, around 3 pm, the same manager sent an email copying HR, questioning the employee's loyalty and suggesting exclusion from client meetings.";
        await generateBundle();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        if (!jsonEl || !jsonEl.textContent) return;
        await navigator.clipboard.writeText(jsonEl.textContent);
        const prev = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = prev || "Copy JSON"), 1200);
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        if (!jsonEl || !jsonEl.textContent) return;
        const blob = new Blob([jsonEl.textContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rpo.json";
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    // If Simulator already set a context before sandbox loads, keep it.
    // Otherwise sandbox stays neutral until Simulator calls setContext.
    initIfPresent();
  });
})();

