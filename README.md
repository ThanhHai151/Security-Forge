# SecForge

> A local security-research platform built on top of this CTF / PortSwigger Web
> Security Academy knowledge base.
>
> **This repository is a project skeleton (scaffold).** It contains documentation only:
> every directory has a `README.md` describing its purpose. There is no code yet — the
> goal at this stage is a clear, agreed-upon frame to build into.
>
> All documentation is written in **English**. The *product itself* is designed to switch
> smoothly between **English and Vietnamese** (see [Multi-language](#multi-language) and
> [`i18n/`](i18n/README.md)).
>
> `secforge` is a placeholder name — rename it freely.

This file and [`ARCHITECTURE.md`](ARCHITECTURE.md) are the **two project-wide overview
documents**. Every other `README.md` is scoped to the single directory it lives in.

---

## Capabilities

What SecForge is meant to do, end to end:

1. **Rich data display.** Present the repository's ~278 markdown notes far more readably
   than raw `.md` — a web application with the feel of Notion: collapsible category
   navigation, a table of contents per page, syntax-highlighted payloads, and search.
   → [`frontend/`](frontend/README.md), [`knowledge_base/`](knowledge_base/README.md)

2. **AI framework for the pentest process.** An agentic framework that drives a
   penetration test the way a human would: pick a technique, run a tool, read the result,
   decide the next move. → [`ai_framework/`](ai_framework/README.md)

3. **Defend any web project.** Point SecForge at a web codebase and have it review for
   the vulnerability classes catalogued here, then recommend (or generate) concrete
   hardening — the defensive counterpart to the pentest framework.
   → [`defense/`](defense/README.md)

4. **Find vulnerabilities two ways.**
   - From the **stored documentation** in this project (the indexed knowledge base), and
   - by **automatically searching for CVEs** when a new or unfamiliar error/technology is
     encountered. → [`vuln_search/`](vuln_search/README.md)

5. **Log-driven next-step planning.** After each pentest step, feed the step's logs back
   in; the agent reads them and **automatically produces the next execution plan**. This
   closes the observe → reason → act → observe loop.
   → [`ai_framework/agent/`](ai_framework/agent/README.md)

6. **Persistent memory (Hermes-style).** The agent remembers findings, target facts, and
   lessons across steps and across sessions, so context is not lost between runs.
   → [`ai_framework/memory/`](ai_framework/memory/README.md)

7. **Self-research.** When the knowledge base does not cover something, the agent can go
   research it (web + CVE sources) and fold the result back into its working knowledge.
   → [`ai_framework/research/`](ai_framework/research/README.md)

8. **Note-taking.** Structured capture of findings, payloads that worked, and to-dos —
   reviewable in the UI and reusable by the agent.
   → [`ai_framework/notes/`](ai_framework/notes/README.md)

9. **Multi-language (EN ⇄ VI).** A first-class concern, not an afterthought: UI strings
   and displayed content can switch between English and Vietnamese.
   → [`i18n/`](i18n/README.md)

---

## How the capabilities map to directories

| Capability                                   | Pillar              | Directory                                  |
|----------------------------------------------|---------------------|--------------------------------------------|
| Rich data display (web / Notion-like)        | Knowledge Base      | [`frontend/`](frontend/README.md), [`knowledge_base/`](knowledge_base/README.md) |
| AI pentest framework + log-driven planning   | AI Framework        | [`ai_framework/`](ai_framework/README.md)  |
| Memory · self-research · note-taking         | AI Framework        | [`ai_framework/memory`](ai_framework/memory/README.md), [`research`](ai_framework/research/README.md), [`notes`](ai_framework/notes/README.md) |
| Web-project defense / hardening              | Defense             | [`defense/`](defense/README.md)            |
| Doc-based + auto-CVE vulnerability finding   | Vuln Search         | [`vuln_search/`](vuln_search/README.md)    |
| Sandboxed practice targets (PortSwigger-style)| Labs / Range       | [`labs/`](labs/README.md)                  |
| EN ⇄ VI switching                            | Cross-cutting       | [`i18n/`](i18n/README.md)                  |
| HTTP API tying it together                   | Backend             | [`backend/`](backend/README.md)            |

The existing topic folders (`SQL/`, `XSS/`, `ssrf/`, `Troubleshooting_Guide/`, …) are the
**content source**. SecForge reads them; it never modifies them.

---

## Inspirations

The brief named three projects; each shapes one part of the AI framework:

| Reference project                  | What SecForge borrows                                | Directory                               |
|------------------------------------|------------------------------------------------------|-----------------------------------------|
| **Anthropic-Cybersecurity-Skills** | "Skills" — structured, on-demand security knowledge. | [`ai_framework/skills/`](ai_framework/skills/README.md) |
| **NousResearch / hermes-agent**    | The reasoning loop + persistent memory.              | [`ai_framework/agent/`](ai_framework/agent/README.md), [`memory/`](ai_framework/memory/README.md) |
| **Z4nzu / hackingtool**            | A categorised catalog of runnable tools.             | [`ai_framework/tools/`](ai_framework/tools/README.md) |

Practice targets follow the **PortSwigger Web Security Academy** model — see
[`labs/`](labs/README.md).

---

## Directory map

```
secforge/
├── README.md            ← overview #1 — capabilities (this file)
├── ARCHITECTURE.md      ← overview #2 — structure & data flow
├── frontend/            Pillar 1 — the viewer UI (web / Notion-like) + language toggle
├── backend/             HTTP API & orchestration that serves the UI and drives modules
├── knowledge_base/      Pillar 1 data — index & render the .md notes, error search
├── ai_framework/        Pillar 2 — the AI pentest framework (umbrella)
│   ├── agent/           reasoning loop + log-driven next-step planner
│   ├── skills/          on-demand security knowledge (skill manifests)
│   ├── tools/           runnable tool catalog (recon, http, injection, …)
│   ├── memory/          persistent, cross-session memory
│   ├── research/        self-research (web + CVE)
│   ├── notes/           structured note-taking
│   └── models/          pluggable LLM backends (Claude, offline)
├── vuln_search/         Pillar 3 — find vulns from docs + auto-CVE on new errors
├── defense/             Pillar 4 — protect / harden any web project (defensive)
├── labs/                Pillar 5 — sandboxed practice targets (PortSwigger-style)
├── i18n/                cross-cutting — EN/VI localization
└── docs/                deeper design notes & specifications
```

---

## Multi-language

- **Documentation is English-only.** Every `.md` in this skeleton stays in English so
  there is one canonical source of truth.
- **The product switches EN ⇄ VI.** Two distinct things are localized:
  - **UI strings** (menus, buttons, labels) — from locale files, switched instantly.
  - **Displayed content** (the knowledge notes, agent output) — English is the source;
    Vietnamese is produced either from stored translations or on demand via the AI model.
- The design keeps a clean separation between *content* and *presentation language* so a
  toggle can re-render without reloading. Details in [`i18n/`](i18n/README.md).

---

## Status & next steps

This is a **documentation skeleton**. Nothing executes yet — by design. To move forward,
each directory's README lists its planned contents and the contracts it must honor. A
sensible build order: `knowledge_base` + `frontend` (visible value first) → `backend`
(wire them) → `ai_framework` → `vuln_search` → `defense` → `labs`, with `i18n` applied
throughout.
