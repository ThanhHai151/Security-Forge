# Server-Side Request Forgery

> The server is coerced into making requests to attacker-chosen internal targets. **Deep dive:**
> [`Troubleshooting_Guide/ssrf.md`](../../../../Troubleshooting_Guide/ssrf.md) ·
> **Skill:** [`ai_framework/skills/`](../../../ai_framework/skills/README.md)

**Aliases / OWASP:** SSRF · A10:2021 Server-Side Request Forgery
**Languages:** English · [Tiếng Việt](README.vi.md)
**Status:** complete

## What it is
SSRF is when an application takes a URL (or host/IP) from the user and fetches it server-side,
letting the attacker point that request at systems the server can reach but they cannot —
internal services, cloud metadata endpoints, or the loopback interface.

## How it works
A feature like "import from URL", webhook, PDF renderer, or image fetcher accepts a URL. The
attacker supplies `http://169.254.169.254/…` (cloud metadata), `http://127.0.0.1:6379/`
(internal Redis), or `file://` schemes. The server makes the request with its own network
position and often its own credentials. Blind SSRF (no response shown) is detected via
out-of-band callbacks.

## Impact
Read cloud instance credentials (classic IMDSv1 metadata theft → account compromise), reach
internal admin panels and databases, port-scan the internal network, hit unauthenticated
internal APIs, and sometimes escalate to RCE against internal services.

## How to detect
- Any parameter containing a URL, hostname, or IP that the server then fetches.
- Out-of-band interaction (Burp Collaborator / your own DNS log) when pointing at a domain you
  control — proves blind SSRF.
- Differential responses/timing between reachable and unreachable internal ports.

## Exploitation (summary)
Confirm the fetch with an OOB canary, then enumerate internal targets (loopback, RFC1918,
metadata IPs). Bypass weak filters with alternate encodings, redirects, DNS rebinding, `[::]`,
decimal/octal IPs, or `@`-tricks in the authority. Escalate via reachable services. Full
techniques in the deep-dive note.

## Defenses
1. **Allow-list** destination hosts/schemes; reject by default.
2. Resolve and validate the IP *after* DNS, and block private/link-local ranges (and re-validate
   on redirect to defeat rebinding/TOCTOU).
3. Disable unused URL schemes (`file://`, `gopher://`, `dict://`).
4. Enforce IMDSv2 / remove instance-metadata reliance; segment internal networks.

## Finding CVEs from scratch
- **NVD** — https://nvd.nist.gov/vuln/search?query=Server-Side+Request+Forgery
- **CVE.org** — https://www.cve.org/CVERecord/SearchResults?query=SSRF
- **Exploit-DB** — https://www.exploit-db.com/search?q=SSRF
- **GitHub Advisories** — https://github.com/advisories?query=ssrf
- **OSV** — https://osv.dev/list?q=ssrf
- **Community** — r/netsec, HackerOne (`weakness:"Server-Side Request Forgery (SSRF)"`), cloud-security blogs (metadata abuse).
- _Query tip: target URL-fetching features and gateways:_ `"<product>" SSRF metadata`.

## Notable CVEs
_Illustrative — verify against NVD before relying on details._
- `CVE-2021-26855` — Microsoft Exchange "ProxyLogon" SSRF, pre-auth, chained to RCE; mass-exploited.
- `CVE-2021-22054` — VMware Workspace ONE UEM SSRF.
- _Canonical incident: the 2019 Capital One breach abused SSRF to read AWS IMDS credentials._

## References
- PortSwigger Web Security Academy — SSRF.
- OWASP — Server-Side Request Forgery Prevention Cheat Sheet.
