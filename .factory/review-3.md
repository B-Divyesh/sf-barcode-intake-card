# Adversarial first-read review 3 — Barcode Intake Card

**Verdict: FAIL**

**Reviewed:** 28 August 2026  
**Live site:** <https://barcode-intake-card.sociobot.in>  
**Repository base:** `60fbb7e654720f08fd8f83c5dc4d5a647ba6a031`

The core intake flow, demo sandbox, claims, accessibility checks, and offline behavior pass. The release still has four findings. A sitemap route is named for a license but serves camera instructions, the first screen never states the price or that the complete tool is free, the demo hides supplier search from its input guidance, and the external footer link is not identified as external. A PASS requires zero findings.

## Findings

### F-3-1 — BLOCKING — `/license` is a misleading route to camera instructions

- **Exact location:** `public/sitemap.xml` publishes `https://barcode-intake-card.sociobot.in/license`; the live route has title **“Camera preview — Barcode Intake Card”** and `h1` **“Open the camera preview.”** Its first sentence is **“There is no license, checkout, or account to set up.”**
- **Evidence:** A direct live request returns HTTP 200. `src/main.ts` maps `/license` to `licensePage()`, and `public/staticwebapp.config.json` rewrites `/license` to the app.
- **Why this fails:** “License” promises licensing information. The route instead says there is no license to set up and repeats camera instructions already available on `/intake`. This is broken semantic routing, and it exposes a stale payment/licensing concept in the sitemap.
- **Concrete fix:** Remove `/license` from the sitemap and route table, redirect old `/license` visits to `/intake`, and keep camera instructions on `/intake`. If a standalone camera guide is genuinely needed, give it `/camera` and a matching title, canonical, and `h1`.

### F-3-2 — Major — The price is missing and “included” has no stated context

- **Exact quotes/locations:** Landing first-screen facts end with **“Camera scanning fills the barcode field”** instead of a price fact. The later section says **“Camera preview is included”** and **“Manual intake and exports are included on this device.”** README → Camera scanning says **“Camera scanning, manual intake, and all exports are included.”** The brief declares `"monetization": "one-time"`.
- **Why this fails:** A visitor cannot tell whether the tool is free, temporarily free, or sold for an unstated one-time price. “Included” does not say what the features are included in. It is also an unlisted access/price claim: no `claims.json` entry says the complete tool has no paywall or checkout.
- **Concrete fix:** If the deployed no-checkout behavior is intentional, replace the third hero fact with **“Free to use — no account or checkout.”** Rename the section **“Scan barcodes with the camera”** and write **“Camera scanning, manual entry, and exports are free to use.”** Register and test that claim, and record the deviation from the brief’s one-time monetization. If payment is intended, show the exact one-time price and what it unlocks, using only Sociobot billing.

### F-3-3 — Minor — The demo search hint omits supplier search

- **Exact location:** `/demo`, Search cards placeholder: **“Barcode, item, or location”**. The registered `search-cards` claim and its passing test also support supplier search.
- **Why this fails:** The first demo screen is where a visitor learns the product. Its only search guidance hides one of the four searchable fields, so a visitor has no reason to try a supplier name.
- **Concrete fix:** Change the placeholder to **“Barcode, item, supplier, or location.”** Add a UI-copy assertion to the existing search claim test.

### F-3-4 — Minor — The footer’s external link does not say it leaves the product

- **Exact location:** Footer on every route: **“Built by Param Factory”** links to `https://sociobot.in` with `rel="external"`, but no visible or accessible external-site label.
- **Why this fails:** The site-structure contract requires external links to say so. `rel="external"` is not announced as link text and does not warn a first-time visitor.
- **Concrete fix:** Use visible text **“Built by Param Factory (external site)”**, or give the link an equivalent accessible name and visible external-link indicator. Keep the destination in the dead-link crawl.

## 1. Cold first read

Fresh Chromium contexts with empty storage loaded production at 390 × 844 and 1440 × 900. No scrolling occurred before these answers were recorded.

| Question | 390 px phone | Desktop |
| --- | --- | --- |
| What does it do? | Turns scanned barcodes into item cards that stay in the browser and can be printed or exported. | Same. |
| For whom? | Small sellers and workshops receiving mixed stock without a full inventory system. | Same. |
| What should I click first? | **Try it with sample data**; adjacent copy says the cards can be searched, edited, and printed. | Same. |

The core first-read gate passes. On the phone, the action, its explanation, and all three current facts are visible before scrolling. Both cold loads returned 200, logged no console or page error, and requested only same-origin HTML, CSS, JavaScript, and the responsive hero image. F-3-2 records the separate mandatory price-fact failure.

## 2. Copy audit

Counts treat hyphenated terms, URLs, versions, and code names as one word. No sentence exceeds 22 words and no banned marketing adjective appears. Technical terms in maintainer-only run and deployment instructions are appropriate there. F-3-2 and F-3-4 are the copy findings.

### Landing page sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| 1 | 6 | Turn scanned barcodes into item cards | Pass; `camera-scan` |
| 2 | 13 | For small sellers and workshops receiving mixed stock without a full inventory system. | Pass |
| 3 | 11 | It opens sample workshop cards you can search, edit, and print. | Pass; `demo-edit` |
| 4 | 5 | Cards stay in this browser | Pass; `local-only` |
| 5 | 6 | Works offline after the first visit | Pass; `offline-reload` |
| 6 | 6 | Camera scanning fills the barcode field | **F-3-2: this replaces the required price fact** |
| 7 | 15 | An engraved workshop desk with parts, a parcel, a scanner, and a blank intake card. | Pass; image alternative |
| 8 | 9 | Record mixed stock before choosing a full inventory system. | Pass |
| 9 | 9 | Review and update the item card before printing it. | Pass; `demo-edit`, `print-card` |
| 10 | 11 | Scan a barcode, type the code, or match a supplier CSV. | Pass; scanning/manual/CSV claims |
| 11 | 6 | Camera scanning fills the barcode field. | Pass; `camera-scan` |
| 12 | 10 | You can also type English letters, numbers, spaces, and punctuation. | Pass; `manual-intake`, `print-card` |
| 13 | 9 | Add its name, supplier, photo, quantity, and shelf location. | Pass |
| 14 | 11 | Print one card or export every record as CSV or JSON. | Pass; print/export claims |
| 15 | 4 | No automatic web lookup. | Pass; `no-web-lookup` |
| 16 | 9 | Supplier and stock details do not leave your device. | Pass; `local-only` |
| 17 | 3 | No purchase orders. | Pass; `no-purchase-orders` |
| 18 | 3 | This records arrivals. | Pass |
| 19 | 5 | It does not run procurement. | Pass; `no-purchase-orders` |
| 20 | 4 | No account or sync. | Pass; `local-only` |
| 21 | 11 | Export a file when you need a backup or another system. | Pass; `json-backup` |
| 22 | 4 | CSV lookups are explicit. | Pass; `csv-lookup` |
| 23 | 5 | You choose the supplier file. | Pass; `csv-lookup` |
| 24 | 6 | It is read in this browser. | Pass; `local-only` |
| 25 | 9 | Manual intake and exports are included on this device. | **F-3-2** |
| 26 | 10 | The camera starts only after you choose Scan with camera. | Pass; `camera-ready` |
| 27 | 9 | Turn a barcode into a private, printable item card. | Pass |

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| For mixed-stock intake | 3 | Pass |
| Try it with sample data | 6 | Pass; result-naming sample action |
| Preview an item card | 4 | Pass |
| How it works | 3 | Pass |
| Capture the code | 3 | Pass |
| Review the item | 3 | Pass |
| Print or export the card | 5 | Pass |
| What this tool does not do | 6 | Pass |
| Camera reader | 2 | Pass |
| Camera preview is included | 4 | **F-3-2** |
| Record an item | 3 | Pass; result-naming action |
| Built by Param Factory | 4 | **F-3-4** |

### README sentences and headings

| # | Words | Copy | Result |
| ---: | ---: | --- | --- |
| 1 | 3 | Barcode Intake Card | Pass |
| 2 | 10 | Turn a barcode scan into a private, printable item card. | Pass |
| 3 | 17 | Barcode Intake Card records incoming stock for micro-sellers and workshops, and works offline after your first visit. | Pass; `offline-reload` |
| 4 | 11 | Cards, supplier CSV rows, and item photos stay in the browser. | Pass; `local-only` |
| 5 | 3 | Live site: https://barcode-intake-card.sociobot.in | Pass |
| 6 | 4 | Try the isolated demo | Pass heading |
| 7 | 5 | Open `/demo`, or visit `https://barcode-intake-card.sociobot.in/?demo=1`. | Pass |
| 8 | 11 | It opens sample workshop cards stored separately from your real cards. | Pass; `demo-isolated` |
| 9 | 7 | Choose **Reset demo** to restore the samples. | Pass; `demo-reset-exit` |
| 10 | 13 | Choose **Start for real** to clear the demo and leave without copying it. | Pass; `demo-reset-exit` |
| 11 | 3 | What it does | Pass heading |
| 12 | 13 | Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo. | Pass |
| 13 | 11 | Opens a camera preview only after you choose Scan with camera. | Pass; `camera-ready` |
| 14 | 11 | Fills the barcode field when the camera reader decodes a barcode. | Pass; `camera-scan` |
| 15 | 9 | Matches a barcode against a supplier CSV you choose. | Pass; `csv-lookup` |
| 16 | 8 | Warns about saved cards with the same barcode. | Pass; `duplicate-review` |
| 17 | 15 | Searches saved cards and prints one item card per page with a Code 128 barcode. | Pass; `search-cards`, `print-card` |
| 18 | 9 | Printable codes use English letters, numbers, spaces, and punctuation. | Pass; `print-card` |
| 19 | 10 | Exports all cards as CSV or a complete JSON backup. | Pass; export claims |
| 20 | 11 | Imports its JSON backup and works offline after the first visit. | Pass; `json-backup`, `offline-reload` |
| 21 | 12 | It does not scrape product databases, create purchase orders, or sync accounts. | Pass; negative claims |
| 22 | 2 | Run locally | Pass heading |
| 23 | 6 | Node.js 20 or newer is recommended. | Pass |
| 24 | 2 | Open `http://localhost:5173`. | Pass |
| 25 | 6 | Use `http://localhost:5173/demo` for the test sandbox. | Pass |
| 26 | 3 | Test and build | Pass heading |
| 27 | 20 | `npm test` builds the production app, starts the preview server, and runs the Playwright claim, accessibility, mobile, and console checks. | Pass |
| 28 | 6 | Chromium for Playwright 1.58.2 is required. | Pass |
| 29 | 8 | The exact deployment command is `npm run build`. | Pass |
| 30 | 10 | Static output lands in `dist/`, with `dist/index.html` at its root. | Pass |
| 31 | 3 | Data and privacy | Pass heading |
| 32 | 6 | Real cards use IndexedDB database `barcode-intake-real`. | Pass; technical storage detail |
| 33 | 4 | Demo cards use `barcode-intake-demo`. | Pass; technical storage detail |
| 34 | 14 | The app sends no item, barcode, CSV, or photo data to a third party. | Pass; `local-only` |
| 35 | 9 | It has no account, sync, checkout, or billing request. | Pass; verified no cross-origin/payment request |
| 36 | 7 | The service worker caches the app shell. | Pass; `offline-reload` |
| 37 | 11 | Export a JSON backup before clearing site data or moving devices. | Pass |
| 38 | 7 | See `/privacy` and `/terms` in the app. | Pass |
| 39 | 2 | Camera scanning | Pass heading |
| 40 | 9 | Camera scanning, manual intake, and all exports are included. | **F-3-2** |
| 41 | 8 | Choose **Scan with camera** to open the preview. | Pass; `camera-ready` |
| 42 | 7 | A decoded barcode fills the barcode field. | Pass; `camera-scan` |
| 43 | 6 | You can always type it instead. | Pass; `manual-intake` |
| 44 | 1 | Deployment | Pass heading |
| 45 | 6 | Deploy `dist/` as a static site. | Pass |
| 46 | 12 | `staticwebapp.config.json` provides SPA routing, the 404 response, security headers, and MIME types. | Pass; maintainer detail |
| 47 | 6 | The factory manages DNS and infrastructure. | Pass |
| 48 | 2 | Project notes | Pass heading |
| 49 | 6 | Visual system and image provenance: `.factory/design.md` | Pass |
| 50 | 4 | Verifiable product claims: `.factory/claims.json` | Pass |
| 51 | 3 | Demo contract: `.factory/demo.md` | Pass |
| 52 | 3 | Final verification: `.factory/handoff.md` | Pass |
| 53 | 1 | License | Pass heading |
| 54 | 1 | MIT. | Pass |
| 55 | 2 | See `LICENSE`. | Pass |

### Terminology and claim-like copy

| Concept | Term used | Result |
| --- | --- | --- |
| Saved unit | item card; “card” after introduction | Pass |
| Intake workflow | intake | Pass |
| Identifying value | barcode or SKU where both are accepted | Pass |
| Lookup file | supplier CSV | Pass |
| Portable copy | JSON backup, then backup | Pass |
| Sample state | demo | Pass |

Every product-behavior sentence above maps to a registered claim or combined observable claim test except the unstated meaning of **“included”**, reported as F-3-2. F-3-3 is an omitted capability in demo field guidance rather than an unlisted product claim.

## 3. Demo and sandbox

- The first-screen action enters `/?demo=1` in one click.
- The first settled screen shows three named workshop items with barcodes, suppliers, locations, quantities, edit actions, and print actions.
- The persistent banner reads **“Demo — sample data, nothing is saved to your real cards.”** It includes **Reset demo** and **Start for real**.
- After editing the first sample, Reset restored **“Check bore before restocking.”** Start for real opened real intake; `/records` then showed no item cards.
- IndexedDB initially contained only `barcode-intake-demo`. After Start for real, both `barcode-intake-demo` and `barcode-intake-real` contained zero records. No localStorage or backend tenant is used.
- The complete manual flow made no cross-origin request and logged no console or page error.

The demo behavior passes. F-3-3 is a discoverability defect in its search hint, not a sandbox failure.

## 4. Claims

A fresh clone at `/tmp/barcode-review3-clean-DiCDYt` was created from the reviewed base. After `npm ci`, every exact `test` command in `.factory/claims.json` ran individually. All 17 passed.

| Claim id | Result | Evidence checked |
| --- | --- | --- |
| `offline-reload` | PASS | Cached demo reload and navigation worked offline. |
| `local-only` | PASS | CSV/photo data persisted; no cross-origin request occurred. |
| `manual-intake` | PASS | A typed barcode saved and appeared in Cards. |
| `duplicate-review` | PASS | Matching saved barcode showed a review candidate. |
| `csv-lookup` | PASS | Chosen supplier CSV filled matching fields. |
| `csv-export` | PASS | Download contained its header and one row per demo card. |
| `search-cards` | PASS | Barcode, item, supplier, and location each filtered correctly. |
| `json-backup` | PASS | Every field, timestamp, and photo value matched after restore. |
| `print-card` | PASS | Code 128 canvas rendered, decoded, and showed location. |
| `demo-isolated` | PASS | Demo cards did not appear in real Cards. |
| `demo-edit` | PASS | A sample was searched, edited, saved, and printed. |
| `demo-reset-exit` | PASS | Reset restored samples; exit discarded demo changes. |
| `camera-ready` | PASS | Camera preview appeared only after the scan action. |
| `camera-scan` | PASS | Deterministic decoded value filled the barcode field and closed the dialog. |
| `photo-reduction` | PASS | 1600 × 1000 source stored as 1200 × 750 JPEG. |
| `no-web-lookup` | PASS | Unknown barcode caused no request or automatic field fill. |
| `no-purchase-orders` | PASS | Save made no mutation request and created no purchase-order data. |

Each claim id occurs exactly once as a test tag. No claim command failed and no claim remained untested. The aggregate clean-clone suite passed **34/34**; the aggregate live suite also passed **34/34**.

## 5. Offline, privacy, and accessibility

- The production offline claim passed from a fresh context after the demo shell was cached.
- Cold landing and the complete edit/reset/exit demo flow requested only the product origin. The response CSP limits `connect-src` to self.
- Real and demo cards use distinct IndexedDB databases. Demo exit cleared the demo store without copying any record to the real store.
- The Playwright axe integration found no serious or critical violations on `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, or `/license`.
- The live URL verifier reported 200, zero console errors, `lang="en"`, one `h1`, one `main`, no missing image alternative, and no unnamed button.
- The 390 px keyboard, overflow, and 44 px target tests passed. Route changes and browser Back focused the new `h1`. Reduced-motion CSS removes effective animation.

## 6. Earlier finding verification

Every earlier finding was checked against both deployed behavior and current code. The previous status labels were not taken as evidence.

| Earlier id | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | Live 390 px control test passed; Privacy email measured at the safe minimum. | Fixed |
| F-1-2 | Copy and validation name the supported printable character set; no “any printed code” remains. | Fixed |
| F-1-3 | `demo-reset-exit` is registered and passed reset plus exit isolation. | Fixed |
| F-1-4 | Search claim tests barcode, item, supplier, and location. | Fixed; discoverability issue is F-3-3 |
| F-1-5 | Backup test compares every stored field and photo after restoration. | Fixed |
| F-1-6 | Preview timing and decoded-to-field behavior have separate passing claims. | Fixed |
| F-1-7 | Demo copy has no unsupported count or “realistic” adjective. | Fixed |
| F-1-8 | Unknown live URL returns a designed HTTP 404 with shared header/footer, metadata, icons, skip link, and recovery action. | Fixed |
| F-1-9 | Landing titles and output copy use item card/card rather than stock card. | Fixed |
| F-1-10 | Decorative folio labels remain absent. | Fixed |
| F-1-11 | Hero eyebrow remains the literal “For mixed-stock intake.” | Fixed |
| F-1-12 | Hero caption gives direct intake guidance. | Fixed |
| F-1-13 | Preview heading is “Preview an item card.” | Fixed |
| F-1-14 | Preview guidance tells the visitor to review and update before printing. | Fixed |
| F-1-15 | Third step is “Print or export the card.” | Fixed |
| F-1-16 | Limits heading is “What this tool does not do.” | Fixed |
| F-1-17 | Empty limits slogan remains absent. | Fixed |
| F-1-18 | Camera section is named directly; F-3-2 concerns price context, not the old checkout metaphor. | Fixed as originally scoped |
| F-1-19 | Action remains “Record an item” and opens the intake form. | Fixed |
| F-1-20 | README avoids “offline-first” and the receiving-desk metaphor. | Fixed |
| F-1-21 | README says one item card per page. | Fixed |
| F-1-22 | Footer contains no asset-provenance lore. | Fixed |
| F-1-23 | App and README use “supplier CSV.” | Fixed |
| F-2-1 | `camera-scan` is registered once and its deterministic decoded value reaches the production barcode field callback. | Fixed |
| F-2-2 | SPA and static 404 pages use `h1` “Page not found.” | Fixed |

## 7. Structure, links, and visual identity

- `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, and the demo print deep link return 200. The `/license` content mismatch is F-3-1.
- Every inspected route has one `h1`, one `main`, `lang="en"`, a route title, description, canonical, Open Graph/Twitter metadata, favicon, consistent header/footer, and Privacy/Terms footer links.
- The social image is 1200 × 630; the apple-touch icon is 180 × 180. `robots.txt`, `sitemap.xml`, SPA rewrites, a true HTTP 404, and response-header CSP are present.
- All discovered internal links returned 200. The explicit email link is exempt. `https://sociobot.in/` returned 200 but fails the external-label requirement in F-3-4.
- SPA forward navigation and browser Back restored the correct URL and focused the route `h1`; direct deep links reloaded correctly.
- Initial app JavaScript is 33.29 kB raw / 11.18 kB gzip. Camera and barcode libraries are lazy chunks.
- The warm paper palette, black rules, registration-red accents, editorial type, engraved receiving-desk art, square controls, and print-sheet layout match `.factory/design.md`. The result is product-specific and not a generic SaaS template.

## 8. Missed leverage

No AI feature is justified. Barcode capture, matching, duplicate review, and export are deterministic, and runtime AI would add an unnecessary remote-data path. The brief-implied import/export needs are covered by supplier CSV input, CSV output, and complete JSON backup/restore. Sync would contradict the current local-only, no-account product. No missed-leverage finding is recorded.

## What would make this perfect

Remove or correctly rename the misleading `/license` route. State plainly whether the complete product is free or give the exact one-time price, and register that promise as a claim. Add supplier to the demo search hint. Label the Param Factory footer destination as external. Then rerun all claim commands, the aggregate local/live suites, the cold mobile first read, and the route/link crawl. No other gap was identified in this round.
