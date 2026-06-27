# `frontend/` — The Viewer & Console UI

**Pillar 1 (presentation).** The single-page console the user actually looks at. Its first
job is to display the knowledge base far more readably than raw `.md` — the feel of a web
app or Notion — and it also hosts the tabs for every other pillar.

## Responsibilities

- **Knowledge Base view** — category sidebar, per-page table of contents, syntax-
  highlighted code/payloads, breadcrumb navigation. Reads rendered HTML from the backend.
- **Search bar** — full-text search, plus the dedicated **error/troubleshooting search**
  the brief asks for.
- **Tabs for the other pillars** — Vuln Search, Agent Console, Defense, Labs.
- **Language toggle (EN ⇄ VI)** — switches UI strings instantly and requests content in
  the selected language. See [`../i18n/`](../i18n/README.md).

## Planned contents

- `index.html` — the app shell.
- `css/` — styling (a calm, readable, Notion-like theme; dark variant for the console).
- `js/` — one small module per tab (`kb`, `search`, `agent`, `defense`, `labs`) plus a
  tiny router and a fetch helper. No bundler/build step is intended.
- `locales/` — or it consumes locale files from [`../i18n/`](../i18n/README.md).

## Connects to

- [`../backend/`](../backend/README.md) — every view fetches JSON/HTML from the API.
- [`../knowledge_base/`](../knowledge_base/README.md) — source of rendered notes.
- [`../i18n/`](../i18n/README.md) — UI string lookup and content-language selection.

## Design notes

- Keep it dependency-light and offline-capable (no CDN requirement).
- Rendering of markdown happens server-side; the frontend displays already-safe HTML so
  the live XSS/SQLi payloads inside the notes can never execute in the viewer.

**Status:** skeleton — directory purpose only.
