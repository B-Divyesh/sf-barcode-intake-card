# Polish 6 — cumulative zero-finding repair map

**Repair commit:** `66b92f8420b519b87cf50e747cf116fca38a4f04`  
**Deployed release:** v1.0.11; service-worker cache `barcode-intake-v13`  
**Production URL:** <https://barcode-intake-card.sociobot.in>  
**Static deployment:** Azure Static Web Apps deployment `c95c1aea-5ad5-4223-8174-2030dd74a4c4`

## Evidence key

- Fresh clone `/tmp/barcode-intake-polish6-clean-w9DXb9` at `66b92f8`:
  `npm ci` passed with zero vulnerabilities, then all **18** exact commands in
  `.factory/claims.json` passed independently.
- Three consecutive local aggregate `npm test` runs passed **41/41** with
  zero retries. The deterministic camera fixture is included in all three.
- Production `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test`
  passed **41/41**. It covers claims, local-only request logging, offline
  navigation, PWA cache activation, camera cleanup/decoding, 390 px layout and
  targets, keyboard/focus/routing, HTTP 404, and axe integration.
- Cold production checks are recorded in
  `.factory/qa-artifacts/polish-6-live/live-check.json`: landing copy and
  `app-v13.js`, the direct `?demo=1` sandbox banner/reset/exit controls and
  three cards, Terms h1/title, HTTP 404, and the `/license` 301 all passed
  with no console or page error before the intentionally requested 404.
- `verify-url.sh` passed at production. Its report and cold screenshots are
  in `.factory/qa-artifacts/polish-6-live/verify/`. Live mobile Lighthouse is
  **99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO**; LCP
  1,603 ms, CLS 0, TBT 0. See `lighthouse-mobile-final.json`.

## Review findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the 45 px minimum for links and controls. | `visible controls meet the 44 pixel touch target at 390 pixels`; live `/privacy`; `cold-mobile.png`. |
| F-1-2 | Registered the printable character set and positively printed/decoded `PART A-12/3`. | `@claim:print-card`; live `/intake`; `cold-mobile.png`. |
| F-1-3 | Retained the reset/exit lifecycle in the demo-only store. | `@claim:demo-reset-exit`; live `/?demo=1`; `demo-mobile.png`. |
| F-1-4 | Retained one search flow for barcode, item, supplier, and location. | `@claim:search-cards`; live `/?demo=1`; `demo-mobile.png`. |
| F-1-5 | Retained complete JSON restore, including all fields, timestamps, and photo. | `@claim:json-backup`; live `/records`; production 41/41. |
| F-1-6 | Retained separate camera-start and decode-to-field tests. | `@claim:camera-ready`, `@claim:camera-scan`; live `/intake`. |
| F-1-7 | Retained sample wording without unsupported counts or subjective promises. | `@claim:demo-edit`; live `/?demo=1`; `demo-mobile.png`. |
| F-1-8 | Retained the shared-shell, metadata-complete HTTP 404. | `unknown documents return HTTP 404 with the designed recovery page`; live `/polish-6-cold-missing`; `404-mobile.png`. |
| F-1-9 | Replaced the remaining “every record” wording with “all cards.” | `landing and terms use the published item-card and supplier-CSV language`; live `/`; `cold-mobile.png`. |
| F-1-10 | Retained removal of decorative publication folios. | Cold live `/`; `cold-mobile.png`. |
| F-1-11 | Retained literal eyebrow “For mixed-stock intake.” | Cold live `/`; `cold-mobile.png`. |
| F-1-12 | Retained direct mixed-stock guidance without a figure label. | `landing preview shows only real item-card fields and plain guidance`; live `/`; `cold-mobile.png`. |
| F-1-13 | Retained literal “Preview an item card” heading. | `page basics and axe: /`; live `/`; `verify/screenshot-desktop.png`. |
| F-1-14 | Retained review-and-update-before-print guidance. | `@claim:demo-edit`, `@claim:print-card`; live `/?demo=1`. |
| F-1-15 | Retained print/CSV/JSON paths under the direct step heading. | `@claim:print-card`, `@claim:csv-export`, `@claim:json-backup`; live `/`. |
| F-1-16 | Retained literal “What this tool does not do.” | `page basics and axe: /`; live `/`; `cold-mobile.png`. |
| F-1-17 | Retained removal of the empty limits slogan. | `.factory/copy-audit.md`; cold live `/`. |
| F-1-18 | Retained “Scan barcodes with the camera.” | `@claim:camera-ready`, `@claim:camera-scan`; live `/intake`. |
| F-1-19 | Retained “Record an item” for the intake form. | `@claim:manual-intake`; live `/intake`; `cold-mobile.png`. |
| F-1-20 | Retained plain-language README opening. | `@claim:offline-reload`; README audit; live `/`. |
| F-1-21 | Retained “one item card per page.” | `@claim:print-card`; README audit; live print route. |
| F-1-22 | Retained removal of footer asset lore. | Cold live `/`; `verify/verify.json`. |
| F-1-23 | Replaced the remaining “supplier file” with “supplier CSV.” | `landing and terms use the published item-card and supplier-CSV language`; live `/`; `cold-mobile.png`. |
| F-2-1 | Retained deterministic decoded-barcode delivery to the production input. | `@claim:camera-scan`; live `/intake`; production 41/41. |
| F-2-2 | Retained “Page not found” in static and SPA error renderers. | 404 regression; live `/polish-6-cold-missing`; `404-mobile.png`. |
| F-3-1 | Retained HTTP 301 `/license` → `/intake`; route remains absent from sitemap. | `the retired license URL redirects to the intake form`; `live-license-headers.txt`; live `/license`. |
| F-3-2 | Retained free/no-account/no-checkout facts and claim. | `@claim:free-no-checkout`; live `/`; `cold-mobile.png`. |
| F-3-3 | Retained all four searchable fields in the mobile hint. | `@claim:search-cards`; live `/?demo=1`; `demo-mobile.png`. |
| F-3-4 | Retained external-site label for Param Factory. | `external Param Factory links say they leave the product`; live `/`; `verify/screenshot-mobile.png`. |
| F-4-1 | Retained preview fields that exist on saved item cards. | `landing preview shows only real item-card fields and plain guidance`; live `/`; `cold-mobile.png`. |
| F-4-2 | Retained removal of “Fig. 01.” | Preview regression; cold live `/`; `cold-mobile.png`. |
| F-4-3 | Retained the accurate build-command README wording. | `README calls npm run build a build command`; README. |
| F-5-1 | Retained per-history-entry scroll restoration and heading focus. | `browser Back and Forward restore each route scroll position and focus its heading`; live `/` ↔ `/intake`; production 41/41. |
| F-5-2 | Retained plain real/sample-storage wording. | `README explains privacy, offline use, and deployment in plain language`; README. |
| F-5-3 | Retained observable offline wording. | `@claim:offline-reload`; README; live `/?demo=1`. |
| F-5-4 | Retained direct deployment-configuration wording. | `README explains privacy, offline use, and deployment in plain language`; README. |
| F-6-1 | Expanded `print-card` claim and test to accept and decode English letters, digits, space, and punctuation. | `@claim:print-card`; live `/intake`; `cold-mobile.png`. |
| F-6-2 | Rewrote the landing export sentence to use **item card/cards** throughout. | `landing and terms use the published item-card and supplier-CSV language`; live `/`; `cold-mobile.png`. |
| F-6-3 | Rewrote the landing lookup sentence to use **supplier CSV** throughout. | `landing and terms use the published item-card and supplier-CSV language`; live `/`; `cold-mobile.png`. |
| F-6-4 | Renamed the terms h1 to “Terms for using Barcode Intake Card.” | `landing and terms use the published item-card and supplier-CSV language`; live `/terms`; `terms-mobile.png`. |
| F-6-5 | Added a delayed deterministic `MediaStream` fixture; readiness is asserted only after a live video track, and both Escape and route teardown end it. | `camera tracks end after Escape and route teardown`; three local 41/41 runs; production 41/41. |

## Historical independent-verification findings

| Finding | Current protection | Evidence |
| --- | --- | --- |
| Dead camera checkout / incomplete claims | The product is free and every public claim is listed exactly once. | `@claim:free-no-checkout`; fresh clone 18/18 exact commands; live `/`. |
| Blank printable barcode | Code 128 is decoded from the rendered canvas; unsupported legacy values get recovery UI. | `@claim:print-card`, `@regression:barcode-render-error`; live print route. |
| Camera tracks survive Escape | The delayed stream fixture verifies track ownership, Escape cleanup, and route teardown. | `camera tracks end after Escape and route teardown`; production 41/41. |
| Corrupt photo / undersized controls / HTTP-200 unknown page | Announced recovery, 44 px targets, and true 404 remain covered. | Corresponding photo, touch-target, and 404 regressions; `404-mobile.png`. |
| Invalid backup / unsupported code / demo changes survive exit | Atomic validation, print recovery, and demo cleanup remain covered. | `@regression:backup-validation`, `@claim:print-card`, `@claim:demo-reset-exit`. |
| Mobile LCP budget | Responsive hero discovery remains in the initial document. | `@regression:mobile-lcp`; live Lighthouse LCP 1,603 ms. |

No review or historical-verification finding remains unresolved.
