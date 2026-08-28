# Polish 1 — adversarial review repair map

**Repair commit:** `679b151680c40110db04dedad07a75790047b5d7`

**Live URL checked cold:** <https://barcode-intake-card.sociobot.in>
**Evidence:** `.factory/qa-evidence/polish-1-live/` — landing screenshots, demo screenshots, designed 404 screenshot, and `verify.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Raised ordinary link minimum height to 45 px, preventing fractional 44 px layout loss. | `visible controls meet the 44 pixel touch target at 390 pixels`; live `/privacy` in production suite. |
| F-1-2 | Replaced “any printed code” with the supported English-letter, number, space, and punctuation set. | `@claim:print-card`; live landing screenshot. |
| F-1-3 | Added the `demo-reset-exit` claim and full reset/exit lifecycle test. | `@claim:demo-reset-exit`; `demo-mobile.png`; live `/?demo=1`. |
| F-1-4 | Expanded the one search claim test to barcode, item name, supplier, and location. | `@claim:search-cards`; live `/demo`. |
| F-1-5 | Expanded backup test to save, export, delete, import, and exact-compare every field, timestamps, and reduced photo bytes. | `@claim:json-backup`; live `/records`. |
| F-1-6 | Narrowed the user-facing and registered promise to the tested behavior: camera preview opens only after Scan with camera. | `@claim:camera-ready`; live `/intake`. |
| F-1-7 | Removed the unsupported demo count and subjective “realistic” wording. | `@claim:demo-edit`; `demo-desktop.png`; live `/?demo=1`. |
| F-1-8 | Rebuilt static 404 with skip link, shared header/footer, route metadata, canonical, social metadata, icons, and recovery action. | `unknown documents return HTTP 404 with the designed recovery page`; `404-mobile.png`; live `/polish-1-missing` returns 404. |
| F-1-9 | Standardized title, Open Graph, Twitter, footer, and copy on “item card.” | `page basics and axe: /`; `verify.json`; live `/`. |
| F-1-10 | Removed decorative folio labels while preserving the broadsheet rule. | `demo-desktop.png` and live `/` cold check. |
| F-1-11 | Replaced the mood-line eyebrow with “For mixed-stock intake.” | `verify.json`; live `/`. |
| F-1-12 | Replaced the hero slogan with direct intake guidance. | `copy-audit.md`; live `/`. |
| F-1-13 | Renamed the preview heading to “Preview an item card.” | `page basics and axe: /`; live `/`. |
| F-1-14 | Replaced vague uncertainty wording with a direct review-before-print statement. | `copy-audit.md`; live `/`. |
| F-1-15 | Renamed step three “Print or export the card.” | `copy-audit.md`; live `/`. |
| F-1-16 | Renamed the limits section “What this tool does not do.” | `page basics and axe: /`; live `/`. |
| F-1-17 | Removed the empty limits introduction. | `copy-audit.md`; live `/`. |
| F-1-18 | Renamed the camera section “Camera preview is included.” | `@claim:camera-ready`; live `/intake`. |
| F-1-19 | Changed the CTA to “Record an item” and standardized the destination as the intake form. | `regression:camera-preview needs no billing SKU`; live `/`. |
| F-1-20 | Rewrote README introduction in plain language without “offline-first” or “receiving desk.” | README review; `@claim:offline-reload`. |
| F-1-21 | Rewrote README print wording to “one item card per page.” | README review; `@claim:print-card`. |
| F-1-22 | Removed footer asset-lore text; provenance remains in `design.md`. | `verify.json`; live `/`. |
| F-1-23 | Standardized README lookup wording on “supplier CSV.” | README review; `@claim:csv-lookup`. |

## Additional acceptance repairs

- `/?demo=1` now opens the isolated seeded sample cards directly, with the persistent banner, Reset demo, and Start for real controls. Reset returns to the sample cards after reseeding; exit clears the demo namespace before real intake opens.
- PWA cache and immutable assets moved from v6 to v7 so the repair cannot be masked by a prior cache.
- Dynamic SPA route metadata now updates Open Graph and Twitter title/description as well as document title, description, and canonical URL.

All 16 claim commands from `.factory/claims.json` passed individually in a fresh clone. The full Playwright suite passed locally and against production (33 tests each); the production suite includes axe checks, touch targets, keyboard/focus behavior, PWA/offline behavior, privacy request checks, and 404 semantics.
