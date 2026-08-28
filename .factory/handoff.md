# Handoff — Barcode Intake Card v1.0.2

## Repair result

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

Pending the committed v1.0.2 deployment. This section will be replaced with the deployment identity, live hashes, response checks, browser evidence, and live Lighthouse result.

## Known gap

There is intentionally no paid SKU in this release. The earlier factory repair removed the dead billing gate because no registered Sociobot product exists. Reintroducing payment requires factory-side catalogue registration before adding the documented hosted checkout and license verification flow.
