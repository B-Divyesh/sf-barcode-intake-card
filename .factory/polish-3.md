# Polish 3 — complete cumulative repair map

**Repair commits:** `f0244ec840bdaa4e91279a8234be3d5be72ca2a1` and `87722545784a6066a50a35809372475fce71a7ad`  
**Live release:** <https://barcode-intake-card.sociobot.in> (v1.0.8)  
**Live evidence:** `.factory/qa-evidence/polish-3-live/`

The initial v1.0.7 repair closed the four review-3 findings. The final v1.0.8
cache-busted stylesheet gives the longer demo search hint its own mobile row so
every searchable field is actually visible at 390 px. Both releases were
deployed through the static work-order deployment.

## Adversarial review findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the 45 px minimum for links and controls, including the Privacy email link. | `visible controls meet the 44 pixel touch target at 390 pixels`; live `/privacy`; `screenshot-mobile.png`. |
| F-1-2 | Kept explicit printable-code guidance and browser validation for English letters, numbers, spaces, and standard punctuation. | `@claim:print-card`; live `/intake`; full live suite. |
| F-1-3 | Kept the registered Reset/Start-for-real lifecycle claim and its isolated-storage implementation. | `@claim:demo-reset-exit`; live `/?demo=1`; `demo-mobile.png`. |
| F-1-4 | Kept four-field search coverage for barcode, item, supplier, and location. | `@claim:search-cards`; live `/?demo=1`; `demo-mobile.png`. |
| F-1-5 | Kept complete, atomic backup validation and field/photo restoration coverage. | `@claim:json-backup`; `@regression:backup-validation`; live `/records`. |
| F-1-6 | Kept separate camera-start and deterministic decode-to-field claims. | `@claim:camera-ready`; `@claim:camera-scan`; live `/intake`. |
| F-1-7 | Kept demo copy free of an unsupported count and subjective wording. | `@claim:demo-edit`; live `/?demo=1`; `demo-mobile.png`. |
| F-1-8 | Kept the designed HTTP 404 with shared header/footer, skip link, metadata, icons, and recovery action. | `unknown documents return HTTP 404 with the designed recovery page`; live `/polish-3-missing`; `404-mobile.png`. |
| F-1-9 | Kept “item card” as the output term in titles, metadata, and product copy. | `page basics and axe: /`; live `/`; `verify.json`. |
| F-1-10 | Decorative publication labels remain removed. | Cold live landing check; `landing-desktop.png`. |
| F-1-11 | Kept the literal eyebrow “For mixed-stock intake.” | Live `/`; `screenshot-mobile.png`. |
| F-1-12 | Kept direct mixed-stock guidance in the image caption. | Live `/`; `screenshot-desktop.png`. |
| F-1-13 | Kept the literal “Preview an item card” heading. | `page basics and axe: /`; live `/`. |
| F-1-14 | Kept review-before-print guidance. | `@claim:demo-edit`; `@claim:print-card`; live `/demo`. |
| F-1-15 | Kept “Print or export the card” and both export paths. | `@claim:print-card`, `@claim:csv-export`, `@claim:json-backup`; live `/`. |
| F-1-16 | Kept the plain “What this tool does not do” section heading. | `page basics and axe: /`; live `/`. |
| F-1-17 | The empty limits slogan remains absent. | Copy audit; live `/`. |
| F-1-18 | Superseded the former preview wording with “Scan barcodes with the camera.” | `@claim:camera-ready`; `@claim:camera-scan`; live `/`. |
| F-1-19 | Kept “Record an item” and the intake-form destination. | Live `/intake`; `@claim:manual-intake`. |
| F-1-20 | Kept README plain language without “offline-first” or the receiving-desk metaphor. | README review; `@claim:offline-reload`. |
| F-1-21 | Kept “one item card per page” in the README. | `@claim:print-card`; README review. |
| F-1-22 | Kept footer asset lore removed; provenance remains in `design.md`. | Live footer; `verify.json`. |
| F-1-23 | Kept “supplier CSV” as the one lookup-file term. | `@claim:csv-lookup`; live `/intake`. |
| F-2-1 | Kept the listed deterministic camera-decoding claim for every public scan promise. | `@claim:camera-scan`; live `/intake`; full live suite. |
| F-2-2 | Kept “Page not found” in both SPA and static 404 renderers. | 404 regression; live `/polish-3-missing`; `404-mobile.png`. |
| F-3-1 | Removed `/license` from the sitemap and app route; old visits now return HTTP 301 to `/intake`. | `the retired license URL redirects to the intake form`; `curl` live `/license` → `301 Location: /intake`. |
| F-3-2 | Replaced ambiguous “included” copy with “Free to use — no account or checkout” and “Camera scanning, manual entry, and exports are free to use”; added the `free-no-checkout` claim. | `@claim:free-no-checkout`; live `/`; `screenshot-mobile.png`. |
| F-3-3 | Added supplier to the search hint and made the search field full-width on phones so the complete hint is visible. | `@claim:search-cards` asserts the exact placeholder; live `/?demo=1`; `demo-mobile.png`. |
| F-3-4 | Labeled the footer destination “Built by Param Factory (external site)” on app and static 404 pages. | `external Param Factory links say they leave the product`; live `/`, `/privacy`, `/terms`, and 404; `404-mobile.png`. |

## Independent-verification findings retained and rechecked

| Finding | Current protection | Evidence |
| --- | --- | --- |
| Verification 3 P1 — incomplete backup breaks records | Complete schema/version/type validation runs before one atomic transaction; old incomplete records sort safely. | `@regression:backup-validation rejects bad shape, version, and types without changing stored cards`; live full suite. |
| Verification 3 P1 — accepted code can print blank | The intake form rejects unsupported scripts, and legacy records show an announced print recovery path. | `@claim:print-card`; `@regression:barcode-render-error`; live `/intake`. |
| Verification 3 P2 — demo edits survive exit | Start for real clears the demo namespace before real intake opens; a later demo seeds clean samples. | `@claim:demo-reset-exit`; live `/?demo=1`. |
| Verification 4 High — mobile LCP budget | Preserved responsive high-priority hero discovery and checked two new mobile Lighthouse runs. | `@regression:mobile-lcp`; `lighthouse-mobile.json` LCP 1.210 s and `lighthouse-mobile-repeat.json` LCP 1.099 s. |

## Final evidence

- Fresh final clone: `/tmp/barcode-intake-card-polish3-final-clean`; `npm ci` passed with zero audit vulnerabilities.
- Every exact test command in `.factory/claims.json` ran individually from that clone: **18/18 passed**.
- Final clean-clone `npm test`: **36/36 passed**. It builds `dist/` and covers claims, data recovery, demo isolation, camera behavior, offline/PWA, mobile, keyboard, 404, and axe integration.
- Final production run: `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npx playwright test`: **36/36 passed**.
- `/opt/fleet/lib/verify-url.sh` passed live with no console errors, one `h1`, one `main`, `lang="en"`, zero missing image alternatives, and zero unnamed buttons.
- Live Lighthouse 13.4.1 mobile runs: **100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO** twice; LCP 1.210 s and 1.099 s, CLS 0.

No review or verification finding remains unresolved.
