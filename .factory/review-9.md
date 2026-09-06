# Review 9 — Turn scanned barcodes into item cards

**Verdict: PASS**  
**Finding count: 0**  
**Untested claim count: 0**

- Reviewed: 6 September 2026
- Live URL: <https://barcode-intake-card.sociobot.in>
- Implementation candidate: `bf59246e4f9f8682c21fb4f80a931fb560e2dba1`
- Product documentation baseline: `5587bd5cbada1b8787fa455b20ac769b8a8a3bca`
- Review starting point: `ea47aba7dc201b25523520d0aeed59bbfb44ee4f`

## Result

**PASS — zero findings of every severity and zero untested claims.** Product
code was not changed. The only change from the implementation candidate to the
review starting point was documentation and QA evidence. All 20 served files
from the live site SHA-256 matched the clean candidate build; deployment
therefore matches `bf59246`.

## First screen before scrolling

Fresh storage-empty desktop (`1440 × 900`) and phone (`390 × 844`) contexts
opened the live root before any scrolling.

- **Job:** Turn scanned barcodes into item cards.
- **Audience:** Small sellers and workshops receiving mixed stock without a
  full inventory system.
- **First action:** **Try it with sample data**; it opens sample workshop
  cards that can be searched, edited, and printed.

The three facts were visible on both screens: cards stay in this browser, the
app works offline after the first visit, and it is free with no account or
checkout. The action explanation and all facts computed to 16 px. Required
hero content ended at 796.84 px on desktop and 666.30 px on phone; neither
viewport had horizontal overflow. Fresh screenshots are in
`/work/.evidence/review-9/verify-live/` and
`/work/.evidence/review-9/live-phone-first-screen.png`.

## Demo and real-data separation

One click loaded three realistic cards: 608ZZ shielded bearing, USB-C panel
cable, and thermal labels. The banner **“Demo — sample data, nothing is saved
to your real cards.”** remained present on the list, edit, and print routes.
Editing the bearing note, choosing **Reset demo**, then reopening the card
restored **“Check bore before restocking.”** **Start for real** opened the
real intake form; real Cards then showed **No item cards yet**. The fresh flow
recorded no cross-origin request. This proves the sample workflow did not read
or change real browser data.

## Claims and clean build

A detached clean clone at `ea47aba` ran `npm ci` successfully (29 locked
packages; zero audit vulnerabilities). `npm test` passed **42/42**, and
`npm run build` passed and produced `dist/index.html`.

Every command declared in `.factory/claims.json` was run separately and
passed: `offline-reload`, `free-no-checkout`, `local-only`, `manual-intake`,
`duplicate-review`, `csv-lookup`, `csv-export`, `search-cards`,
`json-backup`, `print-card`, `demo-isolated`, `demo-edit`,
`demo-reset-exit`, `camera-ready`, `camera-scan`, `photo-reduction`,
`no-web-lookup`, and `no-purchase-orders`.

The production-backed complete suite also passed **42/42**. Each claim ID has
one tagged test. Landing, app, legal, and README copy was cross-checked
against the inventory. No unlisted, false, incomplete, or untested public
claim was found.

## Functional paths

The passing local and live suite exercised normal entry, CSV lookup, duplicate
review, search, CSV export, JSON backup/restore, print, camera start/scan,
photo reduction, demo edit/reset/exit, offline reload, and update readiness.
It also exercised empty required fields, negative quantity, quantity zero,
unsupported barcode scripts, malformed CSV, corrupt photos, denied camera,
invalid backup shape/version/types, delete cancel/confirm, legacy barcode
recovery, Back/Forward focus and scroll restoration, and route teardown.

Supported English letters, numbers, spaces, and punctuation decode as Code
128; unsupported scripts receive a visible correction message. No automatic
web lookup, purchase-order creation, account, checkout, billing, sync,
analytics, AI, or third-party font request occurred.

## Accessibility, routes, privacy, offline, and performance

- `/opt/fleet/lib/verify-url.sh` passed live: title, `lang=en`, one h1, main,
  image alternatives, named buttons, and no console or page errors.
- The live 42-test suite ran axe on `/`, `/demo`, `/intake`, `/records`,
  `/privacy`, and `/terms`, with zero serious or critical violations. It also
  checked keyboard entry, the first skip link, 44 px targets across seven
  routes, camera dialog cleanup/focus return, and 200% reflow.
- With reduced motion, the scan animation and page transition both resolved to
  `0.01 ms`, one animation iteration, and `scroll-behavior: auto`.
- The app's versioned worker and offline demo edit/back flow passed live. Its
  update-ready notice is covered by the full suite. Cards and photos remain in
  separate real and demo browser stores.
- Privacy and Terms have their own titles and main landmarks. The live 404 is
  deliberately HTTP 404, has title **Page not found — Barcode Intake Card**,
  shared recovery structure, and a working return action. `/license` returns
  301 to `/intake`.
- Root and 404 headers include HSTS, `nosniff`, strict-origin referrer policy,
  camera-only permissions policy, and a same-origin CSP with
  `frame-ancestors` delivered as a response header.
- Fresh mobile Lighthouse 13.4.1 retry: Performance **99**, Accessibility
  **100**, Best Practices **100**, SEO **100**; FCP 1.5 s, LCP 1.6 s, CLS 0,
  TBT 0 ms. The initial Lighthouse attempt was discarded because its browser
  screenshot target crashed after collecting data; the retry completed with
  no runtime error.

This is a static local-first PWA. Backend tenant isolation, restart
persistence, health, 429/Retry-After, and installed CLI/library checks do not
apply.

## Earlier findings

All earlier findings were inspected against current source, the clean suite,
and/or the live runtime. No earlier defect reproduced.

| Earlier finding group | Current disposition and proof |
| --- | --- |
| Review 1 F-1-1 through F-1-8 | Fixed: 44 px controls, printable-code boundary, demo reset/exit, four-field search, complete backup, separate camera start/scan, plain demo wording, and designed HTTP 404 all pass. |
| Review 1 F-1-9 through F-1-23 | Fixed: visitor wording consistently uses item card and supplier CSV; decorative/lore labels are absent; headings, preview, limits, camera, action, README, footer, and terminology remain direct and current. |
| Review 2 F-2-1 through F-2-2 | Fixed: deterministic camera scan fills the field; static and app 404 pages say Page not found. |
| Review 3 F-3-1 through F-3-4 | Fixed: retired license route redirects; free/no-checkout wording, demo search guidance, and external-site label all pass live. |
| Review 4 F-4-1 through F-4-3 | Fixed: preview uses only real fields; Fig. 01 remains absent; README accurately describes the build command. |
| Review 5 F-5-1 through F-5-4 | Fixed: Back/Forward restores scroll and h1 focus; README privacy, offline, and deployment wording remains accurate. |
| Review 6 F-6-1 through F-6-5 | Fixed: the full printable character set decodes; card/supplier wording and Terms h1 remain correct; delayed camera cleanup passes. |
| Review 8 F-8-1 | Fixed: action explanation and three facts are 16 px on both fresh viewports and remain above the fold. |
| Verifications 1–5 | Fixed or not reproduced: no paid camera checkout; complete claim inventory; barcode renders under CSP; camera cleanup works; corrupt photos recover; mobile targets pass; unknown URLs return 404; invalid backups are atomic; demo edits do not leak; LCP is within budget; the earlier transient worker timeout did not recur. |

Review 7 and verification 5/6 had no open product finding. The fresh review
found no missed leverage: chosen supplier CSV input, CSV/JSON output, camera
scan, duplicate review, and printable cards cover the brief without sending
inventory data to a third party. An AI feature is not useful for this job.

## Evidence

Fresh evidence is under `/work/.evidence/review-9/`, including browser
screenshots, URL verification, Lighthouse JSON, and the runtime checks. The
required copies are `/work/.evidence/qa-report.md` and
`/work/.evidence/qa-result.json`.
