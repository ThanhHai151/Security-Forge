"""RunService — the orchestration layer the HTTP API sits on.

Holds the tool registry and a model-backend factory, starts runs, and keeps their results
addressable by id. Kept separate from the HTTP layer so it is unit-testable without a
socket. ``defense/`` can reuse this unchanged — only the goal/objective differs.
"""

from __future__ import annotations

from uuid import uuid4

from ai_framework.agent.contracts import Budget, Run, RunConfig
from ai_framework.agent.loop import run_loop
from ai_framework.memory.store import JsonlMemoryStore
from ai_framework.models.base import Backend
from ai_framework.tools.base import ToolRegistry
from ai_framework.tools.builtin import HttpGetTool, NoteFindingTool


def default_registry() -> ToolRegistry:
    reg = ToolRegistry()
    reg.register(HttpGetTool())
    reg.register(NoteFindingTool())
    return reg


def make_backend(name: str) -> Backend:
    if name == "offline":
        from ai_framework.models.offline import OfflineBackend

        return OfflineBackend()
    if name == "anthropic":
        from ai_framework.models.anthropic_backend import AnthropicBackend

        return AnthropicBackend()
    raise ValueError(f"unknown backend: {name}")


class RunService:
    def __init__(
        self,
        registry: ToolRegistry | None = None,
        memory_path: str | None = "memory_store.jsonl",
        budget: Budget | None = None,
    ) -> None:
        self._registry = registry or default_registry()
        self._memory_path = memory_path
        self._budget = budget
        self._runs: dict[str, Run] = {}

    def start_run(self, config: RunConfig) -> str:
        memory = JsonlMemoryStore(self._memory_path) if self._memory_path else None
        run = run_loop(
            config, make_backend(config.backend), self._registry, memory, self._budget
        )
        run_id = uuid4().hex
        self._runs[run_id] = run
        return run_id

    def get_run(self, run_id: str) -> Run | None:
        return self._runs.get(run_id)
