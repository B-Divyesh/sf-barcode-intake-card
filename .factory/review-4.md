# Adversarial first-read review 4 — Barcode Intake Card

**Verdict: FAIL**

**Reviewed:** 29 August 2026  
**Live site:** <https://barcode-intake-card.sociobot.in>  
**Repository base:** `691805764b8a1e500eac63731da3a5c35a203339`

The real intake flow, one-click demo, sandbox isolation, claims, routing, and accessibility checks pass. The review still has three minor findings. The landing preview depicts an intake number and review status that real item cards do not have, a decorative figure label remains, and the README describes the build command as a deployment command. A PASS requires zero findings.

## Findings

### F-4-1 — Minor — The product preview shows fields that real item cards do not have

- **Exact quote/location:** Landing → **Preview an item card**: “INTAKE 0142” and “STATUS / Ready to review.”
- **Verification:** The live demo, intake form, saved-card list, and print card have no intake-number or status field. `src/types.ts` defines barcode, name, supplier, location, quantity, notes, photo, and timestamps only. No entry in `.factory/claims.json` promises an intake number or workflow status.
- **Why this misleads:** The section calls itself a preview of an item card, so a first-time visitor can reasonably expect the displayed fields to exist in the product.
- **Concrete fix:** Replace “INTAKE 0142” with “Sample item card.” Replace “STATUS / Ready to review” with a real field, such as “NOTES / Check bore before restocking.” Alternatively, implement the two fields and add a registered claim test that saves, edits, searches, and prints them.

### F-4-2 — Minor — “Fig. 01” is a decorative publication label

- **Exact quote/location:** Landing hero image caption: “Fig. 01 — Record mixed stock before choosing a full inventory system.”
- **Why this fails the copy rule:** “Fig. 01” carries no information and is invented publication styling. The useful sentence works without it.
- **Concrete fix:** Use “Record mixed stock before choosing a full inventory system.”

### F-4-3 — Minor — The README calls a build command a deployment command

- **Exact quote/location:** README → **Test and build**: “The exact deployment command is `npm run build`.”
- **Verification:** `npm run build` runs TypeScript and Vite and creates `dist/`; it does not deploy the files. The later deployment section correctly says to deploy `dist/` as a static site.
- **Why this misleads:** A maintainer following the sentence will build the site but will not deploy it.
- **Concrete fix:** Replace it with: “Build the deployable files with `npm run build`.”

## 1. Cold first read

Fresh Chromium contexts with empty storage opened production at 390 × 844 and 1440 × 900. No scrolling occurred before these answers were recorded.

| Question | 390 px phone | Desktop |
| --- | --- | --- |
| What does it do? | Turns scanned barcodes into printable item cards kept in the browser. | Same. |
| For whom? | Small sellers and workshops receiving mixed stock without a full inventory system. | Same. |
| What should I click first? | **Try it with sample data**; the adjacent sentence says the cards can be searched, edited, and printed. | Same. |

The action, explanation, and all three facts were fully visible in both first screens. The cold loads returned 200, had no script or page errors, had no horizontal overflow, and requested only same-origin HTML, JavaScript, CSS, and the responsive hero image. The opening gate passes.

## 2. Copy audit

Counts treat contractions, hyphenated terms, URLs, commands, and version numbers as one word. No sentence exceeds 22 words. No banned marketing adjective appears. F-4-1 through F-4-3 are the copy findings.

### Landing-page sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| 1 | 6 | Turn scanned barcodes into item cards | Pass |
| 2 | 13 | For small sellers and workshops receiving mixed stock without a full inventory system. | Pass |
| 3 | 11 | It opens sample workshop cards you can search, edit, and print. | Pass |
| 4 | 5 | Cards stay in this browser | Pass |
| 5 | 6 | Works offline after the first visit | Pass |
| 6 | 7 | Free to use — no account or checkout | Pass |
| 7 | 15 | An engraved workshop desk with parts, a parcel, a scanner, and a blank intake card. | Pass; image alternative |
| 8 | 11 | Fig. 01 — Record mixed stock before choosing a full inventory system. | **F-4-2** |
| 9 | 9 | Review and update the item card before printing it. | Pass |
| 10 | 11 | Scan a barcode, type the code, or match a supplier CSV. | Pass |
| 11 | 6 | Camera scanning fills the barcode field. | Pass |
| 12 | 10 | You can also type English letters, numbers, spaces, and punctuation. | Pass |
| 13 | 9 | Add its name, supplier, photo, quantity, and shelf location. | Pass |
| 14 | 11 | Print one card or export every record as CSV or JSON. | Pass |
| 15 | 4 | No automatic web lookup. | Pass |
| 16 | 9 | Supplier and stock details do not leave your device. | Pass |
| 17 | 3 | No purchase orders. | Pass |
| 18 | 3 | This records arrivals. | Pass |
| 19 | 5 | It does not run procurement. | Pass |
| 20 | 4 | No account or sync. | Pass |
| 21 | 11 | Export a file when you need a backup or another system. | Pass |
| 22 | 4 | CSV lookups are explicit. | Pass |
| 23 | 5 | You choose the supplier file. | Pass |
| 24 | 6 | It is read in this browser. | Pass |
| 25 | 10 | Camera scanning, manual entry, and exports are free to use. | Pass |
| 26 | 10 | The camera starts only after you choose Scan with camera. | Pass |
| 27 | 9 | Turn a barcode into a private, printable item card. | Pass |

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Barcode Intake Card | 3 | Pass; product name |
| Private item cards | 3 | Pass; wordmark descriptor |
| For mixed-stock intake | 3 | Pass |
| Try it with sample data | 6 | Pass; result-naming action |
| Preview an item card | 4 | Pass |
| Intake 0142 | 2 | **F-4-1** |
| Status / Ready to review | 4 | **F-4-1** |
| How it works | 3 | Pass |
| Capture the code | 3 | Pass |
| Review the item | 3 | Pass |
| Print or export the card | 5 | Pass |
| What this tool does not do | 6 | Pass |
| Camera reader | 2 | Pass |
| Scan barcodes with the camera | 5 | Pass |
| Record an item | 3 | Pass; result-naming action |
| Built by Param Factory (external site) | 6 | Pass; destination type is stated |

The remaining navigation and field labels use consistent terms. The primary and secondary actions name their results.

### README sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| 1 | 10 | Turn a barcode scan into a private, printable item card. | Pass |
| 2 | 17 | Barcode Intake Card records incoming stock for micro-sellers and workshops, and works offline after your first visit. | Pass |
| 3 | 11 | Cards, supplier CSV rows, and item photos stay in the browser. | Pass |
| 4 | 10 | It is free to use with no account or checkout. | Pass |
| 5 | 3 | Live site: https://barcode-intake-card.sociobot.in | Pass |
| 6 | 5 | Open `/demo`, or visit https://barcode-intake-card.sociobot.in/?demo=1. | Pass |
| 7 | 11 | It opens sample workshop cards stored separately from your real cards. | Pass |
| 8 | 7 | Choose **Reset demo** to restore the samples. | Pass |
| 9 | 13 | Choose **Start for real** to clear the demo and leave without copying it. | Pass |
| 10 | 13 | Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo. | Pass |
| 11 | 11 | Opens a camera preview only after you choose Scan with camera. | Pass |
| 12 | 11 | Fills the barcode field when the camera reader decodes a barcode. | Pass |
| 13 | 9 | Matches a barcode against a supplier CSV you choose. | Pass |
| 14 | 8 | Warns about saved cards with the same barcode. | Pass |
| 15 | 15 | Searches saved cards and prints one item card per page with a Code 128 barcode. | Pass |
| 16 | 9 | Printable codes use English letters, numbers, spaces, and punctuation. | Pass |
| 17 | 10 | Exports all cards as CSV or a complete JSON backup. | Pass |
| 18 | 11 | Imports its JSON backup and works offline after the first visit. | Pass |
| 19 | 12 | It does not scrape product databases, create purchase orders, or sync accounts. | Pass |
| 20 | 6 | Node.js 20 or newer is recommended. | Pass |
| 21 | 2 | Open `http://localhost:5173`. | Pass |
| 22 | 6 | Use `http://localhost:5173/demo` for the test sandbox. | Pass |
| 23 | 20 | `npm test` builds the production app, starts the preview server, and runs the Playwright claim, accessibility, mobile, and console checks. | Pass |
| 24 | 6 | Chromium for Playwright 1.58.2 is required. | Pass |
| 25 | 8 | The exact deployment command is `npm run build`. | **F-4-3** |
| 26 | 10 | Static output lands in `dist/`, with `dist/index.html` at its root. | Pass |
| 27 | 6 | Real cards use IndexedDB database `barcode-intake-real`. | Pass |
| 28 | 4 | Demo cards use `barcode-intake-demo`. | Pass |
| 29 | 14 | The app sends no item, barcode, CSV, or photo data to a third party. | Pass |
| 30 | 9 | It has no account, sync, checkout, or billing request. | Pass |
| 31 | 7 | The service worker caches the app shell. | Pass |
| 32 | 11 | Export a JSON backup before clearing site data or moving devices. | Pass |
| 33 | 7 | See `/privacy` and `/terms` in the app. | Pass |
| 34 | 10 | Camera scanning, manual intake, and exports are free to use. | Pass |
| 35 | 8 | Choose **Scan with camera** to open the preview. | Pass |
| 36 | 7 | A decoded barcode fills the barcode field. | Pass |
| 37 | 6 | You can always type it instead. | Pass |
| 38 | 6 | Deploy `dist/` as a static site. | Pass |
| 39 | 12 | `staticwebapp.config.json` provides SPA routing, the 404 response, security headers, and MIME types. | Pass |
| 40 | 6 | The factory manages DNS and infrastructure. | Pass |
| 41 | 6 | Visual system and image provenance: `.factory/design.md` | Pass |
| 42 | 4 | Verifiable product claims: `.factory/claims.json` | Pass |
| 43 | 3 | Demo contract: `.factory/demo.md` | Pass |
| 44 | 3 | Final verification: `.factory/handoff.md` | Pass |
| 45 | 1 | MIT. | Pass |
| 46 | 2 | See `LICENSE`. | Pass |

README headings are literal and useful: **Barcode Intake Card** (3), **Try the isolated demo** (4), **What it does** (3), **Run locally** (2), **Test and build** (3), **Data and privacy** (3), **Camera scanning** (2), **Deployment** (1), **Project notes** (2), and **License** (1).

### Terminology

| Concept | Term | Result |
| --- | --- | --- |
| Saved unit | item card; card after introduction | Pass |
| Identifying value | barcode; “Barcode or SKU” where both are accepted | Pass |
| Lookup file | supplier CSV | Pass |
| Portable full copy | JSON backup; backup after introduction | Pass |
| Sample state | demo | Pass |
| Camera feature | camera scanning | Pass |

## 3. Demo and sandbox

- The first-screen action opened `/?demo=1` in one click.
- The first settled screen had h1 **Review sample intake cards** and showed three named workshop records with barcodes, suppliers, locations, quantities, Edit card, and Print card actions.
- The persistent banner read **“Demo — sample data, nothing is saved to your real cards.”** It included **Reset demo** and **Start for real**.
- Editing the bearing note and choosing Reset restored **“Check bore before restocking.”** Editing again and choosing Start for real discarded the demo change. Reopening the demo restored the original samples.
- A real card created before the demo remained present after edit, reset, and exit. Demo data never appeared in the real card list.
- The complete landing, real-card, demo, reset, and exit flow made no cross-origin request and logged no script or page error.

The demo gate and sandbox-isolation check pass.

## 4. Claims

A clean clone was created at `/tmp/barcode-intake-review4-clean-WatdhN` from the reviewed base. `npm ci` passed with zero audit vulnerabilities. Every exact command in `.factory/claims.json` then ran individually; all 18 passed.

| Claim id | Result |
| --- | --- |
| `offline-reload` | PASS |
| `free-no-checkout` | PASS |
| `local-only` | PASS |
| `manual-intake` | PASS |
| `duplicate-review` | PASS |
| `csv-lookup` | PASS |
| `csv-export` | PASS |
| `search-cards` | PASS |
| `json-backup` | PASS |
| `print-card` | PASS |
| `demo-isolated` | PASS |
| `demo-edit` | PASS |
| `demo-reset-exit` | PASS |
| `camera-ready` | PASS |
| `camera-scan` | PASS |
| `photo-reduction` | PASS |
| `no-web-lookup` | PASS |
| `no-purchase-orders` | PASS |

Each claim tag occurs exactly once in the test suite. The aggregate clean-clone `npm test` run passed **36/36**, produced `dist/`, and built initial application JavaScript at 11.05 kB gzip. The aggregate production suite also passed **36/36**. F-4-1 is the only unlisted implied product capability found; F-4-3 is an inaccurate maintainer instruction rather than a runtime product claim.

## 5. Earlier findings rechecked

Every earlier review finding was checked on production and in the current code or tests. None has regressed.

| Earlier id | Current confirmation | Result |
| --- | --- | --- |
| F-1-1 | Live 390 px target test passes on all routes, including the Privacy email link. | Fixed |
| F-1-2 | Copy and validation state the printable character set; “any printed code” is absent. | Fixed |
| F-1-3 | Reset and exit are registered in `demo-reset-exit` and pass live. | Fixed |
| F-1-4 | Search test covers barcode, item, supplier, and location. | Fixed |
| F-1-5 | Backup test restores and exact-compares every stored field and the photo. | Fixed |
| F-1-6 | Preview timing and decoded-to-field behavior have separate passing claims. | Fixed |
| F-1-7 | No unsupported sample count or subjective “realistic” copy remains on landing or README. | Fixed |
| F-1-8 | Unknown URLs return a designed HTTP 404 with shared structure and metadata. | Fixed |
| F-1-9 | Titles and product copy use “item card.” | Fixed |
| F-1-10 | Workshop-utility and local-edition folios remain absent. | Fixed; F-4-2 covers a different remaining figure label |
| F-1-11 | The eyebrow remains the literal “For mixed-stock intake.” | Fixed |
| F-1-12 | The hero caption gives direct intake guidance. | Fixed; F-4-2 concerns only its decorative prefix |
| F-1-13 | The preview heading is “Preview an item card.” | Fixed |
| F-1-14 | Preview guidance tells the visitor to review and update before printing. | Fixed |
| F-1-15 | Step three is “Print or export the card.” | Fixed |
| F-1-16 | The limits heading is “What this tool does not do.” | Fixed |
| F-1-17 | The empty limits slogan remains absent. | Fixed |
| F-1-18 | The camera section is named “Scan barcodes with the camera.” | Fixed |
| F-1-19 | The action remains “Record an item” and opens the intake form. | Fixed |
| F-1-20 | README avoids “offline-first” and the receiving-desk metaphor. | Fixed |
| F-1-21 | README says one item card per page. | Fixed |
| F-1-22 | Asset-provenance lore remains absent from the footer. | Fixed |
| F-1-23 | App and README consistently use “supplier CSV.” | Fixed |
| F-2-1 | `camera-scan` is registered once and the decoded fixture reaches the real barcode-field callback. | Fixed |
| F-2-2 | SPA and static 404 pages use h1 “Page not found.” | Fixed |
| F-3-1 | `/license` returns 301 to `/intake` and is absent from the sitemap and app routes. | Fixed |
| F-3-2 | The first screen says “Free to use — no account or checkout”; the registered claim passes. | Fixed |
| F-3-3 | Demo search guidance includes barcode, item, supplier, and location at 390 px. | Fixed |
| F-3-4 | The footer visibly labels Param Factory as an external site. | Fixed |

## 6. Structure, routing, accessibility, and identity

- `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, and `/print/demo-bearing?demo=1` returned 200. A fresh unknown URL returned HTTP 404. `/license` returned 301 to `/intake`.
- Every inspected route had `lang="en"`, one `h1`, one `main`, a route-specific title, description, canonical, Open Graph/Twitter metadata, SVG favicon, apple-touch icon, shared header/footer, and Privacy/Terms links.
- The home title is **Barcode Intake Card — Make printable item cards** (47 characters). Route titles follow the route-name/product pattern.
- The internal and external link crawl found no dead link. All app and demo deep links returned 200; `https://sociobot.in/` returned 200; the email link is explicit.
- SPA navigation and browser Back restored the correct route and focused its h1. The polite route announcement is present.
- The clean and live suites found no serious or critical axe violation. The 390 px overflow, keyboard skip-link, 44 px touch-target, camera cleanup, reduced-motion, and console checks passed.
- `/opt/fleet/lib/verify-url.sh` passed production: title, `lang=en`, one h1, main, image alternatives, labelled buttons, and no console errors.
- The warm paper palette, black rules, red registration marks, engraved workshop illustration, editorial type, square controls, and print-sheet rhythm match `.factory/design.md`. The result is recognisably product-specific rather than a generic SaaS template.

## 7. Missed leverage

No AI feature is justified for this deterministic, local-first job. The brief-implied lookup and transfer needs are covered by supplier CSV matching, CSV export, and complete JSON backup/restore. Sync would conflict with the current local-only, no-account promise. No missed-leverage finding is recorded.

## What would make this perfect

Make the static product preview match the fields the real cards contain, remove the decorative “Fig. 01” prefix, and describe `npm run build` as a build command rather than a deployment command. Then rerun the full landing/README copy audit, all 18 claim commands, the clean and live suites, and the cold mobile first-read check. No other gap was identified in this round.
