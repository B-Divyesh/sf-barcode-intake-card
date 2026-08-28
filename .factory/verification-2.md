# Independent verification 2 — FAIL

**Candidate:** `1d0f62f8a5f11b046161633a42c0c233faaef1f5`

**URL:** https://barcode-intake-card.sociobot.in

**Run:** 2026-08-28 from a clean checkout

## Verdict

**FAIL — do not release.** The live deployment is byte-identical to the candidate, but the production CSP breaks the core printable barcode, keyboard dismissal leaves the camera stream running, and the claim inventory is incomplete. Additional image-error, touch-target, and 404 defects also remain.

## Release-blocking findings

### P1 — The live printable barcode is a solid black rectangle

The smallest useful product requires printable one-up barcode cards. On `/print/demo-bearing?demo=1`, JsBarcode creates a white background rectangle and black bar group using inline `style` attributes. The candidate's production CSP is `style-src 'self'`, so the browser blocks all three generated styles. The background and bars therefore use the SVG default black fill and merge into one solid `246 × 72` black rectangle. It is not a usable barcode.

Evidence:

- [Live print screenshot](qa-artifacts/live-print.png)
- The live console reports three `Applying inline style violates ... style-src 'self'` errors on every print route render.
- DOM inspection found `style="fill:#ffffff"` on the background and `style="fill:#000000"` on the bar group; computed rendering shows the solid block.
- `@claim:print-card` passes locally only because Vite preview does not apply `staticwebapp.config.json`. It checks that SVG rectangles exist, not that the production barcode is visually scannable or that the production policy produces no errors. This is a claim-test false positive.

### P1 — Escape hides the camera dialog but leaves the camera live

With a permitted fake camera, `Scan with camera` opened the dialog with one media track in `readyState: "live"`. Pressing Escape closed the native dialog, but 300 ms later the same track was still `"live"`. Closing with the visible button correctly removed/stopped the track. The `cancel` path has no scanner cleanup, so a keyboard user can dismiss the UI while capture continues invisibly.

This violates the privacy and keyboard expectations of the brief. Scanner cleanup must run on dialog `cancel`/`close` and on route teardown, with a regression test that asserts every track becomes `ended`.

### P1 — Visitor-facing claims are absent from `.factory/claims.json`

The claim file exists and its declared commands pass, but the page and README also promise that photos are reduced before storage, that there is no automatic web lookup, and that the tool does not create purchase orders. These statements have no corresponding claim entries and dedicated `@claim:<id>` tests. In particular, the existing photo test uploads a 1 × 1 image and checks only that the stored URL is JPEG; it cannot prove reduction. The claims contract says an unlisted claim fails review.

## Other defects

### P2 — Corrupt image input produces an unhandled error

Uploading a file named `corrupt.png` with MIME type `image/png` but invalid bytes triggers the page error `The source image cannot be decoded.` The status live region remains empty and the preview remains hidden. The user is not told what happened or how to recover.

### P2 — Multiple mobile controls miss the 44 px target minimum

At `390 × 844`, measured hit boxes include `Intake` at `38 × 15`, `Cards` at `37 × 15`, `Reset demo` at `70 × 32`, `Start for real` at `72 × 15`, and footer legal links at about `35–43 × 15` CSS pixels. The attached accessibility and design contracts require every interactive target to be at least `44 × 44`.

### P2 — Unknown URLs return HTTP 200

`GET /does-not-exist` returns the designed client-side “This card is not in the file” page, but the HTTP response is `200`, not `404`. The configured navigation fallback intercepts the request before `responseOverrides.404` can apply.

## Mandatory opening gates

### Claim commands

The first pre-install claim invocation could not start because the clean clone had no dependencies (`tsc: not found`). After the required locked install (`npm ci`), every exact command in `.factory/claims.json` passed individually:

`offline-reload`, `local-only`, `manual-intake`, `duplicate-review`, `csv-lookup`, `csv-export`, `search-cards`, `json-backup`, `print-card`, `demo-isolated`, `demo-edit`, and `camera-ready`.

This does not override the live `print-card` false positive or the unlisted-claim finding above.

### Cold first read

The first-read gate passes on desktop and at 390 px. The cold screen states:

- what it does: “Turn scans into item cards”;
- who it serves: small sellers and workshops receiving mixed stock;
- what to click: “Try it with sample data.”

The action and all three plain facts are visible in the initial 390 × 844 viewport. One click opens three realistic records and the persistent “Demo — sample data, nothing is saved to your real cards” banner with Reset and Start for real actions. See [desktop](qa-artifacts/live-cold-desktop.png), [mobile](qa-artifacts/live-cold-mobile.png), and [demo](qa-artifacts/live-mobile-demo.png) evidence.

## Evidence that passed

### Checkout, tests, and build

- Repository HEAD was exactly the requested candidate and `origin/main`: `1d0f62f8a5f11b046161633a42c0c233faaef1f5`.
- `npm ci` passed; `npm audit` and `npm audit --omit=dev` reported 0 vulnerabilities.
- `npm test` passed 22/22 tests in 34.9 s.
- `npm run build` passed (`tsc --noEmit && vite build`) and produced `dist/`.
- No separate lint script exists.
- Build output: initial app JS 29.70 KB raw / 10.26 KB gzip; CSS 11.56 KB raw / 3.50 KB gzip; deferred scanner 108.68 KB gzip; deferred barcode renderer 14.72 KB gzip. The landing hero transferred 48.03 KB. Budgets pass.

### End-to-end behavior

- Real-data flow passed required-field rejection, malformed CSV explanation, valid quoted CSV matching, quantity `0`, save, refresh persistence, supplier/location search, CSV download content, malformed JSON recovery, delete cancellation, and confirmed deletion.
- A 1536 × 1024 PNG was converted to a 1200 × 800 JPEG, persisted in IndexedDB, and restored in edit mode.
- A generated Code 128 fake-camera feed was decoded live as `5901234123457`; the successful-scan path closed the dialog, stopped its track, and returned focus.
- Demo reset, edit/search flows, and real/demo database isolation passed.

### Privacy, network, and server policy

- Complete demo and live photo/save flows produced no cross-origin requests. No analytics, account, checkout, billing, or sign-in integration exists.
- The site is a static PWA with no product API endpoints, so API burst/rate-limit and backend concurrency/health checks are not applicable. There is no sign-in authority to validate.
- HTTPS redirect, HSTS, `nosniff`, strict-origin referrer policy, camera-only permissions policy, and frame blocking are present. Hashed assets return `Cache-Control: public, max-age=31536000, immutable`.
- The CSP is strong in principle but is incompatible with the live barcode renderer as described above.

### PWA and offline behavior

- Manifest fields, standalone display, versioned start URL, theme colors, 192/512 icons, and maskable purpose are present; icon dimensions match declarations.
- Live service worker state was `activated`; cache `barcode-intake-v2` contained the shell.
- After going offline, a full `/demo` reload, navigation to demo intake, and back navigation all worked with all three sample records.
- An isolated v2 → v3 update simulation showed the update toast, Reload now action, activation, old-cache deletion, and continued control.

### Accessibility and presentation

- Independent live axe scans on `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, `/print/demo-bearing?demo=1`, and the client 404 found no serious or critical findings.
- All checked routes have `lang="en"`, one `main`, one `h1`, route-specific titles, labels, and image alternatives.
- Keyboard order starts with the skip link. Focus treatment is visible; focus red is 6.24:1 against paper. Dialog button close returns focus to Scan with camera.
- Reduced motion changes animation duration to `0.01ms`, iteration count to 1, and fixes the scan rule in place.
- There is no horizontal overflow at 390 px. The target-size defect remains.

### Performance and deployment identity

- Lighthouse 13.4.1 mobile: Performance **96**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.7 s, CLS 0, TBT 210 ms. Raw report: [lighthouse-live.json](qa-artifacts/lighthouse-live.json).
- SHA-256 matched for every one of 19 user-facing files in local `dist/` and the live deployment, plus `index.html`: app/CSS/scanner/barcode bundles, service worker, manifest, offline/404 pages, icons, hero/social assets, robots, sitemap, favicon, and static CSS. There were zero mismatches.
- Every crawled internal link returned 200, and the sole external footer link resolved to 200. The unknown-route status defect is noted above.

## Required remediation

1. Render the barcode using CSP-compatible SVG presentation attributes or otherwise reconcile the renderer with the production CSP. Add a production-header E2E test that verifies contrasting bars, no console errors, and an actual decode.
2. Stop every media track on dialog `cancel`/`close`, route change, and teardown; test Escape explicitly.
3. Add the missing claim entries/tests or remove the statements.
4. Catch image decode failures and announce a specific recovery action.
5. Enlarge all interactive hit areas to at least 44 × 44 CSS pixels and retest at 390 px.
6. Return an actual HTTP 404 for unknown routes while retaining the designed page.
