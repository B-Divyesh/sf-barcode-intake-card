# Adversarial first-read review 2 — Barcode Intake Card

**Verdict: FAIL**

**Reviewed:** 28 August 2026  
**Live URL:** <https://barcode-intake-card.sociobot.in>  
**Repository base:** `583e18ec0f508d3d575e9e05a851de7debe36580`

The core intake flow is clear and the isolated demo works. This is still a fail: the landing page promises barcode scanning while the claim inventory deliberately tests only opening a camera preview, and the designed 404 uses a metaphor where a literal error heading is required. A PASS requires no findings.

## Findings

### F-2-1 — Major — Barcode scanning is an unlisted, untested landing promise

- **Exact quotes/location:** Landing → **How it works**: “Use a scanner, type the code, or match a supplier CSV.” Landing → **Capture the code**: “Scan or type a code made from English letters, numbers, spaces, and punctuation.” The hero headline also says “Turn scans into item cards.”
- **Evidence:** `.factory/claims.json` has `camera-ready`, whose exact claim is only “Camera preview opens only after Scan with camera.” Its tagged test opens a permitted fake camera and asserts “Camera ready”; it does not provide a barcode frame or assert that a decoded barcode reaches the form. No other claim covers decoding.
- **Why this fails:** A first-time visitor can reasonably rely on “Use a scanner” and “Scan” to mean that the camera scanner reads a barcode. The product may implement that path, but the claims contract has no listed, observable test for it. The earlier repair intentionally narrowed the public camera promise to the tested preview behavior; these two landing sentences broaden it again.
- **Concrete fix:** Either change both sentences to remove scanning — for example, “Type a barcode or match a supplier CSV.” and “Type a code made from English letters, numbers, spaces, and punctuation.” — or add a `camera-scan` claim, such as “Camera scanning fills the barcode field,” with one deterministic fixture/video or reader mock that asserts the decoded value fills the field and closes the scanner. Keep the current `camera-ready` claim for permission timing.

### F-2-2 — Minor — The 404 headline is a metaphor, not an error heading

- **Exact quote/location:** Fresh unknown route `/review-2-missing`, and client-side unknown-route renderer: `<h1>This card is not in the file</h1>`.
- **Evidence:** The live route correctly returns HTTP 404 and has the shared header, footer, metadata, and recovery action. The same metaphor appears in `public/404.html` and `src/main.ts`.
- **Why this fails:** The heading does not name the section or error in plain language. A visitor or screen-reader user hears a product metaphor before knowing that the address was not found; the supplied plain-words rules explicitly prohibit this kind of brand-lore wording.
- **Concrete fix:** Use `<h1>Page not found</h1>` in both renderers. Keep the current useful lede and “Return to the intake form” action.

## Cold first read

Fresh, storage-empty Chromium contexts loaded the production origin before scrolling.

| Question | 390 × 844 phone | 1440 × 900 desktop |
| --- | --- | --- |
| What does it do? | Turns barcode scans into printable item cards stored in the browser. | Same. |
| For whom? | Small sellers and workshops receiving mixed stock without a full inventory system. | Same. |
| What should I click first? | **Try it with sample data**; its adjacent copy says it opens cards to search, edit, and print. | Same. |

This gate passes. On the phone, the action note and all three facts are visible before scrolling. Both first loads returned 200 with no console or page errors; requests were only the page, same-origin CSS/JS, and the selected same-origin hero image.

## Copy audit

Word counts treat hyphenated terms, URLs, versions, and code names as one word. No landing or README sentence exceeds 22 words. No banned marketing adjective occurs. The scanning statements are F-2-1. Technical terms in the run/deployment instructions are retained because those sections address a maintainer performing the named commands.

### Landing sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| 1 | 5 | Turn scans into item cards | F-2-1 (scan promise) |
| 2 | 13 | For small sellers and workshops receiving mixed stock without a full inventory system. | Pass |
| 3 | 11 | It opens sample workshop cards you can search, edit, and print. | Pass (`demo-edit`) |
| 4 | 5 | Cards stay in this browser | Pass (`local-only`) |
| 5 | 6 | Works offline after the first visit | Pass (`offline-reload`) |
| 6 | 7 | Camera preview opens when you choose it | Pass (`camera-ready`) |
| 7 | 9 | Record mixed stock before choosing a full inventory system. | Pass |
| 8 | 9 | Review and update the item card before printing it. | Pass (`demo-edit`, `print-card`) |
| 9 | 11 | Use a scanner, type the code, or match a supplier CSV. | F-2-1 |
| 10 | 13 | Scan or type a code made from English letters, numbers, spaces, and punctuation. | F-2-1 |
| 11 | 9 | Add its name, supplier, photo, quantity, and shelf location. | Pass |
| 12 | 11 | Print one card or export every record as CSV or JSON. | Pass (`print-card`, `csv-export`, `json-backup`) |
| 13 | 4 | No automatic web lookup. | Pass (`no-web-lookup`) |
| 14 | 9 | Supplier and stock details do not leave your device. | Pass (`local-only`) |
| 15 | 3 | No purchase orders. | Pass (`no-purchase-orders`) |
| 16 | 3 | This records arrivals. | Pass |
| 17 | 5 | It does not run procurement. | Pass (`no-purchase-orders`) |
| 18 | 4 | No account or sync. | Pass (`local-only`) |
| 19 | 11 | Export a file when you need a backup or another system. | Pass (`json-backup`) |
| 20 | 4 | CSV lookups are explicit. | Pass (`csv-lookup`) |
| 21 | 5 | You choose the supplier file. | Pass (`csv-lookup`) |
| 22 | 6 | It is read in this browser. | Pass (`local-only`) |
| 23 | 9 | Manual intake and exports are included on this device. | Pass (`manual-intake`, export claims) |
| 24 | 10 | The camera starts only after you choose Scan with camera. | Pass (`camera-ready`) |
| 25 | 9 | Turn a barcode into a private, printable item card. | Pass |

Landing headings are literal and useful: **For mixed-stock intake**, **Preview an item card**, **How it works**, **Capture the code**, **Review the item**, **Print or export the card**, **What this tool does not do**, and **Camera preview is included**. The visible actions name results: **Try it with sample data**, **Record an item**, **Reset demo**, **Start for real**, **Edit card**, **Print card**, and the export actions. No landing heading or button adds a separate finding.

### README sentences and headings

| # | Words | Copy | Result |
| ---: | ---: | --- | --- |
| 1 | 3 | Barcode Intake Card | Pass |
| 2 | 10 | Turn a barcode scan into a private, printable item card. | Pass |
| 3 | 17 | Barcode Intake Card records incoming stock for micro-sellers and workshops, and works offline after your first visit. | Pass |
| 4 | 11 | Cards, supplier CSV rows, and item photos stay in the browser. | Pass (`local-only`) |
| 5 | 3 | Live site: https://barcode-intake-card.sociobot.in | Pass |
| 6 | 4 | Try the isolated demo | Pass heading |
| 7 | 5 | Open `/demo`, or visit `https://barcode-intake-card.sociobot.in/?demo=1`. | Pass |
| 8 | 11 | It opens sample workshop cards stored separately from your real cards. | Pass (`demo-isolated`) |
| 9 | 7 | Choose **Reset demo** to restore the samples. | Pass (`demo-reset-exit`) |
| 10 | 13 | Choose **Start for real** to clear the demo and leave without copying it. | Pass (`demo-reset-exit`) |
| 11 | 3 | What it does | Pass heading |
| 12 | 13 | Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo. | Pass |
| 13 | 11 | Opens a camera preview only after you choose Scan with camera. | Pass (`camera-ready`) |
| 14 | 9 | Matches a barcode against a supplier CSV you choose. | Pass (`csv-lookup`) |
| 15 | 8 | Warns about saved cards with the same barcode. | Pass (`duplicate-review`) |
| 16 | 15 | Searches saved cards and prints one item card per page with a Code 128 barcode. | Pass (`search-cards`, `print-card`) |
| 17 | 9 | Printable codes use English letters, numbers, spaces, and punctuation. | Pass (`print-card`) |
| 18 | 10 | Exports all cards as CSV or a complete JSON backup. | Pass (`csv-export`, `json-backup`) |
| 19 | 11 | Imports its JSON backup and works offline after the first visit. | Pass (`json-backup`, `offline-reload`) |
| 20 | 12 | It does not scrape product databases, create purchase orders, or sync accounts. | Pass (`no-web-lookup`, `no-purchase-orders`, `local-only`) |
| 21 | 2 | Run locally | Pass heading |
| 22 | 6 | Node.js 20 or newer is recommended. | Pass |
| 23 | 2 | Open `http://localhost:5173`. | Pass |
| 24 | 6 | Use `http://localhost:5173/demo` for the test sandbox. | Pass |
| 25 | 3 | Test and build | Pass heading |
| 26 | 20 | `npm test` builds the production app, starts the preview server, and runs the Playwright claim, accessibility, mobile, and console checks. | Pass |
| 27 | 6 | Chromium for Playwright 1.58.2 is required. | Pass |
| 28 | 8 | The exact deployment command is `npm run build`. | Pass |
| 29 | 10 | Static output lands in `dist/`, with `dist/index.html` at its root. | Pass |
| 30 | 3 | Data and privacy | Pass heading |
| 31 | 6 | Real cards use IndexedDB database `barcode-intake-real`. | Pass; technical storage detail |
| 32 | 4 | Demo cards use `barcode-intake-demo`. | Pass; technical storage detail |
| 33 | 14 | The app sends no item, barcode, CSV, or photo data to a third party. | Pass (`local-only`) |
| 34 | 9 | It has no account, sync, checkout, or billing request. | Pass (`local-only`) |
| 35 | 7 | The service worker caches the app shell. | Pass (`offline-reload`) |
| 36 | 11 | Export a JSON backup before clearing site data or moving devices. | Pass |
| 37 | 7 | See `/privacy` and `/terms` in the app. | Pass |
| 38 | 2 | Camera preview | Pass heading |
| 39 | 9 | Camera preview, manual intake, and all exports are included. | Pass |
| 40 | 12 | Choose **Scan with camera** from the intake form to request camera access. | Pass (`camera-ready`) |
| 41 | 7 | You can always type a barcode instead. | Pass (`manual-intake`) |
| 42 | 1 | Deployment | Pass heading |
| 43 | 6 | Deploy `dist/` as a static site. | Pass |
| 44 | 12 | `staticwebapp.config.json` provides SPA routing, the 404 response, security headers, and MIME types. | Pass; deployment detail |
| 45 | 6 | The factory manages DNS and infrastructure. | Pass |
| 46 | 2 | Project notes | Pass heading |
| 47 | 7 | Visual system and image provenance: `.factory/design.md` | Pass |
| 48 | 5 | Verifiable product claims: `.factory/claims.json` | Pass |
| 49 | 4 | Demo contract: `.factory/demo.md` | Pass |
| 50 | 4 | Final verification: `.factory/handoff.md` | Pass |
| 51 | 1 | License | Pass heading |
| 52 | 1 | MIT. | Pass |
| 53 | 2 | See `LICENSE`. | Pass |

## Demo, sandbox, privacy, and claims

- The landing action enters `/demo` in one click. Its first settled screen already displays three named workshop cards, with barcodes, suppliers, locations, quantities, edit controls, and print controls.
- The persistent banner reads **“Demo — sample data, nothing is saved to your real cards.”** It includes **Reset demo** and **Start for real**. An edited note was present before reset, absent after reset, and absent from real `/records` after leaving demo.
- The direct `/demo` route, `/?demo=1`, and demo app routes use the demo namespace in code (`barcode-intake-demo`); real data uses `barcode-intake-real`. The demo flow made no cross-origin request. A complete live Start-for-real run ended at `/intake` with no banner after waiting for navigation.
- The production request log for cold landing and demo covered only same-origin assets. The live CSP has `connect-src 'self'`; no tracker, third-party font/script, account, sync, or product endpoint was requested.
- A clean clone at `/tmp/barcode-intake-review-2-nZ1iKs` ran each of the 16 exact commands in `.factory/claims.json` individually; all passed. The aggregate clean-clone `npm test` also passed **33/33** in 34.0 seconds, and `npm run build` produced `dist/`. No declared claim test failed.

| Claim id | Result |
| --- | --- |
| offline-reload | PASS |
| local-only | PASS |
| manual-intake | PASS |
| duplicate-review | PASS |
| csv-lookup | PASS |
| csv-export | PASS |
| search-cards | PASS |
| json-backup | PASS |
| print-card | PASS |
| demo-isolated | PASS |
| demo-edit | PASS |
| demo-reset-exit | PASS |
| camera-ready | PASS; preview timing only — see F-2-1 |
| photo-reduction | PASS |
| no-web-lookup | PASS |
| no-purchase-orders | PASS |

## Earlier findings: live and code confirmation

Every item below was checked against the live origin and the implementation, rather than accepted from the previous handoff alone.

| Earlier id | Confirmation | Result |
| --- | --- | --- |
| F-1-1 | Live 390 px touch-target regression test passes; ordinary links have the repaired minimum height. | Fixed |
| F-1-2 | Landing states the supported printable character set, not “any” code. | Fixed |
| F-1-3 | `demo-reset-exit` is registered and passes reset plus exit isolation. | Fixed |
| F-1-4 | `search-cards` tests barcode, item, supplier, and location. | Fixed |
| F-1-5 | `json-backup` compares every field and the photo after restore. | Fixed |
| F-1-6 | The explicit camera claim is narrowed to opening a preview; related new landing scan claims are separately reported as F-2-1. | Fixed as originally scoped |
| F-1-7 | No unsupported demo count or subjective “realistic” wording remains. | Fixed |
| F-1-8 | Fresh unknown URL returns designed HTTP 404 with shared header/footer, metadata, skip link, and recovery action. | Fixed; F-2-2 is separate copy issue |
| F-1-9 | Titles and product copy use “item card.” | Fixed |
| F-1-10 | Decorative folio labels are absent. | Fixed |
| F-1-11 | Eyebrow is “For mixed-stock intake.” | Fixed |
| F-1-12 | Hero caption is direct intake guidance. | Fixed |
| F-1-13 | Preview heading names the item-card preview. | Fixed |
| F-1-14 | Preview guidance now says to review and update before printing. | Fixed |
| F-1-15 | Third step is “Print or export the card.” | Fixed |
| F-1-16 | Limits heading is “What this tool does not do.” | Fixed |
| F-1-17 | Empty limits introduction is absent. | Fixed |
| F-1-18 | Camera section is named “Camera preview is included.” | Fixed |
| F-1-19 | CTA is “Record an item”; destination is the intake form. | Fixed |
| F-1-20 | README no longer uses “offline-first” or “receiving desk.” | Fixed |
| F-1-21 | README says one item card per page. | Fixed |
| F-1-22 | Footer asset lore is absent; provenance remains in design documentation. | Fixed |
| F-1-23 | README and app use “supplier CSV.” | Fixed |

## Structure, routing, and identity

- Live routes `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, and `/print/demo-bearing?demo=1` returned 200. A fresh unknown document returned 404. All rendered same-origin links returned 200; the `mailto:` link is explicit; the Param Factory link returned 200.
- All inspected routes have one `h1`, one `main`, route-specific title, description, canonical, social metadata, favicon, language, consistent header/footer, and Privacy/Terms footer links. Titles follow the product/route pattern. The 404 has the same structural elements but fails F-2-2’s copy rule.
- SPA navigation updates title and metadata, moves focus to the new `h1`, announces it, and browser Back restores the previous route and focus. The 390 px live touch-target test passes.
- The warm-paper, black-rule, red-registration-line broadsheet system, serif editorial hierarchy, engraved receiving-desk art, and square controls visibly follow `.factory/design.md`; it is not a generic SaaS template.
- No additional AI, sync, or import/export feature is missing. The brief calls for local barcode intake, CSV lookup, backup/export, photo, duplicate review, and printable cards; these are present. Runtime AI would add a remote-data path without helping this deterministic job.

## What would make this perfect

Add a deterministic, listed claim test for actual camera barcode decoding or remove every public scanning promise that exceeds camera-preview behavior. Replace both 404 metaphoric headings with “Page not found.” Then rerun the complete clean-clone claim loop and live first-read audit. With those two changes, no further finding was identified in this round.
