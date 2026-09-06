# Handoff — independent verification 6

## Result

**PASS — release accepted.** Independent QA found zero findings of every
severity and zero untested claims. Product code was not modified.

- Live URL: <https://barcode-intake-card.sociobot.in>
- Implementation verified: `bf59246e4f9f8682c21fb4f80a931fb560e2dba1`
- Documentation baseline verified: `5587bd5cbada1b8787fa455b20ac769b8a8a3bca`
- Full report: `.factory/verification-6.md`

## Verification summary

- Fresh phone and desktop browsers showed the job, audience, sample action,
  action outcome, and all three facts before scrolling. The outcome and facts
  render at 16 px. Required content ends at 666.30/844 px on phone and
  790.84/900 px on desktop.
- The one-click demo opened three populated cards. Its sample label persisted
  through edit and print. Reset restored the original note. Start for real
  left zero real cards. The flow made no cross-origin request.
- All 18 exact claim commands passed from the clean checkout.
- Clean `npm test`: 42/42 passed. `npm run build` passed and produced
  `dist/index.html`. Production-backed `npm test`: 42/42 passed.
- All 20 served runtime files matched clean `dist/` byte for byte.
- Factory URL verification passed. Standalone live axe found zero violations;
  settled axe found zero violations on all app, print, legal, and 404 routes.
- Fresh Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.22 s, CLS 0, TBT 3 ms.
- Normal, invalid, boundary, recovery, camera, keyboard, focus, reduced-motion,
  200% reflow, offline, update, privacy, route-title, legal, link, and designed
  HTTP 404 checks passed.
- Every earlier review and independent-verification finding was explicitly
  rechecked and remains fixed. The detailed disposition is in the report.

## How to verify

```bash
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test
```

Run every command in `.factory/claims.json` separately from a clean checkout.

## Evidence

Fresh evidence is under `/work/.evidence/` with prefix
`barcode-intake-card-verification-6-`. Required copies are
`/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.

## Remaining limitations

This is a static, local-first PWA. Backend tenant, restart, health, rate-limit,
and installed-package checks do not apply. Clearing browser storage removes
cards unless the user first exports a JSON backup, as the product discloses.

The product is accurately free and has no registered or advertised paid tier.
No checkout, billing, AI, analytics, account, or sync request is present.
