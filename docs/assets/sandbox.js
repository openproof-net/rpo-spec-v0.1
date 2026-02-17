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

window.Sandbox = window.Sandbox || {};

window.Sandbox.setContext = function(ctx) {
  window.__RPO_CONTEXT__ = ctx;

  // 1) Update summary template
  if (ctx.summary && ctx.summary.template) {
    window.__RPO_SUMMARY_TEMPLATE__ = ctx.summary.template;
  }

  // 2) Update weights
  if (ctx.weights) {
    window.__RPO_WEIGHTS__ = ctx.weights;
  }

  // 3) Update label mapping
  if (ctx.ui && ctx.ui.labels) {
    window.__RPO_LABELS__ = ctx.ui.labels;
  }
};

