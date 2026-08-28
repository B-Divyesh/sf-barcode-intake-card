# Independent verification 3 — FAIL

**Candidate:** `db64420e3965dd8e8502729fa15783f3a9e80a09`

**URL:** <https://barcode-intake-card.sociobot.in>

**Run:** 2026-08-28 from a clean candidate checkout

## Verdict

**FAIL — do not release.** The live deployment is byte-identical to the candidate build and the mandatory opening gate passes, but invalid backup input can persistently break the product, accepted barcode/SKU input can produce a blank printable barcode, and demo edits are not discarded when the user starts for real.

## Release-blocking findings

### P1 — A partially shaped backup is accepted and persistently breaks the card ledger

The importer validates only `id`, `barcode`, and `name` before writing every object to IndexedDB. I imported this representative invalid backup in a fresh live browser:

```json
{
  "version": 1,
  "items": [
    {"id": "bad-a", "barcode": "BAD-A", "name": "Missing fields A"},
    {"id": "bad-b", "barcode": "BAD-B", "name": "Missing fields B"}
  ]
}
```

The page reported **“2 cards imported. Refreshing the list.”** It then raised `Cannot read properties of undefined (reading 'localeCompare')` because `getItems()` assumes `updatedAt` exists. Reloading `/records` raised the same exception and left only the skip link rendered. The invalid records remain in IndexedDB, and the product provides no way to delete or repair them.

This is a persistent data-integrity and recovery failure in a core import path. The relevant checks are at `src/main.ts:357-370`; the later unsafe sort is at `src/db.ts:34-36`.

Evidence: [accepted invalid backup](qa-evidence/live-invalid-backup-accepted.png) and [broken state after reload](qa-evidence/live-invalid-backup-after-reload.png).

Required fix: validate the complete backup schema and version before any write, make the import atomic, reject or normalize invalid values, and add a regression test proving an invalid backup leaves existing data and the UI intact.

### P1 — Accepted barcode/SKU text can produce a blank print card

The intake field says to use any letters or numbers and applies no supported-character validation. In a fresh live context I saved barcode/SKU `部品-１２３`. Saving succeeded and opened the print route, but Code 128 rendering failed. The canvas remained its blank default: `300 × 150`, `0` opaque pixels, and `0` dark pixels. Only its accessibility label changed to `Barcode image unavailable. Code 部品-１２３`; no visible error or recovery action was shown.

This contradicts the `print-card` claim and breaks the brief's printable one-up card for input the UI accepts. The renderer catches and hides the failure at `src/main.ts:378-387`.

Evidence: [blank barcode on the live print card](qa-evidence/live-unsupported-barcode.png).

Required fix: constrain and explain the supported Code 128 character set before save, or select a symbology that can encode the scanned value. Show a visible, announced error and add boundary tests to the claim.

### P2 — “Start for real” does not discard demo edits

I changed the first demo card's notes to `Verifier edit that should be discarded when demo ends`, chose **Start for real**, then reopened `/demo`. The edited note was still present. The demo uses a separate database, so real cards remain safe, but the attached demo contract requires leaving demo mode to discard demo data unless the user explicitly keeps it.

The action only navigates to `/intake` at `src/main.ts:409-410`; it does not clear the demo database.

Required fix: clear and reseed `barcode-intake-demo` when leaving, or explicitly offer to keep the demo once. Add an exit/re-entry regression test.

## Mandatory opening gates

### Claims

`.factory/claims.json` exists. Before broader QA, all 15 listed commands were run individually and exactly as written. All passed:

`offline-reload`, `local-only`, `manual-intake`, `duplicate-review`, `csv-lookup`, `csv-export`, `search-cards`, `json-backup`, `print-card`, `demo-isolated`, `demo-edit`, `camera-ready`, `photo-reduction`, `no-web-lookup`, and `no-purchase-orders`.

Each invocation ran its own production build and one tagged Playwright test. The broad `print-card` claim is nevertheless disproved by the accepted Unicode boundary case above; the authored test covers only the numeric sample.

A cross-check of the live landing copy and README found no additional unmapped functional claim.

### Cold first read

The cold live first screen passes on desktop and at `390 × 844`:

- What it does: **“Turn scans into item cards.”**
- For whom: **“For small sellers and workshops receiving mixed stock without a full inventory system.”**
- What to click: **“Try it with sample data.”** The adjacent sentence explains that it opens three cards to search, edit, and print.
- All required copy and three plain facts ended at `604 px`, within the initial `844 px` mobile viewport.
- One keyboard-activated click opened three realistic cards and the persistent demo banner with Reset and Start for real actions.

Evidence: [desktop first read](qa-evidence/live-first-read-desktop.png), [mobile first read](qa-evidence/live-first-read-mobile.png), and [mobile demo](qa-evidence/live-demo-mobile.png).

## Evidence that passed

### Clean install, build, and repository tests

- `npm ci`: passed; 29 packages installed.
- `npm audit` and `npm audit --omit=dev`: 0 vulnerabilities.
- `npm test`: 29/29 Playwright tests passed in 47.5 seconds.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed and produced `dist/`. No lint script is configured.
- Build output: app JS 30.53 KB raw / 10.56 KB gzip; CSS 11.85 KB raw / 3.57 KB gzip; deferred barcode code 14.72 KB gzip; deferred scanner 108.68 KB gzip. Total shipped JS is under 200 KB gzip, with only the app chunk initially executed.
- Barcode libraries are pinned and MIT-licensed: `@zxing/browser@0.1.5` and `jsbarcode@3.12.1`.

### Independent end-to-end behavior

Fresh live contexts passed:

- empty required fields and quantity `-1` were blocked by named browser validation;
- a CSV without a barcode-like column produced a recovery message;
- a quoted CSV row containing commas populated name, supplier, location, and quantity `0`;
- non-image and corrupt-image inputs produced specific recovery messages; a valid photo persisted as JPEG;
- save, full reload, supplier search, CSV download, JSON download, delete cancellation, and confirmed deletion worked;
- a 30-card dataset rendered in 590 ms, searched to one result, exported 31 CSV rows, and had no 390 px overflow;
- a generated fake-camera Code 128 feed was decoded as `5901234123457`; the dialog closed, capture stopped, focus returned, and no browser error occurred;
- denied camera access showed a manual-entry recovery path;
- the normal printable sample produced a two-color canvas and a decodable Code 128 value.

### Privacy, requests, and server applicability

- The complete live demo/CSV/photo/save/export/camera flow made 21 requests, all same-origin GETs. There were zero cross-origin requests, mutations, analytics calls, console errors, or page errors.
- Source inspection found no account, sync, billing, analytics, AI, or third-party runtime integration. System fonts are used; no remote fonts or scripts load.
- The CSP restricts scripts, styles, connections, objects, forms, and frames to the expected origins. HTTPS redirect, HSTS, `nosniff`, strict-origin referrer policy, and camera-only permissions policy are present.
- Versioned assets return `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and service worker use a 30-second revalidation policy.
- This is a static PWA with no product or unlock API endpoint. API rate-limit, backend concurrency/health, and Entra sign-in checks are not applicable. No sign-in exists.

### PWA behavior

- The live service worker controlled the page, cache `barcode-intake-v3` existed, and the manifest and app shell were cached.
- After Chromium went offline, a full `/demo` reload, edit navigation, and back navigation retained all three sample cards with zero errors.
- An isolated same-build v3 → QA-v4 worker update produced **“An update is ready. Reload now”**. Reload activated the new worker, removed the v3 cache, retained three demo cards, and produced zero errors.
- The manifest has standalone display, a versioned start URL, matching theme/background colors, valid 192/512 icons, and a maskable 512 icon.

### Accessibility, responsive behavior, and links

- Independent live axe scans at `390 × 844` on `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, `/print/demo-bearing?demo=1`, and the designed 404 found no serious or critical findings; in fact, axe reported no violations.
- All real routes had one `h1`, one `main`, `lang=en`, route-specific titles, zero horizontal overflow, no small visible targets, and no console/page errors.
- The skip link is first in tab order. Its focus ring is 3 px and has 6.24:1 contrast against the paper background. Text contrast checks ranged from 5.86:1 to 17.65:1.
- Reduced motion changed page and scanner animation duration to `0.01 ms`, one iteration, fixed the scan line, and disabled smooth scrolling.
- A 200% zoom check at 1280 px retained the full layout without horizontal overflow.
- Every discovered internal link and the external Param Factory link returned 200; the privacy mail link is explicit.
- Factory `verify-url.sh` passed with one `h1`, one `main`, `lang=en`, no missing image alternatives, no unlabeled buttons, and no errors. Evidence: [verify report](qa-evidence/verify-live/verify.json).

### Performance and deployment identity

- Lighthouse 13.4.1 mobile: Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.7 s, TBT 180 ms, CLS 0. Evidence: [raw Lighthouse report](qa-evidence/lighthouse-live.json).
- Initial transfer was 153.7 KB total: 10.7 KB script, 3.7 KB CSS, and 134.4 KB hero image. No font or third-party transfer occurred.
- All 20 served build files matched local `dist/` byte-for-byte by SHA-256, including the app/CSS/scanner/barcode bundles, service worker, manifest, icons, images, static pages, robots, and sitemap. The live deployment therefore matches candidate `db64420e3965dd8e8502729fa15783f3a9e80a09`.
- `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, and the sample print route return 200. `/does-not-exist` returns the designed page with HTTP 404.

## Required next steps

1. Make JSON import fully schema-validated and atomic, preserve existing data on rejection, and add invalid-shape/version/type regression coverage.
2. Validate printable barcode/SKU input or support its full accepted character range; expose rendering failure visibly and strengthen `@claim:print-card`.
3. Make Start for real discard/reset demo state or offer an explicit keep action, then test exit and re-entry.
4. Deploy the repaired build and request a fresh independent verification.
