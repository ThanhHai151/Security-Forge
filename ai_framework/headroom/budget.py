"""Token accounting for Headroom.

Offline backend uses a fast char/word heuristic (§3.1, Open question §6); a Claude backend
can swap in exact counting later. ``count_tokens`` is the single entry point everything
else calls so the estimator can be replaced in one place.
"""

from __future__ import annotations

import json
from typing import Any

from ai_framework.agent.contracts import MemoryRecord, Turn

# Rough bytes-per-token for English+JSON. Deliberately conservative so we compact a little
# early rather than overflow. Revisit against Claude's exact counts (Open question §6).
_CHARS_PER_TOKEN = 4


def estimate_tokens(text: str) -> int:
    """Heuristic token count for a string. Never returns < 1 for non-empty text."""
    if not text:
        return 0
    return max(1, (len(text) + _CHARS_PER_TOKEN - 1) // _CHARS_PER_TOKEN)


# Public alias; a backend may rebind this to an exact tokenizer.
count_tokens = estimate_tokens


def turn_tokens(turn: Turn) -> int:
    """Tokens a single turn contributes: reasoning + tool calls + logs + next plan."""
    total = count_tokens(turn.reasoning) + count_tokens(turn.next_plan)
    for call in turn.tool_calls:
        total += count_tokens(call.name) + count_tokens(json.dumps(call.arguments))
    for result in turn.tool_results:
        total += count_tokens(result.log)
    return total


def tools_tokens(tools: list[dict[str, Any]]) -> int:
    return count_tokens(json.dumps(tools))


def memory_tokens(memory: list[MemoryRecord]) -> int:
    return sum(count_tokens(r.body) + count_tokens(r.technique) for r in memory)
