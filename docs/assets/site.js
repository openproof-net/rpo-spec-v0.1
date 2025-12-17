/* =========================================================
   OpenProof — Global Site Script
   Shared helpers for index / overview / sandbox / demos
   No framework, no dependency, no magic
   ========================================================= */

(function () {
  "use strict";

   const CONFIDENCE_LEVELS = {
  "very-low": { label: "Very low" },
  "low": { label: "Low" },
  "medium": { label: "Medium" },
  "high": { label: "High" },
  "very-high": { label: "Very high" }
};


  /* ---------- Utils ---------- */

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  /* ---------- Page detection ---------- */

  const pageType = document.documentElement.getAttribute("data-page");

  /* ---------- Soft auto-redirect (index only) ---------- */
  if (pageType === "spec") {
    const AUTO_REDIRECT_DELAY = 12000; // ms

    setTimeout(function () {
      if (!document.hidden) {
        // Uncomment if you want auto-redirect enabled
        // window.location.href = "./sandbox.html";
      }
    }, AUTO_REDIRECT_DELAY);
  }

  /* ---------- Copy-to-clipboard helper ---------- */
  $all("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetId = btn.getAttribute("data-copy-target");
      const target = document.getElementById(targetId);
      if (!target) return;

      const text =
        target.value ||
        target.textContent ||
        "";

      if (!navigator.clipboard) {
        alert("Clipboard not available in this browser.");
        return;
      }

      navigator.clipboard.writeText(text).then(function () {
        const original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.textContent = original;
        }, 1200);
      });
    });
  });

  /* ---------- Debug (dev only) ---------- */
  // console.log("[OpenProof] site.js loaded — page:", pageType);
})();
