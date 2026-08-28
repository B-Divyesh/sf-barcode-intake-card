# Independent verification 5 — PASS

**Candidate:** `e1eba4a8763ba6b7b4f13d92b6632f9dc205f490`  
**Live URL:** <https://barcode-intake-card.sociobot.in>  
**Verified:** 2026-08-28

## Verdict

**PASS — release accepted.** The deployed runtime matches the candidate and the offline, local-first barcode-intake workflow works end to end. No release-blocking defects were found.

## Required opening checks

### Claims

`.factory/claims.json` exists and contains 15 claims. From the clean checkout, after `npm ci`, every listed command was run individually and passed:

`offline-reload`, `local-only`, `manual-intake`, `duplicate-review`, `csv-lookup`, `csv-export`, `search-cards`, `json-backup`, `print-card`, `demo-isolated`, `demo-edit`, `camera-ready`, `photo-reduction`, `no-web-lookup`, and `no-purchase-orders`.

The full local suite then passed **33/33**. A fresh production run using `PLAYWRIGHT_BASE_URL=https://barcode-intake-card.sociobot.in npx playwright test` also passed **33/33 in 1.1 minutes**, covering all claims and regression checks.

One initial fresh live run timed out while waiting for `navigator.serviceWorker.ready`. A repeat of the exact offline claim passed in 4.8 seconds; the complete subsequent live suite passed, and direct inspection showed an active `barcode-intake-v6` worker controlling the page with all 13 shell files cached. This did not reproduce and is not a finding.

### Cold first read

Passes at a cold 390 × 844 viewport and desktop:

- **What it does:** “Turn scans into item cards.”
- **For whom:** “For small sellers and workshops receiving mixed stock without a full inventory system.”
- **What to click first:** the visible one-click **Try it with sample data** action, with adjacent text explaining it opens three cards to search, edit, and print.

The demo opened realistic sample cards and its persistent banner offered Reset demo and Start for real.

## Build and functional verification

- `npm ci`: passed; 0 audit vulnerabilities.
- `npm test`: **33/33 passed** locally.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed and produced `dist/`; no lint script exists.
- Initial app JS: 33.04 KB raw / 11.26 KB gzip. CSS: 11.88 KB raw / 3.58 KB gzip. Deferred barcode and scanner chunks: 14.72 KB and 108.68 KB gzip. Initial JS is within the static-product budget.
- Normal and recovery paths passed in the live suite: manual intake, duplicates, chosen CSV lookup, search, CSV/JSON export and import, valid photo reduction, corrupt-photo recovery, camera permission/cleanup, print rendering, deletion, demo isolation, and demo exit reset.
- The prior invalid-backup failure is repaired: malformed shape, version, and type inputs are rejected without changing existing cards, and legacy incomplete records no longer crash the ledger.
- The prior accepted-Unicode printable-code failure is repaired: unsupported scripts are rejected at entry with an explicit recovery message; normal Code 128 cards render decodable marks. Legacy unsupported cards get a visible print recovery path.
- The prior demo-exit failure is repaired: Start for real clears demo edits before a new demo is seeded.

## Live privacy, PWA, accessibility, and deployment

- The production test flow recorded no cross-origin requests. The page has no account, sync, billing, AI, or server-side product endpoint; rate-limit, backend concurrency/health, and Entra checks do not apply.
- The browser received a same-origin CSP; HSTS, `nosniff`, strict-origin referrer policy, and camera-only permissions policy. HTML, manifest, and worker revalidate at 30 seconds; hashed app assets are immutable for one year.
- The active production worker is `barcode-intake-v6`, precaches the shell, and the fresh offline-reload claim passed. Local PWA update/cache-cleanup regression coverage passed.
- `verify-url.sh` passed live: title, `lang=en`, one `h1`, one `main`, image alternatives, labelled buttons, and zero console errors.
- Live axe coverage across `/`, `/demo`, `/intake`, `/records`, `/privacy`, `/terms`, and `/license` found no serious or critical violations. Keyboard skip-link and 390 px mobile/44 px target checks passed. Reduced-motion and camera cleanup checks passed.
- Lighthouse 13.4.1 mobile: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.1 s, TBT 100 ms, CLS 0.
- SHA-256 comparison found all **20 served runtime files** identical to clean local `dist/`. `staticwebapp.config.json` is deployment configuration and correctly returns 404 rather than being served.

## Defects

None found. No known release-blocking gaps.
