# Handoff — adversarial review 6

## Outcome

Reviewed production at <https://barcode-intake-card.sociobot.in> from fresh
390 px and desktop browser contexts. No product code was changed. The verdict
in `.factory/review-6.md` is **FAIL** with three blocking, historically
half-fixed findings and two minor findings.

## What was done

- Recorded cold first-screen and settled demo screenshots.
- Audited every landing and README sentence, heading, and action.
- Ran all 18 commands in `.factory/claims.json` separately from clean clone
  `/tmp/barcode-review6-clean-F9iLLE`.
- Exercised live demo edit/reset/exit behavior and confirmed a pre-existing
  real card remained untouched.
- Recorded the live request log: all requests were same-origin.
- Rechecked every finding from reviews 1–5 against current production and
  code, then checked all five polish reports and the previous handoff.
- Crawled every rendered link; checked route metadata, the designed HTTP 404,
  `/license` redirect, deep links, Back/Forward scroll and focus, response
  headers, accessibility, and the product-specific visual system.

## Verification results

- Exact claim commands: **18/18 passed**.
- Second clean-clone aggregate `npm test`: **40/40 passed** and built `dist/`.
- Production Playwright suite: **40/40 passed**.
- The first clean aggregate passed 39/40; the camera-track teardown regression
  timed out once, then passed five isolated reruns and the second aggregate.
  This nondeterminism is review finding F-6-5.
- `verify-url.sh`: passed with no console errors, one h1, one main, `lang=en`,
  no missing image alternatives, and no unnamed buttons.
- Link crawl: all HTTP destinations passed; unknown route returned 404 and
  `/license` returned 301 to `/intake`.
- Evidence: `.factory/qa-evidence/review-6/`.

## Findings left for the next worker

- F-6-1: register and positively test the advertised printable character set;
  this is the unfinished part of F-1-2.
- F-6-2: replace landing “every record” with consistent item-card wording;
  this is the unfinished part of F-1-9.
- F-6-3: replace landing “supplier file” with “supplier CSV”; this is the
  unfinished part of F-1-23.
- F-6-4: rename the Terms h1 so it identifies the page plainly.
- F-6-5: make the fake-camera teardown regression deterministic and prove the
  clean aggregate is stable across repeated runs.

No AI, sync, billing, or additional transfer feature is recommended. The
deterministic local workflow already includes supplier CSV matching, CSV
export, and complete JSON backup/restore.
