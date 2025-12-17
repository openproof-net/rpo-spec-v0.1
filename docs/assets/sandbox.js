<script>
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

  /* -------------------------
     Utilities
  ------------------------- */

  function normaliseText(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function countSentences(text) {
    const cleaned = normaliseText(text);
    if (!cleaned) return 0;
    return cleaned.split(/[.!?]+/g).map(s => s.trim()).filter(Boolean).length;
  }

  function countEvidenceMarkers(text) {
    const digits = (text.match(/\b\d{2,}\b/g) || []).length;
    const markers = text.match(/\b(on|at|since|because|when|where|witness|email|report|contract|invoice)\b/gi) || [];
    return digits + markers.length;
  }

  function detectDates(text) {
    const months = "january february march april may june july august september october november december".split(" ");
    const lower = text.toLowerCase();
    const found = new Set();

    months.forEach(m => {
      if (lower.includes(m)) found.add(m.charAt(0).toUpperCase() + m.slice(1));
    });

    (text.match(/\b(19|20)\d{2}\b/g) || []).forEach(y => found.add(y));
    return Array.from(found);
  }

  function detectPlaces(text) {
    const placeWords = "office headquarters store shop factory plant school university court hospital paris lyon marseille london berlin brussels new york sydney".split(" ");
    const lower = text.toLowerCase();
    const found = new Set();
    placeWords.forEach(p => { if (lower.includes(p)) found.add(p); });
    return Array.from(found);
  }

  function countTemporalMarkers(text) {
    const markers = text.match(/\b(yesterday|today|tomorrow|morning|evening|night|week|month|year|before|after|during)\b/gi) || [];
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

  return Math.max(
    0,
    Math.min(100, base + dateWeight + temporalWeight - penalty)
  );
}


  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function safeToFixed(n, digits) {
    return Number.isFinite(n) ? Number(n.toFixed(digits)) : 0;
  }

  /* -------------------------
     RPO Bundle generation
  ------------------------- */

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

    /* Canonical content for deterministic sealing */
    const canonicalForHash = [
      "rpo_version=0.1",
      "issuer=" + issuer,
      "subject=" + subject,
      "title=" + title,
      "narrative=" + normaliseText(narrative)
    ].join("|");

    const publicHash = await sha256(canonicalForHash);
    const bundleId = "rpo-" + publicHash.slice(0, 12);
    const createdAt = new Date().toISOString();

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
        heuristic_scores: {
          coherence_score: coherenceScore,
          evidence_markers: markers,
          sentence_count: sentences,
          dates_detected: dates.length,
          places_detected: places.length,
          density_ratio: safeToFixed(densityRatio, 2),
          chronology_confidence: chronologyConfidence
        },
        heuristic_anchors: {
          dates,
          places,
          temporal_markers: temporalMarkers
        }
      }
    };

    /* UI updates */
    sentencesEl.textContent = sentences;
    markersEl.textContent = markers;
    scoreEl.textContent = coherenceScore + "%";
    datesEl.textContent = dates.length;
    placesEl.textContent = places.length;
    densityEl.textContent = safeToFixed(densityRatio, 2);
    chronoEl.textContent = chronologyConfidence + "%";
    metricsEl.style.display = "grid";

    hashBlockEl.style.display = "block";
    hashValueEl.textContent = publicHash;

    anchorsBlockEl.style.display = "block";
    anchorsDatesEl.textContent = "Dates: " + (dates.length ? dates.join(", ") : "–");
    anchorsPlacesEl.textContent = "Places: " + (places.length ? places.join(", ") : "–");
    anchorsTemporalEl.textContent = "Temporal markers: " + temporalMarkers;

    taglineEl.textContent =
      "This draft bundle illustrates how a narrative can be structured, sealed and later re-evaluated without rewriting history.";

    jsonEl.textContent = JSON.stringify(rpo, null, 2);
    outputActions.style.display = "flex";
  }

  generateBtn.addEventListener("click", generateBundle);

  resetBtn.addEventListener("click", () => {
    titleInput.value = "";
    issuerInput.value = "";
    subjectInput.value = "";
    narrativeInput.value = "";

    taglineEl.textContent = "Fill the form and click “Generate” to produce a draft RPO bundle.";
    metricsEl.style.display = "none";
    hashBlockEl.style.display = "none";
    anchorsBlockEl.style.display = "none";
    jsonEl.textContent = "";
    outputActions.style.display = "none";
  });

  loadExampleBtn.addEventListener("click", async () => {
    titleInput.value = "Incident in Paris office – March 2024";
    issuerInput.value = "Internal audit team, Company X";
    subjectInput.value = "Employee – Sales department";

    narrativeInput.value =
      "On 14 March 2024, around 10:30 am, an argument broke out in the Paris office between a line manager and a sales employee. " +
      "Several colleagues report that the manager raised his voice, threatened to remove key accounts from the employee and asked him to leave the open space immediately. " +
      "Later that day, around 3 pm, the same manager sent an email copying HR, questioning the employee's loyalty and suggesting exclusion from client meetings.";

    await generateBundle();
  });

  copyBtn.addEventListener("click", async () => {
    if (!jsonEl.textContent) return;
    await navigator.clipboard.writeText(jsonEl.textContent);
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy JSON", 1200);
  });

  downloadBtn.addEventListener("click", () => {
    if (!jsonEl.textContent) return;
    const blob = new Blob([jsonEl.textContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rpo.json";
    a.click();
    URL.revokeObjectURL(url);
  });
</script>

