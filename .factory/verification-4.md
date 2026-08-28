# Independent verification 4 — FAIL

**Candidate:** `2df992d27114a301519f7b1afa87f068434edb07`  
**Live URL:** <https://barcode-intake-card.sociobot.in>  
**Verified:** 2026-08-28

## Release decision

**FAIL — do not release.** The candidate is correctly deployed and the intake product works end to end, but two independent mobile Lighthouse 13.4.1 runs exceed the acceptance LCP budget of 2.5 seconds: **2.851 s** and **2.666 s**. The PWA/performance contract requires LCP below 2.5 seconds on a throttled mid-range phone. This is a reproducible release-blocking performance defect.

## Release-blocking defect

### High — mobile LCP exceeds the 2.5 s budget

Both fresh live Lighthouse mobile runs completed successfully and scored well overall, but their LCP measurements were over budget:

| Run | Performance | Accessibility | Best practices | SEO | FCP | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 95 | 100 | 100 | 100 | 1.748 s | **2.851 s** | 0 | 9 ms |
| 2 | 96 | 100 | 100 | 100 | 1.543 s | **2.666 s** | 0 | 0 ms |

Raw reports: [run 1](qa-artifacts/lighthouse-verification-4.json) and [run 2](qa-artifacts/lighthouse-verification-4-r2.json). Rework and measure the LCP element until repeated mobile runs are below 2.5 seconds.

## Opening gate: PASS

A cold live desktop visit returned 200 with no console/page errors and only same-origin document, script, stylesheet, and hero-image requests. The first screen says:

- what it does: **“Turn scans into item cards”**;
- for whom: **“For small sellers and workshops receiving mixed stock without a full inventory system.”**;
- what to click first: the visible one-click **“Try it with sample data”** action, with the outcome stated beside it.

The action opens `/demo` with three realistic cards and the persistent **“Demo — sample data, nothing is saved to your real cards”** banner, **Reset demo**, and **Start for real**. This passes the plain-words and demo-sandbox gates.

## Local quality gates: PASS

- Clean `npm ci` passed (29 packages; audit reported 0 vulnerabilities).
- `.factory/claims.json` exists with 15 claims. Every declared command was invoked individually from the clean install; all claim tests passed. The aggregate `npm test` run also passed **32/32** Playwright tests, including every tagged claim.
- `npm run build` passed (`tsc --noEmit && vite build`) and produced `dist/`. There is no separate lint script.
- The initial app bundle is 33.04 KB raw / **11.29 KB gzip**; CSS is 11.85 KB raw / **3.57 KB gzip**. Deferred barcode and scanner chunks are 14.72 KB and 108.68 KB gzip. The initial JavaScript budget passes.
- The full suite covers offline reload, versioned service-worker activation, local-only CSV/photo persistence, manual intake, duplicate review, CSV lookup/export, search, JSON backup validation/recovery, barcode printing, demo isolation/edit exit, camera lifecycle, photo reduction, no lookup, no purchase order, desktop/mobile axe, keyboard skip link, touch targets, and 404 behavior.

## Live functional, privacy, PWA, and accessibility evidence: PASS

- SHA-256 matched all **20 served candidate files** in freshly built `dist/`; `staticwebapp.config.json` is deployment configuration and is not a served asset.
- Supported routes `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, and `/print/demo-bearing?demo=1` return 200. An unknown route returns HTTP 404 with the designed recovery page.
- A fresh live normal flow rejected empty required fields, rejected unsupported `部品-１２３` with its recovery message, rejected quantity `-1`, saved the valid quantity-`0` card, and opened a printable barcode card. There were no console/page errors.
- A runtime request log for the landing, demo/offline, and real-card flow recorded only same-origin GETs; there were no cross-origin, mutating, analytics, account, sync, billing, automatic lookup, or photo/CSV upload requests. This matches the local-only privacy promise.
- Live browser state had active `barcode-intake-v5`, cache `barcode-intake-v5`, and no waiting worker. `registration.update()` completed. After one online demo visit, offline navigation and hard reload of `/intake?demo=1` succeeded with the demo banner present.
- Fresh mobile `390 × 844` inspection showed no horizontal overflow. Tab first reached the skip link, whose computed focus outline was a visible 3 px `#a22b1f` ring. Reduced-motion, camera Escape cleanup, keyboard, and 44 px target coverage pass in the 32-test suite.
- Axe on every live app route, after the app became idle, found **zero serious or critical violations**. The factory URL verifier passed: title present, `lang=en`, one h1, main landmark, zero missing image alternatives, zero unnamed buttons, and zero console errors. Evidence: [verify.json](qa-artifacts/verification-4-live/verify.json).
- Headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, `camera=(self)` permissions policy, and a same-origin CSP. Versioned JS/CSS assets use `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and worker revalidate at 30 seconds.

## Applicability

This is a static local-first PWA with no backend endpoint, product-unlock request, sign-in, package, or CLI. Backend rate-limit, Entra tenant, and consumer-install checks are not applicable.

## Required next step

Improve the live mobile LCP path, redeploy, and repeat at least two fresh Lighthouse mobile runs. Do not change the acceptance status until both are below 2.5 seconds.
