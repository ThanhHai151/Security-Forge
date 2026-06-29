/**
 * Tiny hash router for the SPA. Three top-level sections — the Dashboard (profile),
 * the Docs (knowledge base), and the Pentest tool catalog — plus deep links into a
 * single doc (`#/docs/<slug>`).
 *
 * Hash shapes:
 *   #/                 → dashboard (home)
 *   #/dashboard        → dashboard
 *   #/docs             → docs index (category browser)
 *   #/docs/<slug>      → a single vulnerability doc
 *   #/pentest          → pentest tool catalog
 *   #/<slug>           → back-compat: opens that doc under /docs
 */
import { bySlug } from "../content/catalog";

/** Parse a `window.location.hash` string into `{ section, slug }`. */
export function parseRoute(hash) {
  const raw = decodeURIComponent((hash || "").replace(/^#\/?/, "")).trim();
  const parts = raw.split("/").filter(Boolean);

  if (parts.length === 0) return { section: "dashboard", slug: "" };

  const [head, ...rest] = parts;
  if (head === "docs") {
    const slug = rest[0] && bySlug[rest[0]] ? rest[0] : "";
    return { section: "docs", slug };
  }
  if (head === "pentest") return { section: "pentest", slug: "" };
  if (head === "dashboard") return { section: "dashboard", slug: "" };

  // Back-compat: a bare known slug (`#/sql_injection`) opens that doc.
  if (bySlug[head]) return { section: "docs", slug: head };

  return { section: "dashboard", slug: "" };
}
