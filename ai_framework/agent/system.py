"""Builds the system message for a run: role, safety, skills, and tool schemas."""

from __future__ import annotations

import json
from typing import Any

from ai_framework.agent.contracts import RunConfig


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
