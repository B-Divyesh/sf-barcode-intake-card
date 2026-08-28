# Handoff — adversarial review 1

## Outcome

Review 1 is complete. Verdict: **FAIL**.

No product code was changed. The review is recorded in `.factory/review-1.md` with 23 findings. `F-1-1` is blocking because the production Privacy email target measures `43.9998779296875px` high at 390 px, regressing the handoff's earlier 44 px repair.

## Verification performed

- Opened the live site cold in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Exercised the one-click demo, edit, Reset demo, Start for real, real-storage isolation, and request log.
- Ran all 15 exact `.factory/claims.json` commands separately in a fresh temporary clone: all passed.
- Ran `npm test`: 33/33 passed and `dist/` was produced.
- Ran the full suite against production. Transient navigation/service-worker failures passed on immediate focused rerun; the 44 px Privacy link failure repeated twice.
- Ran the factory live URL verifier: passed with no console errors.
- Checked live routes, 404 status, metadata, focus on SPA navigation, browser Back, links, response headers, offline behavior, visual identity, and all earlier handoff repairs.
- Audited every landing and README sentence or heading with word counts. No sentence exceeds 22 words.

## Files changed

- `.factory/review-1.md`
- `.factory/handoff.md`

## Work left

Fix every finding in `.factory/review-1.md`, beginning with blocking `F-1-1`. Complete the partial search, backup, and camera claim tests; add the missing demo claims; narrow the “any printed code” copy; complete the 404 skeleton; and replace the flagged copy. Re-run the full review from scratch after deployment.
