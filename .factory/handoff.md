# Handoff — Barcode Intake Card v1.0.1

## Repair summary

The independent verifier's two P1 findings in `78dea5d28850eb04e041e5a91cd821228ea2d039` are repaired in this candidate.

- Reproduced the old production checkout failure on 2026-08-28: `GET https://api.sociobot.in/api/v1/products/barcode-intake-card/checkout` returned `404` with `{"error":"enabled factory product","status":404}`.
- The repository has no catalogue-registration tool and its contract forbids changing billing infrastructure. Rather than retain a dead paid gate around the brief's core scan action, camera scanning is now included locally. The app has no checkout link, license token, billing call, or external `connect-src` allowance. This is a deliberate monetization deviation: the useful offline barcode workflow is preserved, while the unavailable $19 SKU is not advertised.
- The prior `/license` URL remains a compatible explanatory page, now directing users to the included camera action.
- The PWA asset and cache revision moved from v1 to v2, so an installed client receives the repaired app shell rather than continuing to serve the prior cached bundle.
- Claim inventory now covers the previously missing editable demo and browser-only/no-account privacy promises. The obsolete price/checkout claim was removed with the unsupported copy. `@regression:checkout-dead-link` proves the landing contains no Sociobot checkout URL and the scan action remains enabled.

## Verification

Run from a clean checkout:

```bash
npm ci
npm test
npm run build
```

Local evidence from 2026-08-28:

- `npm ci`: completed; `npm audit --omit=dev`: 0 vulnerabilities.
- Every one of the 12 commands in `.factory/claims.json` passed individually from the clean install.
- `npm test`: 22/22 Playwright tests passed in 20.1 s. This includes all claim tests, the dead-checkout regression, PWA v2 cache activation, desktop/browser-console checks, and the 390 × 844 keyboard/mobile check.
- `npm run build`: passed; `dist/index.html` exists. Initial app JavaScript is 10.26 KB gzip and CSS is 3.50 KB gzip. Camera code remains deferred at 108.68 KB gzip; barcode rendering remains deferred at 14.72 KB gzip.
- `@axe-core/playwright` found no serious or critical violations on `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, and `/license`. Each route has one `h1`, a `main`, an English language declaration, and no console errors. The standalone axe CLI could not launch its Selenium Chrome driver in this image; the in-suite Playwright axe integration is the documented equivalent and passed.
- `verify-url.sh` against the production build preview returned HTTP 200 with title, language, main landmark, one `h1`, no missing image alt text, no unlabeled buttons, and no console/page errors. Screenshots were visually checked at 1366 × 900 and 390 × 844; the mobile regression asserts no horizontal overflow and Tab reaches the skip link.
- Offline verification visits `/demo`, waits for the service-worker cache, switches Chromium offline, then edits and returns to sample cards. The v2 cache test confirms `barcode-intake-v2` and `/assets/app-v2.js` are precached.
- Privacy verification saves a real card containing a selected photo and supplier CSV, reloads it from IndexedDB, and records no cross-origin requests. The CSP now permits same-origin connections and forms only.

## Deployment and live verification

Deployed static `dist/` with the factory work-order configuration on 2026-08-28. Azure Static Web Apps deployment `d0a0877a-3e1f-4988-a87a-c448f5a0f324` succeeded to `https://barcode-intake-card.sociobot.in`.

- Live `GET /` and `GET /sw.js` return 200. The deployed shell references `app-v2.js`/`app-v2.css`; the live service worker declares `barcode-intake-v2` and its v2 precache list.
- SHA-256 matched local `dist/` for `index.html`, `sw.js`, `manifest.webmanifest`, `app-v2.js`, `app-v2.css`, `scanner-v2.js`, and `barcode-v2.js`.
- Live headers include HSTS, `nosniff`, strict-origin referrer policy, the camera-only permissions policy, and the same-origin-only CSP. The live rendered demo has one `h1`, one `main`, no console errors, no checkout/API links, a v2 cache entry, no 390 px overflow, working skip link, and offline demo edit navigation.
- Live `verify-url.sh` passed: 710 ms page load, English title/lang, main landmark, zero missing alt attributes, zero unlabeled buttons, and no page/console errors.
- Lighthouse 13.4.1 against the live site: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.6 s, CLS 0, TBT 0 ms.

## Known gap

There is intentionally no paid SKU in this release. Reintroducing a paid camera tier requires the factory to register and validate a product in the Sociobot billing catalogue first; only then should the documented hosted-checkout and verification integration be restored.
