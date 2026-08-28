# Handoff — polish 1 complete

## Outcome

All 23 findings in `.factory/review-1.md` are repaired. The repair commit is `679b151680c40110db04dedad07a75790047b5d7` (`fix: complete adversarial review repairs`) and production is deployed at <https://barcode-intake-card.sociobot.in>.

The full finding-by-finding mapping is in `.factory/polish-1.md`. The product remains a static, local-first PWA with the monochrome broadsheet visual system; no backend, tracker, external font, or paid-service dependency was added.

## What changed

- Fixed the 390 px privacy-email target regression with a 45 px ordinary-link minimum.
- Made `/?demo=1` a direct seeded demo entry point and tested Reset demo / Start for real isolation end to end.
- Added `demo-reset-exit` to the 16-claim inventory; strengthened search and complete-backup claim tests.
- Rewrote all reviewed landing and README wording, standardized “item card” and “supplier CSV,” and refreshed the verb-first catalog description.
- Narrowed the camera promise to the tested camera-preview behavior.
- Completed static 404 structure and metadata; SPA metadata now updates social title and description by route.
- Versioned the repair PWA shell and immutable assets as v7.

## Exact verification evidence

- Fresh clone: `/tmp/barcode-intake-clean-UZaxj5`, created from commit `679b151`; `npm ci` passed with 0 audit vulnerabilities.
- Every exact command in `.factory/claims.json` was invoked separately in that clone: **16/16 passed** (`offline-reload`, `local-only`, `manual-intake`, `duplicate-review`, `csv-lookup`, `csv-export`, `search-cards`, `json-backup`, `print-card`, `demo-isolated`, `demo-edit`, `demo-reset-exit`, `camera-ready`, `photo-reduction`, `no-web-lookup`, `no-purchase-orders`).
- Clean-clone aggregate `npm test`: **33/33 passed**. Local build used `tsc --noEmit && vite build` and produced `dist/` with `dist/index.html` at root.
- Local build budget: initial `app-v7.js` **11.18 KB gzip**; `app-v7.css` **3.57 KB gzip**. Deferred scanner and barcode chunks are **108.68 KB** and **14.72 KB gzip**.
- Production full suite: `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npx playwright test` — **33/33 passed**, including Playwright axe checks on landing, demo, intake, records, privacy, terms, and camera routes; keyboard skip link; 390 px touch targets; offline/PWA; request privacy assertions; and HTTP 404 behavior.
- Factory live verifier: `/opt/fleet/lib/verify-url.sh https://barcode-intake-card.sociobot.in .factory/qa-evidence/polish-1-live` passed. `verify.json` records title, `lang=en`, one h1, main landmark, zero missing image alts, zero unnamed buttons, and zero console errors.
- Lighthouse mobile production run (Chromium 1208): **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; LCP **1.2 s**, CLS **0**. Report: `.factory/qa-evidence/polish-1-live/lighthouse-mobile.json`.
- Cold production checks: `/` returned 200 with title `Barcode Intake Card — Make printable item cards`; `/?demo=1` opened samples and banner; `/polish-1-missing` returned **HTTP 404** with shared structure and 7 required metadata/structure markers. Screenshots: `screenshot-desktop.png`, `screenshot-mobile.png`, `demo-desktop.png`, `demo-mobile.png`, and `404-mobile.png` in `.factory/qa-evidence/polish-1-live/`.
- Deployment: `/opt/fleet/lib/deploy-static.sh barcode-intake-card /work/repo/dist` completed successfully (Azure deployment `cf0c45d1-88c7-4cbd-9efc-28040db280b9`), then the custom production domain returned 200.

## How to run

```bash
npm ci
npm test
npm run build
```

Use `http://localhost:5173/?demo=1` for the isolated sample flow. Deploy `dist/` as a static site using the included Static Web Apps configuration.

## Known gaps / next steps

None. Camera decode remains implemented, but the visitor-facing claim deliberately promises only the fully deterministic, tested camera-preview start behavior.
