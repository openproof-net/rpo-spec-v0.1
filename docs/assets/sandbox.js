/* docs/assets/sandbox.js
   OpenProof / RPO Sandbox Engine (UI-safe, deterministic, context-aware)
*/

(() => {
  "use strict";

  // -----------------------------
  // Grab UI elements (may be null if loaded on other pages)
  // -----------------------------
  const generateBtn = document.getElementById("generate-btn");
  const resetBtn = document.getElementById("reset-btn");
  const loadExampleBtn = document.getElementById("load-example-btn");

  const titleInput = document.getElementById("case-title");
  const issuerInput = document.getElementById("issuer");
  const subjectInput = document.getElementById("subject");
  const narrativeInput = document.getElementById("narrative");

  const taglineEl = document.getElementById("result-tagline");
  const metricsEl = document.getElementById("metrics");
  const sentencesEl = document.getElementById("metric-sentences");
  const markersEl = document.getElementById("metric-markers");
  const scoreEl = document.getElementById("metric-score");
  const datesEl = document.getElementById("metric-dates");
  const placesEl = document.getElementById("metric-places");
  const densityEl = document.getElementById("metric-density");
  const chronoEl = document.getElementById("metric-chrono");

  const hashBlockEl = document.getElementById("hash-block");
  const hashValueEl = document.getElementById("hash-value");

  const anchorsBlockEl = document.getElementById("anchors-block");
  const anchorsDatesEl = document.getElementById("anchors-dates");
  const anchorsPlacesEl = document.getElementById("anchors-places");
  const anchorsTemporalEl = document.getElementById("anchors-temporal");

  const jsonEl = document.getElementById("rpo-json");
  const outputActions = document.getElementById("output-actions");
  const copyBtn = document.getElementById("copy-json-btn");
  const downloadBtn = document.getElementById("download-json-btn");

  // -----------------------------
  // Context plumbing (always available)
  // -----------------------------
  window.Sandbox = window.Sandbox || {};

  const DEFAULT_WEIGHTS = Object.freeze({
    // Keep these stable & boring: context can tune, engine remains deterministic
    coherence_base: 1.0,
    evidence_markers: 1.0,
    chronology: 1.0,
    contradictions_penalty: 1.0, // (placeholder, currently 0 unless you compute it)
    uncertainty_bonus: 1.0,      // (placeholder, currently 0 unless you compute it)
  });

  const DEFAULT_LABELS = Object.freeze({
    issuer: "issuer",
    subject: "subject",
    title: "title",
    narrative: "narrative",
    coherence_score: "coherence_score",
    chronology_confidence: "chronology_confidence",
    evidence_markers: "evidence_markers",
    dates_detected: "dates_detected",
    places_detected: "places_detected",
    density_ratio: "density_ratio",
  });

  const DEFAULT_SUMMARY_TEMPLATE =
    "This draft bundle illustrates how a narrative can be structured, sealed and later re-evaluated without rewriting history.";

  window.__RPO_CONTEXT__ = window.__RPO_CONTEXT__ || null;
  window.__RPO_WEIGHTS__ = window.__RPO_WEIGHTS__ || { ...DEFAULT_WEIGHTS };
  window.__RPO_LABELS__ = window.__RPO_LABELS__ || { ...DEFAULT_LABELS };
  window.__RPO_SUMMARY_TEMPLATE__ = window.__RPO_SUMMARY_TEMPLATE__ || DEFAULT_SUMMARY_TEMPLATE;

  window.Sandbox.setContext = function setContext(ctx) {
    window.__RPO_CONTEXT__ = ctx || null;

    // Summary template
    if (ctx?.summary?.template) window.__RPO_SUMMARY_TEMPLATE__ = ctx.summary.template;

    // Weights
    if (ctx?.weights && typeof ctx.weights === "object") {
      window.__RPO_WEIGHTS__ = { ...DEFAULT_WEIGHTS, ...ctx.weights };
    }

    // Labels
    if (ctx?.ui?.labels && typeof ctx.ui.labels === "object") {
      window.__RPO_LABELS__ = { ...DEFAULT_LABELS, ...ctx.ui.labels };
    }

    // Optional: help/tooltips
    if (ctx?.ui?.help && typeof ctx.ui.help === "object") {
      window.__RPO_HELP__ = ctx.ui.help;
    }

    try {
      console.log("[Sandbox.setContext]", ctx?.key || ctx);
    } catch (_) {}
  };

  // -----------------------------
  // Guard: if sandbox UI not present, do nothing else
  // -----------------------------
  const UI_READY = !!(generateBtn && narrativeInput && jsonEl);
  if (!UI_READY) {
    // This is expected when sandbox.js is included from simulator/home
    try {
      console.log("[sandbox.js] UI not detected — engine skipped (setContext still available).");
    } catch (_) {}
    return;
  }

  // -----------------------------
  // Utilities (deterministic)
  // -----------------------------
  function normaliseText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function countSentences(text) {
    const cleaned = normaliseText(text);
    if (!cleaned) return 0;
    // simple deterministic split: punctuation boundaries
    return cleaned.split(/[.!?]+/g).map(s => s.trim()).filter(Boolean).length;
  }

  function countEvidenceMarkers(text) {
    const t = normaliseText(text);
    if (!t) return 0;
    const digits = (t.match(/\b\d{2,}\b/g) || []).length;
    const markers = (t.match(/\b(on|at|since|because|when|where|witness|email|report|contract|invoice|chat|message|ticket|log)\b/gi) || []).length;
    return digits + markers;
  }

  function detectDates(text) {
    const t = normaliseText(text).toLowerCase();
    if (!t) return [];
    const months = "january february march april may june july august september october november december".split(" ");
    const found = new Set();

    // month names
    months.forEach(m => {
      if (t.includes(m)) found.add(m.charAt(0).toUpperCase() + m.slice(1));
    });

    // years (1900-2099)
    (t.match(/\b(19|20)\d{2}\b/g) || []).forEach(y => found.add(y));

    // simple dd/mm or dd-mm
    (t.match(/\b\d{1,2}[\/\-]\d{1,2}([\/\-]\d{2,4})?\b/g) || []).forEach(d => found.add(d));

    return Array.from(found);
  }

  function detectPlaces(text) {
    const t = normaliseText(text).toLowerCase();
    if (!t) return [];
    const placeWords = [
      "office","headquarters","store","shop","factory","plant","school","university","court","hospital",
      "paris","lyon","marseille","london","berlin","brussels","new york","sydney","tokyo","madrid"
    ];
    const found = new Set();
    placeWords.forEach(p => { if (t.includes(p)) found.add(p); });
    return Array.from(found);
  }

  function countTemporalMarkers(text) {
    const t = normaliseText(text).toLowerCase();
    if (!t) return 0;
    const markers = (t.match(/\b(yesterday|today|tomorrow|morning|evening|night|week|month|year|before|after|during|later|earlier|immediately)\b/gi) || []).length;
    return markers;
  }

  function safeToFixed(n, digits) {
    const x = Number(n);
    return Number.isFinite(x) ? x.toFixed(digits) : "0";
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function computeCoherenceScore(sentences, markers, weights) {
    // Deterministic heuristic, tuned by weights (still deterministic)
    const base = Math.min(40, sentences * 6) * (weights.coherence_base || 1);
    const detail = Math.min(40, markers * 4) * (weights.evidence_markers || 1);
    const floor = 20;
    return clamp(Math.round(floor + base + detail), 0, 100);
  }

  function computeChronologyConfidence(datesCount, temporalMarkers, contradictions, weights) {
    // dates + temporal markers help, contradictions penalize (if you compute them later)
    const base = 5;
    const dateWeight = Math.min(40, datesCount * 20);
    const temporalWeight = Math.min(40, temporalMarkers * 8);
    const penalty = (contradictions || 0) * 15 * (weights.contradictions_penalty || 1);
    const raw = base + dateWeight + temporalWeight - penalty;
    return clamp(Math.round(raw * (weights.chronology || 1)), 0, 100);
  }

  async function sha256(text) {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function renderSummary(template, vars) {
    // very small templater: {{key}}
    const t = String(template || DEFAULT_SUMMARY_TEMPLATE);
    return t.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, k) => {
      const v = vars?.[k];
      return (v === undefined || v === null) ? "" : String(v);
    });
  }

  // -----------------------------
  // Bundle generation (deterministic)
  // -----------------------------
  async function generateBundle() {
    const labels = window.__RPO_LABELS__ || DEFAULT_LABELS;
    const weights = window.__RPO_WEIGHTS__ || DEFAULT_WEIGHTS;
    const summaryTemplate = window.__RPO_SUMMARY_TEMPLATE__ || DEFAULT_SUMMARY_TEMPLATE;

    const title = normaliseText(titleInput?.value) || "Untitled case";
    const issuer = normaliseText(issuerInput?.value) || "Unknown issuer";
    const subject = normaliseText(subjectInput?.value) || "Unspecified subject";
    const narrative = (narrativeInput?.value || "").trim();

    if (!normaliseText(narrative)) {
      alert("Please paste a narrative before generating the bundle.");
      return;
    }

    // Heuristics
    const sentences = countSentences(narrative);
    const markers = countEvidenceMarkers(narrative);
    const dates = detectDates(narrative);
    const places = detectPlaces(narrative);
    const temporalMarkers = countTemporalMarkers(narrative);

    // Placeholders you can implement later (still deterministic if computed)
    const contradictions = 0;
    const uncertaintySignals = 0;

    const coherenceScore = computeCoherenceScore(sentences, markers, weights);
    const chronologyConfidence = computeChronologyConfidence(dates.length, temporalMarkers, contradictions, weights);
    const densityRatio = sentences ? markers / sentences : 0;

    // Canonical text for deterministic sealing (ordered, stable)
    const canonicalForHash = [
      "rpo_version=0.1",
      `issuer=${issuer}`,
      `subject=${subject}`,
      `title=${title}`,
      `narrative=${normaliseText(narrative)}`
    ].join("|");

    const publicHash = await sha256(canonicalForHash);
    const bundleId = "rpo-" + publicHash.slice(0, 12);
    const createdAt = new Date().toISOString();

    // Build RPO object
    const rpo = {
      rpo_version: "0.1",
      bundle_id: bundleId,
      created_at: createdAt,

      issuer: { label: labels.issuer, value: issuer },
      subject: { label: labels.subject, value: subject },

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
        engine: { kind: "deterministic-heuristics", ai: false },
        note: "Open demonstrator. No psycho-forensic model embedded."
      },

      heuristic_scores: {
        [labels.coherence_score]: coherenceScore,
        [labels.evidence_markers]: markers,
        sentences_count: sentences,
        [labels.dates_detected]: dates.length,
        [labels.places_detected]: places.length,
        [labels.density_ratio]: Number(safeToFixed(densityRatio, 2)),
        [labels.chronology_confidence]: chronologyConfidence,
        uncertainty_signals: uncertaintySignals,
        contradictions_detected: contradictions
      },

      heuristic_anchors: {
        dates,
        places,
        temporal_markers: temporalMarkers
      }
    };

    // -----------------------------
    // Update UI (safe, consistent)
    // -----------------------------
    if (sentencesEl) sentencesEl.textContent = String(sentences);
    if (markersEl) markersEl.textContent = String(markers);
    if (scoreEl) scoreEl.textContent = coherenceScore + "%";
    if (datesEl) datesEl.textContent = String(dates.length);
    if (placesEl) placesEl.textContent = String(places.length);
    if (densityEl) densityEl.textContent = safeToFixed(densityRatio, 2);
    if (chronoEl) chronoEl.textContent = chronologyConfidence + "%";

    if (metricsEl) metricsEl.style.display = "grid";

    if (hashBlockEl) hashBlockEl.style.display = "block";
    if (hashValueEl) hashValueEl.textContent = publicHash;

    if (anchorsBlockEl) anchorsBlockEl.style.display = "block";
    if (anchorsDatesEl) anchorsDatesEl.textContent = "Dates: " + (dates.length ? dates.join(", ") : "—");
    if (anchorsPlacesEl) anchorsPlacesEl.textContent = "Places: " + (places.length ? places.join(", ") : "—");
    if (anchorsTemporalEl) anchorsTemporalEl.textContent = "Temporal markers: " + String(temporalMarkers);

    const summaryText = renderSummary(summaryTemplate, {
      title,
      issuer,
      subject,
      bundle_id: bundleId,
      hash: publicHash,
      coherence: coherenceScore,
      chronology: chronologyConfidence
    });

    if (taglineEl) taglineEl.textContent = summaryText;

    if (jsonEl) jsonEl.textContent = JSON.stringify(rpo, null, 2);
    if (outputActions) outputActions.style.display = "flex";
  }

  function resetUI() {
    if (titleInput) titleInput.value = "";
    if (issuerInput) issuerInput.value = "";
    if (subjectInput) subjectInput.value = "";
    if (narrativeInput) narrativeInput.value = "";

    if (taglineEl) taglineEl.textContent = "Fill the form and click “Generate” to produce a draft RPO bundle.";
    if (metricsEl) metricsEl.style.display = "none";
    if (hashBlockEl) hashBlockEl.style.display = "none";
    if (anchorsBlockEl) anchorsBlockEl.style.display = "none";
    if (jsonEl) jsonEl.textContent = "";
    if (outputActions) outputActions.style.display = "none";
  }

  async function copyJSON() {
    if (!jsonEl || !jsonEl.textContent) return;
    try {
      await navigator.clipboard.writeText(jsonEl.textContent);
      if (copyBtn) {
        const prev = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = prev || "Copy JSON"; }, 1200);
      }
    } catch (e) {
      alert("Copy failed. Your browser may block clipboard access.");
    }
  }

  function downloadJSON() {
    if (!jsonEl || !jsonEl.textContent) return;
    const blob = new Blob([jsonEl.textContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rpo.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // -----------------------------
  // Wire events
  // -----------------------------
  generateBtn?.addEventListener("click", () => { void generateBundle(); });
  resetBtn?.addEventListener("click", resetUI);

  loadExampleBtn?.addEventListener("click", async () => {
    if (titleInput) titleInput.value = "Incident in Paris office — March 2024";
    if (issuerInput) issuerInput.value = "Internal audit team, Company X";
    if (subjectInput) subjectInput.value = "Employee — Sales department";
    if (narrativeInput) {
      narrativeInput.value =
        "On 14 March 2024, around 10:30 am, an argument broke out in the Paris office between a line manager and a sales employee. " +
        "Several colleagues report that the manager raised his voice, threatened to remove key accounts from the employee and asked him to leave the open space immediately. " +
        "Later that day, around 3 pm, the same manager sent an email copying HR, questioning the employee's loyalty and suggesting exclusion from client meetings.";
    }
    await generateBundle();
  });

  copyBtn?.addEventListener("click", () => { void copyJSON(); });
  downloadBtn?.addEventListener("click", downloadJSON);

  // Init state
  resetUI();

  try {
    console.log("[sandbox.js] Engine ready.");
  } catch (_) {}
})();
