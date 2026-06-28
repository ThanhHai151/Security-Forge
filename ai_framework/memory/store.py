"""Persistent, cross-session memory (Hermes-style).

Records are appended to a JSON-lines file so memory outlives a single run. ``recall``
ranks by (target match, technique match, recency) and returns the top-K to re-enter the
loop's context. ``has_failed_attempt`` backs the anti-loop guard. See §2.4 and Step 5.
"""

from __future__ import annotations

from pathlib import Path

from ai_framework.agent.contracts import MemoryKind, MemoryRecord


class JsonlMemoryStore:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)

    def write(self, record: MemoryRecord) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("a", encoding="utf-8") as fh:
            fh.write(record.model_dump_json() + "\n")

    def all(self) -> list[MemoryRecord]:
        if not self.path.exists():
            return []
        with self.path.open(encoding="utf-8") as fh:
            return [MemoryRecord.model_validate_json(line) for line in fh if line.strip()]

    def recall(self, target: str, technique: str, k: int = 5) -> list[MemoryRecord]:
        records = self.all()

        def score(r: MemoryRecord) -> tuple[int, int, str]:
            return (
                1 if r.target == target else 0,
                1 if technique and r.technique == technique else 0,
                r.created_at.isoformat(),  # recency: later isoformat sorts higher
            )

        return sorted(records, key=score, reverse=True)[:k]

    def has_failed_attempt(self, target: str, technique: str, body: str) -> bool:
        return any(
            r.kind == MemoryKind.attempt
            and r.target == target
            and r.technique == technique
            and r.body == body
            for r in self.all()
        )
