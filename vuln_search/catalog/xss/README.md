# Cross-Site Scripting

> Attacker script executes in another user's browser in the app's origin. **Deep dive:**
> [`Troubleshooting_Guide/xss.md`](../../../../Troubleshooting_Guide/xss.md) ·
> **Skill:** [`ai_framework/skills/`](../../../ai_framework/skills/README.md)

**Aliases / OWASP:** XSS · A03:2021 Injection
**Languages:** English · [Tiếng Việt](README.vi.md)
**Status:** complete

## What it is
XSS occurs when an application includes attacker-controlled data in a page without correct
context-aware escaping, so the browser executes it as script. The attacker's code then runs with
the victim's session, in the application's origin.

## How it works
Three classic forms:
- **Reflected** — payload in the request is echoed straight into the response (e.g. a search
  term), executing for whoever follows the crafted link.
- **Stored / persistent** — payload is saved (comment, profile) and runs for every viewer.
- **DOM-based** — client-side JS reads a source (`location.hash`, `document.URL`) and writes it
  to a dangerous sink (`innerHTML`, `eval`) without sanitization. See also `dom_based`.

## Impact
Session/cookie theft, account takeover, credential capture via fake forms, CSRF-token theft,
keylogging, drive-by actions performed as the victim, and worm-like propagation for stored XSS.

## How to detect
- A reflected marker (`'"><svg onload=…>`) appears unescaped in HTML, an attribute, or a script
  context.
- Inputs rendered into `innerHTML`/template literals client-side.
- Differences across contexts (HTML body vs attribute vs JS string vs URL) — each needs its own
  payload and escaping.

## Exploitation (summary)
Identify the reflection context, break out of it, and execute (`<script>`, event handlers,
`javascript:` URIs, or JS-string breakouts). Bypass filters with case/encoding tricks and
alternate tags/events. Use a benign `alert(document.domain)` PoC; escalate to session exfil only
within scope. Full payloads in the deep-dive note.

## Defenses
1. **Context-aware output encoding** (HTML, attribute, JS, URL) — the primary fix.
2. A strict **Content-Security-Policy** as defense-in-depth (`script-src` nonces/hashes).
3. Frameworks' auto-escaping; avoid `innerHTML`/`dangerouslySetInnerHTML`; sanitize with a
   vetted library (DOMPurify) when raw HTML is unavoidable.
4. `HttpOnly` cookies to blunt token theft.

## Finding CVEs from scratch
- **NVD** — https://nvd.nist.gov/vuln/search?query=Cross-Site+Scripting
- **CVE.org** — https://www.cve.org/CVERecord/SearchResults?query=Cross-Site+Scripting
- **Exploit-DB** — https://www.exploit-db.com/search?q=XSS
- **GitHub Advisories** — https://github.com/advisories?query=xss (huge for npm/WordPress plugins)
- **OSV** — https://osv.dev/list?q=xss
- **Community** — r/netsec, HackerOne (`weakness:"Cross-site Scripting (XSS)"` — the most-reported class), WPScan for WordPress plugins.
- _Query tip: WordPress/Drupal plugins and admin panels are the richest hunting grounds:_
  `"<plugin> <version>" stored XSS`.

## Notable CVEs
_Illustrative — verify against NVD before relying on details._
- `CVE-2023-37580` — Zimbra Collaboration reflected XSS, exploited in the wild.
- `CVE-2019-11358` — jQuery prototype pollution often chained to XSS (see `prototype_pollution`).
- _Canonical pre-CVE example: the 2005 "Samy" worm on MySpace (stored XSS, self-propagating)._

## References
- PortSwigger Web Security Academy — Cross-site scripting.
- OWASP — XSS Prevention & DOM-based XSS Prevention Cheat Sheets.
