# `i18n/` — Localization (English ⇄ Vietnamese)

**Cross-cutting.** Makes the *product* switch smoothly between English and Vietnamese. This
is a design concern from day one, not a later patch.

## Ground rule

**Documentation (`.md`) is English-only** — one canonical source of truth across the whole
project. Localization applies to the **running product**, not to these docs.

## Two things are localized, independently

1. **UI strings** — menus, buttons, labels, status messages.
   - Stored as keyed locale files: `en` and `vi` (e.g. `en.json`, `vi.json`).
   - The [`frontend/`](../frontend/README.md) looks every string up by key and swaps
     locale **instantly on toggle**, with no reload.

2. **Displayed content** — the knowledge notes and the agent's output.
   - **English is the source.** Vietnamese is provided by either:
     - **cached translations** stored alongside the source (fast, reviewable), or
     - **on-demand translation** via the [`models/`](../ai_framework/models/README.md)
       backend, then cached for reuse.
   - Content carries a **language tag** so the viewer can request the EN or VI variant.

## The contract

- Nothing user-facing is hard-coded in one language — every string goes through a lookup,
  and every piece of content carries a language tag.
- Adding a language later = add a locale file + a translation source; no code changes in
  the consuming modules.

## Connects to

- [`../frontend/`](../frontend/README.md) — toggle + string lookup.
- [`../backend/`](../backend/README.md) — resolves the requested language per request.
- [`../ai_framework/models/`](../ai_framework/models/README.md) — on-demand content
  translation.

## Planned contents

- `en` / `vi` UI locale files.
- A small glossary so security terms translate consistently.
- The translation-cache layout for content.

**Status:** skeleton — directory purpose only.
