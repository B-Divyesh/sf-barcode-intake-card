# Handoff — Barcode Intake Card v1.0.0

## What shipped

- Offline-first Vite + TypeScript PWA with a versioned service-worker cache and install manifest.
- Manual barcode intake with required item name and location, supplier, quantity, notes, and locally reduced photos.
- Licensed camera scanning through the MIT-licensed ZXing browser package. Manual entry remains free.
- User-chosen supplier CSV matching, including clear malformed-file errors.
- Duplicate barcode candidates with a review link and the choice to save a separate card.
- IndexedDB card storage, searchable records, CSV export, JSON backup/import, deletion confirmation, and one-up Code 128 print cards.
- Isolated `/demo` with three realistic records, persistent demo banner, reset, and a clean exit to real data.
- $19 one-time camera license checkout, return-token storage, daily-cached Sociobot verification, and restore form.
- Product-specific monochrome broadsheet layout, responsive generated hero, social card, PWA icons, 404, privacy, and terms pages.

## Verification

Run from a clean clone:

```bash
npm install
npm test
npm run build
```

Latest local results on 2026-08-28:

- `npm test`: 20 passed in 18.0 seconds.
- Claim coverage: offline use, local-only demo flow, free manual intake, CSV matching, CSV export, print barcode, demo isolation, and camera startup.
- Axe: no serious or critical violations on `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, or `/license`.
- Mobile: 390 × 844 px has no horizontal overflow; keyboard skip-link path passes.
- Console: no errors on the seven tested routes.
- `npm audit`: 0 vulnerabilities.
- `npm run build`: passes; `dist/index.html` exists.
- Build size: initial JS 11.06 KB gzip; CSS 3.51 KB gzip; scanner 108.68 KB gzip on demand; barcode renderer 14.72 KB gzip on demand; mobile hero 47 KB.
- Lighthouse 12.8.2, mobile defaults against the production preview: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 2.0 s, TBT 0 ms, CLS 0.

The offline claim waits for the cached shell, switches Chromium offline, then edits and returns to demo records without a network connection.

## Known gaps

- Camera scanning needs HTTPS or localhost and a browser that grants camera access. Manual entry is always available.
- The live billing checkout and a paid license token were not exercised in automated tests. The verifier uses the documented Sociobot production endpoints.
- Data has no cloud sync by design. Users must export a JSON backup before clearing browser storage or moving devices.

## Next steps

- Register the `barcode-intake-card` product and its $19 price in the Sociobot billing catalogue before launch.
- Run one checkout and license-restore smoke test against the registered product.
- Deploy only `dist/`; the factory owns DNS and infrastructure.
