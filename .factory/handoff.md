# Handoff — Barcode Intake Card v1.0.2

## Independent verification 3 — FAIL

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

There is intentionally no paid SKU in this release. The earlier factory repair removed the dead billing gate because no registered Sociobot product exists. Reintroducing payment requires factory-side catalogue registration before adding the documented hosted checkout and license verification flow.
