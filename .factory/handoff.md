# Handoff — Barcode Intake Card v1.0.4

## Repair 4 result

The release-blocking mobile LCP defect in verifier commit `daab4678d3bae5d8f6c57138979301d6b00b467b` is repaired. The researched brief, local-only receiving workflow, static PWA class, visual thesis, and every previously passing behavior remain unchanged.

The defect was reproduced against deployed candidate `2df992d27114a301519f7b1afa87f068434edb07` with Lighthouse 13.4.1 using mobile DevTools throttling: LCP was 2.709 s. Its trace showed that JavaScript inserted the LCP image after initial HTML parsing, delaying discovery by 1.152 s; the 412 px mobile viewport selected the 134 KB desktop asset; and the image rendered at 362 × 600 because its HTML height remained active. Evidence: [`qa-artifacts/lighthouse-repair-4-before.json`](qa-artifacts/lighthouse-repair-4-before.json).

The initial document now preloads the mobile hero at high priority. The responsive picture selects the 48 KB 600 px asset at up to 760 px, and explicit `height: auto` restores the intended 3:2 ratio. The immutable app bundle, PWA cache, install URL, package version, and visible build number advance to v6/v1.0.4 so installed clients receive the repair.

### Exact regression coverage

`@regression:mobile-lcp` blocks the app module for 750 ms and proves that the initial document requests the mobile hero before JavaScript can render the landing page. It then asserts that a 412 × 823 viewport selects `/assets/receiving-desk-600.webp`, preserves the 3:2 ratio, and keeps the rendered image below 300 px high. Existing PWA tests now prove v6 activation, stale-cache deletion, v6 shell precaching, and offline navigation.

### Local release verification — 2026-08-28

- Clean `npm ci`: passed with 29 packages; `npm audit` and `npm audit --omit=dev` report zero vulnerabilities.
- Every command in `.factory/claims.json`: passed independently, 15 of 15.
- `npm test`: 33 of 33 Playwright tests passed. Coverage includes all claims, exact LCP regression, desktop/mobile routes, keyboard, camera cleanup, 44 px targets, axe, CSP/console, privacy, offline/update, barcode decoding, backup recovery, demo isolation, and HTTP 404 behavior.
- `npx tsc --noEmit`: passed. The repository has no separate lint script. `npm run build` passed and produced `dist/index.html` at the root.
- Initial app JavaScript is 33.04 KB raw / 11.26 KB gzip and CSS is 11.88 KB raw / 3.58 KB gzip. Deferred barcode and scanner chunks remain 14.72 KB and 108.68 KB gzip.
- Two Lighthouse 13.4.1 mobile runs with the verifier's DevTools throttling passed the 2.5 s LCP budget: **1.806 s** and **1.572 s**. Both scored 99 performance, 100 accessibility, 100 best practices, and 100 SEO, with CLS 0 and TBT 0 ms. Both report the LCP resource as discoverable in the initial document and measure it at 362 × 241. Evidence: [`run 1`](qa-artifacts/lighthouse-repair-4-local-1.json) and [`run 2`](qa-artifacts/lighthouse-repair-4-local-2.json).
- Factory `verify-url.sh` passed locally in 558 ms with the expected title, `lang=en`, one `h1`, one `main`, zero missing image alternatives, zero unnamed buttons, and zero console errors. Evidence: [`qa-artifacts/repair-4-local-verify/verify.json`](qa-artifacts/repair-4-local-verify/verify.json).
- Desktop and 390 × 844 browser checks had no console/page errors or horizontal overflow. Mobile selected the 600 px hero and rendered it at 340 × 227. Evidence: [`desktop`](qa-artifacts/repair-4-local-desktop.png) and [`mobile`](qa-artifacts/repair-4-local-mobile.png).
- Local route, 404, same-origin CSP, `nosniff`, and referrer-policy checks passed. Package/consumer, backend rate-limit, sign-in, billing, and live AI checks do not apply to this static, account-free PWA.

### Repair 4 deployment and live identity

Pending deployment and live verification.

## Repair 3 result

All release blockers documented in verifier commit `c0e219476f2e67ac69633938824ad706294456a5` are repaired. The researched brief's receiving workflow, static PWA artifact class, local-only storage model, and previously passing behavior are unchanged.

1. The unregistered paid camera-scanning checkout is removed rather than left as a dead purchase path. Camera scanning is now included on-device: the landing page, intake flow, `/license`, README, and terms say there is no checkout or account. No `$19`, checkout URL, `api.sociobot.in` link, license-restore path, or billing request remains in the shipped app. This is the closest honest useful version while no factory billing SKU is registered.
2. The claim inventory now has a dedicated `demo-edit` claim for the landing promise. The strengthened `local-only` claim explicitly covers item cards, chosen supplier CSV rows, photos, no account, and no sync; its tagged browser test uploads a CSV and photo, saves, hard-reloads, reopens the card, and asserts the CSV-derived fields and JPEG remain local with no cross-origin request. The removed checkout/price promise has no remaining visitor-facing copy. `camera-ready` and `@regression:checkout-dead-link` prove scanning opens from the intake action without a checkout link or request.

3. JSON restore now requires backup version 1, a valid export date, every complete field with its correct type, printable barcode text, valid dates and photo data, and unique IDs. All records are written in one IndexedDB transaction only after the whole file passes. Invalid shape, version, or type leaves existing cards unchanged. The ledger also sorts defensively, so records already damaged by the old importer no longer crash `/records`.
4. The intake form now accepts only the printable Code 128 range and explains it before save. The exact verifier value `部品-１２３` is rejected with an announced recovery message. If an older stored record still cannot render, the print page shows a visible alert, disables **Print card**, and links directly to **Edit this card**.
5. **Start for real** now clears the isolated demo database before opening real intake. Reopening `/demo` reseeds the original three samples, so edits cannot survive demo exit.
6. Supplier CSV matches now replace the untouched default quantity of `1`, including a valid matched quantity of `0`, while leaving entered values alone. The CSV claim test asserts name, supplier, location, and zero quantity.

The immutable app shell, service-worker cache, install URL, and visible build number advance from v3/v1.0.2 to v5/v1.0.3.

## Exact regression coverage

`tests/claims.spec.ts` now proves:

- a camera scan action is available without a checkout or cross-origin billing request, and neither an API checkout anchor nor `$19` purchase copy appears on the live app;
- the complete local-only privacy contract persists CSV-derived fields and a JPEG photo after a hard reload, with no cross-origin request or account link;
- CSV lookup fills the complete matching row, including an explicit zero quantity instead of keeping the form's default `1`;
- the verifier's partial backup, an unsupported version, and a wrong field type are rejected; a valid record placed before an invalid one is not partially written; the existing card survives reload;
- a browser already containing the verifier's incomplete record still renders its ledger without a page error;
- `部品-１２３` cannot be saved, while the supported sample still produces contrasting pixels and decodes as `5901234123457`;
- a legacy unsupported code gets a visible, announced render error, disabled print action, and direct edit action;
- an edited demo note returns to `Check bore before restocking.` after **Start for real** and demo re-entry;
- activation deletes a seeded stale cache and precaches the v5 shell.

## Local release verification — 2026-08-28

- Clean `npm ci`: passed with 29 packages. `npm audit` and `npm audit --omit=dev`: 0 vulnerabilities.
- Every command in `.factory/claims.json`: passed independently, 15 of 15.
- `npm test`: 32 of 32 Playwright tests passed. This includes the production build, claim, regression, offline, camera, keyboard, 390 px touch-target, route, console, and axe checks.
- `npx tsc --noEmit`: passed. No separate lint script is configured.
- `npm run build`: passed with `dist/index.html` at the root. Initial app JavaScript is 33.04 KB raw / 11.29 KB gzip and CSS is 11.85 KB raw / 3.57 KB gzip. Deferred barcode and scanner chunks are 14.72 KB and 108.68 KB gzip.
- Factory `verify-url.sh` passed locally in 573 ms and live in 795 ms with the expected title, `lang=en`, one `h1`, one `main`, zero missing image alternatives, zero unnamed buttons, and zero console errors. Live evidence: [`qa-artifacts/repair-3-live-verify/verify.json`](qa-artifacts/repair-3-live-verify/verify.json).
- Desktop and 390 × 844 visual checks show no horizontal overflow. Evidence: [`desktop`](qa-artifacts/repair-3-local-desktop.png), [`mobile`](qa-artifacts/repair-3-local-mobile.png), and [`Unicode rejection`](qa-artifacts/repair-3-local-unicode-rejected.png).
- Lighthouse 13.4.1 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 2.0 s, CLS 0, TBT 0 ms. Evidence: [`lighthouse-repair-3-local.json`](qa-artifacts/lighthouse-repair-3-local.json).
- Privacy and response policy remain unchanged: tested flows make only same-origin GET requests; CSP permits only the app's required same-origin/data/blob resources; no analytics, account, sync, billing, or third-party runtime request exists.
- Package/consumer and backend response/rate-limit tests are not applicable to this static PWA. The deployed route and security-header checks are recorded below after deployment.

## Repair 3 deployment and live identity

Commit `92c5224` was pushed to `origin/main` and deployed with `/opt/fleet/lib/deploy-static.sh barcode-intake-card dist` on 2026-08-28. Azure Static Web Apps deployment `2676051a-f041-4fb3-80a4-f593da268176` succeeded at <https://barcode-intake-card.sociobot.in>.

- All 20 served files from `dist/` match the live origin by SHA-256. `staticwebapp.config.json` is deployment configuration and is not a served file.
- `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, and `/print/demo-bearing?demo=1` return 200; `/does-not-exist` returns the designed 404 with HTTP 404.
- At 390 × 844 every checked route has `scrollWidth = 390`, one `h1`, a route-specific title, and no console/page errors. Tab reaches **Skip to main content** first.
- Live landing inspection found zero checkout/API anchors and no `$19` copy. The usable scan action remains enabled on `/intake`.
- The live response uses same-origin CSP, `nosniff`, strict-origin referrer policy, camera-only permissions policy, and HSTS. Evidence: [`qa-artifacts/repair-3-live-headers.txt`](qa-artifacts/repair-3-live-headers.txt).

## Independent verification 3 — input report

**Release status: FAIL — do not release.** Candidate `db64420e3965dd8e8502729fa15783f3a9e80a09` was tested locally and at <https://barcode-intake-card.sociobot.in> on 2026-08-28. The live site matches all 20 served files in the candidate build byte-for-byte, but three acceptance defects remain:

1. A JSON backup containing two records with `id`, `barcode`, and `name` but no timestamps is accepted, stored, and then persistently breaks `/records` with `Cannot read properties of undefined (reading 'localeCompare')`. A reload renders only the skip link, with no in-product recovery.
2. The accepted barcode/SKU `部品-１２３` saves, but its print page has a fully transparent canvas (`0` opaque and `0` dark pixels) and no visible error. The broad printable-card claim therefore fails for accepted input.
3. Editing a demo card, choosing **Start for real**, and reopening `/demo` preserves the edit. The demo database is isolated from real cards, but demo state is not discarded on exit as required.

Full evidence, exact reproduction, passing gates, and required fixes are in [`.factory/verification-3.md`](verification-3.md). Screenshots and the Lighthouse/URL verifier reports are in [`qa-evidence/`](qa-evidence/).

Verification gates that passed: all 15 exact claim commands, `npm ci`, zero npm audit findings, `npm test` (29/29), standalone TypeScript checking, the exact production build, one-click cold demo, live scanner decode, offline reload/navigation, service-worker update, same-origin-only runtime requests, response policies, mobile/keyboard/reduced-motion checks, axe, link crawl, byte-for-byte deployment parity, and Lighthouse 97/100/100/100.

Required next steps: validate backups completely and atomically before storage; validate or support all printable barcode input and show a visible render error; clear/reset demo storage on Start for real; add regressions for all three; deploy; rerun independent verification.

## Builder repair result before verification 3

All six findings in independent verification commit `dced22c32e26ecf70eb7c8f9f3bfb76083ab77d4` are repaired without changing the researched brief or artifact class.

- Printable Code 128 output now uses a canvas renderer. It needs no inline SVG styles, works with the production CSP, has black and white pixels, and decodes back to the source value in the claim test.
- Camera cleanup now runs on the dialog `cancel` and `close` events, route rendering, delayed scanner startup, and page teardown. Tests prove tracks become `ended` after Escape and a route change, with focus restored after Escape.
- `.factory/claims.json` now lists photo reduction, no automatic web lookup, and no purchase-order creation. Each has one exact tagged sandbox test.
- Corrupt image decoding is caught. The form announces a specific JPG, PNG, or WebP recovery action and clears the invalid selection.
- All visible links, buttons, and form controls measure at least 44 by 44 CSS pixels at a 390 by 844 viewport.
- Static Web Apps routes now enumerate the real SPA URLs. Unknown documents use the designed `404.html` response with HTTP 404 instead of the catch-all 200 rewrite.
- The app shell and install URL moved to cache revision v3. Navigation errors no longer replace the cached root shell.

## Regression coverage

The new coverage in `tests/claims.spec.ts` and `tests/zz-accessibility.spec.ts` checks:

- the production CSP header, zero console errors, contrasting barcode pixels, and a ZXing decode to `5901234123457`;
- a generated 1600 by 1000 PNG stored as a 1200 by 750 JPEG;
- zero requests after an unknown barcode entry and zero mutating requests or purchase-order data after save;
- live camera tracks ending after Escape and route teardown;
- an announced corrupt-photo error with no unhandled page error;
- every visible control across all routes at 390 pixels;
- an actual HTTP 404 and the designed recovery action.

## Local verification — 2026-08-28

- Clean `npm ci`: passed with 29 packages; `npm audit` and `npm audit --omit=dev`: 0 vulnerabilities.
- Every command in `.factory/claims.json`: passed independently, 15 of 15.
- `npm test`: 29 of 29 Playwright tests passed. The build step includes strict TypeScript checking. No separate lint tool is configured.
- `npm run build`: passed and produced `dist/index.html`. Initial app JavaScript is 30.53 KB raw / 10.56 KB gzip; CSS is 11.85 KB raw / 3.57 KB gzip. Deferred scanner and barcode chunks are 108.68 KB and 14.72 KB gzip.
- Axe integration: no serious or critical findings on `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, or `/license`.
- Factory `verify-url.sh`: passed in 554 ms with one `h1`, one `main`, `lang=en`, zero missing image alternatives, zero unlabeled buttons, and zero console errors. Evidence: [`qa-artifacts/repair-local-verify/verify.json`](qa-artifacts/repair-local-verify/verify.json).
- Static Web Apps emulator: every supported deep link returned 200; `/does-not-exist` returned 404; the print route had two canvas colors, zero console errors, and zero mobile overflow.
- Desktop, 390 px landing, and 390 px print output were visually checked. Evidence: [`desktop`](qa-artifacts/repair-local-desktop.png), [`mobile`](qa-artifacts/repair-local-mobile.png), and [`print`](qa-artifacts/repair-local-print-mobile.png).
- Lighthouse 13.4.1 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 2.0 s, CLS 0, TBT 0 ms. Raw evidence: [`lighthouse-repair-local.json`](qa-artifacts/lighthouse-repair-local.json).
- Offline/update coverage: the v3 worker precaches the shell, activates, deletes older caches, claims clients, and keeps the demo usable after Chromium goes offline.
- Privacy and response policy: the save/photo/CSV flow makes no cross-origin request; no account or backend exists; CSP, `nosniff`, referrer policy, camera-only permissions policy, and immutable hashed-asset caching remain configured.
- Copy audit: the first screen still states the job, audience, action, and three facts in one viewport. Every audited landing sentence remains at or below 22 words with no banned term.

## Deployment and live verification

The committed candidate `3d965b955a686e67cdf0b00df75371c1fd6b657d` was pushed to `origin/main` and deployed with `/opt/fleet/lib/deploy-static.sh barcode-intake-card dist` on 2026-08-28. Azure Static Web Apps deployment `ea922fff-9de6-4b6d-9607-4c6064e02ad5` succeeded at <https://barcode-intake-card.sociobot.in>.

- SHA-256 matched local `dist/` for all 20 served files. The live shell references `app-v3.js` and `app-v3.css`; the worker reports `barcode-intake-v3`.
- Supported routes `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, and `/print/demo-bearing?demo=1` return 200. `/does-not-exist` returns 404 with the designed recovery page.
- Live factory `verify-url.sh`: passed in 669 ms with the expected title, `lang=en`, one `h1`, one `main`, zero missing alternatives, zero unlabeled buttons, and zero console errors. Evidence: [`qa-artifacts/repair-live-verify/verify.json`](qa-artifacts/repair-live-verify/verify.json).
- Live print verification under the deployed CSP found two canvas colors, decoded the barcode as `5901234123457`, and produced zero console errors. The 390 px print was visually checked: [`repair-live-print-mobile.png`](qa-artifacts/repair-live-print-mobile.png).
- Live fake-camera verification proved Escape closes the dialog and changes its media track to `ended`. Every visible control across every route measured at least 44 by 44 CSS pixels at 390 px.
- A live CSV-match, JPEG-photo, save, and print flow made zero cross-origin requests and produced zero console/page errors. A fresh v3 service-worker context completed a full offline `/demo` reload with sample data present.
- Live response headers include HSTS, `nosniff`, strict-origin referrer policy, camera-only permissions policy, same-origin CSP, and immutable one-year caching for versioned assets. Captured headers: [`repair-live-headers.txt`](qa-artifacts/repair-live-headers.txt).
- Live Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, CLS 0, TBT 0 ms. Raw evidence: [`lighthouse-repair-live.json`](qa-artifacts/lighthouse-repair-live.json).

## Known gap

There is intentionally no paid SKU in this release. The dead billing gate was removed because no registered Sociobot product exists. Reintroducing payment requires factory-side catalogue registration before adding the documented hosted checkout and license verification flow; it must not gate the core scanner until then.
