# `headroom/` — context-window budgeting & compaction

Headroom sits **between the agent loop and the model backend**. It does not reason; it
*measures and shapes* what reaches the backend so every model call stays inside the context
window with deliberate slack ("headroom") reserved for the model's own output. See
[`docs/INTEGRATION_PLAN.md` §3](../../docs/INTEGRATION_PLAN.md).

```
agent loop ──builds TurnRequest──▶ [ headroom.fit ] ──FittedRequest──▶ models backend
     ▲                                  │ (accounts tokens, compacts,
     └────── parsed actions ◀───────────┘  folds a synopsis into system)
```

## The contract

```python
fit(request: TurnRequest, budget: Budget) -> FittedRequest
```

`fit()` never changes the *meaning* of the turn protocol — it only chooses what to include
and how densely. Swapping models (different window sizes) changes only the `Budget`, not the
loop. The returned `FittedRequest.report` (a `CompactionReport`) records every action so
nothing is lost silently.

## Token accounting (`budget.py`)

`count_tokens` is the single estimator everything calls. The offline path uses a ~4-chars/token
heuristic; a Claude backend can rebind it to exact counting in one place.

## The compaction ladder (`fit.py`)

When the assembled input would eat into the reserved output headroom, `fit()` compacts in
priority order, re-checking the budget after each step and stopping as soon as it fits:

1. **drop_reasoning** — clear reasoning/scratchpad on older turns (cheapest to lose).
2. **summarize_turns** — fold older turns into a rolling synopsis (kept, not dropped) that is
   appended to the system prompt.
3. **shrink_memory** — drop the weakest recalled memory records (recall is best-first).
4. **truncate_log** — last resort: cut large tool logs to a head+tail window with a
   `[...truncated N chars...]` marker.

The most recent `budget.keep_recent_turns` turns are always kept intact.

## Configuration (`Budget`)

`context_window`, `reserved_output_headroom` (or `Budget.from_window(window, reserved_fraction)`),
`memory_recall_k`, `keep_recent_turns`, `max_tool_log_tokens`. `input_budget =
context_window - reserved_output_headroom` is the target `fit()` must hit.

## Using it

Headroom is opt-in and additive — `run_loop(..., budget=None)` behaves exactly as before:

```python
from ai_framework.agent.contracts import Budget
run = run_loop(config, backend, registry, memory, budget=Budget.from_window(200_000))
for report in run.compaction_reports:   # one per model call
    ...
```

The CLI demo exposes it via `--headroom <window>`; `backend/RunService` accepts a `budget=`.
