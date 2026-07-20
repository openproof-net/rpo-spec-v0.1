from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class TruthXBoundary:
    """Explicit integration boundary; disabled unless an operator enables it."""

    enabled: bool = False
    endpoint: str = ""

    def enrich(self, ledger: dict[str, Any]) -> dict[str, Any]:
        if not self.enabled:
            return {
                "status": "disabled",
                "note": "TruthX execution is not enabled in the public backend boundary.",
            }
        if not self.endpoint:
            return {
                "status": "blocked",
                "note": "TruthX was enabled without a configured private endpoint.",
            }
        # The production adapter belongs behind an authenticated service boundary.
        # It is intentionally not implemented as an implicit outbound LLM call here.
        return {
            "status": "configured",
            "note": "A private TruthX adapter must add an auditable, redacted result here. The endpoint is never returned to clients.",
        }
