# SecForge

> A browsable, **bilingual (English ⇄ Tiếng Việt)** knowledge base of web-vulnerability
> classes and a phase-organized pentest toolkit — and the security profile of
> **Huỳnh Thanh Hải** ([@ThanhHai151](https://github.com/ThanhHai151)).
>
> 🔗 **Live:** _add your Cloudflare Pages URL here_ · For authorized testing, CTFs, and
> defending your own projects only.

A fast, fully static web app (React + Vite + Tailwind) with three sections:

- **Dashboard** — who I am, what I focus on, and what I'm building.
- **Docs** — a searchable dictionary of **29 web-vulnerability classes**: what each is, how
  it works, impact, detection, an exploitation summary, **payloads & techniques**, defenses,
  and how to find CVEs from scratch. Every card has an English **and** a Vietnamese version.
- **Pentest** — the tools I reach for, grouped by engagement phase, each with a
  representative command and links into the relevant docs.

## Features

- **29 vulnerability classes**, fully written and **bilingual** (every card has a `README.vi.md`).
- Instant **EN ⇄ VI** toggle for both the interface and the content.
- **Light / dark** theme (navy-ink + teal), persisted across visits.
- Full-text search, a per-page table of contents, and syntax-highlighted payloads.
- **100% static** — no backend, no tracking. Deep links work everywhere via hash routing.

## Run locally

```bash
cd frontend
npm install
npm run dev        # http://localhost:61020
```

Build the static site:

```bash
npm run build      # outputs frontend/dist
npm run preview
```

The content lives in `vuln_search/catalog/<slug>/README.md` (and its `README.vi.md` sibling);
the app reads it at build time, so editing a card and rebuilding is all it takes to update.

## Deploy — Cloudflare Pages

Connect this repository in the **Cloudflare Pages** dashboard with these settings:

| Setting                 | Value           |
|-------------------------|-----------------|
| Root directory          | `frontend`      |
| Build command           | `npm run build` |
| Build output directory  | `dist`          |
| Node version            | `20` (pinned via `frontend/.nvmrc`) |

Every push to `main` then redeploys automatically. (The same settings work for Netlify;
for GitHub Pages, set `base: '/Security-Forge/'` in `vite.config.js` first.)

## Project layout

```
frontend/             React + Vite SPA — Dashboard · Docs · Pentest
vuln_search/catalog/  29 vulnerability cards (EN + VI) — the content source
docs/                 design notes & specifications
defense/ · labs/ · knowledge_base/ · i18n/   roadmap / future pillars
```

> The AI agent framework (the Hermes reasoning loop, Headroom context compression, and a
> multi-account AI router for local pentesting) is developed as a **separate local project**
> and is intentionally not part of this public, static knowledge base.

## About

**Huỳnh Thanh Hải** — Security Researcher · Offensive Security & AI Tooling. I work across
the offensive lifecycle (recon → web exploitation → reporting) and care just as much about
turning each finding into a concrete, testable defense.

- GitHub: <https://github.com/ThanhHai151>
- Email: thanhhai1512005@gmail.com

## Use & disclaimer

For **authorized testing, CTFs, and defending your own projects only**. The vulnerability
details here are educational; "Notable CVEs" are illustrative — verify against
[NVD](https://nvd.nist.gov/) before relying on them.
