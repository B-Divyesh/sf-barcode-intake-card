# Review 8 — Turn scanned barcodes into item cards

**Verdict: FAIL**  
**Reviewed:** 6 September 2026  
**Live URL:** <https://barcode-intake-card.sociobot.in>  
**Implementation candidate:** `66b92f8420b519b87cf50e747cf116fca38a4f04`  
**Documentation baseline:** `21471be5ffa43d60f2a456cc9000a4be4d7854e4`  
**Finding count:** 1  
**Untested claim count:** 0

The intake, demo, privacy, offline, print, and recovery flows work. All 18
declared claim commands pass. This review still fails because required
first-screen copy is smaller than the 16 px minimum in the supplied design
rules and in this product's own visual specification. A PASS requires zero
findings of every severity.

## Finding

### F-8-1 — Minor — Required first-screen copy is smaller than 16 px

- **Live evidence:** At both phone and desktop widths, the sentence beside
  **Try it with sample data** is 14 px. The three required privacy, offline,
  and price facts are 13 px. On a 390 px phone, those facts are the smallest
  meaningful text in the first screen.
- **Source evidence:** `.action-note { font-size: 14px; }` and
  `.facts { font-size: 13px; }` are in `src/style.css`. The site-structure and
  design-principles contracts require body text of at least 16 px.
  `.factory/design.md` also says, “Body remains 16 px or larger.”
- **Impact:** The first action's result and the three facts a new visitor must
  read are harder to read on a phone. The live product also contradicts its
  recorded visual specification.
- **Required change:** Render the action explanation and all three facts at
  16 px or larger at every width. Keep the opening action and facts within the
  390 × 844 first screen, then rerun phone layout, contrast, and 200% text
  resize checks.

No product code was changed during this review.

## First screen before scrolling

Fresh storage-empty Chromium contexts opened the live root at 390 × 844 and
1440 × 900.

| Question | Answer shown on both screens |
| --- | --- |
| What is the job? | Turn scanned barcodes into item cards. |
| Who is it for? | Small sellers and workshops receiving mixed stock without a full inventory system. |
| What is the first action? | **Try it with sample data**. The next sentence says it opens cards to search, edit, and print. |

The action, its outcome, and all three facts fit without scrolling. The last
fact ended at 629 px on the phone and 774 px on desktop. Both pages started at
scroll position 0, had no horizontal overflow, made only same-origin requests,
and raised no console or page errors. The job and action are clear; F-8-1 is
the remaining text-size defect.

## Demo and real-data isolation

The first-screen action opened `/?demo=1` in one click. The settled page showed
three populated workshop cards:

- 608ZZ shielded bearing
- USB-C panel cable, 30 cm
- Thermal labels, 50 × 30 mm

The banner **“Demo — sample data, nothing is saved to your real cards”** stayed
visible on the card list, edit screen, and print screen. Editing the bearing
note and choosing **Reset demo** restored **“Check bore before restocking.”**
Editing it again and choosing **Start for real** opened real intake. Real Cards
contained no sample or edited card and no demo banner. Re-entering the demo
restored the original note. The whole flow made no cross-origin request and
raised no error. All browser contexts were new and disposable; no existing
real browser data was read or changed.

## Declared claims

A detached clean checkout at documentation SHA `21471be5` was installed with
`npm ci`; 29 packages were installed and the audit reported zero
vulnerabilities. Every command below was then run independently and exactly as
declared in `.factory/claims.json`.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `offline-reload` | PASS | Cached demo edit and back navigation worked with the context offline. |
| `free-no-checkout` | PASS | Record, print, and export completed without account, checkout, or payment traffic. |
| `local-only` | PASS | CSV fields and a photo survived reload; no cross-origin request occurred. |
| `manual-intake` | PASS | A typed card saved and reopened with its fields and photo. |
| `duplicate-review` | PASS | A saved demo barcode showed its review candidate. |
| `csv-lookup` | PASS | A chosen supplier CSV filled name, supplier, location, and quantity zero. |
| `csv-export` | PASS | The download had the expected header and one row per demo card. |
| `search-cards` | PASS | Barcode, item, supplier, and location each selected the right card. |
| `json-backup` | PASS | All fields, timestamps, and the photo matched after export, deletion, and import. |
| `print-card` | PASS | Unsupported script was rejected; `PART A-12/3` rendered and decoded as Code 128. |
| `demo-isolated` | PASS | Sample cards did not appear in real Cards. |
| `demo-edit` | PASS | A sample was searched, edited, saved, and printed. |
| `demo-reset-exit` | PASS | Reset restored samples; exit discarded changes and copied nothing. |
| `camera-ready` | PASS | The preview appeared only after the camera action. |
| `camera-scan` | PASS | A deterministic scan filled the barcode field and closed the dialog. |
| `photo-reduction` | PASS | A 1600 × 1000 image was stored as a 1200 × 750 JPEG. |
| `no-web-lookup` | PASS | Unknown barcode entry made no request and filled no product fields. |
| `no-purchase-orders` | PASS | Saving made no mutation request and created no purchase-order data. |

Each claim id appears once in the tests, and all 18 test commands are unique.
The live landing, app routes, Privacy, Terms, and README were cross-checked
against the inventory. No missing, false, incomplete, or untested public claim
was found. **Untested claim count: 0.**

The clean aggregate `npm test` passed 41/41. `npm run build` passed and created
`dist/index.html`. The same suite against production passed 41/41.

## Normal, invalid, boundary, and recovery paths

Fresh live contexts produced these results:

| Path | Result |
| --- | --- |
| Empty required fields | Barcode received focus and the live status said, “Please fill out this field.” |
| Unsupported barcode script | Save stayed on intake and explained the printable character set. |
| Quantity `-1` | Save stayed on intake, focused Quantity, and exposed its minimum-value message. |
| Quantity `0` | The card saved and printed with quantity 0. |
| CSV without a barcode-like column | The page named the required barcode, code, SKU, EAN, or UPC column. |
| Corrupt image bytes | The page announced the accepted photo types and kept the preview hidden. |
| Denied camera permission | The open dialog explained how to allow access or type the code; Close returned focus to the scan button. |
| Invalid JSON backup | The import was rejected; the existing card remained before and after reload. |
| Delete cancellation | The named card remained. |
| Confirmed deletion | The card was removed and the empty state appeared. |

The production suite also passed duplicate review, photo reduction, printable
barcode decoding, camera Escape and route teardown, full backup recovery, and
legacy unsupported-code recovery.

## Accessibility, keyboard, motion, and layout

- Factory `verify-url.sh` passed production: title, `lang="en"`, one h1, one
  main landmark, image alternatives, named buttons, and no console error.
- Settled live axe checks found no violation on phone or desktop for `/`,
  `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, the sample print route,
  and the designed 404. The repository suite's route axe checks also passed.
- Tab first reached the skip link. Its visible outline was 3 px red. Enter
  moved to `#main` and focused the h1. App links, forms, dialog controls, and
  card actions worked by keyboard.
- Escape and route changes ended camera tracks. Closing the camera restored
  focus to **Scan with camera**.
- Every tested control was at least 44 × 44 CSS px at 390 px.
- With reduced motion, page animation and button transitions were 0.01 ms,
  animation iteration count was one, and smooth scrolling was off.
- At 200% text size, the primary action and required facts remained present
  and usable. F-8-1 concerns their normal rendered size.
- No route had horizontal overflow at the normal 390 px viewport.

## Offline, privacy, and update behavior

- Production used the active `barcode-intake-v13` worker and its versioned app
  shell. The exact live offline claim passed.
- The worker precaches the shell, deletes old cache versions, uses
  `skipWaiting`, claims clients, and falls back to the cached root or offline
  page for navigation.
- The app contains an announced update-ready notice with **Reload now**. The
  earlier isolated worker-update verification remains applicable because the
  implementation is byte-identical.
- Cold load, demo reset/exit, CSV/photo intake, save, print, and export produced
  only same-origin requests. Source inspection found no analytics, account,
  sync, billing, AI, remote font, or third-party runtime call.
- Privacy and Terms are reachable, titled, structured, and consistent with
  the tested local-only behavior.

This is a static local-first PWA. It has no backend, tenant, server-side state,
health endpoint, rate-limited product API, CLI, library, or desktop package.
Backend isolation, restart persistence, 429/Retry-After, and installed-consumer
checks do not apply. Browser state correctly uses separate real and demo
IndexedDB databases, as allowed by the product brief.

## Routes, links, 404, and site structure

Direct checks of `/`, `/demo`, `/intake`, `/records`, `/privacy`, and `/terms`
returned 200. Each had its own title, one h1, one main, header, footer, skip
link, description, canonical URL, and matching Open Graph and Twitter title.
Every discovered internal link returned 200. The retired `/license` route
returned 301 to `/intake`.

An unknown URL returned a deliberate HTTP 404 with **“Page not found”**, the
full site shell and metadata, and a working return action. This expected 404
is not a defect. Robots, sitemap, manifest, favicon, and apple-touch icon all
returned the correct successful response and content type. Live headers
included the same-origin CSP, `nosniff`, strict-origin referrer policy, and a
camera-only permissions policy.

## Performance and deployment identity

Fresh Lighthouse 13.0.1 mobile results:

| Measure | Result |
| --- | ---: |
| Performance | 96 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 1.04 s |
| LCP | 1.22 s |
| CLS | 0 |
| TBT | 242 ms |

The initial transfer was 66.5 KB: 11.6 KB app JavaScript, 3.7 KB CSS, and a
48.2 KB mobile hero. Scanner and barcode code remain deferred. Initial JS and
CSS are within budget; LCP and CLS pass their limits.

The live HTML, `app-v13` JavaScript and CSS, scanner and barcode chunks,
service worker, manifest, 404 page, offline page, and static CSS were
byte-identical to the clean build. Git history shows every change after
implementation commit `66b92f8` is a report or evidence file. The live runtime
therefore matches implementation candidate `66b92f8420b519b87cf50e747cf116fca38a4f04`.
The documentation baseline reviewed is
`21471be5ffa43d60f2a456cc9000a4be4d7854e4`.

## Earlier findings checked again

Every earlier finding was tested against the current live site, current tests,
or both. “Fixed” below means the fault did not reproduce; it does not rely on
an earlier report's status.

| Earlier finding | Current disposition and proof |
| --- | --- |
| F-1-1 | Fixed. The live 390 px target test includes Privacy and passed the 44 px minimum. |
| F-1-2 | Fixed. Unsupported script is rejected; supported punctuation renders and decodes. |
| F-1-3 | Fixed. Reset and exit are registered and passed independently and live. |
| F-1-4 | Fixed. One claim test checks barcode, item, supplier, and location search. |
| F-1-5 | Fixed. Backup restoration compares every field, timestamp, and photo. |
| F-1-6 | Fixed. Separate camera-ready and camera-scan tests cover start and decode. |
| F-1-7 | Fixed. Current demo copy uses “sample workshop cards” without the disputed adjective or count. |
| F-1-8 | Fixed. The live HTTP 404 has the shared shell, metadata, skip link, and return action. |
| F-1-9 | Fixed. Visitor copy consistently uses “item card” or “cards.” |
| F-1-10 | Fixed. Decorative folio labels are absent. |
| F-1-11 | Fixed. The eyebrow says “For mixed-stock intake.” |
| F-1-12 | Fixed. The hero caption gives direct intake guidance. |
| F-1-13 | Fixed. The section is “Preview an item card.” |
| F-1-14 | Fixed. Preview copy says to review and update before printing. |
| F-1-15 | Fixed. Step three names printing and export. |
| F-1-16 | Fixed. The limits heading is “What this tool does not do.” |
| F-1-17 | Fixed. The empty limits slogan is absent. |
| F-1-18 | Fixed. The camera heading names barcode scanning. |
| F-1-19 | Fixed. “Record an item” opens intake. |
| F-1-20 | Fixed. README uses plain offline wording. |
| F-1-21 | Fixed. README says one item card per page. |
| F-1-22 | Fixed. The footer contains no asset story. |
| F-1-23 | Fixed. “Supplier CSV” is used consistently. |
| F-2-1 | Fixed. `camera-scan` fills the production barcode field from a deterministic decode. |
| F-2-2 | Fixed. Static and app 404 headings say “Page not found.” |
| F-3-1 | Fixed. `/license` is absent from the sitemap and returns 301 to intake. |
| F-3-2 | Fixed. The first screen says the complete product is free with no account or checkout. |
| F-3-3 | Fixed. Demo search guidance names barcode, item, supplier, and location. |
| F-3-4 | Fixed. The footer says “Built by Param Factory (external site).” |
| F-4-1 | Fixed. The preview contains only fields found on real item cards. |
| F-4-2 | Fixed. “Fig. 01” is absent. |
| F-4-3 | Fixed. README calls `npm run build` a build command. |
| F-5-1 | Fixed. Live Back and Forward restore route scroll and h1 focus. |
| F-5-2 | Fixed. README explains real and sample storage without database jargon. |
| F-5-3 | Fixed. README describes the observable first-visit offline behavior. |
| F-5-4 | Fixed. README deployment wording is direct and accurate. |
| F-6-1 | Fixed. The printable character set is registered, rejected at its boundary, and decoded positively. |
| F-6-2 | Fixed. The landing export sentence says “cards,” not “records.” |
| F-6-3 | Fixed. The landing lookup sentence says “supplier CSV.” |
| F-6-4 | Fixed. Terms h1 is “Terms for using Barcode Intake Card.” |
| F-6-5 | Fixed. The delayed deterministic camera test passed locally and live with no retry. |
| Verification 1 dead checkout | Fixed. The product is free; no checkout or billing path remains. |
| Verification 1 incomplete claims | Fixed. Eighteen unique claim ids and tests cover current public promises. |
| Verification 2 broken print barcode | Fixed. The canvas has contrasting marks and decodes under the live CSP. |
| Verification 2 camera left live | Fixed. Escape, Close, and route teardown end the track and restore focus. |
| Verification 2 missing photo/lookup/order claims | Fixed. All three are registered and pass. |
| Verification 2 corrupt photo | Fixed. Invalid bytes produce an announced recovery message without an error. |
| Verification 2 small controls | Fixed. The 390 px target test passed every app route. |
| Verification 2 HTTP-200 unknown page | Fixed. A new unknown URL returned HTTP 404. |
| Verification 3 invalid backup | Fixed. Bad version and shape are rejected atomically; the existing card survives reload. |
| Verification 3 blank unsupported print | Fixed. Entry is rejected and legacy cards get visible edit recovery. |
| Verification 3 demo edits survive exit | Fixed. Exit clears changes; re-entry reseeds originals. |
| Verification 4 slow LCP | Fixed. Fresh mobile LCP was 1.22 s. |
| Verification 5 pass | Confirmed again except for new finding F-8-1. |

## Missed leverage

No additional AI feature is justified. Scanning, matching, duplicate review,
printing, and export are deterministic. Supplier CSV input, CSV output, and
complete JSON backup cover the useful transfer paths. Sync would conflict with
the local-only, no-account scope.

## Required next step

Increase the required first-screen action explanation and three facts to at
least 16 px without pushing them below the first phone screen. Then rerun the
phone first-read, 200% text-resize, settled axe, and Lighthouse checks. No
other current gap was found.
