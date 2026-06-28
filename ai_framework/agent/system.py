"""Builds the system message for a run: role, safety, skills, and tool schemas."""

from __future__ import annotations

import json
from typing import Any

from ai_framework.agent.contracts import MemoryRecord, RunConfig


def render_memory_block(records: list[MemoryRecord]) -> str:
    """Render recalled memory for injection into the system prompt (Step 5).

    Returns "" when there is nothing to recall, so callers can append unconditionally.
    """
    if not records:
        return ""
    lines = [f"- [{r.kind}] {r.technique or 'general'}: {r.body}" for r in records]
    return (
        "Relevant memory recalled from prior steps/sessions "
        "(use it; do not repeat known dead ends):\n" + "\n".join(lines)
    )


def with_memory(system: str, records: list[MemoryRecord]) -> str:
    """Append the recalled-memory block to a system prompt if there is any."""
    block = render_memory_block(records)
    return f"{system}\n\n{block}" if block else system


def build_system_prompt(config: RunConfig, tools: list[dict[str, Any]]) -> str:
    authorized = ", ".join(sorted(config.authorized_targets)) or "(localhost only)"
    tool_lines = "\n".join(f"- {t['name']}: {t['description']}" for t in tools)
    return (
        "You are SecForge, an agent for AUTHORIZED security testing only.\n"
        f"Goal: {config.goal}\n"
        f"Target: {config.target}\n"
        f"Authorized targets: {authorized}\n"
        "Safety: never act on a target that is not authorized.\n\n"
        "Available tools:\n"
        f"{tool_lines}\n\n"
        f"Tool schemas:\n{json.dumps(tools, indent=2)}"
    )
