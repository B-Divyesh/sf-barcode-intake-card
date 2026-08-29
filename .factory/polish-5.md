# Polish 5 — cumulative zero-finding repair map

**Repair commit:** `91971a28d2046cd00a0dd404551996d8b716a99c`  
**Deployed release:** v1.0.10, service-worker cache `barcode-intake-v12`  
**Production URL:** <https://barcode-intake-card.sociobot.in>  
**Static deployment:** Azure deployment `be2adbbb-209c-4b13-8f6b-8ecb1c111f1c`

## Evidence key

- Fresh clone `/tmp/barcode-intake-polish5-clean-Dti7Ez` at `91971a2`:
  `npm ci` passed; all 18 exact commands in `.factory/claims.json` passed
  independently; aggregate `npm test` passed **40/40**.
- The configured work-order command `npm ci && npm test && npm run build`
  passed in the deploy checkout. `dist/` contains `index.html`; initial app JS
  is 33.22 KB raw / 11.21 KB gzip and CSS is 11.76 KB raw / 3.58 KB gzip.
- Production `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test`
  passed **40/40**, including all claims, offline, privacy request checks, axe,
  mobile, routing, and the new Back/Forward test.
- Cold production verification passed at `/`: no console errors; title, lang,
  one h1, main, image alternatives, and button names are present in
  `.factory/qa-artifacts/polish-5-live/verify.json`. Cold screenshots are
  `screenshot-desktop.png` and `screenshot-mobile.png` in that directory.
- Live mobile evidence: `live-demo-mobile.png` proves the seeded isolated demo
  and persistent banner; `live-404-mobile.png` proves the designed 404. Root
  and 404 response headers are `live-headers.txt` and `live-404-headers.txt`.
- Live mobile Lighthouse: **100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO**; LCP 1,247 ms, CLS 0, TBT 1 ms. See
  `lighthouse-mobile.json` in the same directory.

## Review findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the 45 px minimum for ordinary links and controls, including Privacy email. | Live `visible controls meet the 44 pixel touch target at 390 pixels`; `/privacy`; `screenshot-mobile.png`. |
| F-1-2 | Retained explicit English-letter, number, space, and punctuation guidance and validation. | Live `@claim:print-card`; `/intake`; production 40/40. |
| F-1-3 | Retained the registered Reset demo/Start for real lifecycle and isolated demo storage. | Live `@claim:demo-reset-exit`; `/?demo=1`; `live-demo-mobile.png`. |
| F-1-4 | Retained one search flow that proves barcode, item, supplier, and location. | Live `@claim:search-cards`; `/demo`; `live-demo-mobile.png`. |
| F-1-5 | Retained exact backup restoration of every saved value and photo. | Live `@claim:json-backup`; `/records`; production 40/40. |
| F-1-6 | Retained separate camera-start and deterministic decode-to-field tests. | Live `@claim:camera-ready`, `@claim:camera-scan`; `/intake`. |
| F-1-7 | Retained sample wording without an unsupported count or subjective promise. | Live `@claim:demo-edit`; `/?demo=1`; `live-demo-mobile.png`. |
| F-1-8 | Retained shared, metadata-complete static 404 with HTTP 404 response. | Live `unknown documents return HTTP 404 with the designed recovery page`; `/polish-5-missing-page`; `live-404-mobile.png`, `live-404-headers.txt`. |
| F-1-9 | Retained **item card** as the one output term in title, metadata, and copy. | Live `page basics and axe: /`; `/`; `screenshot-desktop.png`. |
| F-1-10 | Retained removal of decorative publication folios. | Cold `/`; `screenshot-mobile.png`. |
| F-1-11 | Retained literal eyebrow **For mixed-stock intake**. | Cold `/`; `screenshot-mobile.png`. |
| F-1-12 | Retained the direct mixed-stock figure caption without a figure label. | Live `landing preview shows only real item-card fields and plain guidance`; `/`; `screenshot-mobile.png`. |
| F-1-13 | Retained literal heading **Preview an item card**. | Live `page basics and axe: /`; `/`; `screenshot-desktop.png`. |
| F-1-14 | Retained review-and-update-before-print guidance. | Live `@claim:demo-edit`, `@claim:print-card`; `/demo`. |
| F-1-15 | Retained **Print or export the card** and both export paths. | Live `@claim:print-card`, `@claim:csv-export`, `@claim:json-backup`; `/`. |
| F-1-16 | Retained literal heading **What this tool does not do**. | Live `page basics and axe: /`; `/`; `screenshot-mobile.png`. |
| F-1-17 | Retained removal of the empty limits slogan. | Cold `/`; `.factory/copy-audit.md`; `screenshot-mobile.png`. |
| F-1-18 | Retained direct heading **Scan barcodes with the camera**. | Live `@claim:camera-ready`, `@claim:camera-scan`; `/`. |
| F-1-19 | Retained **Record an item** and the intake-form destination. | Live `@claim:manual-intake`; `/intake`; `screenshot-mobile.png`. |
| F-1-20 | Retained plain-language README opening without offline-first or desk jargon. | README audit; live `@claim:offline-reload`; `/`. |
| F-1-21 | Retained README wording **one item card per page**. | README audit; live `@claim:print-card`; print route. |
| F-1-22 | Retained removal of footer asset lore; provenance remains in `design.md`. | Cold `/`; `verify.json`; `screenshot-mobile.png`. |
| F-1-23 | Retained **supplier CSV** as the sole lookup-file term. | Live `@claim:csv-lookup`; `/intake`; `live-demo-mobile.png`. |
| F-2-1 | Retained registered camera-decoding claim and deterministic production callback test. | Live `@claim:camera-scan`; `/intake`; production 40/40. |
| F-2-2 | Retained literal **Page not found** in SPA and static 404 renderers. | Live 404 regression; `/polish-5-missing-page`; `live-404-mobile.png`. |
| F-3-1 | Retained `/license` HTTP 301 redirect to `/intake` and absence from navigation/sitemap. | Live `the retired license URL redirects to the intake form`; `/license` → 301 `/intake`. |
| F-3-2 | Retained free/no-account/no-checkout fact and free-use copy. | Live `@claim:free-no-checkout`; `/`; `screenshot-mobile.png`. |
| F-3-3 | Retained supplier in the 390 px demo search hint. | Live `@claim:search-cards`; `/?demo=1`; `live-demo-mobile.png`. |
| F-3-4 | Retained visible **(external site)** qualifier on the Param Factory link. | Live `external Param Factory links say they leave the product`; `/`; `screenshot-mobile.png`. |
| F-4-1 | Retained preview fields that exist on real cards: item card, location, quantity, and notes. | Live `landing preview shows only real item-card fields and plain guidance`; `/`; `screenshot-desktop.png`. |
| F-4-2 | Retained removal of the decorative **Fig. 01** caption prefix. | Live preview regression; `/`; `screenshot-mobile.png`. |
| F-4-3 | Retained README language that calls `npm run build` a build command. | Live `README calls npm run build a build command`; README. |
| F-5-1 | Added per-history-entry `scrollY` state, manual browser scroll restoration, and focus with `preventScroll`; Back and Forward now restore each route’s reading position. | New live `browser Back and Forward restore each route scroll position and focus its heading`; `/` → `/intake` → Back/Forward; production 40/40. |
| F-5-2 | Replaced README database identifiers with **Your real cards and sample cards are stored separately in this browser.** | Live `README explains privacy, offline use, and deployment in plain language`; README; `/privacy`. |
| F-5-3 | Replaced service-worker jargon with the tested sentence **The app works offline after your first visit.** | Live README plain-language test and `@claim:offline-reload`; README; `/demo`. |
| F-5-4 | Replaced SPA/MIME jargon with direct deployment configuration wording. | Live README plain-language test; README; `/polish-5-missing-page` returns the designed 404. |

## Historical independent-verification findings

| Finding | Current protection | Evidence |
| --- | --- | --- |
| Verification 1 P1 — dead camera checkout | The product has no checkout path; camera scanning is free to use without an account. | Live `@claim:free-no-checkout`, `@claim:camera-scan`; `/intake`; `screenshot-mobile.png`. |
| Verification 1 P1 — incomplete claims | The inventory has 18 public claims, each with exactly one tagged sandbox test. | Fresh-clone 18/18 exact commands; production 40/40; `.factory/claims.json`. |
| Verification 2 P1 — solid barcode under CSP | Canvas Code 128 rendering is CSP-compatible and decoded in-browser. | Live `@claim:print-card`; `/print/demo-bearing?demo=1`; production headers. |
| Verification 2 P1 — Escape leaves camera live | Cancel, close, and route teardown stop every camera track and return focus. | Live `camera tracks end after Escape and route teardown`; `/intake`; production 40/40. |
| Verification 2 P1 — unlisted photo/lookup/order claims | Photo reduction, no automatic lookup, and no purchase order are each registered and tested. | Live `@claim:photo-reduction`, `@claim:no-web-lookup`, `@claim:no-purchase-orders`; `/intake`. |
| Verification 2 P2 — corrupt photo recovery | Invalid image bytes produce an announced recovery message. | Live `corrupt photos show an announced recovery message without an unhandled error`; `/intake`. |
| Verification 2 P2 — undersized controls | All visible controls are measured at least 44 px on every mobile route. | Live `visible controls meet the 44 pixel touch target at 390 pixels`; `screenshot-mobile.png`. |
| Verification 2 P2 — HTTP-200 unknown route | Static response override serves the designed HTTP 404. | Live 404 regression; `/polish-5-missing-page`; `live-404-headers.txt`, `live-404-mobile.png`. |
| Verification 3 P1 — invalid backup corrupts ledger | Full schema/version/type validation occurs before one atomic write; legacy incomplete cards sort safely. | Live `@regression:backup-validation`; `/records`; production 40/40. |
| Verification 3 P1 — accepted code prints blank | Unsupported scripts are rejected before save; legacy values receive an announced print recovery path. | Live `@claim:print-card`, `@regression:barcode-render-error`; `/intake`. |
| Verification 3 P2 — demo edits survive exit | Start for real clears only demo storage before opening real intake. | Live `@claim:demo-reset-exit`; `/?demo=1`; `live-demo-mobile.png`. |
| Verification 4 High — mobile LCP over budget | Responsive high-priority hero discovery remains in the initial document. | Live Lighthouse LCP 1,247 ms; `@regression:mobile-lcp`; `lighthouse-mobile.json`, `screenshot-mobile.png`. |

## Final acceptance notes

- The first-screen action remains a one-click `/?demo=1` sandbox. It opens
  sample cards immediately and its persistent banner provides Reset demo and
  Start for real; real and demo cards remain in separate databases.
- `.factory/claims.json` remains a complete 18-claim inventory. Each id has
  exactly one tagged browser test, and all exact commands passed from the
  fresh clone.
- The visual system remains the product’s monochrome workshop broadsheet:
  warm paper, ink rules, registration red, editorial type, original engraved
  receiving-desk art, and square print-sheet controls. No generic template or
  external asset/runtime data path was introduced.
- No review finding, historical regression, or known gap remains unresolved.
