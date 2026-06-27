# `knowledge_base/` — Index, Render & Search the Notes

**Pillar 1 (data).** Turns the repository's ~278 `.md` files into something the
[`frontend/`](../frontend/README.md) can display beautifully and everything else can query.
This is the shared reference surface other pillars link into.

## Responsibilities

- **Index** — scan the knowledge-base root (the CTF repo's topic folders), recording one
  entry per note: id, path, title, category, headings, whether it is a
  troubleshooting/error doc, size, modified time. Skips non-content dirs (`.venv`,
  `.claude`, `.git`, `secforge`) and empty placeholders.
- **Render** — convert markdown to **safe** HTML. *Security-critical:* the notes contain
  live XSS/SQLi payloads, so every code block and inline span must be HTML-escaped or the
  viewer itself becomes vulnerable. Supports headings (with anchors for a TOC), fenced code
  with language hints, tables, lists, blockquotes, rules, and inline formatting.
- **Search** — two modes:
  - **full-text** across all notes, ranked;
  - **errors/troubleshooting** — the dedicated "search for errors" feature, focused on the
    `Troubleshooting_Guide/` notes and matching on symptoms/error strings.

## Connects to

- [`../frontend/`](../frontend/README.md) renders what this produces.
- [`../vuln_search/`](../vuln_search/README.md) searches this index as its first source.
- [`../ai_framework/skills/`](../ai_framework/skills/README.md) — each KB topic backs a skill.
- [`../i18n/`](../i18n/README.md) — content is tagged with a language so the viewer can
  request EN or VI.

## Content source

Read-only over the existing topic folders (`SQL/`, `XSS/`, `ssrf/`,
`Troubleshooting_Guide/`, …). This pillar never modifies the source notes.

**Status:** skeleton — directory purpose only.
