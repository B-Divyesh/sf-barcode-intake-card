# Handoff — adversarial review 5

## What was done

Performed the requested read-only adversarial review of the deployed Barcode
Intake Card at desktop and 390 px mobile sizes. No product code, assets, tests,
or configuration were changed. Added `.factory/review-5.md` with the full
review and this handoff.

## Verification

- Cold first-read checks on `/` at 390 × 844 and 1440 × 1000: the job, user,
  and first action are clear.
- Clicking the first-screen sample-data action opens `/?demo=1` with three
  usable sample cards immediately; the isolation banner, Reset demo, and Start
  for real controls are present.
- Fresh clone at `/tmp/barcode-intake-review5-clean-3y1e5m`: `npm ci` passed;
  all 18 exact `.factory/claims.json` commands passed individually; aggregate
  `npm test` passed 38/38.
- Production: `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test`
  passed 38/38. The live URL verifier passed with no console errors and the
  required title/lang/main/h1/alt/button checks.
- Route crawl: all discovered internal links returned 200, unknown URLs return
  the designed HTTP 404, and `/license` returns a 301 to `/intake`.

## Known gaps

The review verdict is **FAIL** with four findings in `.factory/review-5.md`:

1. **Blocking:** browser Back/Forward does not restore the previous scroll
   position; it returns to the top despite correctly moving focus to the `h1`.
2. README exposes IndexedDB/database identifiers instead of a plain privacy
   explanation.
3. README says “service worker caches the app shell” instead of the observable
   offline result.
4. README deployment copy uses unexplained SPA/MIME jargon.

## Next steps

Implement scroll-state restoration with a Playwright Back/Forward regression,
apply the three proposed README rewrites, then rerun all claims, the full
production suite, and the adversarial review.
