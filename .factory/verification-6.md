# Barcode intake verification 6 — PASS

**Verdict: PASS**  
**Finding count: 0**  
**Untested claim count: 0**

- Live URL: <https://barcode-intake-card.sociobot.in>
- Implementation reviewed: `bf59246e4f9f8682c21fb4f80a931fb560e2dba1`
- Documentation baseline reviewed: `5587bd5cbada1b8787fa455b20ac769b8a8a3bca`
- Verification date: 2026-09-06
- Clean checkout: `/tmp/barcode-intake-verify6-clean`

## Release decision

**PASS — release accepted.** The deployed runtime is byte-identical to the
implementation candidate. The local-first barcode intake job works end to end
on phone and desktop. No finding of any severity remains, and every public
claim was tested.

## First screen before scrolling

- **Job:** Turn a scanned barcode into a private, printable item card.
- **Audience:** Small sellers and workshops receiving mixed stock without a
  full inventory system.
- **First action:** **Try it with sample data**. The adjacent sentence says the
  samples can be searched, edited, and printed.

In fresh live contexts, the job, audience, action, action outcome, and three
facts were visible before scrolling. At `390 × 844`, the required content ended
at 666.30 px. At `1440 × 900`, it ended at 790.84 px. The action outcome and
each fact rendered at 16 px in both viewports. Neither viewport overflowed
horizontally. Evidence:
`barcode-intake-card-verification-6-live-browser.json`, `-phone.png`, and
`-desktop.png` in `/work/.evidence/`.

## Demo and real-data isolation

One click opened three populated workshop cards: a shielded bearing, a USB-C
panel cable, and thermal labels. The first card showed a barcode, supplier,
location, and quantity. The persistent label said **Demo — sample data,
nothing is saved to your real cards.** It remained visible on the list, edit,
and print routes.

A temporary note appeared on the print card. **Reset demo** restored the
original bearing note. **Start for real** removed the demo label and opened a
real store with zero cards. The complete flow made no cross-origin request and
ran in a fresh browser context, so no existing real data was read or changed.

## Claims

`.factory/claims.json` contains 18 claims. Each ID occurs in exactly one tagged
test. After `npm ci`, all 18 commands were run separately and exactly as
declared; all passed.

| Claim | Result |
| --- | --- |
| `offline-reload` | Pass |
| `free-no-checkout` | Pass |
| `local-only` | Pass |
| `manual-intake` | Pass |
| `duplicate-review` | Pass |
| `csv-lookup` | Pass |
| `csv-export` | Pass |
| `search-cards` | Pass |
| `json-backup` | Pass |
| `print-card` | Pass |
| `demo-isolated` | Pass |
| `demo-edit` | Pass |
| `demo-reset-exit` | Pass |
| `camera-ready` | Pass |
| `camera-scan` | Pass |
| `photo-reduction` | Pass |
| `no-web-lookup` | Pass |
| `no-purchase-orders` | Pass |

The landing page, intake UI, privacy and terms pages, README, and demo copy
were cross-checked against the inventory. No unlisted, false, incomplete, or
untested public claim was found. The copy audit has no sentence over 22 words
and no banned term. Evidence: `barcode-intake-card-verification-6-claims.log`
and `-claim-inventory.log`.

## Clean build and deployment identity

- Clean `npm ci`: passed; 29 packages, zero audit vulnerabilities.
- Clean `npm test`: **42/42 passed**.
- Clean `npm run build`: passed and produced `dist/index.html`.
- Production-backed `npm test`: **42/42 passed**.
- Initial app JavaScript: 33.79 KB raw / 11.36 KB gzip.
- CSS: 11.76 KB raw / 3.58 KB gzip.
- Deferred barcode and scanner chunks: 14.72 KB and 108.68 KB gzip.
- All **20/20** served build files matched clean `dist/` by SHA-256.
  `staticwebapp.config.json` is deployment configuration and is not served.

The only changes after the implementation candidate and before this review
were the documentation files in `5587bd5`. They do not change the product
image.

## Normal, invalid, boundary, and recovery paths

- Manual entry saved and printed a complete card. Quantity `0` saved and
  printed; quantity `-1` was rejected and focused the quantity field.
- Empty required fields focused the barcode input and announced **Please fill
  out this field.**
- Unsupported script remained on intake with the supported-character recovery
  message. Supported letters, numbers, spaces, and punctuation rendered and
  decoded as Code 128.
- A chosen supplier CSV filled matching fields. A CSV without a barcode-like
  column gave a specific correction message.
- A corrupt photo gave a specific recovery message. A large photo was reduced
  to 1200 × 750 and persisted.
- Invalid backup shape, version, and field types were rejected atomically. The
  existing card remained available after reload. Complete JSON export/import
  restored every value and the photo.
- Search worked by barcode, item, supplier, and location. CSV export contained
  one row per saved card.
- Duplicate review, camera permission denial, deterministic camera decoding,
  Escape cleanup, focus return, and route teardown all passed.
- Delete cancellation retained all three sample cards. Confirmation removed
  only the named card. Reset restored the sample set.

Evidence: both 42-test logs and
`barcode-intake-card-verification-6-boundary-routes.json`.

## Accessibility, keyboard, motion, and layout

- Factory URL verification passed: title, `lang=en`, one h1, one main, image
  alternatives, named buttons, and no root-page console or page errors.
- Standalone axe CLI found zero violations on the live root. Settled axe runs
  found zero violations on `/`, `/demo`, `/intake`, `/records`, `/privacy`,
  `/terms`, the sample print page, and the designed 404.
- Keyboard Tab reached the skip link first and then the visible navigation and
  sample action. Enter opened the demo. The focus ring was a visible 3 px red
  outline. Native buttons, links, inputs, and the camera dialog remained
  keyboard operable.
- Every visible control measured at least 44 × 44 CSS px at 390 px. Back and
  Forward restored route scroll positions and focused each destination h1.
- Reduced motion changed page and scan animations to `0.01 ms`, one iteration,
  fixed the scan line, and disabled smooth scrolling.
- A 640 CSS px reflow check, equivalent to a 1280 px desktop at 200% zoom, had
  no horizontal overflow.
- Fresh mobile Lighthouse 13.4.1: Performance **100**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 0.92 s, LCP 1.22 s, CLS 0, TBT 3 ms.

## Privacy, offline use, updates, routes, and links

- The demo, CSV, photo, save, reload, edit, print, reset, and exit flow made
  zero cross-origin requests. No analytics, account, sync, checkout, billing,
  AI, font-CDN, or third-party runtime request was found.
- The versioned `barcode-intake-v14` worker controlled the app, cached the
  shell, removed an old cache, and supported offline demo edit and Back
  navigation after the first visit.
- The update-ready path exposed an announced **An update is ready. Reload now**
  notice with an operable reload button.
- `/privacy` and `/terms` returned 200 with their own titles, one h1, one main,
  shared navigation, and footer. All 15 discovered same-origin links returned
  200. The external factory link was labelled **external site**; it was not
  fetched because it is outside this product's authorised scope.
- `/license` correctly returned 301 to `/intake` and is absent from the
  sitemap. The tested unknown URL deliberately returned HTTP 404 and displayed
  the designed shared-shell recovery page. Chromium's expected failed-resource
  message for that deliberate 404 is not a product defect.
- Root and assets carried HSTS, `nosniff`, strict-origin referrer policy,
  camera-only permissions policy, and the same-origin CSP. Versioned assets
  used one-year immutable caching.

## Earlier finding disposition

Every earlier review finding, including minor copy findings, was checked
against the live output and current tests.

| Finding | Current proof | Disposition |
| --- | --- | --- |
| F-1-1 | All visible controls, including Privacy, pass the 44 px live test. | Fixed |
| F-1-2 | Printable characters are named, boundary-rejected, rendered, and decoded. | Fixed |
| F-1-3 | Reset and exit are registered and pass the full lifecycle. | Fixed |
| F-1-4 | Search is tested by barcode, item, supplier, and location. | Fixed |
| F-1-5 | Backup restore exact-compares every stored value and photo. | Fixed |
| F-1-6 | Camera start and decoded-to-field behavior have separate passing claims. | Fixed |
| F-1-7 | Demo copy has no unsupported count or subjective promise. | Fixed |
| F-1-8 | The live HTTP 404 has shared structure, metadata, and recovery. | Fixed |
| F-1-9 | Visitor copy consistently uses **item card** or **card**. | Fixed |
| F-1-10 | Decorative folio labels remain absent. | Fixed |
| F-1-11 | The eyebrow is the literal **For mixed-stock intake**. | Fixed |
| F-1-12 | The hero caption gives direct intake guidance. | Fixed |
| F-1-13 | The preview heading is **Preview an item card**. | Fixed |
| F-1-14 | Preview guidance says to review and update before printing. | Fixed |
| F-1-15 | Step three names print and export. | Fixed |
| F-1-16 | The limits heading is **What this tool does not do**. | Fixed |
| F-1-17 | The empty limits slogan is absent. | Fixed |
| F-1-18 | The camera heading names barcode scanning. | Fixed |
| F-1-19 | **Record an item** opens the intake form. | Fixed |
| F-1-20 | README avoids the old offline-first and receiving-desk jargon. | Fixed |
| F-1-21 | README says **one item card per page**. | Fixed |
| F-1-22 | Asset lore is absent from the visitor footer. | Fixed |
| F-1-23 | **Supplier CSV** is the consistent lookup-file term. | Fixed |
| F-2-1 | `camera-scan` is registered once and passes locally and live. | Fixed |
| F-2-2 | Static and app 404 headings say **Page not found**. | Fixed |
| F-3-1 | `/license` returns 301 to intake and is absent from the sitemap. | Fixed |
| F-3-2 | The first screen says the complete tool is free with no account or checkout. | Fixed |
| F-3-3 | Demo search guidance names barcode, item, supplier, and location. | Fixed |
| F-3-4 | The footer labels Param Factory as an external site. | Fixed |
| F-4-1 | Landing preview fields all exist on real item cards. | Fixed |
| F-4-2 | The decorative **Fig. 01** label is absent. | Fixed |
| F-4-3 | README accurately calls `npm run build` a build command. | Fixed |
| F-5-1 | Back and Forward restore scroll and destination focus live. | Fixed |
| F-5-2 | README explains storage separation without database internals. | Fixed |
| F-5-3 | README describes the observable offline result. | Fixed |
| F-5-4 | README deployment wording is direct and tested. | Fixed |
| F-6-1 | The complete printable set is registered and positively decoded. | Fixed |
| F-6-2 | Landing export copy uses **cards**, not **records**. | Fixed |
| F-6-3 | Landing lookup copy uses **supplier CSV**. | Fixed |
| F-6-4 | Terms h1 names the page and product. | Fixed |
| F-6-5 | The delayed camera cleanup regression passes without retry. | Fixed |
| F-8-1 | Outcome and facts are 16 px and above the fold in both required viewports. | Fixed |

Earlier independent-verification findings also remain fixed:

| Earlier finding | Current proof | Disposition |
| --- | --- | --- |
| Verification 1: dead paid camera checkout | Camera scanning is free; no checkout or billing route is present. | Fixed |
| Verification 1: incomplete claims | 18/18 exact claim commands pass; each tag occurs once. | Fixed |
| Verification 1 observation: unknown path returned 200 | Unknown paths return the designed page with HTTP 404. | Fixed |
| Verification 2: CSP rendered a solid barcode | Live canvas has contrasting bars and decodes to the exact value. | Fixed |
| Verification 2: Escape left camera active | Escape and route teardown end tracks and return focus. | Fixed |
| Verification 2: photo, lookup, and order claims absent | All three are registered and pass. | Fixed |
| Verification 2: corrupt photo was unhandled | A specific announced recovery message appears with no page error. | Fixed |
| Verification 2: small mobile targets | The live seven-route 44 px test passes. | Fixed |
| Verification 2: unknown URL returned 200 | It now returns HTTP 404 with the designed page. | Fixed |
| Verification 3: invalid backup broke the ledger | Full schema validation is atomic and the recovery regression passes. | Fixed |
| Verification 3: accepted code printed blank | Unsupported script is blocked; supported punctuation decodes. | Fixed |
| Verification 3: demo edits survived exit | Start for real clears edits; reopening restores originals. | Fixed |
| Verification 4: mobile LCP exceeded 2.5 s | Fresh live LCP is 1.22 s. | Fixed |
| Verification 5: one transient worker-ready timeout | Exact claim and complete live suite pass without retry. | Not reproduced |

Review 7 and verification 5 were prior PASS reports and introduced no open
finding. No earlier finding has regressed.

## Applicability and remaining limitations

This is a static, local-first PWA. It has no backend, tenant, server-side
product state, health endpoint, rate-limited API, installed package, CLI, or
desktop wrapper. Backend isolation, restart persistence, health, 429, and
consumer-install checks are therefore not applicable. Browser state persists
through IndexedDB; clearing site data removes cards unless the user exported a
backup, as disclosed.

The brief does not benefit from an AI step. Camera scanning, chosen CSV lookup,
photo handling, duplicate review, print, and export cover the smallest useful
job without sending inventory data away. No missed-leverage finding applies.

## Evidence index

Fresh evidence is under `/work/.evidence/` with prefix
`barcode-intake-card-verification-6-`. The key files are the claim, local-suite,
live-suite, runtime-hash, browser, boundary-route, link, keyboard, update,
verify-url, axe, route-axe, header, Lighthouse, and screenshot artifacts.
