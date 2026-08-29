# Adversarial first-read review 6 — Barcode Intake Card

**Verdict: FAIL**

**Reviewed:** 29 August 2026  
**Live site:** <https://barcode-intake-card.sociobot.in>  
**Repository base:** `e81599a998a54e47b1c94917936631f6d190aca4`

The first screen, demo, offline behavior, privacy boundary, routes, and all 18
registered claim commands work. The release still fails because three earlier
findings were only partly fixed. The supported-character promise remains
outside the claim inventory, and two landing sentences still rename concepts
that the product's own terminology table says must remain consistent. The
clean aggregate suite also produced one non-claim camera-test failure before
passing on repetition. A PASS requires zero findings.

## Findings

### F-6-1 — BLOCKING — F-1-2 remains half-fixed: the printable-character promise is not a registered, complete claim

- **Exact quotes:** Landing → Capture the code: “You can also type English
  letters, numbers, spaces, and punctuation.” README → What it does:
  “Printable codes use English letters, numbers, spaces, and punctuation.”
- **Claim inventory:** `.factory/claims.json` has `print-card`, but its claim is
  only “Creates a printable one-up card with a barcode.” It does not state the
  supported character set.
- **Test gap:** `@claim:print-card` rejects `部品-１２３`, then renders and decodes
  the digits-only demo value `5901234123457`. It never prints and decodes a
  value containing English letters, a space, and punctuation. Passing this
  test therefore cannot detect a regression in most of the advertised set.
- **History:** F-1-2 required the replacement copy **and** alignment of the
  claim text and test with the accepted character set. The copy changed, but
  the claim contract and positive test did not. Polish 1–5 marked the finding
  fixed without verifying that last requirement.
- **Why this matters:** A visitor is told which supplier codes are safe to
  print. The registered test proves only digits, so the assurance is broader
  than its evidence.
- **Concrete fix:** Expand `print-card` to state that Code 128 output supports
  English letters, numbers, spaces, and standard punctuation. Save, print,
  and decode a representative value such as `PART A-12/3`, and assert the
  decoded value exactly matches the input. Alternatively add one dedicated
  `printable-character-set` claim and exactly one tagged test.

### F-6-2 — BLOCKING — F-1-9 remains half-fixed: “item card” becomes “record”

- **Exact quote/location:** Landing → How it works → Print or export the card:
  “Print one card or export every record as CSV or JSON.”
- **Contradicting terminology:** The headline, title, footer, README, and
  `.factory/copy-audit.md` name the stored unit an **item card**. The audit's
  terminology table explicitly maps “Stored record” to “item card.”
- **History:** F-1-9 identified `record` as one of the competing output terms
  and required “item card” everywhere. “Stock card” was removed, but this
  sentence remained in every later reviewed release. That makes the earlier
  finding half-fixed and blocking again.
- **Why this matters:** A first-time visitor must infer whether a record is a
  different export object or the same item card.
- **Concrete rewrite:** “Print one item card, or export all cards as CSV or
  JSON.”

### F-6-3 — BLOCKING — F-1-23 remains half-fixed: “supplier CSV” becomes “supplier file”

- **Exact quotes/location:** Landing → How it works: “Scan a barcode, type the
  code, or match a supplier CSV.” Landing → What this tool does not do: “You
  choose the supplier file.”
- **Contradicting terminology:** `.factory/copy-audit.md` says the sole term
  for this concept is **supplier CSV**. The second sentence changes the name.
- **History:** F-1-23 required “supplier CSV” everywhere. The README was fixed,
  but this landing sentence remained. Polish 1–5 incorrectly describe
  “supplier CSV” as the sole live term.
- **Why this matters:** “Supplier file” can mean a PDF, spreadsheet, image, or
  other document even though the picker accepts CSV.
- **Concrete rewrite:** “You choose the supplier CSV.”

### F-6-4 — Minor — The Terms h1 does not name the page

- **Exact quote/location:** `/terms` h1: “Use the tool as your own record.”
- **Why this matters:** The phrase is grammatically unclear—a tool is not a
  record—and a heading list does not identify it as the terms page.
- **Concrete rewrite:** “Terms for using Barcode Intake Card.”

### F-6-5 — Minor — The clean aggregate camera regression is nondeterministic

- **Exact location:** `tests/zz-accessibility.spec.ts`, “camera tracks end
  after Escape and route teardown,” at the first `scanner-video.srcObject`
  poll.
- **Evidence:** The first clean-clone `npm test` run failed 39/40 after seven
  seconds because the track state was `undefined`, not `live`. The same test
  then passed five consecutive isolated runs; a second clean aggregate and
  the complete live suite passed 40/40.
- **Why this matters:** A required local quality gate is not dependable on its
  first run, and this race can hide a scanner-start or teardown regression.
- **Concrete fix:** Give this test a deterministic `MediaStream` fixture and
  assert the app does not announce “Camera ready” until the video owns a live
  track. Run the clean aggregate repeatedly with zero retries before closing
  the finding.

## 1. Cold first read

Fresh, storage-empty Chromium contexts opened production at 390 × 844 and
1440 × 900. No scrolling occurred before these answers were recorded.

| Question | Phone | Desktop |
| --- | --- | --- |
| What does this do? | Turns scanned barcodes into item cards. | Same. |
| For whom? | Small sellers and workshops receiving mixed stock without a full inventory system. | Same. |
| What should I click first? | **Try it with sample data**; adjacent copy says it opens cards to search, edit, and print. | Same. |

The complete headline, audience sentence, primary action, action result, and
three privacy/offline/price facts were visible in both first screens. Both
loads returned 200, remained at `scrollY = 0`, and logged no console or page
error. This gate passes. Evidence:
`qa-evidence/review-6/cold-mobile.png` and `cold-desktop.png`.

## 2. Copy audit

Counts treat contractions, hyphenated terms, URLs, file names, and version
numbers as one word. Punctuation-only separators are not words. No sentence
exceeds 22 words and no banned marketing word appears. The terminology flags
are F-6-2 and F-6-3. F-6-1 is the claim-registration gap behind otherwise
plain copy.

### Landing-page sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| 1 | 6 | Turn scanned barcodes into item cards | Pass; h1 |
| 2 | 13 | For small sellers and workshops receiving mixed stock without a full inventory system. | Pass |
| 3 | 11 | It opens sample workshop cards you can search, edit, and print. | Pass |
| 4 | 5 | Cards stay in this browser | Pass |
| 5 | 6 | Works offline after the first visit | Pass |
| 6 | 7 | Free to use — no account or checkout | Pass |
| 7 | 15 | An engraved workshop desk with parts, a parcel, a scanner, and a blank intake card. | Pass; image alternative |
| 8 | 9 | Record mixed stock before choosing a full inventory system. | Pass |
| 9 | 9 | Review and update the item card before printing it. | Pass |
| 10 | 4 | Check bore before restocking. | Pass; sample note |
| 11 | 11 | Scan a barcode, type the code, or match a supplier CSV. | Pass |
| 12 | 6 | Camera scanning fills the barcode field. | Pass |
| 13 | 10 | You can also type English letters, numbers, spaces, and punctuation. | F-6-1 |
| 14 | 9 | Add its name, supplier, photo, quantity, and shelf location. | Pass |
| 15 | 11 | Print one card or export every record as CSV or JSON. | F-6-2 |
| 16 | 4 | No automatic web lookup. | Pass |
| 17 | 9 | Supplier and stock details do not leave your device. | Pass |
| 18 | 3 | No purchase orders. | Pass |
| 19 | 3 | This records arrivals. | Pass |
| 20 | 5 | It does not run procurement. | Pass |
| 21 | 4 | No account or sync. | Pass |
| 22 | 11 | Export a file when you need a backup or another system. | Pass |
| 23 | 4 | CSV lookups are explicit. | Pass |
| 24 | 5 | You choose the supplier file. | F-6-3 |
| 25 | 6 | It is read in this browser. | Pass |
| 26 | 10 | Camera scanning, manual entry, and exports are free to use. | Pass |
| 27 | 10 | The camera starts only after you choose Scan with camera. | Pass |
| 28 | 9 | Turn a barcode into a private, printable item card. | Pass; footer |

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Barcode Intake Card | 3 | Pass; wordmark |
| Private item cards | 3 | Pass; informative descriptor |
| For mixed-stock intake | 3 | Pass |
| Try it with sample data | 6 | Pass; result-naming primary action |
| Preview an item card | 4 | Pass |
| Sample item card | 3 | Pass |
| 608ZZ shielded bearing | 3 | Pass; sample item name |
| Location / Quantity / Notes | 3 | Pass; real field labels |
| How it works | 3 | Pass |
| Capture the code | 3 | Pass |
| Review the item | 3 | Pass |
| Print or export the card | 5 | Pass |
| What this tool does not do | 6 | Pass |
| Camera reader | 2 | Pass |
| Scan barcodes with the camera | 5 | Pass |
| Record an item | 3 | Pass; result-naming action |
| Intake / Cards / Demo / Privacy | 4 | Pass; navigation destinations |
| Privacy / Terms / Built by Param Factory (external site) | 8 | Pass; footer destinations |

### README sentences

| # | Words | Sentence | Result |
| ---: | ---: | --- | --- |
| 1 | 10 | Turn a barcode scan into a private, printable item card. | Pass |
| 2 | 17 | Barcode Intake Card records incoming stock for micro-sellers and workshops, and works offline after your first visit. | Pass |
| 3 | 11 | Cards, supplier CSV rows, and item photos stay in the browser. | Pass |
| 4 | 10 | It is free to use with no account or checkout. | Pass |
| 5 | 5 | Open `/demo`, or visit <https://barcode-intake-card.sociobot.in/?demo=1>. | Pass |
| 6 | 11 | It opens sample workshop cards stored separately from your real cards. | Pass |
| 7 | 7 | Choose **Reset demo** to restore the samples. | Pass |
| 8 | 13 | Choose **Start for real** to clear the demo and leave without copying it. | Pass |
| 9 | 13 | Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo. | Pass |
| 10 | 11 | Opens a camera preview only after you choose Scan with camera. | Pass |
| 11 | 11 | Fills the barcode field when the camera reader decodes a barcode. | Pass |
| 12 | 9 | Matches a barcode against a supplier CSV you choose. | Pass |
| 13 | 8 | Warns about saved cards with the same barcode. | Pass |
| 14 | 15 | Searches saved cards and prints one item card per page with a Code 128 barcode. | Pass |
| 15 | 9 | Printable codes use English letters, numbers, spaces, and punctuation. | F-6-1 |
| 16 | 10 | Exports all cards as CSV or a complete JSON backup. | Pass |
| 17 | 11 | Imports its JSON backup and works offline after the first visit. | Pass |
| 18 | 12 | It does not scrape product databases, create purchase orders, or sync accounts. | Pass |
| 19 | 6 | Node.js 20 or newer is recommended. | Pass |
| 20 | 2 | Open `http://localhost:5173`. | Pass |
| 21 | 6 | Use `http://localhost:5173/demo` for the test sandbox. | Pass |
| 22 | 20 | `npm test` builds the production app, starts the preview server, and runs the Playwright claim, accessibility, mobile, and console checks. | F-6-5 |
| 23 | 6 | Chromium for Playwright 1.58.2 is required. | Pass |
| 24 | 8 | Build the deployable files with `npm run build`. | Pass |
| 25 | 10 | Static output lands in `dist/`, with `dist/index.html` at its root. | Pass |
| 26 | 12 | Your real cards and sample cards are stored separately in this browser. | Pass |
| 27 | 14 | The app sends no item, barcode, CSV, or photo data to a third party. | Pass |
| 28 | 9 | It has no account, sync, checkout, or billing request. | Pass |
| 29 | 8 | The app works offline after your first visit. | Pass |
| 30 | 11 | Export a JSON backup before clearing site data or moving devices. | Pass |
| 31 | 7 | See `/privacy` and `/terms` in the app. | Pass |
| 32 | 10 | Camera scanning, manual entry, and exports are free to use. | Pass |
| 33 | 8 | Choose **Scan with camera** to open the preview. | Pass |
| 34 | 7 | A decoded barcode fills the barcode field. | Pass |
| 35 | 6 | You can always type it instead. | Pass |
| 36 | 6 | Deploy `dist/` as a static site. | Pass |
| 37 | 17 | `staticwebapp.config.json` sends app routes to the right page, returns the designed 404 page, and sets security headers. | Pass |
| 38 | 6 | The factory manages DNS and infrastructure. | Pass |
| 39 | 1 | MIT. | Pass |
| 40 | 2 | See [`LICENSE`](LICENSE). | Pass |

README headings are literal: **Barcode Intake Card** (3), **Try the isolated
demo** (4), **What it does** (3), **Run locally** (2), **Test and build** (3),
**Data and privacy** (3), **Camera scanning** (2), **Deployment** (1),
**Project notes** (2), and **License** (1). Its bold action names—**Reset demo**
(2), **Start for real** (3), and **Scan with camera** (3)—are direct. “Live
site” and the four project-note labels are descriptive fragments, not
sentences; none adds a flag.

### Terminology

| Concept | Required term | Observed exception | Result |
| --- | --- | --- | --- |
| Stored unit | item card; card after introduction | “every record” | F-6-2 |
| Identifying value | barcode | None | Pass |
| Physical storage note | location | None | Pass |
| Lookup file | supplier CSV | “supplier file” | F-6-3 |
| Full portable copy | JSON backup; backup after introduction | None | Pass |
| Isolated sample state | demo | None | Pass |
| Camera feature | camera scanning | None | Pass |

## 3. Demo and sandbox

- The first-screen action opened `/?demo=1` in one click.
- The first settled screen already showed three specific records: 608ZZ
  shielded bearing, USB-C panel cable, and thermal labels, with barcodes,
  suppliers, quantities, locations, and edit/print actions.
- The persistent banner read “Demo — sample data, nothing is saved to your real
  cards.” It contained **Reset demo** and **Start for real**.
- Editing the bearing note, resetting, and reopening it restored “Check bore
  before restocking.” Starting for real cleared the demo change and removed
  the banner.
- A separately created real control card remained present after entering,
  resetting, and leaving the demo. No sample item appeared in real Cards.
- IndexedDB exposed separate `barcode-intake-demo` and
  `barcode-intake-real` databases. The complete observed demo flow made 19
  same-origin requests and zero cross-origin requests; it logged no error.

The demo gate passes. Evidence:
`qa-evidence/review-6/demo-mobile-settled.png`.

## 4. Claims

A clean clone at `/tmp/barcode-review6-clean-F9iLLE` ran every exact `test`
command from `.factory/claims.json` separately. All 18 passed. Each claim tag
occurs exactly once in the test suite.

| Claim id | Result | Evidence checked |
| --- | --- | --- |
| `offline-reload` | PASS | Cached demo routes worked after the context went offline. |
| `free-no-checkout` | PASS | Record, print, and CSV export completed without account, checkout, or payment request. |
| `local-only` | PASS | CSV-derived fields and a photo persisted after reload with no cross-origin request. |
| `manual-intake` | PASS | A typed item with all fields and photo saved and reopened. |
| `duplicate-review` | PASS | An existing demo barcode produced a review candidate. |
| `csv-lookup` | PASS | A chosen supplier CSV filled the matching fields, including quantity zero. |
| `csv-export` | PASS | CSV contained a header and one row per demo card. |
| `search-cards` | PASS | Barcode, item, supplier, and location searches each isolated the expected card. |
| `json-backup` | PASS | Every field, timestamp, and photo matched after export, delete, and import. |
| `print-card` | PASS, incomplete public scope | The numeric demo barcode rendered and decoded; see F-6-1 for the unregistered character-set promise. |
| `demo-isolated` | PASS | Demo cards did not enter the real card list. |
| `demo-edit` | PASS | A sample was searched, edited, saved, and printed. |
| `demo-reset-exit` | PASS | Reset restored samples and exit discarded demo changes. |
| `camera-ready` | PASS | The preview appeared only after the scan action. |
| `camera-scan` | PASS | A deterministic decoded value filled the live barcode field and closed the dialog. |
| `photo-reduction` | PASS | A 1600 × 1000 image was stored as a 1200 × 750 JPEG. |
| `no-web-lookup` | PASS | Unknown barcode entry caused no request or automatic field fill. |
| `no-purchase-orders` | PASS | Saving caused no mutation request or purchase-order backup data. |

No listed claim command failed. F-6-1 is an unlisted/under-specified public
claim, not a failure of an existing tagged command.

The first aggregate clean-clone run built `dist/` and passed 39/40; its one
failure is F-6-5. Five immediate isolated reruns passed, the second clean
`npm test` passed 40/40, and the production suite passed 40/40. The build's
initial app JavaScript is 33.22 KB raw / 11.21 KB gzip; scanner and barcode
chunks are lazy.

## 5. Earlier findings and polish claims

All five earlier reviews, all five polish reports, and the previous handoff
were read. The status below comes from current live behavior and code/tests,
not the reports' “fixed” labels.

| Earlier id | Current verification | Result |
| --- | --- | --- |
| F-1-1 | Live 390 px suite measures every visible control at least 44 px, including the Privacy email link. | Fixed |
| F-1-2 | Copy names a character set, but `claims.json` and the positive print test do not cover that set. | **Half-fixed — F-6-1** |
| F-1-3 | `demo-reset-exit` passed reset and exit isolation. | Fixed |
| F-1-4 | `search-cards` covers barcode, item, supplier, and location. | Fixed |
| F-1-5 | `json-backup` compares every stored value and photo after restore. | Fixed |
| F-1-6 | Separate camera-start and decode-to-field claims pass. | Fixed |
| F-1-7 | No unsupported sample count or “realistic” promise remains. | Fixed |
| F-1-8 | Unknown URL returns a shared-shell, metadata-complete HTTP 404. | Fixed |
| F-1-9 | “Stock card” is gone, but the landing still calls item cards “record.” | **Half-fixed — F-6-2** |
| F-1-10 | Decorative workshop/local-edition folios remain absent. | Fixed |
| F-1-11 | Hero eyebrow remains “For mixed-stock intake.” | Fixed |
| F-1-12 | Hero caption is direct mixed-stock guidance. | Fixed |
| F-1-13 | Preview heading remains “Preview an item card.” | Fixed |
| F-1-14 | Preview guidance names review and update before print. | Fixed |
| F-1-15 | Step three is “Print or export the card.” | Fixed |
| F-1-16 | Limits heading is “What this tool does not do.” | Fixed |
| F-1-17 | Empty limits slogan remains absent. | Fixed |
| F-1-18 | Camera section is “Scan barcodes with the camera.” | Fixed |
| F-1-19 | “Record an item” opens the intake form. | Fixed |
| F-1-20 | README contains no “offline-first” or receiving-desk metaphor. | Fixed |
| F-1-21 | README says “one item card per page.” | Fixed |
| F-1-22 | Asset lore remains absent from the footer. | Fixed |
| F-1-23 | README uses “supplier CSV,” but the landing still says “supplier file.” | **Half-fixed — F-6-3** |
| F-2-1 | `camera-scan` is registered and the deterministic decode reaches the production field callback. | Fixed |
| F-2-2 | Static and SPA 404 renderers say “Page not found.” | Fixed |
| F-3-1 | `/license` returns 301 to `/intake` and is absent from the sitemap. | Fixed |
| F-3-2 | First screen states “Free to use — no account or checkout”; its claim passes. | Fixed |
| F-3-3 | Demo search guidance visibly includes supplier at 390 px. | Fixed |
| F-3-4 | Footer visibly labels Param Factory as an external site. | Fixed |
| F-4-1 | Preview uses only real item-card fields and values. | Fixed |
| F-4-2 | “Fig. 01” remains absent. | Fixed |
| F-4-3 | README calls `npm run build` a build command. | Fixed |
| F-5-1 | Live Back/Forward restores route-specific scroll and focuses the destination h1. | Fixed |
| F-5-2 | README explains real/sample separation without IndexedDB identifiers. | Fixed |
| F-5-3 | README states the observable offline result without service-worker jargon. | Fixed |
| F-5-4 | README explains the deployment configuration without SPA/MIME jargon. | Fixed |

The polish reports' historical verification items also remain protected:
invalid backups are rejected atomically, unsupported legacy codes have a
print recovery path, Escape and route changes stop camera tracks on repeated
checks, corrupt photos produce an announced error, unknown documents return
HTTP 404, and the responsive hero is discoverable before JavaScript. F-6-5
records the one aggregate camera-test race rather than treating a prior
“passed” label as proof.

## 6. Structure, routing, accessibility, and identity

- `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, and the demo print
  deep link returned 200. `/license` returned 301 to `/intake`; a new unknown
  URL returned HTTP 404.
- Every app route had `lang="en"`, one `h1`, one `main`, a route-specific
  title, description, canonical, Open Graph/Twitter metadata, two favicon
  links, and the shared header/footer with Privacy and Terms. F-6-4 is the one
  heading-copy exception.
- The social image is 1200 × 630 and the apple-touch icon is 180 × 180.
  `robots.txt`, `sitemap.xml`, SPA rewrites, the response-header CSP, and the
  designed static 404 are present.
- The crawl covered every rendered link from all public routes and the sample
  print route. Every same-origin and external HTTP destination returned 200;
  the email destination is an explicit `mailto:` link.
- The production Back/Forward test passed route-specific scroll restoration,
  focused h1 behavior, and route announcements. Deep links reload correctly.
- Playwright axe found no serious or critical issue on the six app routes.
  Keyboard entry, the skip link, 390 px overflow, 44 px targets, reduced
  motion, image alternatives, and console checks passed. `verify-url.sh`
  reported one h1, one main, `lang=en`, zero missing alt attributes, zero
  unnamed buttons, and no console error.
- Response headers contain CSP `frame-ancestors` as a header, `nosniff`, a
  strict-origin referrer policy, HSTS, and a camera-only permissions policy.
- The warm-paper broadsheet, black rules, red registration marks, engraved
  workshop image, editorial serif hierarchy, square controls, and print-sheet
  layout match `.factory/design.md`. It is visually specific to receiving and
  labeling stock, not a generic SaaS template.

Evidence is under `.factory/qa-evidence/review-6/`, including cold mobile and
desktop, settled demo, designed 404, and URL-verifier output.

## 7. Missed leverage

No missing AI, sync, import, or export feature is justified. Barcode capture,
CSV matching, duplicate review, print, CSV export, and complete JSON
backup/restore cover the brief's deterministic workflow. Runtime AI would
create an unnecessary network/key path for private supplier data. Account
sync would contradict the current local-only promise. No AI key or provider
call is embedded.

## What would make this perfect

Close F-6-1 through F-6-5: register and positively test the full printable
character promise; replace “every record” with “all cards”; replace “supplier
file” with “supplier CSV”; give Terms a literal h1; and make the camera
teardown test deterministic. Then rerun every claim command separately, run
the clean and live aggregate suites repeatedly, and repeat the cold mobile,
demo-isolation, copy, route, link, and accessibility checks. Nothing else was
identified in this round.
