# Handoff — perfection-loop round 4

## Outcome

The release is repaired, committed, pushed, deployed, and cold-checked at
<https://barcode-intake-card.sociobot.in>. All findings from review rounds 1–4
and their retained verification findings are closed. The product remains a
local-first Vite/TypeScript PWA with its monochrome workshop-broadsheet visual
system; no product scope, hosting class, tracking, or external data path was
added.

The repaired release is v1.0.9. Code changes are in
`0e04afd20620e8ada252a77defcf1c9d1d67e374` and
`d9a3968b2b0fd86a7eed974178af9ee577b72405`; both are pushed to `main`.
Static deployment completed as Azure deployment
`85b6cfe6-ee3e-4e7d-b3b0-c9d7c623eddb`.

## What changed

- The landing preview now only shows content real item cards have: a sample
  card label plus location, quantity, and notes. It no longer invents an
  intake number or review status.
- The hero caption is plain guidance with no decorative “Fig. 01” prefix.
- README correctly calls `npm run build` a build command, not a deployment
  command.
- The JSON-backup claim test now waits for the saved-card result before
  exporting. This removes a race observed only in an aggregate clean-clone
  run while preserving the full restoration assertion.
- The PWA cache and versioned asset names moved to v11/v1.0.9, ensuring the
  repaired shell replaces earlier cached copy.
- The catalog description is now the verb-first, 49-character sentence:
  “Turn barcodes into private, printable item cards.”

## Verification

### Clean clone and local quality gates

- Fresh clone `/tmp/barcode-intake-polish4-final-clean-T7hoc9` at
  `d9a3968`:
  - `npm ci` passed with 0 audit vulnerabilities.
  - Every exact claim command from `.factory/claims.json` passed separately:
    `offline-reload`, `free-no-checkout`, `local-only`, `manual-intake`,
    `duplicate-review`, `csv-lookup`, `csv-export`, `search-cards`,
    `json-backup`, `print-card`, `demo-isolated`, `demo-edit`,
    `demo-reset-exit`, `camera-ready`, `camera-scan`, `photo-reduction`,
    `no-web-lookup`, and `no-purchase-orders`.
  - Every claim tag occurs exactly once; the final aggregate `npm test` passed
    **38/38** and the clone’s `test-results/.last-run.json` is `passed`.
- The work-order command `npm ci && npm test && npm run build` passed in the
  repair checkout; the final `dist/` has `index.html` at its root.
- Local verifier passed at `http://127.0.0.1:4174/`: no errors, one h1, main,
  `lang=en`, title, image alternatives, and labelled buttons. Evidence:
  `.factory/qa-artifacts/polish-4-local-verify/verify.json`.
- Local Lighthouse desktop and mobile both scored 100 in all four categories.
  Mobile: LCP 1.357 s, CLS 0, TBT 0. Evidence:
  `.factory/qa-artifacts/lighthouse-polish-4-local-mobile.json`.

### Production cold check

- Fresh production suite:
  `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npm test` —
  **38/38 passed**.
- `/opt/fleet/lib/verify-url.sh` passed live with no console/page errors,
  `lang=en`, title, one h1, main, zero missing image alternatives, and zero
  unnamed buttons. Evidence:
  `.factory/qa-artifacts/polish-4-live-verify/verify.json`.
- Direct cold requests returned 200 for `/`, `/demo`, `/?demo=1`, `/intake`,
  `/records`, `/privacy`, `/terms`, and `/print/demo-bearing?demo=1`;
  `/polish-4-missing` returned 404; `/license` returned 301.
- The production shell serves `app-v11.js`, cache `barcode-intake-v11`,
  “Sample item card,” and “Check bore before restocking.” It does not contain
  “Fig. 01,” “Intake 0142,” or “Ready to review.”
- Live mobile Lighthouse: Performance **100**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 0.905 s, LCP 1.078 s, CLS 0, TBT 0.
  Evidence: `.factory/qa-artifacts/lighthouse-polish-4-live-mobile.json`.
- Fresh visual evidence:
  `.factory/qa-artifacts/polish-4-live-desktop.png`,
  `.factory/qa-artifacts/polish-4-live-mobile.png`,
  `.factory/qa-artifacts/polish-4-live-demo-mobile.png`, and
  `.factory/qa-artifacts/polish-4-live-404-mobile.png`.

## Demo, privacy, and PWA

- `?demo=1` and `/demo` enter the separate `barcode-intake-demo` IndexedDB
  namespace. The first settled view includes sample cards and the persistent
  “Demo — sample data, nothing is saved to your real cards” banner, with
  Reset demo and Start for real.
- Reset restores the original samples. Start for real clears demo edits before
  opening real intake and never copies them into `barcode-intake-real`.
- Offline, camera lifecycle, local-only request logging, supplier CSV lookup,
  JSON backup/restore, printing, mobile controls, keyboard focus, route
  metadata/focus, legal links, and the designed static 404 are exercised by
  the final local and live suites.

## Known gaps and next steps

None. No paid tier or runtime AI feature is appropriate for this deterministic,
privacy-first local tool; supplier CSV lookup and exports cover the brief’s
transfer needs without sending inventory data away.

See `.factory/polish-4.md` for the finding-by-finding repair and evidence map.
