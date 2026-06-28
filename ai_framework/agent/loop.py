"""The Hermes loop: observe -> reason -> act -> observe, with log-driven planning.

For a goal+target, repeatedly ask the backend for an action, execute its tool calls,
record the logs, then ask the backend to plan the next step from those logs — until the
backend signals done or the step budget is reached. Optionally persists to memory and
suppresses known dead-end attempts (anti-loop). See Step 4 + Step 5.
"""

from __future__ import annotations

import json

from ai_framework.agent.contracts import (
    Budget,
    MemoryKind,
    MemoryRecord,
    Run,
    RunConfig,
    ToolCall,
    ToolResult,
    Turn,
)
from ai_framework.agent.system import build_system_prompt
from ai_framework.headroom import TurnRequest, fit
from ai_framework.memory.store import JsonlMemoryStore
from ai_framework.models.base import Backend
from ai_framework.tools.base import ToolContext, ToolRegistry


def _body(call: ToolCall) -> str:
    return json.dumps(call.arguments, sort_keys=True)


def run_loop(
    config: RunConfig,
    backend: Backend,
    registry: ToolRegistry,
    memory: JsonlMemoryStore | None = None,
    budget: Budget | None = None,
) -> Run:
    tools = registry.schemas()
    system = build_system_prompt(config, tools)
    ctx = ToolContext(authorized_targets=config.authorized_targets)
    run = Run(config=config)

    for i in range(config.step_budget):
        # Headroom: shape what reaches the backend so the call stays inside the window
        # with reserved output headroom. Off (budget=None) -> unchanged behaviour.
        if budget is not None:
            recalled = (
                memory.recall(config.target, "", budget.memory_recall_k) if memory else []
            )
            fitted = fit(
                TurnRequest(
                    system=system, transcript=run.transcript, tools=tools, memory=recalled
                ),
                budget,
            )
            run.compaction_reports.append(fitted.report)
            action = backend.act(fitted.system, fitted.transcript, config, fitted.tools)
        else:
            action = backend.act(system, run.transcript, config, tools)
        if action.done:
            run.outcome = "done"
            break

        results: list[ToolResult] = []
        for call in action.tool_calls:
            body = _body(call)
            # Anti-loop: skip a call that already failed with identical args.
            if memory and memory.has_failed_attempt(config.target, call.name, body):
                results.append(
                    ToolResult(
                        call_id=call.id,
                        log=f"skipped: known dead end ({call.name} {body})",
                        ok=False,
                    )
                )
                continue

            result = registry.execute(call, ctx)
            results.append(result)

            if memory:
                kind = MemoryKind.target_fact if result.ok else MemoryKind.attempt
                memory.write(
                    MemoryRecord(
                        id=f"{call.id}",
                        kind=kind,
                        target=config.target,
                        technique=call.name,
                        body=body if not result.ok else result.log[:500],
                    )
                )

        turn = Turn(
            index=i,
            reasoning=action.reasoning,
            tool_calls=action.tool_calls,
            tool_results=results,
        )
        run.transcript.append(turn)
        turn.next_plan = backend.plan(system, run.transcript, config)
    else:
        run.outcome = "step_budget_reached"

    return run
