# Handoff — perfection-loop round 5

## Outcome

Released Barcode Intake Card v1.0.10 at
<https://barcode-intake-card.sociobot.in>. The four review-5 findings and all
retained findings from reviews 1–4 are closed. The product remains a
local-first Vite/TypeScript PWA with its monochrome workshop-broadsheet visual
system, isolated one-click demo, no tracking, and no third-party data path.

The executable repair is commit
`91971a28d2046cd00a0dd404551996d8b716a99c` (`fix: restore route history and
plain language`), pushed to `main`. Static deployment completed as Azure
deployment `be2adbbb-209c-4b13-8f6b-8ecb1c111f1c`; the live document loads
`app-v12.js` and the service worker cache is `barcode-intake-v12`.

## What changed

- Route history now stores `scrollY` on every entry. Back/Forward restores the
  saved reading position after rendering, while focus moves to and announces
  the destination h1 without scrolling it into view.
- Added an end-to-end regression that checks landing → intake → Back → Forward
  scroll positions and heading focus at 390 px.
- Rewrote the three review-5 README sentences in plain language: separated
  real/sample cards, tested offline behavior, and deployment configuration.
- Kept every earlier repair live: item-card terminology, explicit printable
  codes, one-click isolated demo lifecycle, complete claim coverage, camera
  decode proof, designed HTTP 404, explicit free/no-checkout facts, supplier
  search guidance, legal/external links, and accurate preview fields.
- Updated the catalog line to the verb-first, 49-character sentence: “Record
  barcodes as private, printable item cards.”

## Verification

- Fresh clone `/tmp/barcode-intake-polish5-clean-Dti7Ez` at `91971a2`:
  `npm ci` passed with zero audit vulnerabilities; all 18 exact claim commands
  from `.factory/claims.json` passed independently; aggregate `npm test`
  passed **40/40**.
- The work-order build command `npm ci && npm test && npm run build` passed in
  the deploy checkout. `dist/index.html` exists; app JS is 11.21 KB gzip and
  CSS is 3.58 KB gzip.
- Production `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test`
  passed **40/40**, covering every claim, privacy request logging, offline
  reload, PWA cache update, camera cleanup/decoding, mobile keyboard/targets,
  routing/history, 404, and axe integration.
- `/opt/fleet/lib/verify-url.sh` passed cold production with no console errors,
  title, `lang=en`, one h1, main landmark, zero images missing alt, and zero
  unnamed buttons. See `.factory/qa-artifacts/polish-5-live/verify.json`.
- Cold mobile screenshots of landing, demo, and 404 are in
  `.factory/qa-artifacts/polish-5-live/` as `screenshot-mobile.png`,
  `live-demo-mobile.png`, and `live-404-mobile.png`. They were visually
  inspected after deployment.
- Live headers confirm CSP is delivered as a response header, 404 remains HTTP
  404, and `/license` remains HTTP 301 to `/intake`.
- Mobile Lighthouse against the live URL: **100 Performance, 100
  Accessibility, 100 Best Practices, 100 SEO**; LCP 1,247 ms, CLS 0, TBT 1
  ms. See `lighthouse-mobile.json` in the same evidence directory.

## Known gaps and next steps

None. No runtime AI feature, paid checkout, or sync service is appropriate for
this deterministic, privacy-first intake tool; supplier CSV matching and local
CSV/JSON export cover the brief’s transfer needs.

See `.factory/polish-5.md` for the complete finding-by-finding repair map.
