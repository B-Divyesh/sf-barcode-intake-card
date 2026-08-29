# Polish 4 — cumulative zero-finding repair map

**Repair commits:** `0e04afd20620e8ada252a77defcf1c9d1d67e374`, `d9a3968b2b0fd86a7eed974178af9ee577b72405`  
**Deployed release:** v1.0.9, service-worker cache `barcode-intake-v11`  
**Production URL:** <https://barcode-intake-card.sociobot.in>  
**Deployment:** Static work order, Azure deployment `85b6cfe6-ee3e-4e7d-b3b0-c9d7c623eddb`

## Final evidence key

- Final clean clone: `/tmp/barcode-intake-polish4-final-clean-T7hoc9` at
  `d9a3968`; `npm ci` passed, every one of the 18 exact commands in
  `.factory/claims.json` passed individually, and final `npm test` passed
  **38/38**. `test-results/.last-run.json` records `"status": "passed"`.
- Work-order build command `npm ci && npm test && npm run build` passed in the
  repair checkout. The final bundle is `app-v11.js` 32.62 KB raw / 11.02 KB
  gzip, CSS is 11.76 KB raw / 3.58 KB gzip, and deferred scanner/barcode code
  remains lazy.
- The full production suite passed **38/38** with
  `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test`.
- `/opt/fleet/lib/verify-url.sh` passed live: one h1, main landmark,
  `lang=en`, a title, no missing image alternatives, no unnamed buttons, and
  no page or console errors. See
  `.factory/qa-artifacts/polish-4-live-verify/verify.json`.
- Live mobile Lighthouse 13.4.1: Performance **100**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 0.905 s, LCP 1.078 s, TBT 0 ms,
  CLS 0. See `.factory/qa-artifacts/lighthouse-polish-4-live-mobile.json`.
- Fresh evidence screenshots: `polish-4-live-desktop.png`,
  `polish-4-live-mobile.png`, `polish-4-live-demo-mobile.png`, and
  `polish-4-live-404-mobile.png` in `.factory/qa-artifacts/`.

## Adversarial review findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the 45 px minimum for every ordinary link and control, including the Privacy email link. | `visible controls meet the 44 pixel touch target at 390 pixels`; live 38/38; `/privacy`; `polish-4-live-mobile.png`. |
| F-1-2 | Kept printable-code guidance and validation limited to English letters, numbers, spaces, and punctuation. | `@claim:print-card`; live `/intake`; `polish-4-live-mobile.png`. |
| F-1-3 | Kept Reset demo and Start for real as one registered lifecycle claim in the isolated demo namespace. | `@claim:demo-reset-exit`; live `/?demo=1`; `polish-4-live-demo-mobile.png`. |
| F-1-4 | Kept the one search claim covering barcode, item, supplier, and location. | `@claim:search-cards`; live `/demo`; `polish-4-live-demo-mobile.png`. |
| F-1-5 | Kept backup validation and exact restoration of all fields, timestamps, and photo data. The claim now waits for the actual saved-card result before exporting, removing a clean-suite race. | `@claim:json-backup`; live `/records`; final clean clone 18/18. |
| F-1-6 | Kept separate tests for camera-start timing and decoded barcode delivery to the production barcode field. | `@claim:camera-ready`, `@claim:camera-scan`; live `/intake`. |
| F-1-7 | Kept demo copy free of an unsupported item count and subjective wording. | `@claim:demo-edit`; live `/?demo=1`; `polish-4-live-demo-mobile.png`. |
| F-1-8 | Kept the shared, metadata-complete static 404 with recovery action and HTTP 404 status. | `unknown documents return HTTP 404 with the designed recovery page`; live `/polish-4-missing` returned 404; `polish-4-live-404-mobile.png`. |
| F-1-9 | Kept “item card” as the output term in title, metadata, headings, and footer. | `page basics and axe: /`; live `/`; `polish-4-live-desktop.png`. |
| F-1-10 | Kept the old decorative publication folios removed. | Cold live `/`; `polish-4-live-mobile.png`. |
| F-1-11 | Kept the literal hero eyebrow “For mixed-stock intake.” | Cold live `/`; `polish-4-live-mobile.png`. |
| F-1-12 | Retained direct mixed-stock guidance and, in this round, removed the remaining decorative figure prefix. | `landing preview shows only real item-card fields and plain guidance`; live `/`; `polish-4-live-mobile.png`. |
| F-1-13 | Kept the literal section heading “Preview an item card.” | `page basics and axe: /`; live `/`; `polish-4-live-desktop.png`. |
| F-1-14 | Kept direct review-before-print guidance. | `@claim:demo-edit`, `@claim:print-card`; live `/demo`; `polish-4-live-desktop.png`. |
| F-1-15 | Kept the result-naming third step “Print or export the card.” | `@claim:print-card`, `@claim:csv-export`, `@claim:json-backup`; live `/`; `polish-4-live-mobile.png`. |
| F-1-16 | Kept the literal limits heading “What this tool does not do.” | `page basics and axe: /`; live `/`; `polish-4-live-desktop.png`. |
| F-1-17 | Kept the empty limits slogan absent. | Landing copy audit; live `/`; `polish-4-live-mobile.png`. |
| F-1-18 | Kept the direct camera section heading “Scan barcodes with the camera.” | `@claim:camera-ready`, `@claim:camera-scan`; live `/`; `polish-4-live-desktop.png`. |
| F-1-19 | Kept “Record an item” as the consistent action to the intake form. | `@claim:manual-intake`; live `/intake`; `polish-4-live-mobile.png`. |
| F-1-20 | Kept README plain language without “offline-first” or the receiving-desk metaphor. | README audit; `@claim:offline-reload`; live `/`. |
| F-1-21 | Kept README’s “one item card per page” wording. | README audit; `@claim:print-card`; live print route. |
| F-1-22 | Kept decorative asset-lore out of the footer; provenance stays in `design.md`. | Footer check; live `/`; `polish-4-live-mobile.png`. |
| F-1-23 | Kept “supplier CSV” as the sole lookup-file term. | `@claim:csv-lookup`; live `/intake`; `polish-4-live-desktop.png`. |
| F-2-1 | Kept the registered deterministic barcode-decoding test and its matching public copy. | `@claim:camera-scan`; live `/intake`; production 38/38. |
| F-2-2 | Kept literal “Page not found” headings in SPA and static 404 renderers. | 404 regression; live `/polish-4-missing`; `polish-4-live-404-mobile.png`. |
| F-3-1 | Kept `/license` out of navigation and sitemap; old requests now redirect to `/intake`. | `the retired license URL redirects to the intake form`; live `/license` returned 301. |
| F-3-2 | Kept the first-screen free/no-account/no-checkout fact and matching camera/free-use wording. | `@claim:free-no-checkout`; live `/`; `polish-4-live-mobile.png`. |
| F-3-3 | Kept supplier in the mobile demo search hint. | `@claim:search-cards`; live `/?demo=1`; `polish-4-live-demo-mobile.png`. |
| F-3-4 | Kept the visible “(external site)” qualifier for the Param Factory footer link. | `external Param Factory links say they leave the product`; live `/`; `polish-4-live-mobile.png`. |
| F-4-1 | Replaced invented “INTAKE 0142” and “STATUS / Ready to review” preview content with “Sample item card” and the real Notes field “Check bore before restocking.” | `landing preview shows only real item-card fields and plain guidance`; cold live `/`; `polish-4-live-desktop.png`, `polish-4-live-mobile.png`. |
| F-4-2 | Removed “Fig. 01” from the hero caption. | `landing preview shows only real item-card fields and plain guidance`; cold live `/`; `polish-4-live-mobile.png`. |
| F-4-3 | Rewrote the maintainer instruction to “Build the deployable files with `npm run build`.” | `README calls npm run build a build command`; README at `d9a3968`; no production route applies to repository documentation. |

## Historical independent-verification findings

| Finding | Current protection | Evidence |
| --- | --- | --- |
| Verification P1: dead camera checkout / unregistered claims | There is no billing path; every public behavior is in the 18-entry claim inventory and each tag occurs exactly once. | `@claim:free-no-checkout`; final clean-clone tag audit; live `/`. |
| Verification 2 P1: blank printable barcode | Code 128 rendering is decoded in-browser; legacy unsupported codes expose a recovery path. | `@claim:print-card`, `@regression:barcode-render-error`; live print route. |
| Verification 2 P1: camera survives Escape | Scanner tracks stop on Escape and route teardown. | `camera tracks end after Escape and route teardown`; live 38/38. |
| Verification 2 P2: corrupt photo, undersized targets, HTTP-200 404 | Announced photo recovery, 44 px checks, and a designed HTTP 404 remain covered. | `corrupt photos show an announced recovery message`, touch-target test, 404 test; `polish-4-live-404-mobile.png`. |
| Verification 3 P1/P2: invalid backup, unsupported code, demo exit | Atomic backup validation, print recovery, and demo-namespace clearing remain covered. | `@regression:backup-validation`, `@claim:print-card`, `@claim:demo-reset-exit`; final clean clone. |
| Verification 4 High: mobile LCP | Retained early responsive hero discovery and verified repeated current performance. | `@regression:mobile-lcp`; live Lighthouse LCP 1.078 s; `lighthouse-polish-4-live-mobile.json`. |

No current or historical finding remains unresolved.
