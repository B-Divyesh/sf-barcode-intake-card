# Polish 2 — cumulative adversarial repair map

**Implementation commit:** `5087dc1`  
**Live URL:** <https://barcode-intake-card.sociobot.in>  
**Live evidence:** `.factory/qa-evidence/polish-2-live/`

Every finding below was rechecked in this round. Earlier repairs were retained and verified rather than accepted from their prior status.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Raised all ordinary links, wordmarks, buttons, and icon controls to a 45 px safe minimum; this round caught and fixed another fractional 43.99998 px button. | `visible controls meet the 44 pixel touch target at 390 pixels`; live 34/34 suite; `screenshot-mobile.png`. |
| F-1-2 | Retained the exact printable character guidance; no “any printed code” promise remains. | `@claim:print-card`; live `/` and `/intake`. |
| F-1-3 | Retained the registered reset/exit promise and full isolated lifecycle test. | `@claim:demo-reset-exit`; `demo-mobile.png`; live `/?demo=1`. |
| F-1-4 | Retained four-field search coverage for barcode, item, supplier, and location. | `@claim:search-cards`; live `/demo`. |
| F-1-5 | Retained complete backup comparison for all fields, timestamps, and photo data. | `@claim:json-backup`; clean-clone and live suites. |
| F-1-6 | Kept preview-permission timing as its own claim and added a separate deterministic decode-to-field claim. | `@claim:camera-ready`; `@claim:camera-scan`. |
| F-1-7 | Kept demo copy free of an unsupported count and subjective wording. | `@claim:demo-edit`; `demo-desktop.png`. |
| F-1-8 | Retained shared 404 header/footer, skip link, metadata, canonical, social tags, icons, and HTTP status. | `unknown documents return HTTP 404 with the designed recovery page`; `404-headers.txt`; `404-mobile.png`. |
| F-1-9 | Kept “item card” as the single output term in titles, metadata, copy, and footer. | `page basics and axe: /`; `verify.json`. |
| F-1-10 | Decorative publication folios remain removed. | Cold live `screenshot-desktop.png`. |
| F-1-11 | Retained the literal eyebrow “For mixed-stock intake.” | Cold live `screenshot-mobile.png`. |
| F-1-12 | Retained direct mixed-stock guidance in the hero caption. | `.factory/copy-audit.md`; live `/`. |
| F-1-13 | Retained the literal heading “Preview an item card.” | `page basics and axe: /`; `screenshot-mobile.png`. |
| F-1-14 | Retained direct review-before-print guidance. | `@claim:demo-edit`; `@claim:print-card`. |
| F-1-15 | Retained “Print or export the card.” | `@claim:print-card`, `@claim:csv-export`, `@claim:json-backup`. |
| F-1-16 | Retained “What this tool does not do.” | `page basics and axe: /`; live `/`. |
| F-1-17 | The empty limits slogan remains removed. | `.factory/copy-audit.md`; live `/`. |
| F-1-18 | Retained the literal camera section heading. | `@claim:camera-ready`; live `/`. |
| F-1-19 | Retained “Record an item” and consistent intake-form terminology. | Live `/` and `/intake`; `screenshot-mobile.png`. |
| F-1-20 | README remains plain-language and avoids “offline-first” and the desk metaphor. | README review; `@claim:offline-reload`. |
| F-1-21 | README retains “one item card per page.” | README review; `@claim:print-card`. |
| F-1-22 | Asset-lore copy remains absent from the footer; provenance stays in `design.md`. | `verify.json`; live footer. |
| F-1-23 | “Supplier CSV” remains the single lookup-file term. | README and live `/intake`; `@claim:csv-lookup`. |
| F-2-1 | Rewrote the first screen to say exactly what scanning does and added `camera-scan` to `claims.json`. Its browser test replaces only the reader with a deterministic decoded fixture, then asserts the production callback fills the field and closes the scanner. | `@claim:camera-scan camera scanning fills the barcode field`; passed individually from the clean clone and in the live 34/34 suite; `screenshot-mobile.png`. |
| F-2-2 | Replaced the metaphor in both SPA and static 404 renderers with `h1` “Page not found”; changed the lede from “card” to “page.” | Live HTTP 404 in `404-headers.txt`; `404.html`; `404-mobile.png`; 404 regression test. |

## Additional acceptance work

- The primary first-screen action now links directly to `/?demo=1`. It opens seeded sample cards with the persistent nothing-is-saved banner, Reset demo, and Start for real.
- `.factory/catalog-description.txt` is now the 49-character verb-first sentence: “Scan barcodes into private, printable item cards.”
- PWA cache and immutable filenames moved to v8 so the live repair cannot be hidden by an older service worker cache.
- All 17 claim commands passed individually from clean clone `/tmp/barcode-polish2-clean-iJ50Dh`; aggregate clean-clone and live suites both passed 34/34.
- Live Lighthouse scored 100 in Performance, Accessibility, Best Practices, and SEO, with 1.2 s LCP, zero CLS, and 0 ms TBT.

No finding of any severity remains unresolved.
