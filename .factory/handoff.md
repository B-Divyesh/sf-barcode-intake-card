# Handoff — review 8

## Result

**FAIL.** Review 8 found one minor issue and zero untested claims. No product
code changed.

The required first-screen outcome sentence renders at 14 px, and the three
privacy, offline, and price facts render at 13 px. The supplied design rules
and `.factory/design.md` require body copy of at least 16 px. See
`.factory/review-8.md` for the evidence and required change.

## Product and documentation versions

- Live URL: <https://barcode-intake-card.sociobot.in>
- Implementation reviewed: `66b92f8420b519b87cf50e747cf116fca38a4f04`
- Documentation baseline: `21471be5ffa43d60f2a456cc9000a4be4d7854e4`
- Live build: v1.0.11, `app-v13`, service-worker cache
  `barcode-intake-v13`

All checked runtime files were byte-identical to the clean build from the
implementation candidate. Changes after that implementation are reports and
evidence only.

## Verification completed

- Clean detached checkout: `npm ci` passed with zero audit vulnerabilities.
- Every one of the 18 commands in `.factory/claims.json` passed independently.
- Clean `npm test`: 41/41 passed.
- Production-backed `npm test`: 41/41 passed.
- `npm run build`: passed and produced `dist/index.html`.
- Factory URL verification passed with no console errors.
- Fresh phone and desktop first-read checks passed for job, audience, action,
  first-screen fit, same-origin requests, and no overflow.
- One-click demo, persistent label, realistic samples, edit, print, reset,
  exit, re-entry, and real/demo isolation passed.
- Empty, unsupported, negative, zero, malformed CSV, corrupt photo, denied
  camera, invalid backup, deletion cancellation, and deletion recovery paths
  passed.
- Settled axe scans found no violations on all app routes, sample print, and
  the designed HTTP 404. Keyboard, focus return, 44 px targets, route history,
  and reduced motion passed.
- Offline navigation and reload passed. The versioned worker and update-ready
  UI are present.
- Fresh mobile Lighthouse: Performance 96, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.22 s, CLS 0, TBT 242 ms.
- All earlier review and verification findings were checked again. None
  regressed. Review 8's text-size issue is new.

## How to verify

```bash
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test
```

Run each command in `.factory/claims.json` separately before accepting a new
candidate. Open the live root in fresh 390 × 844 and desktop contexts, and
check the first screen without scrolling.

## Known gap and next step

Raise `.action-note` and `.facts` to at least 16 px at every width. Keep the
action, outcome, and three facts inside the first 390 × 844 screen. Rerun phone
layout, 200% text resize, settled axe, Lighthouse, and all claim commands.

Do not mark the product PASS until F-8-1 is fixed and the next independent
review reports zero findings.
