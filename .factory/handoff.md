# Handoff — polish 3 complete

## Outcome

Released the cumulative repair for Barcode Intake Card at
<https://barcode-intake-card.sociobot.in>.

- `f0244ec840bdaa4e91279a8234be3d5be72ca2a1` removes the misleading license page, adds the tested no-checkout claim, fixes supplier search guidance, labels the external footer link, and bumps the PWA cache.
- `87722545784a6066a50a35809372475fce71a7ad` gives the longer demo search hint a full mobile row, so all four fields remain visible at 390 px, and bumps the cache again.
- `/license` now returns `301 Location: /intake`; it is absent from the sitemap and no longer renders camera instructions.
- The first screen now plainly says the shipped tool is free to use with no account or checkout. This is an intentional deviation from the brief’s earlier `one-time` monetization note: the deployed product has no billing flow or stated price, so adding a fictional paid tier would be misleading. The complete currently shipped tool is free and that observable promise is registered as `free-no-checkout`.

## Verification

Final clean clone: `/tmp/barcode-intake-card-polish3-final-clean` at `8772254`.

- `npm ci` passed; audit reported zero vulnerabilities.
- Every exact command in `.factory/claims.json` was executed individually: **18/18 passed**.
- `npm test` from the final clean clone passed **36/36** and produced `dist/`.
- Final production run, `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npx playwright test`, passed **36/36**.
- `/opt/fleet/lib/verify-url.sh https://barcode-intake-card.sociobot.in .factory/qa-evidence/polish-3-live` passed: HTTP 200, no console errors, title, `lang=en`, one `h1`, one `main`, alt text, and labelled buttons.
- Live axe coverage passed on `/`, `/demo`, `/intake`, `/records`, `/privacy`, and `/terms`; there were no serious or critical findings.
- Live mobile checks passed for 44 px targets, keyboard skip link, reduced motion, offline reload, demo reset/exit, and the designed HTTP 404.
- Two live Lighthouse 13.4.1 mobile runs scored **100 / 100 / 100 / 100** (Performance / Accessibility / Best Practices / SEO). LCP was 1.210 s then 1.099 s; CLS was 0 in both runs.
- Final built initial application JavaScript is 32.66 KB raw / 11.05 KB gzip; CSS is 11.71 KB raw / 3.57 KB gzip. Deferred scanner and barcode chunks are 108.68 KB and 14.72 KB gzip.

Live evidence is committed under `.factory/qa-evidence/polish-3-live/`, including desktop/mobile landing captures, the isolated demo, the 404, verifier output, and both Lighthouse reports. `.factory/polish-3.md` maps every cumulative finding to its evidence.

## Run and deploy

```bash
npm ci
npm test
npm run build
```

Deploy `dist/` as the configured static site. The final deployment was checked cold at the production URL; `?demo=1` opens isolated sample data with Reset demo and Start for real.

## Known gaps and next steps

None. The local-first PWA intentionally has no account, sync, AI service, or billing flow.
