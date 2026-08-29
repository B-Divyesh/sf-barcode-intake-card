# Adversarial first-read review 5 — Barcode Intake Card

**Verdict: FAIL**

**Reviewed:** 29 August 2026  
**Live site:** <https://barcode-intake-card.sociobot.in>  
**Repository base:** `dc540c4959c3f3bc8499962b6da5fb27cfd596e0`

The product is immediately understandable and its one-click demo is real. It
does not pass this round because browser Back discards the visitor's scroll
position, contrary to the route-history contract. The README also retains
three pieces of implementation jargon that a first-time product reader cannot
use. A PASS requires zero findings.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 1000, without a
previous visit or stored data. Before scrolling, the first screen answered all
three questions.

- **What it does:** It turns a scanned or typed barcode into a private,
  printable item card.
- **For whom:** Small sellers and workshops receiving mixed stock without a
  full inventory system.
- **What to click first:** **Try it with sample data**. The adjacent sentence
  says it opens cards that can be searched, edited, and printed.

The mobile first screen contains the complete headline, audience sentence,
primary action, action result, and the three facts. This is not a blocking
first-read failure.

## Findings

### F-5-1 — BLOCKING — Back navigation loses the visitor's reading position

- **Exact location:** Every SPA route transition; reproduce from `/` on a
  390 px viewport, scroll to 900 px, open **Intake**, then use browser Back.
- **Evidence:** Production measured `scrollY = 900` before navigation and
  `scrollY = 0` after Back. Focus correctly moved to the landing `h1`, but
  `src/main.ts` calls `scrollTo({ top: 0, ... })` for every `popstate` render
  and stores no per-history-entry position.
- **Why this fails:** A person returning from a form is returned to the top
  of a long landing page instead of the place they were reading. The
  site-structure contract requires Back/Forward to restore scroll and focus;
  this is broken route history, not merely a visual preference.
- **Concrete fix:** Store `{ scrollY }` in the current history entry before
  `pushState`, store `scrollY: 0` in the new entry, and on `popstate` restore
  the entry's saved position after render while moving focus to the route
  `h1`. Add a Playwright regression that scrolls `/`, opens `/intake`, goes
  Back and Forward, and asserts both route-specific scroll positions and the
  focused `h1`.

### F-5-2 — Minor — The README names browser database internals instead of explaining privacy

- **Exact quote/location:** README → Data and privacy: “Real cards use
  IndexedDB database `barcode-intake-real`.” and “Demo cards use
  `barcode-intake-demo`.”
- **Why this fails:** `IndexedDB` and the internal database identifiers are
  implementation jargon. They do not help a first-time seller decide what is
  private or what the demo changes.
- **Concrete fix:** Replace both sentences with: “Your real cards and sample
  cards are stored separately in this browser.” Keep the database names in
  `.factory/demo.md` or developer documentation if a verifier needs them.

### F-5-3 — Minor — The README uses an unexplained implementation slogan for offline behavior

- **Exact quote/location:** README → Data and privacy: “The service worker
  caches the app shell.”
- **Why this fails:** “service worker” and “app shell” describe browser
  machinery, not the result a reader can use. It is also an unlisted
  implementation claim, rather than the registered, observable offline
  promise.
- **Concrete fix:** Replace it with the registered plain-language result:
  “The app works offline after your first visit.” Retain
  `@claim:offline-reload` as its proof.

### F-5-4 — Minor — The deployment paragraph uses unexplained web-platform jargon

- **Exact quote/location:** README → Deployment:
  “`staticwebapp.config.json` provides SPA routing, the 404 response,
  security headers, and MIME types.”
- **Why this fails:** “SPA routing” and “MIME types” do not tell a maintainer
  in plain words what deployment configuration does.
- **Concrete fix:** Replace it with: “`staticwebapp.config.json` sends app
  routes to the right page, returns the designed 404 page, and sets security
  headers.” Mention MIME types only in a separate technical reference when a
  deployment problem requires it.

## Copy audit

Word counts treat a hyphenated term as one word. No landing or README sentence
exceeds 22 words. Landing headings are literal section names, and visible
actions name their result: **Try it with sample data**, **Record an item**,
**Export CSV**, **Export backup**, **Print card**, **Reset demo**, and
**Start for real**. The three jargon flags above are the only copy findings.

### Landing sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 6 | Turn scanned barcodes into item cards | pass |
| 12 | For small sellers and workshops receiving mixed stock without a full inventory system. | pass |
| 11 | It opens sample workshop cards you can search, edit, and print. | pass |
| 5 | Cards stay in this browser | pass |
| 6 | Works offline after the first visit | pass |
| 7 | Free to use — no account or checkout | pass |
| 9 | Record mixed stock before choosing a full inventory system. | pass |
| 9 | Review and update the item card before printing it. | pass |
| 4 | Check bore before restocking. | pass |
| 11 | Scan a barcode, type the code, or match a supplier CSV. | pass |
| 6 | Camera scanning fills the barcode field. | pass |
| 10 | You can also type English letters, numbers, spaces, and punctuation. | pass |
| 9 | Add its name, supplier, photo, quantity, and shelf location. | pass |
| 11 | Print one card or export every record as CSV or JSON. | pass |
| 4 | No automatic web lookup. | pass |
| 9 | Supplier and stock details do not leave your device. | pass |
| 3 | No purchase orders. | pass |
| 3 | This records arrivals. | pass |
| 5 | It does not run procurement. | pass |
| 4 | No account or sync. | pass |
| 11 | Export a file when you need a backup or another system. | pass |
| 4 | CSV lookups are explicit. | pass |
| 5 | You choose the supplier file. | pass |
| 6 | It is read in this browser. | pass |
| 10 | Camera scanning, manual entry, and exports are free to use. | pass |
| 10 | The camera starts only after you choose Scan with camera. | pass |
| 9 | Turn a barcode into a private, printable item card. | pass |

### README sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 10 | Turn a barcode scan into a private, printable item card. | pass |
| 17 | Barcode Intake Card records incoming stock for micro-sellers and workshops, and works offline after your first visit. | pass |
| 11 | Cards, supplier CSV rows, and item photos stay in the browser. | pass |
| 10 | It is free to use with no account or checkout. | pass |
| 10 | Open `/demo`, or visit <https://barcode-intake-card.sociobot.in/?demo=1>. | pass |
| 11 | It opens sample workshop cards stored separately from your real cards. | pass |
| 7 | Choose **Reset demo** to restore the samples. | pass |
| 13 | Choose **Start for real** to clear the demo and leave without copying it. | pass |
| 13 | Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo. | pass |
| 11 | Opens a camera preview only after you choose Scan with camera. | pass |
| 11 | Fills the barcode field when the camera reader decodes a barcode. | pass |
| 9 | Matches a barcode against a supplier CSV you choose. | pass |
| 8 | Warns about saved cards with the same barcode. | pass |
| 15 | Searches saved cards and prints one item card per page with a Code 128 barcode. | pass |
| 9 | Printable codes use English letters, numbers, spaces, and punctuation. | pass |
| 10 | Exports all cards as CSV or a complete JSON backup. | pass |
| 11 | Imports its JSON backup and works offline after the first visit. | pass |
| 12 | It does not scrape product databases, create purchase orders, or sync accounts. | pass |
| 7 | Node.js 20 or newer is recommended. | pass |
| 4 | Open `http://localhost:5173`. | pass |
| 9 | Use `http://localhost:5173/demo` for the test sandbox. | pass |
| 20 | `npm test` builds the production app, starts the preview server, and runs the Playwright claim, accessibility, mobile, and console checks. | pass |
| 8 | Chromium for Playwright 1.58.2 is required. | pass |
| 8 | Build the deployable files with `npm run build`. | pass |
| 12 | Static output lands in `dist/`, with `dist/index.html` at its root. | pass |
| 6 | Real cards use IndexedDB database `barcode-intake-real`. | **F-5-2** |
| 4 | Demo cards use `barcode-intake-demo`. | **F-5-2** |
| 14 | The app sends no item, barcode, CSV, or photo data to a third party. | pass |
| 9 | It has no account, sync, checkout, or billing request. | pass |
| 7 | The service worker caches the app shell. | **F-5-3** |
| 11 | Export a JSON backup before clearing site data or moving devices. | pass |
| 7 | See `/privacy` and `/terms` in the app. | pass |
| 10 | Camera scanning, manual entry, and exports are free to use. | pass |
| 8 | Choose **Scan with camera** to open the preview. | pass |
| 7 | A decoded barcode fills the barcode field. | pass |
| 6 | You can always type it instead. | pass |
| 6 | Deploy `dist/` as a static site. | pass |
| 14 | `staticwebapp.config.json` provides SPA routing, the 404 response, security headers, and MIME types. | **F-5-4** |
| 6 | The factory manages DNS and infrastructure. | pass |
| 1 | MIT. | pass |
| 3 | See `LICENSE`. | pass |

Terminology is otherwise consistent: **item card**, **barcode**, **location**,
**supplier CSV**, **demo**, and **backup** are each used for one concept.

## Demo, claims, privacy, and behavior

- Clicking the first-screen **Try it with sample data** action opened
  `/?demo=1` and displayed three specific sample cards immediately: 608ZZ
  shielded bearing, USB-C panel cable, and thermal labels. The persistent
  banner reads “Demo — sample data, nothing is saved to your real cards.” and
  includes **Reset demo** and **Start for real**.
- The live full suite passed **38/38**. It includes the reset/exit flow,
  separate `barcode-intake-demo` and `barcode-intake-real` storage, search,
  edit, print, camera, local-only request logging, and offline reload.
- In a separate fresh clone, `npm ci` passed and every exact command listed in
  `.factory/claims.json` passed individually: all 18 registered claim tags.
  The fresh-clone aggregate `npm test` also passed **38/38**.
- A cold `/demo` request log contained only the document and same-origin
  product assets. The local-only and offline claim tests record requests and
  take the browser offline after the first visit; both passed. There is no
  provider key or runtime AI feature. That is appropriate here: the brief's
  useful work is deterministic local capture, and the supplied CSV/import/
  export path covers the implied transfer need without a sync service.

## Structure and routes

Live `/`, `/demo`, `/intake`, `/records`, `/privacy`, and `/terms` returned
200 with a route-specific title, one `h1`, meta description, and canonical.
The unknown route returned the designed static 404 with HTTP 404. `/license`
returned a 301 to `/intake`. Every discovered internal link returned 200; the
external Param Factory link returned 200 and says it is external. Headers
include CSP with `frame-ancestors` as a response header, referrer policy, and
`nosniff`. `verify-url.sh` passed against production with no console errors,
`lang="en"`, one `h1`, one main landmark, no images missing `alt`, and no
unnamed buttons. The monochrome broadsheet system matches `.factory/design.md`
and is distinct from a generic SaaS template.

The sole structural failure is F-5-1: the route itself and focus change work,
but its Back/Forward scroll restoration does not.

## Earlier findings rechecked

Every earlier review, polish report, verification report, and handoff was
read. The following are confirmed fixed in both the current code and the live
site; none is merely marked fixed.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Live 390 px suite measures the Privacy email link and other visible controls at least 44 px. |
| F-1-2 | Public wording and validation limit printable codes to English letters, numbers, spaces, and punctuation. |
| F-1-3 | Banner controls are covered by `@claim:demo-reset-exit`, which passed live. |
| F-1-4 | `@claim:search-cards` checks barcode, item, supplier, and location. |
| F-1-5 | `@claim:json-backup` compares every saved field and photo after restore. |
| F-1-6 | Separate camera-ready and deterministic decoded-barcode tests pass. |
| F-1-7 | Demo copy contains no unsupported sample count or subjective “realistic” promise. |
| F-1-8 | Static 404 has the shared shell, metadata, favicon links, recovery link, and HTTP 404 status. |
| F-1-9 | Current titles and product copy use “item card,” not “stock card.” |
| F-1-10 | Decorative workshop/publication labels are absent. |
| F-1-11 | The hero eyebrow is the literal “For mixed-stock intake.” |
| F-1-12 | The hero caption is direct mixed-stock guidance with no figure label. |
| F-1-13 | The preview heading is “Preview an item card.” |
| F-1-14 | Preview guidance now names review/update before printing. |
| F-1-15 | The third step is “Print or export the card.” |
| F-1-16 | The limits heading is “What this tool does not do.” |
| F-1-17 | The previous empty limits slogan is absent. |
| F-1-18 | The camera section is headed “Scan barcodes with the camera.” |
| F-1-19 | The CTA is “Record an item” and opens the intake form. |
| F-1-20 | README no longer uses “offline-first.” |
| F-1-21 | README says “one item card per page.” |
| F-1-22 | Footer asset lore remains absent; provenance is in `design.md`. |
| F-1-23 | “Supplier CSV” is the consistent lookup-file term. |
| F-2-1 | Camera decoding is a registered claim with a deterministic decode fixture. |
| F-2-2 | Both SPA and static 404 pages use “Page not found.” |
| F-3-1 | `/license` now redirects to `/intake` with HTTP 301. |
| F-3-2 | The landing states “Free to use — no account or checkout,” proved by `@claim:free-no-checkout`. |
| F-3-3 | The demo search prompt names supplier and remains visible at 390 px. |
| F-3-4 | The footer says “Built by Param Factory (external site).” |
| F-4-1 | The preview only shows real labels and values: item card, location, quantity, and notes. |
| F-4-2 | “Fig. 01” is absent from the hero caption. |
| F-4-3 | README calls `npm run build` a build command, not a deployment command. |

## What would make this perfect

Preserve route-specific scroll positions while retaining the existing route
focus announcement, then replace the three README implementation sentences
with the proposed plain-language wording. Re-run the full live suite and add
the Back/Forward restoration test. With those four findings closed, the
product would be clear, tryable, privacy-honest, and structurally complete.
