# Adversarial first-read review 1 — Barcode Intake Card

**Verdict: FAIL**

**Reviewed:** 28 August 2026

**Live site:** <https://barcode-intake-card.sociobot.in>

**Repository base:** `7d064b5937f8d56037a03157e9242b14dfc17427`

The first screen and isolated demo pass their core tests. The release still fails because a previously repaired 44 px touch-target defect is reproducible on production. There are also unlisted or overbroad claims, incomplete 404 structure, and copy that violates the supplied plain-words rules. A PASS requires zero findings.

## Findings

### F-1-1 — BLOCKING — The production Privacy email target is under 44 px

- **Exact location:** `/privacy`, link `privacy@sociobot.in`.
- **Evidence:** `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npx playwright test --grep 'visible controls meet'` failed twice. Chromium measured the link at `143.421875 × 43.9998779296875` CSS pixels at a 390 px viewport.
- **History:** `.factory/handoff.md` previously records “All visible links, buttons, and form controls measure at least 44 by 44 CSS pixels.” This is a regression of that earlier finding, so it is blocking under the review instructions.
- **Impact:** The live site misses the stated minimum target size, and its own production accessibility test fails.
- **Concrete fix:** Give ordinary inline links at least 45 CSS pixels of block size, or otherwise remove fractional layout loss while preserving a measured minimum of 44. Re-run the exact production test and require every measured dimension to be `>= 44`.

### F-1-2 — Major — “Any printed code” is an unlisted and false claim

- **Exact quote/location:** Landing → How it works → Capture the code: “Scan with your camera or enter any printed code.”
- **Evidence:** The app deliberately rejects characters outside printable ASCII. The regression test confirms that `部品-１２３` cannot be saved or printed.
- **Impact:** “Any” tells a first-time user that all printed codes are accepted when the supported input is narrower. No `.factory/claims.json` entry makes or tests this broad promise.
- **Concrete fix:** Replace it with: “Scan or type a code made from English letters, numbers, spaces, and punctuation.” Align the relevant claim text and test with that accepted character set.

### F-1-3 — Major — Reset and exit promises are absent from `claims.json`

- **Exact quotes/location:** README → Try the isolated demo: “Choose **Reset demo** to restore the samples.” and “Choose **Start for real** to clear the demo and leave without copying it.”
- **Evidence:** Both are observable promises. `demo-isolated` covers separation from real cards, while `demo-edit` covers search/edit/print. Neither claim states Reset behavior or clearing on exit. A regression test covers exit, but it is not registered as a claim; no tagged claim test covers the Reset control.
- **Impact:** The privacy-sensitive demo controls are not in the required claim inventory even though visitors are told to rely on them.
- **Concrete fix:** Add claim entries and exactly one tagged test for each promise, or one precisely worded combined claim with one test that edits data, resets it, edits again, starts for real, and confirms no copy or edit remains.

### F-1-4 — Major — The search claim test covers only one of four promised fields

- **Exact claim/location:** `search-cards`: “Searches saved cards by barcode, item, supplier, or location.”
- **Evidence:** `@claim:search-cards` enters only `Drawer C-03`, a location. It never searches by barcode, item name, or supplier.
- **Impact:** The command passes even if three quarters of the listed search behavior breaks.
- **Concrete fix:** In the one tagged test, run four searches against the demo—one for barcode, item name, supplier, and location—and assert the expected card is the only result each time.

### F-1-5 — Major — The “complete JSON backup” test does not verify complete restoration

- **Exact claim/location:** `json-backup`: “Exports and imports a complete JSON backup.”
- **Evidence:** The tagged test saves only barcode, name, and location. After import it checks only that the item name is visible. It does not compare supplier, quantity, notes, photo data, identifiers, or timestamps.
- **Impact:** A backup that silently drops optional fields or photos can pass the claim test.
- **Concrete fix:** Save a card with every field and a photo, export it, delete it, import it, then reopen the card and compare every stored field and the photo bytes or dimensions.

### F-1-6 — Major — The camera claim test proves startup, not scanning

- **Exact claim/location:** `camera-ready`: “Camera scanning is included and starts only after the scan action.”
- **Evidence:** The tagged test checks that a permitted fake camera opens and shows “Camera ready”. It never presents a barcode or asserts that a decoded value reaches the barcode field.
- **Impact:** A camera preview with a broken decoder still passes a claim that scanning is included.
- **Concrete fix:** Feed a deterministic barcode frame or video fixture through the camera path and assert the decoded value fills the barcode field and closes the scanner. Alternatively narrow every claim to “Camera preview opens” if decoding is not tested.

### F-1-7 — Minor — Demo copy uses an unlisted count and a subjective adjective

- **Exact quotes/locations:** Landing action note: “It opens three ready-made cards you can search, edit, and print.” README: “It loads three realistic workshop items in a separate IndexedDB database.”
- **Impact:** “Three” is not stated in the `demo-edit` claim, while “realistic” is subjective marketing copy. “IndexedDB” is unnecessary jargon in the demo introduction.
- **Concrete fix:** Use the registered promise: “It opens sample workshop cards you can search, edit, and print.” In README use: “It opens sample workshop cards stored separately from your real cards.” If the count matters, add it to the claim and assertion.

### F-1-8 — Minor — The live 404 omits the standard site structure and metadata

- **Exact location:** Any unknown URL, served by `public/404.html`; verified with `/review-1-missing-page`.
- **Evidence:** It correctly returns HTTP 404 and has a designed recovery action, one `h1`, one `main`, `lang`, and a route title. It does not include the shared header, footer, skip link, meta description, canonical, Open Graph/Twitter metadata, or favicons.
- **Impact:** The error route is visibly disconnected from every other route and does not meet the site-structure contract.
- **Concrete fix:** Render the same header/footer and skip link as the app, add the complete route metadata, and keep the current HTTP 404 response and recovery link.

### F-1-9 — Minor — The same output is called both “stock cards” and “item cards”

- **Exact quotes/locations:** `<title>`, OG, and Twitter title: “Barcode Intake Card — Make private stock cards.” Landing `h1`: “Turn scans into item cards.” How it works: “export every record”.
- **Impact:** A visitor must decide whether a stock card and item card are different things.
- **Concrete fix:** Use “item card” everywhere. Suggested title: “Barcode Intake Card — Make printable item cards.”

### F-1-10 — Minor — Decorative folio labels carry no product information

- **Exact quotes/location:** Landing hero: “Workshop utility no. 01” and “Local edition · 2026”.
- **Impact:** These invented publication labels are brand lore and do not help a visitor use or assess the product.
- **Concrete fix:** Delete both labels. Keep the visual rule if it is needed for the broadsheet identity.

### F-1-11 — Minor — The hero eyebrow is a mood line

- **Exact quote/location:** Landing hero: “From parcel to shelf”.
- **Impact:** It does not name the section or explain the product without the surrounding paragraph.
- **Concrete fix:** Replace it with “For mixed-stock intake” or remove it.

### F-1-12 — Minor — The hero caption is a slogan rather than usable guidance

- **Exact quote/location:** “Receive the odd parts first. Choose a stock system later.”
- **Impact:** “Odd parts” is ambiguous and the two imperatives do not describe a product capability.
- **Concrete fix:** Replace both sentences with: “Record mixed stock before choosing a full inventory system.”

### F-1-13 — Minor — “A card before a catalogue” is a metaphor heading

- **Exact quote/location:** Landing preview section heading: “A card before a catalogue”.
- **Impact:** The heading does not name the preview section when read out of context.
- **Concrete fix:** Replace it with: “Preview an item card”.

### F-1-14 — Minor — The preview description makes an unexplained visibility claim

- **Exact quote/location:** “Record the facts you know now. Keep uncertainty visible until you review the item.”
- **Impact:** The interface has no named uncertainty state, so “keep uncertainty visible” is vague and unlisted.
- **Concrete fix:** Replace both sentences with: “Review and update the item card before printing it.” Register that behavior if it remains a product claim.

### F-1-15 — Minor — “Print or move on” does not name the third step

- **Exact quote/location:** Landing → How it works, third step: “Print or move on”.
- **Impact:** “Move on” does not say what the product does next.
- **Concrete fix:** Replace it with: “Print or export the card”.

### F-1-16 — Minor — The limits heading uses jargon and a desk metaphor

- **Exact quote/location:** “Your intake desk, not an ERP”.
- **Impact:** A small seller may not know “ERP”, and the heading does not plainly name the section.
- **Concrete fix:** Replace it with: “What this tool does not do”.

### F-1-17 — Minor — The limits introduction is an empty slogan

- **Exact quote/location:** “The tool stays small on purpose.”
- **Impact:** It gives no usable detail and merely introduces the four concrete limits that follow it.
- **Concrete fix:** Delete it; the four limit statements already explain the scope.

### F-1-18 — Minor — The camera heading names checkout instead of the section

- **Exact quote/location:** “Scan without a checkout”.
- **Impact:** The section is about included camera scanning, but its heading is framed around a payment screen that does not exist.
- **Concrete fix:** Replace it with: “Camera scanning is included”.

### F-1-19 — Minor — The secondary CTA uses an inconsistent metaphor instead of naming the result

- **Exact quote/location:** Landing button: “Open the intake desk”. Related labels call the product a “receiving desk”, “intake desk”, “tool”, and “app”.
- **Impact:** The button opens a form; it does not open a desk. The changing product nouns weaken first-read consistency.
- **Concrete fix:** Change the button to “Record an item”. Refer to the product as “the tool” or “the app”, and call the destination “the intake form”.

### F-1-20 — Minor — README uses “offline-first” jargon

- **Exact quote/location:** README introduction: “Barcode Intake Card is an offline-first receiving desk for micro-sellers and workshops.”
- **Impact:** “Offline-first” is implementation language, while “receiving desk” is a metaphor.
- **Concrete fix:** Replace it with: “Barcode Intake Card records incoming stock for micro-sellers and workshops, and works offline after your first visit.”

### F-1-21 — Minor — README uses “one-up cards” jargon

- **Exact quote/location:** README → What it does: “Searches saved cards and prints one-up cards with Code 128 barcodes.”
- **Impact:** “One-up” is print-production jargon and is not used elsewhere.
- **Concrete fix:** Replace it with: “Searches saved cards and prints one item card per page with a Code 128 barcode.”

### F-1-22 — Minor — The footer contains non-usable asset copy

- **Exact quote/location:** Footer: “Hero art generated for this product.”
- **Impact:** The sentence does not help a visitor use or assess the tool and would work unchanged on another product page. Provenance is already recorded in `.factory/design.md`.
- **Concrete fix:** Remove it from the footer and retain the detailed provenance in `.factory/design.md`.

### F-1-23 — Minor — The supplier lookup file changes names

- **Exact quotes/locations:** Landing: “match a supplier CSV.” README: “Matches a barcode against a CSV file chosen by the user.”
- **Impact:** The second sentence drops “supplier”, making it less clear that both sentences describe the same optional lookup file.
- **Concrete fix:** Replace the README sentence with: “Matches a barcode against a supplier CSV you choose.” Use “supplier CSV” everywhere.

## 1. Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 with empty browser storage.

| Question | Mobile, before scrolling | Desktop, before scrolling |
| --- | --- | --- |
| What does this do? | Turns a barcode scan into an item card that can be kept locally and printed. | Same. |
| For whom? | Small sellers and workshops receiving mixed stock. | Same. |
| What should I click first? | “Try it with sample data”. The adjacent sentence says it opens cards to search, edit, and print. | Same. |

All three answers are visible without scrolling. At 390 px the action ends at 447 px, its explanation at 506 px, and all three facts end at 604 px. There was no horizontal overflow or console/page error. This step is not blocking.

## 2. Copy audit

Counting treats contractions, hyphenated terms, file names, and version numbers as one word. No landing or README sentence exceeds 22 words. No banned plain-words term appears. The copy flags are F-1-2, F-1-3, and F-1-7 through F-1-23.

### Landing page sentences

| # | Rendered sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Turn scans into item cards | 5 | Pass |
| 2 | For small sellers and workshops receiving mixed stock without a full inventory system. | 12 | Pass |
| 3 | It opens three ready-made cards you can search, edit, and print. | 11 | F-1-7 |
| 4 | Cards stay in this browser | 5 | Pass |
| 5 | Works offline after the first visit | 6 | Pass |
| 6 | Camera scanning is included | 4 | Pass |
| 7 | Receive the odd parts first. | 5 | F-1-12 |
| 8 | Choose a stock system later. | 5 | F-1-12 |
| 9 | Record the facts you know now. | 6 | F-1-14 |
| 10 | Keep uncertainty visible until you review the item. | 8 | F-1-14 |
| 11 | Use a scanner, type the code, or match a supplier CSV. | 11 | Pass |
| 12 | Scan with your camera or enter any printed code. | 9 | F-1-2 |
| 13 | Add its name, supplier, photo, quantity, and shelf location. | 9 | Pass |
| 14 | Print one card or export every record as CSV or JSON. | 11 | Pass |
| 15 | The tool stays small on purpose. | 6 | F-1-17 |
| 16 | No automatic web lookup. | 4 | Pass |
| 17 | Supplier and stock details do not leave your device. | 9 | Pass |
| 18 | No purchase orders. | 3 | Pass |
| 19 | This records arrivals. | 3 | Pass |
| 20 | It does not run procurement. | 5 | Pass |
| 21 | No account or sync. | 4 | Pass |
| 22 | Export a file when you need a backup or another system. | 11 | Pass |
| 23 | CSV lookups are explicit. | 4 | Pass |
| 24 | You choose the supplier file. | 5 | Pass |
| 25 | It is read in this browser. | 6 | Pass |
| 26 | Camera scanning, manual intake, and exports are included on this device. | 10 | Pass |
| 27 | The camera starts only after you choose Scan with camera. | 10 | Pass |
| 28 | Turn a barcode into a private, printable item card. | 9 | Pass |
| 29 | Hero art generated for this product. | 6 | F-1-22 |

### Landing headings, labels, and actions

| Exact copy | Words | Result |
| --- | ---: | --- |
| Workshop utility no. 01 | 4 | F-1-10 |
| Local edition · 2026 | 3 | F-1-10 |
| From parcel to shelf | 4 | F-1-11 |
| Try it with sample data | 6 | Pass; approved sample action |
| A card before a catalogue | 5 | F-1-13 |
| How it works | 3 | Pass |
| Capture the code | 3 | Pass |
| Review the item | 3 | Pass |
| Print or move on | 4 | F-1-15 |
| Your intake desk, not an ERP | 6 | F-1-16 |
| Camera reader | 2 | Pass |
| Scan without a checkout | 4 | F-1-18 |
| Open the intake desk | 4 | F-1-19 |

### README sentences and headings

| # | Rendered copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Barcode Intake Card | 3 | Pass |
| 2 | Turn a barcode scan into a private, printable item card. | 10 | Pass |
| 3 | Barcode Intake Card is an offline-first receiving desk for micro-sellers and workshops. | 12 | F-1-20 |
| 4 | It records mixed stock before you need an inventory system. | 10 | Pass |
| 5 | Cards, supplier CSV rows, and item photos stay in the browser. | 11 | Pass |
| 6 | Live site: https://barcode-intake-card.sociobot.in | 3 | Pass |
| 7 | Try the isolated demo | 4 | Pass |
| 8 | Open `/demo`, or visit https://barcode-intake-card.sociobot.in/demo. | 5 | Pass |
| 9 | It loads three realistic workshop items in a separate IndexedDB database. | 11 | F-1-7 |
| 10 | Choose **Reset demo** to restore the samples. | 7 | F-1-3 |
| 11 | Choose **Start for real** to clear the demo and leave without copying it. | 13 | F-1-3 |
| 12 | What it does | 3 | Pass |
| 13 | Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo. | 13 | Pass |
| 14 | Opens the device camera for barcode scanning with no account or checkout. | 12 | Pass |
| 15 | Matches a barcode against a CSV file chosen by the user. | 11 | F-1-23 |
| 16 | Warns about saved cards with the same barcode. | 8 | Pass |
| 17 | Searches saved cards and prints one-up cards with Code 128 barcodes. | 11 | F-1-21 |
| 18 | Printable codes use English letters, numbers, spaces, and punctuation. | 9 | Pass |
| 19 | Exports all cards as CSV or a complete JSON backup. | 10 | Pass |
| 20 | Imports its JSON backup and works offline after the first visit. | 11 | Pass |
| 21 | It does not scrape product databases, create purchase orders, or sync accounts. | 12 | Pass |
| 22 | Run locally | 2 | Pass |
| 23 | Node.js 20 or newer is recommended. | 6 | Pass |
| 24 | Open `http://localhost:5173`. | 2 | Pass |
| 25 | Use `http://localhost:5173/demo` for the test sandbox. | 6 | Pass |
| 26 | Test and build | 3 | Pass |
| 27 | `npm test` builds the production app, starts the preview server, and runs the Playwright claim, accessibility, mobile, and console checks. | 20 | Pass |
| 28 | Chromium for Playwright 1.58.2 is required. | 6 | Pass |
| 29 | The exact deployment command is `npm run build`. | 8 | Pass |
| 30 | Static output lands in `dist/`, with `dist/index.html` at its root. | 10 | Pass |
| 31 | Data and privacy | 3 | Pass |
| 32 | Real cards use IndexedDB database `barcode-intake-real`. | 6 | Pass; technical detail in the data section |
| 33 | Demo cards use `barcode-intake-demo`. | 4 | Pass |
| 34 | The app sends no item, barcode, CSV, or photo data to a third party. | 14 | Pass |
| 35 | It has no account, sync, checkout, or billing request. | 9 | Pass |
| 36 | The service worker caches the app shell. | 7 | Pass |
| 37 | Export a JSON backup before clearing site data or moving devices. | 11 | Pass |
| 38 | See `/privacy` and `/terms` in the app. | 7 | Pass |
| 39 | Camera scanning | 2 | Pass |
| 40 | Camera scanning, manual intake, and all exports are included. | 9 | Pass |
| 41 | Choose **Scan with camera** from the intake form to request camera access. | 12 | Pass |
| 42 | You can always type a barcode instead. | 7 | Pass |
| 43 | Deployment | 1 | Pass |
| 44 | Deploy `dist/` as a static site. | 6 | Pass |
| 45 | `staticwebapp.config.json` provides SPA routing, the 404 response, security headers, and MIME types. | 12 | Pass; appropriate deployment terminology |
| 46 | The factory manages DNS and infrastructure. | 6 | Pass |
| 47 | Project notes | 2 | Pass |
| 48 | Visual system and image provenance: `.factory/design.md` | 6 | Pass |
| 49 | Verifiable product claims: `.factory/claims.json` | 4 | Pass |
| 50 | Demo contract: `.factory/demo.md` | 3 | Pass |
| 51 | Final verification: `.factory/handoff.md` | 3 | Pass |
| 52 | License | 1 | Pass |
| 53 | MIT. | 1 | Pass |
| 54 | See `LICENSE`. | 2 | Pass |

### Terminology check

| Concept | Current terms | Required term | Result |
| --- | --- | --- | --- |
| Stored unit | item card, stock card, card, record | item card; “card” only after introduction | F-1-9 |
| Product/workspace | receiving desk, intake desk, tool, app | tool or app; “intake form” for the destination | F-1-19 |
| Identifying value | barcode, code, SKU | barcode or SKU where both are accepted | Pass |
| User-selected lookup file | supplier CSV, CSV file | supplier CSV | F-1-23 |
| Full portable copy | JSON backup, backup | JSON backup on first mention, then backup | Pass |
| Isolated sample state | demo | demo | Pass |

## 3. Demo and sandbox

- The landing action reaches `/demo` in one click.
- The first settled demo screen shows three named workshop cards with barcodes, suppliers, quantities, and locations.
- The persistent banner says: “Demo — sample data, nothing is saved to your real cards.” It includes **Reset demo** and **Start for real**.
- Editing a sample, choosing **Reset demo**, and checking the list removed the edit and restored the original card.
- Choosing **Start for real** opened `/intake` without a demo banner. `/records` then showed zero real cards.
- The fresh demo context used `barcode-intake-demo`; localStorage and sessionStorage were empty. The real database did not receive sample cards.
- The observed demo flow made no cross-origin request. The offline claim passed against production.

The behavior passes. The inventory gap is reported in F-1-3 and F-1-7.

## 4. Claim audit

Every exact command in `.factory/claims.json` was run separately after `npm ci` in a fresh temporary clone. All 15 passed from the local production build.

| Claim id | Result | Observable assertion |
| --- | --- | --- |
| `offline-reload` | PASS | Demo shell and navigation work after going offline. |
| `local-only` | PASS | CSV-derived fields and a reduced photo persist with no cross-origin request. |
| `manual-intake` | PASS | A typed barcode saves and appears in Cards. |
| `duplicate-review` | PASS | A matching saved barcode shows a review candidate. |
| `csv-lookup` | PASS | A chosen supplier CSV fills matching fields. |
| `csv-export` | PASS | The download has one row per demo card. |
| `search-cards` | COMMAND PASS; F-1-4 | Location search passes, but barcode, item, and supplier are untested. |
| `json-backup` | COMMAND PASS; F-1-5 | A basic card returns, but complete field/photo restoration is untested. |
| `print-card` | PASS | The printed Code 128 canvas has contrasting pixels and decodes correctly. |
| `demo-isolated` | PASS | Demo cards do not appear in real Cards. |
| `demo-edit` | PASS | A sample can be searched, edited, saved, and printed. |
| `camera-ready` | COMMAND PASS; F-1-6 | Camera starts only after the action; actual barcode decoding is untested. |
| `photo-reduction` | PASS | A 1600 × 1000 image is stored as 1200 × 750 JPEG. |
| `no-web-lookup` | PASS | Entering an unknown barcode sends no request and fills no item data. |
| `no-purchase-orders` | PASS | Saving makes no mutation request or purchase-order backup data. |

The full local suite passed 33/33. A first full production run had four transient service-worker/navigation timeouts; the affected PWA, `local-only`, `duplicate-review`, and mobile-navigation tests all passed immediately when rerun together. F-1-1 was the only repeatable production failure. Claim inventory or coverage findings remain in F-1-2 through F-1-7.

## 5. Offline and privacy behavior

- The production offline claim passed from a fresh browser context after the service worker cached `/demo`.
- The demo, CSV/photo save, camera, and barcode-entry checks observed no cross-origin request.
- The live response CSP restricts connections to self. HSTS, `nosniff`, strict-origin referrer policy, and camera-only permissions policy are present.
- Demo and real records use separate IndexedDB databases. Reset and exit behavior were exercised; no demo card appeared in real storage.

## 6. Earlier findings and handoff claims

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The complete `.factory/handoff.md` was checked. No repair was accepted on its status alone.

| Earlier handoff item | Live and code confirmation | Result |
| --- | --- | --- |
| Mobile LCP image discovered before JS; mobile asset and 3:2 ratio | `@regression:mobile-lcp` passed live; `/assets/receiving-desk-600.webp` was selected. | Fixed |
| Dead paid camera checkout removed | `@regression:checkout-dead-link` passed live; camera remains usable. | Fixed |
| Partial/malformed backup no longer corrupts Cards | Backup validation regression passed live and locally. | Fixed |
| Unsupported Unicode barcode gets a recovery path | Save rejection and legacy print recovery regression passed live. | Fixed |
| Start for real discards demo edits | Demo exit regression passed live; manual Reset also restored samples. | Fixed, but claim inventory is incomplete (F-1-3) |
| Supplier CSV can fill zero quantity | CSV lookup claim passed. | Fixed |
| Camera tracks end after Escape and route changes | Camera cleanup test passed live. | Fixed |
| Corrupt image has announced recovery copy | Corrupt-photo test passed live. | Fixed |
| Unknown routes return a designed HTTP 404 | Live unknown route returned 404 with recovery link. | Routing fixed; shared structure remains incomplete (F-1-8) |
| Every visible control is at least 44 × 44 | Production test repeatedly measured the Privacy email link below 44 px. | **Regressed — F-1-1** |

## 7. Site structure and identity

- Landing and all app routes have one `h1`, one `main`, `lang="en"`, route-specific browser titles, descriptions, and canonicals.
- The landing title follows the product-name/em-dash pattern and is under 60 characters, but its “stock card” term is inconsistent (F-1-9).
- The landing has canonical, Open Graph, Twitter card, a 1200 × 630 product image, SVG favicon, and 180 px apple-touch icon.
- `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, `/license`, and the demo print deep link returned 200. An unknown URL returned 404.
- SPA navigation moved focus to the new `h1`; the browser Back action returned from `/demo` to `/`.
- Rendered landing links returned 200, including the external Param Factory destination. App-route tests exercised demo edit/print and legal links without a dead destination.
- Header and footer are consistent on app routes. The static 404 exception is F-1-8.
- The monochrome broadsheet, engraved workshop art, square controls, red registration accents, and editorial spacing are product-specific. It does not resemble a generic SaaS gradient/card template.
- Axe found no serious or critical violations on the seven app routes. The factory URL verifier passed with no console errors, one `h1`, one `main`, `lang`, image alternatives, and named buttons. The touch-target regression remains F-1-1.

## 8. Missed leverage

No additional AI, sync, import, or export feature is justified by the brief. Supplier CSV lookup, CSV export, complete JSON backup/restore, photos, duplicates, camera/manual entry, search, and printing are present. Runtime AI would add network disclosure and key management to a job that is deterministic and intentionally local. Sync would contradict the stated no-account, local-first scope. No missed-leverage finding is recorded.

## What would make this perfect

Resolve F-1-1 through F-1-23, then repeat the entire audit from fresh mobile and desktop contexts. A perfect result has a production 44 px test that passes, no overbroad, unlisted, or partially tested claim, one term for item cards, literal section headings, a fully structured 404, all exact claim commands passing, and no remaining copy flag.
