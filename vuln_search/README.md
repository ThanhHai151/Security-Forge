# `vuln_search/` — Vulnerability Search

**Pillar 3.** Answers "what could be wrong here?" from two complementary sources, and
feeds candidates to the [`ai_framework`](../ai_framework/README.md).

## Two sources

1. **Stored documentation (offline-first).** Search the indexed
   [`knowledge_base`](../knowledge_base/README.md) and a derived **technique catalog** (the
   32 vulnerability classes already documented here). This is the primary, always-available
   path.
2. **Automatic CVE lookup (on demand).** When the agent meets a **new or unfamiliar**
   technology/error that the docs don't cover, query external CVE feeds (e.g. OSV / NVD) to
   pull in matching, recent vulnerabilities.

## Responsibilities

- **Technique catalog** — a searchable list of the documented vuln classes, each linking
  back to its KB note and skill.
- **CVE lookup** — query by product/version/keyword; normalize results; cache them. Online
  access is **opt-in** via config and degrades gracefully when offline.
- **Rank & hand off** — return ordered candidates to
  [`../ai_framework/agent/`](../ai_framework/agent/README.md) and
  [`../ai_framework/research/`](../ai_framework/research/README.md).

## Connects to

- [`../knowledge_base/`](../knowledge_base/README.md) — first search source.
- [`../ai_framework/research/`](../ai_framework/research/README.md) — triggers CVE lookups
  on knowledge gaps.
- [`../defense/`](../defense/README.md) — the same search identifies risks to harden.
- [`../frontend/`](../frontend/README.md) — the "Vuln Search" tab.

## Planned contents

- The technique catalog (seeded from the KB categories).
- A CVE lookup module with a cache and an offline seed set.

**Status:** skeleton — directory purpose only.
