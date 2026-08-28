# Handoff — adversarial review 2

## Outcome

Review-only work completed; no product code was changed. `.factory/review-2.md` records a **FAIL** with two findings:

1. The landing promises barcode scanning while the registered camera claim and test prove only that a preview opens.
2. Both designed 404 renderers use the metaphor “This card is not in the file” rather than a literal error heading.

## Verification performed

- Cold, storage-empty live checks at 390 × 844 and 1440 × 900: the first screen states the job, audience, and first action; no console errors or third-party requests occurred.
- Demo checked live: three sample cards load in one click, banner/reset/exit are present, reset clears an edit, Start for real reaches `/intake`, and real `/records` remains empty.
- Each of the 16 exact `.factory/claims.json` commands was run individually in clean clone `/tmp/barcode-intake-review-2-nZ1iKs`; all passed.
- Aggregate clean-clone `npm test` passed **33/33** and built `dist/`; the live 390 px touch-target test also passed.
- Live routes, metadata, shared structure, back/focus behavior, link crawl, privacy request log, 404 status, prior review findings, README, and landing copy were rechecked from scratch.

## Next steps

Implement the two concrete fixes in `review-2.md`, then repeat the clean-clone claim loop and the live first-read review. Do not mark the product accepted until the camera scan promise is either tested and registered or removed, and the 404 heading is literal.
