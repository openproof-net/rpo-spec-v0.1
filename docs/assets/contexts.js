/* docs/assets/contexts.js
   Centralized context mapping for UI framing (NOT a rebrand).
   Deterministic engine stays unchanged. */
window.CONTEXTS = {
  governance: {
    key: "governance",
    ui: {
      name: "Governance",
      description:
        "Decision defensibility for complex organizations: audit exposure, traceability, source-of-truth stability, and explicit business rules across systems.",
      labels: {
        exposure: "Audit exposure",
        authority: "Decision owner",
        rigor: "Timestamp rigor",
        custody: "Chain-of-custody",
        contradictions: "Contradictions",
        uncertainty: "Uncertainty logging"
      },
      help: {
        exposure: "Governance risk surface (audit, compliance, control gaps).",
        authority: "Who holds accountability for the decision.",
        rigor: "How strictly time is captured, normalized, and validated.",
        custody: "How evidence integrity is preserved end-to-end.",
        contradictions: "Detected conflicts across statements / artifacts.",
        uncertainty: "Explicit logging of unknowns and missing fields."
      }
    },
    weights: { rigor: 0.9, custody: 0.7, contradictions: 0.8, uncertainty: 0.8 },
    toggles: { showCustody: true, showContradictions: true, showUncertainty: true },
    presets: {
      chips: ["audit exposure", "data lineage", "rules", "quality checks"],
      sectionTitles: {
        input: "Inputs",
        cockpit: "Decision cockpit",
        preview: "Preview",
        report: "Report"
      }
    },
    summary: {
      template:
        "This RPO bundle captures a governance decision and its defensibility perimeter. It documents declared sources, rules, lineage and uncertainty to support audit, accountability, and repeatability."
    }
  },

  legal: {
    key: "legal",
    ui: {
      name: "Legal Proceedings",
      description:
        "Litigation-ready framing: chain-of-custody rigor, timestamp discipline, contradictions, and evidence packaging for adversarial reading.",
      labels: {
        exposure: "Litigation exposure",
        authority: "Authority / Decision maker",
        rigor: "Timestamp rigor",
        custody: "Chain-of-custody",
        contradictions: "Contradictions",
        uncertainty: "Uncertainty logging"
      },
      help: {
        exposure: "Likelihood of legal dispute and evidentiary scrutiny.",
        authority: "Who has legal authority and decision capacity.",
        rigor: "Court-friendly timestamp discipline and normalization.",
        custody: "Evidence integrity and custody trace.",
        contradictions: "Conflicts that will be attacked by opposing counsel.",
        uncertainty: "Unknowns that must be explicitly disclosed."
      }
    },
    weights: { rigor: 1.0, custody: 1.0, contradictions: 1.0, uncertainty: 0.85 },
    toggles: { showCustody: true, showContradictions: true, showUncertainty: true },
    presets: {
      chips: ["litigation exposure", "chain-of-custody", "timeline", "contradictions"],
      sectionTitles: {
        input: "Inputs",
        cockpit: "Proceedings cockpit",
        preview: "Preview",
        report: "Report"
      }
    },
    summary: {
      template:
        "This RPO bundle is structured for adversarial reading. It emphasizes chain-of-custody, timestamp discipline, contradictions, and explicit uncertainty — to withstand legal scrutiny."
    }
  },

  institutional: {
    key: "institutional",
    ui: {
      name: "Institutional Crisis",
      description:
        "High-pressure environments: escalation timeline integrity, what-was-known-when reconstruction, and uncertainty as first-class evidence.",
      labels: {
        exposure: "Institutional exposure",
        authority: "Authority / Escalation owner",
        rigor: "Timestamp rigor",
        custody: "Chain-of-custody",
        contradictions: "Contradictions",
        uncertainty: "Uncertainty logging"
      },
      help: {
        exposure: "Institution-level risk: reputational, political, operational.",
        authority: "Who owns escalation and accountability under stress.",
        rigor: "Timeline integrity for ‘what was known when’.",
        custody: "Integrity of sensitive artifacts over time.",
        contradictions: "Signals of narrative distortion under pressure.",
        uncertainty: "Explicit uncertainty logging to avoid retrospective rewriting."
      }
    },
    weights: { rigor: 1.0, custody: 0.85, contradictions: 0.95, uncertainty: 1.0 },
    toggles: { showCustody: true, showContradictions: true, showUncertainty: true },
    presets: {
      chips: ["escalation trail", "what-was-known-when", "uncertainty", "risk flags"],
      sectionTitles: {
        input: "Inputs",
        cockpit: "Crisis cockpit",
        preview: "Preview",
        report: "Report"
      }
    },
    summary: {
      template:
        "This RPO bundle reconstructs escalation and timeline integrity under institutional stress. It prioritizes uncertainty logging, contradictions, and ‘what-was-known-when’ defensibility."
    }
  }
};
