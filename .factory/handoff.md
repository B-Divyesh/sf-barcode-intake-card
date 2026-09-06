# Handoff — repair 5

## Result

**Repair complete and deployed.** F-8-1 is fixed at its source. The action
outcome and each privacy, offline, and price fact now render at 16 px on phone
and desktop. The wording, product scope, demo boundary, and real-data behavior
did not change.

An outcome-based browser regression measures the computed size of all four
required text elements, their visibility, first-viewport fit, and horizontal
overflow at 390 × 844 and 1440 × 900.

## Product and deployment versions

- Live URL: <https://barcode-intake-card.sociobot.in>
- Deployed implementation: `bf59246e4f9f8682c21fb4f80a931fb560e2dba1`
- Prior documentation baseline: `141c672c068917b7bfb32f9dc91b077bbfc6dbe3`
- Documentation/evidence update: the commit containing this handoff; its SHA is
  reported separately because a commit cannot contain its own identifier.
- Release: v1.0.12, `app-v14`, service-worker cache `barcode-intake-v14`
- Static deployment: `1df23e0b-d943-4414-9e92-da880ce8d5e1`

All 20 served runtime files match the clean candidate build byte for byte.
Later documentation commits do not require a new product image.

## Verification completed

- Clean clone: `/tmp/barcode-intake-repair5-clean-UZjlmk/repo`.
- `npm ci` passed with zero audit vulnerabilities.
- All 18 exact commands in `.factory/claims.json` passed independently.
- Clean `npm test`: 42/42 passed. `npm run build` passed and produced
  `dist/index.html`.
- Production-backed `npm test`: 42/42 passed.
- Factory URL verification passed live with one h1, one main, `lang=en`, image
  alternatives, named buttons, and no console or page errors.
- Standalone axe CLI found zero violations on the live root. Settled route axe
  checks found no serious or critical violation on `/`, `/demo`, `/intake`,
  `/records`, `/privacy`, `/terms`, sample print, or the designed 404.
- Fresh mobile Lighthouse: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.92 s, LCP 1.22 s, CLS 0, TBT 0 ms.
- Initial app JavaScript is 11.36 KB gzip and CSS is 3.58 KB gzip. Scanner and
  barcode code remain deferred.

## Cold browser results

- At 390 × 844, all required copy is 16 px and ends at 666 px. At 1440 × 900,
  it ends at 791 px. Neither page has horizontal overflow.
- A 640 CSS px reflow check, equivalent to a 1280 px desktop at 200% browser
  zoom, retained the action and facts with no horizontal overflow.
- The first screen names the job, small-seller/workshop audience, and sample
  action before scrolling.
- One click opened three populated workshop cards. The demo banner persisted
  through list, edit, and print routes. Reset restored the original bearing
  note. Start for real left an empty real card list and removed the banner.
- The full walkthrough made no cross-origin request and changed no persistent
  real data outside its fresh browser context.

## Normal, boundary, and recovery results

- Empty required fields focus the barcode field and announce the browser's
  validation message.
- Unsupported script and quantity `-1` remain on intake with recovery text;
  quantity `0` saves and prints.
- A malformed supplier CSV, corrupt photo, denied camera, and invalid backup
  each produce a specific recovery message. Invalid backup input leaves the
  saved card intact.
- Delete cancellation keeps the named card; confirmation removes it and shows
  the empty state.
- Offline reload, service-worker cache activation, update-ready behavior,
  keyboard flow, focus return, Back/Forward position, reduced motion, and
  44 px controls passed in the clean and live suites.
- `/privacy` and `/terms` return 200 with route titles and shared structure.
  The tested missing route intentionally returns HTTP 404, and retired
  `/license` intentionally returns 301 to `/intake`.

## Earlier findings

Every earlier review and verification finding was rechecked through the clean
and production suites plus fresh browser paths:

- F-1-1 through F-1-23 remain fixed: target sizes, claims, demo lifecycle,
  search/backup coverage, camera coverage, 404 structure, plain wording, and
  consistent item-card and supplier-CSV terms all pass.
- F-2-1 through F-6-5 remain fixed: decoded scanning, literal 404 copy, retired
  license routing, free-use wording, mobile search guidance, external-link
  labeling, faithful preview fields, route scroll restoration, README wording,
  printable character coverage, Terms heading, and deterministic camera
  cleanup all pass.
- Independent-verification findings remain fixed: CSP-safe decodable print,
  camera teardown, registered photo/lookup/order claims, corrupt-photo
  recovery, true HTTP 404, atomic backup rejection, unsupported-code recovery,
  demo exit isolation, and mobile LCP below 2.5 seconds.
- F-8-1 is fixed by the new computed-rendering regression and the live 16 px
  measurements above. No current finding remains open.

## Evidence

Evidence is under `/work/.evidence/` with the prefix
`barcode-intake-card-repair-5`, including claim, local/live suite, axe,
Lighthouse, cold-browser, recovery, header, screenshot, and runtime-hash
results. The catalog description is copied there as required.

## How to verify

```bash
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test
```

Run every command in `.factory/claims.json` separately from a clean checkout.

## Remaining limitations

This is a static, local-first PWA. Backend tenant, restart, health, rate-limit,
and installed-package checks do not apply. Clearing browser storage removes
cards unless the user exported a JSON backup, as the product discloses.

The researched brief proposed one-time monetization, but there is no registered
or advertised live paid offer. The current product is accurately free. This
repair did not change entitlements, remove a paid deliverable, or invent a
price, so no billing-offer evidence file is applicable.
