# Adversarial first-read review 7 — Barcode Intake Card

**Verdict: PASS**  
**Reviewed:** 29 August 2026  
**Live URL:** <https://barcode-intake-card.sociobot.in>  
**Repository base:** `e9c83f3eb9fb45b77bd8b71e984319a357f19c5c`

There are zero findings. The checks below were rerun against the live site and
current code; this is not a diff-only acceptance.

## Cold first read

Fresh, storage-empty Chromium contexts opened the live root at 390 × 844 and
1440 × 900, without scrolling.

| Question | Result at both widths |
| --- | --- |
| What does it do? | “Turn scanned barcodes into item cards.” |
| For whom? | Small sellers and workshops receiving mixed stock. |
| What should I click first? | “Try it with sample data”; adjacent copy says it opens cards to search, edit, and print. |

The phone viewport contains the action, outcome sentence, and all three facts.
There is no overflow, console/page error, or cross-origin cold-load request.

## Copy audit

Counts treat URLs, code names, contractions, and hyphenated terms as one word.
Every visitor-facing sentence is at or below 22 words. No banned marketing
word, mood heading, unexplained metaphor, inconsistent product term, or
non-result action remains. Where an item makes a visitor-relevant promise, its
claim id is shown.

### Landing sentences

| # | Words | Copy | Result |
| ---: | ---: | --- | --- |
| 1 | 6 | Turn scanned barcodes into item cards | h1; pass |
| 2 | 12 | For small sellers and workshops receiving mixed stock without a full inventory system. | pass |
| 3 | 11 | It opens sample workshop cards you can search, edit, and print. | `demo-edit` |
| 4 | 5 | Cards stay in this browser | `local-only` |
| 5 | 6 | Works offline after the first visit | `offline-reload` |
| 6 | 7 | Free to use — no account or checkout | `free-no-checkout` |
| 7 | 15 | An engraved workshop desk with parts, a parcel, a scanner, and a blank intake card. | image alt |
| 8 | 9 | Record mixed stock before choosing a full inventory system. | pass |
| 9 | 9 | Review and update the item card before printing it. | pass |
| 10 | 5 | Check bore before restocking. | sample note |
| 11 | 11 | Scan a barcode, type the code, or match a supplier CSV. | camera/manual/CSV claims |
| 12 | 6 | Camera scanning fills the barcode field. | `camera-scan` |
| 13 | 10 | You can also type English letters, numbers, spaces, and punctuation. | `print-card` |
| 14 | 9 | Add its name, supplier, photo, quantity, and shelf location. | `manual-intake` |
| 15 | 12 | Print one item card, or export all cards as CSV or JSON. | print/export claims |
| 16 | 4 | No automatic web lookup. | `no-web-lookup` |
| 17 | 9 | Supplier and stock details do not leave your device. | `local-only` |
| 18 | 3 | No purchase orders. | `no-purchase-orders` |
| 19 | 3 | This records arrivals. | pass |
| 20 | 5 | It does not run procurement. | `no-purchase-orders` |
| 21 | 4 | No account or sync. | `local-only` |
| 22 | 11 | Export a file when you need a backup or another system. | `json-backup` |
| 23 | 4 | CSV lookups are explicit. | `csv-lookup` |
| 24 | 6 | You choose the supplier CSV. | `csv-lookup` |
| 25 | 6 | It is read in this browser. | `csv-lookup` |
| 26 | 10 | Camera scanning, manual entry, and exports are free to use. | `free-no-checkout` |
| 27 | 10 | The camera starts only after you choose Scan with camera. | `camera-ready` |
| 28 | 9 | Turn a barcode into a private, printable item card. | footer; pass |

Headings are literal: **For mixed-stock intake**, **Preview an item card**,
**How it works**, **Capture the code**, **Review the item**, **Print or export
the card**, **What this tool does not do**, and **Scan barcodes with the
camera**. Actions are result-naming verbs: **Try it with sample data**,
**Record an item**, **Reset demo**, **Start for real**, **Edit card**, **Print
card**, **Export CSV**, and **Export backup**.

### README sentences

| # | Words | Copy | Result |
| ---: | ---: | --- | --- |
| 1 | 10 | Turn a barcode scan into a private, printable item card. | pass |
| 2 | 17 | Barcode Intake Card records incoming stock for micro-sellers and workshops, and works offline after your first visit. | pass |
| 3 | 11 | Cards, supplier CSV rows, and item photos stay in the browser. | `local-only` |
| 4 | 10 | It is free to use with no account or checkout. | `free-no-checkout` |
| 5 | 3 | Live site: https://barcode-intake-card.sociobot.in | pass |
| 6 | 5 | Open `/demo`, or visit the live demo URL. | pass; source URL checked |
| 7 | 11 | It opens sample workshop cards stored separately from your real cards. | `demo-isolated` |
| 8 | 7 | Choose **Reset demo** to restore the samples. | `demo-reset-exit` |
| 9 | 13 | Choose **Start for real** to clear the demo and leave without copying it. | `demo-reset-exit` |
| 10 | 13 | Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo. | pass |
| 11 | 11 | Opens a camera preview only after you choose Scan with camera. | `camera-ready` |
| 12 | 11 | Fills the barcode field when the camera reader decodes a barcode. | `camera-scan` |
| 13 | 9 | Matches a barcode against a supplier CSV you choose. | `csv-lookup` |
| 14 | 8 | Warns about saved cards with the same barcode. | `duplicate-review` |
| 15 | 15 | Searches saved cards and prints one item card per page with a Code 128 barcode. | search/print claims |
| 16 | 9 | Printable codes use English letters, numbers, spaces, and punctuation. | `print-card` |
| 17 | 10 | Exports all cards as CSV or a complete JSON backup. | export claims |
| 18 | 11 | Imports its JSON backup and works offline after the first visit. | backup/offline claims |
| 19 | 12 | It does not scrape product databases, create purchase orders, or sync accounts. | limits claims |
| 20 | 6 | Node.js 20 or newer is recommended. | maintainer instruction |
| 21 | 2 | Open `http://localhost:5173`. | maintainer instruction |
| 22 | 6 | Use `http://localhost:5173/demo` for the test sandbox. | maintainer instruction |
| 23 | 20 | `npm test` builds the production app, starts the preview server, and runs the Playwright claim, accessibility, mobile, and console checks. | pass |
| 24 | 6 | Chromium for Playwright 1.58.2 is required. | pass |
| 25 | 8 | Build the deployable files with `npm run build`. | pass |
| 26 | 10 | Static output lands in `dist/`, with `dist/index.html` at its root. | pass |
| 27 | 12 | Your real cards and sample cards are stored separately in this browser. | `demo-isolated` |
| 28 | 14 | The app sends no item, barcode, CSV, or photo data to a third party. | `local-only` |
| 29 | 10 | It has no account, sync, checkout, or billing request. | `local-only`/`free-no-checkout` |
| 30 | 8 | The app works offline after your first visit. | `offline-reload` |
| 31 | 11 | Export a JSON backup before clearing site data or moving devices. | pass |
| 32 | 7 | See `/privacy` and `/terms` in the app. | pass |
| 33 | 10 | Camera scanning, manual entry, and exports are free to use. | `free-no-checkout` |
| 34 | 8 | Choose **Scan with camera** to open the preview. | `camera-ready` |
| 35 | 7 | A decoded barcode fills the barcode field. | `camera-scan` |
| 36 | 6 | You can always type it instead. | `manual-intake` |
| 37 | 6 | Deploy `dist/` as a static site. | maintainer instruction |
| 38 | 17 | `staticwebapp.config.json` sends app routes to the right page, returns the designed 404 page, and sets security headers. | pass |
| 39 | 6 | The factory manages DNS and infrastructure. | pass |
| 40 | 1 | MIT. | pass |
| 41 | 2 | See `LICENSE`. | pass |

## Demo, claims, and privacy

The visible sample action reaches `/demo` in one click. Its first settled
screen shows three named workshop cards, search, edit, and print controls.
The persistent banner says **“Demo — sample data, nothing is saved to your
real cards.”**

Live test: edited a sample note; Reset demo restored **“Check bore before
restocking.”**; edited again; Start for real reached `/intake`; real `/records`
had neither sample cards nor the banner; re-entering demo restored the original
note. No request in this flow left the product origin and no error occurred.
The code uses distinct demo/real IndexedDB stores and clears demo state on exit.

From clean clone `/tmp/barcode-review7-clean-Put85W/repo`, all exact claim
commands passed: `offline-reload`, `free-no-checkout`, `local-only`,
`manual-intake`, `duplicate-review`, `csv-lookup`, `csv-export`,
`search-cards`, `json-backup`, `print-card`, `demo-isolated`, `demo-edit`,
`demo-reset-exit`, `camera-ready`, `camera-scan`, `photo-reduction`,
`no-web-lookup`, and `no-purchase-orders`. The live aggregate suite passed
41 tests; `npm run build` produced `dist/`.

## Structure and quality

Direct live checks of `/`, `/demo`, `/intake`, `/records`, `/privacy`,
`/terms`, and an unknown URL confirmed route-specific title, one h1, main,
description, canonical, OG/Twitter metadata, skip link, shared header/footer,
and focus-aware history routing. The unknown URL is a designed HTTP 404.
All discovered internal links returned 200, apart from that deliberate 404;
`/license` is the intended 301 to `/intake`. Favicon, apple icon, manifest,
robots, sitemap, CSP and security headers are live.

The monochrome workshop-broadsheet visual identity matches `.factory/design.md`
and is distinct from a generic SaaS template. It uses the original engraved
receiving-desk art, warm paper, ink rules, registration red, editorial type,
and reduced-motion fallback. Live axe and 390 px keyboard/touch tests pass.

Fresh mobile Lighthouse recorded Performance 99, Accessibility 100, Best
Practices 100, SEO 100, FCP 1.57 s, LCP 1.65 s, CLS 0, and TBT 0. Chrome
crashed only while collecting the final screenshot after those metrics were
captured.

## Earlier findings: confirmed fixed

Every item below was reconfirmed on the live site and in code/tests.

| IDs | Confirmation |
| --- | --- |
| F-1-1 | 45 px controls; live 390 px target regression passes. |
| F-1-2, F-6-1 | Supported printable set is named, rejected at the boundary, and decoded by `print-card`. |
| F-1-3 | Reset/exit lifecycle is registered and live-confirmed. |
| F-1-4 | Claim tests barcode, item, supplier, and location search. |
| F-1-5 | Backup compares all fields and photo after import. |
| F-1-6, F-2-1 | Separate readiness and decode-to-field claims cover camera behavior. |
| F-1-7 | No unsupported count/subjective demo copy remains. |
| F-1-8, F-2-2 | Both 404 renderers use “Page not found” with full metadata/shell. |
| F-1-9, F-6-2 | Current copy consistently uses item card/cards. |
| F-1-10 | Decorative folio labels are absent. |
| F-1-11 | Eyebrow is literal mixed-stock guidance. |
| F-1-12 | Hero caption is direct intake guidance. |
| F-1-13 | Preview heading names the item-card preview. |
| F-1-14 | Preview says review/update before print. |
| F-1-15 | Third step names print/export. |
| F-1-16 | Limits section is literal. |
| F-1-17 | Empty limits slogan is absent. |
| F-1-18 | Camera section is literal. |
| F-1-19 | Intake action is “Record an item.” |
| F-1-20 | README opening avoids offline-first/desk jargon. |
| F-1-21 | README says one item card per page. |
| F-1-22 | Footer asset lore is absent. |
| F-1-23, F-6-3 | Supplier CSV is the sole lookup-file term. |
| F-3-1 | `/license` redirects 301 and is absent from sitemap. |
| F-3-2 | Hero says free/no account/no checkout; test covers it. |
| F-3-3 | Demo placeholder includes supplier. |
| F-3-4 | Footer visibly labels the external site. |
| F-4-1 | Preview fields exist on actual cards. |
| F-4-2 | Decorative Fig. 01 is absent. |
| F-4-3 | README accurately calls the build command a build command. |
| F-5-1 | Live Back/Forward restores scroll and h1 focus. |
| F-5-2 | README explains separate real/sample storage in plain language. |
| F-5-3 | README uses observable offline wording. |
| F-5-4 | Deployment wording is direct and tested. |
| F-6-4 | Terms h1 names the page. |
| F-6-5 | Delayed track fixture makes camera cleanup coverage deterministic. |
| Verification P1 checkout/claims | No checkout remains and all public claims are listed/tested. |
| Verification 2 P1 barcode/CSP | Canvas Code 128 is decodable under the production policy. |
| Verification 2 P1 Escape camera | Escape and route teardown end tracks. |
| Verification 2 P1 unlisted claims | Photo, lookup, and purchase-order claims are registered. |
| Verification 2 P2 corrupt photo | Invalid image recovery is announced. |
| Verification 2 P2 touch targets | Live mobile target check passes. |
| Verification 2 P2 HTTP 200 404 | Unknown URLs are HTTP 404. |
| Verification 3 P1 backup integrity | Import validates schema/version/types before atomic write. |
| Verification 3 P1 blank print | Unsupported code recovery is visible; accepted code prints. |
| Verification 3 P2 demo exit | Start for real clears demo changes before re-entry. |
| Verification 4 High LCP | Fresh live LCP is 1.65 s. |

## Missed leverage and what would make this perfect

The brief’s obvious transfer needs are already covered by chosen supplier CSV
lookup, CSV export, and complete JSON backup/import. Sync would conflict with
the local-first privacy contract. AI would not improve this deterministic
barcode-intake job and is correctly absent; no provider key or decorative AI
feature is embedded.

Nothing remains to do under the brief. Keep the claim inventory and this
clean-context review in the release check whenever scanner, storage, service
worker, copy, or routing changes.
