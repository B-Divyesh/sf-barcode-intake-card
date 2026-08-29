# Handoff — adversarial review 4

## Outcome

Completed the fourth cold first-read review of <https://barcode-intake-card.sociobot.in>. The verdict is **FAIL** because the zero-finding standard is not met. Three minor findings are documented in `.factory/review-4.md`:

- the landing preview depicts an intake number and review status that real item cards do not have;
- the hero caption retains the decorative “Fig. 01” label;
- the README calls `npm run build` a deployment command even though it only creates `dist/`.

No product code was changed.

## Verification performed

- Opened production cold in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Entered the sample-data demo in one click and verified its seeded first screen, persistent banner, reset, exit, real-card preservation, separate IndexedDB namespaces, and same-origin request log.
- Created clean clone `/tmp/barcode-intake-review4-clean-WatdhN`, ran `npm ci`, and ran all 18 exact `.factory/claims.json` commands individually; all passed.
- Ran aggregate `npm test` from the clean clone: **36/36 passed**, `dist/` was produced.
- Ran the aggregate suite against production: **36/36 passed**.
- Crawled all rendered links and checked route titles, metadata, canonical links, h1/main counts, 404 behavior, `/license` redirect, deep links, browser Back, and route-change focus.
- Ran `/opt/fleet/lib/verify-url.sh` against production; it passed with no console errors or basic accessibility defects.
- Rechecked all 29 findings from reviews 1–3 on the live site and in code/tests; all earlier findings remain fixed.

## Next steps

Resolve F-4-1 through F-4-3, deploy through the factory workflow, and repeat the review from a fresh browser context. A PASS requires zero findings.
