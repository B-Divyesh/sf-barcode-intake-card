# Handoff — adversarial review 3

## Outcome

Review only; no product code was changed. `.factory/review-3.md` records a **FAIL** with four findings: a misleading `/license` route (blocking), missing/ambiguous price copy, an incomplete demo search hint, and an unlabeled external footer destination.

## Verification

- Reviewed base: `60fbb7e654720f08fd8f83c5dc4d5a647ba6a031`.
- Fresh clone: `/tmp/barcode-review3-clean-DiCDYt`.
- Every exact command in `.factory/claims.json`: **17/17 passed individually**.
- Fresh-clone `npm test`: **34/34 passed**; its build produced `dist/`.
- Production Playwright suite: **34/34 passed**.
- Live URL verifier: 200, no console errors, one `h1`, one `main`, `lang=en`, no missing alt text, and no unnamed button.
- Manual live demo: sample data visible in one click; Reset restored the original sample; Start for real left both real and demo stores empty; no cross-origin request occurred.
- Route/link crawl: all discovered links returned 200 or were explicit `mailto:` links; unknown route returned a designed HTTP 404. The semantic `/license` mismatch remains a finding.
- Evidence: `.factory/qa-evidence/review-3/`.

## Re-run

```bash
npm ci
npm test
PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npx playwright test
```

## Remaining work

Resolve F-3-1 through F-3-4 in `.factory/review-3.md`, deploy, and repeat the full clean-clone and live review. Do not claim completion until all four findings are absent on production.
