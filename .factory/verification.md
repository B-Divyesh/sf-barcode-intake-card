# Independent verification — FAIL

**Candidate:** `a12b5b889520d46ec19e89b74ae285130d8cdc3c`
**URL:** https://barcode-intake-card.sociobot.in
**Run:** 2026-08-28 (fresh checkout)

## Verdict

**FAIL — do not release.** The advertised, paid path to camera scanning is dead in production. This is a core capability in the researched brief, and the product locks it behind the failed checkout route.

## Release blockers

### P1 — Camera-scanning checkout is a dead link in production

The live `Buy camera scanning` link is exactly:

`https://api.sociobot.in/api/v1/products/barcode-intake-card/checkout`

Fresh `GET` and `HEAD` checks returned **HTTP 404**, with body:

```json
{"error":"enabled factory product","status":404}
```

The landing page advertises this as a `$19` one-time purchase, and manual testing confirmed that unlicensed users are sent to this purchase/restore route when choosing camera scanning. A buyer therefore cannot obtain the license required for the core scanner. The handoff's required catalogue-registration next step was not completed.

### P1 — Claim inventory does not cover several visitor-facing promises

The claims policy requires a dedicated tagged claim test for every statement a visitor can rely on. `.factory/claims.json` has no entries for, among others:

- the landing-page promise that the demo cards can be **edited**;
- the landing/README privacy promises that CSV rows and photos stay in the browser and that there is **no account or sync**;
- the `$19` price / one-time checkout promise.

Some existing tests exercise related behavior, but their IDs and stated claims are different (for example, `manual-intake` is the claim that manual intake is free). The required claim inventory is therefore incomplete. Add distinct, observable sandbox tests or remove/narrow these promises.

## Required remediation

1. Register/enable `barcode-intake-card` in the Sociobot production billing catalogue at the advertised price, then verify a checkout redirect and successful return-token verification on the live origin.
2. Add the missing claim entries and tagged tests (or remove the promises). Re-run every command in `.factory/claims.json` from a clean checkout.
3. Request a fresh verification after the live URL changes.

## Evidence that passed

### Required claim commands

`.factory/claims.json` exists and all 12 declared commands passed individually from the demo entry point:

`offline-reload`, `local-only`, `manual-intake`, `duplicate-review`, `csv-lookup`, `csv-export`, `search-cards`, `json-backup`, `print-card`, `demo-isolated`, `camera-ready`, and `license-restore`.

`npm test` also passed (20 tests), and an independent rerun of `tests/zz-accessibility.spec.ts` passed 8/8.

### Cold first read

On a new 390 px live browser session, the page plainly says it turns scans into item cards, names small sellers/workshops receiving mixed stock, and presents a one-click **Try it with sample data** action with the result stated beside it. The demo opened three sample cards and showed the required persistent banner, reset action, and start-for-real exit. This requirement passes.

### Build, behavior, privacy, and PWA

- `npm ci`, `npm run build`, and `npm test` passed. Production build output: initial `app-v1.js` 11.06 KB gzip and CSS 3.51 KB gzip; scanner (108.68 KB gzip) and barcode renderer (14.72 KB gzip) are deferred. The initial static JS budget passes.
- Independent real-data flow passed: required-field rejection, malformed CSV recovery, zero quantity, save/refresh persistence, malformed JSON recovery, printable card, and local photo selection/persistence.
- In a live photo/intake flow, all observed requests were same-origin. No analytics or third-party runtime requests were observed. The live CSP, referrer policy, permissions policy, HSTS, and `nosniff` headers are present; hashed assets are immutable-cached.
- Live PWA service worker was active (`barcode-intake-v1`), offline full reload of `/demo` passed, and offline navigation to intake and back to records passed. The implementation includes cache versioning, `skipWaiting`, `clientsClaim`, and an update-ready notification.
- The live deployment exactly matches the candidate build: SHA-256 matched for `index.html`, `app-v1.js`, `app-v1.css`, `scanner-v1.js`, `barcode-v1.js`, `sw.js`, and `manifest.webmanifest`.

### Accessibility, responsive, performance

- Independent live axe scans of `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, and the client 404 found no serious or critical findings; no console/page errors occurred.
- At 390 × 844, all checked routes had `scrollWidth = 390`; keyboard Tab reached the skip link; reduced motion reduced animation duration to `0.01ms`.
- Lighthouse 13.4.1 (mobile/defaults, live URL): Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP 1.8 s, CLS 0, TBT 30 ms.

### API rate limiting

The only server-side product integration tested was license verification. A burst of 50 invalid-token verification requests at concurrency 25 produced 30 × 200 and 20 × **429**. Every observed 429 included `Retry-After: 3` or `4`; limiting began at roughly 30 requests in this burst. This passes the rate-limit requirement. No sign-in flow exists.

## Non-blocking observations

- An unknown live path renders the designed client-side 404 page, but the HTTP response is 200 because SPA navigation fallback serves `index.html`. If HTTP 404 semantics are required for crawlers, adjust the hosting fallback/404 routing.
- The repository has no `verify-url.sh`; equivalent title/lang/main/alt/console checks were performed through the independent Playwright and axe runs.
