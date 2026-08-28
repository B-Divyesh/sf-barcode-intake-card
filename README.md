# Barcode Intake Card

Turn a barcode scan into a private, printable item card.

Barcode Intake Card is an offline-first receiving desk for micro-sellers and workshops. It records mixed stock before you need an inventory system. Cards, supplier CSV rows, and item photos stay in the browser.

Live site: <https://barcode-intake-card.sociobot.in>

## Try the isolated demo

Open `/demo`, or visit <https://barcode-intake-card.sociobot.in/demo>. It loads three realistic workshop items in a separate IndexedDB database. Choose **Reset demo** to restore the samples. Choose **Start for real** to leave without copying them.

## What it does

- Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo.
- Opens the device camera for barcode scanning with a $19 one-time workshop license.
- Matches a barcode against a CSV file chosen by the user.
- Warns about saved cards with the same barcode.
- Searches saved cards and prints one-up cards with Code 128 barcodes.
- Exports all cards as CSV or a complete JSON backup.
- Imports its JSON backup and works offline after the first visit.

It does not scrape product databases, create purchase orders, or sync accounts.

## Run locally

Node.js 20 or newer is recommended.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Use `http://localhost:5173/demo` for the test sandbox.

## Test and build

```bash
npm test
npm run build
```

`npm test` builds the production app, starts the preview server, and runs the Playwright claim, accessibility, mobile, and console checks. Chromium for Playwright 1.58.2 is required.

The exact deployment command is `npm run build`. Static output lands in `dist/`, with `dist/index.html` at its root.

## Data and privacy

Real cards use IndexedDB database `barcode-intake-real`. Demo cards use `barcode-intake-demo`. License tokens use namespaced local storage. The app sends no item, barcode, CSV, or photo data to a third party. License purchase and verification use the Sociobot billing API.

The service worker caches the app shell. Export a JSON backup before clearing site data or moving devices. See `/privacy` and `/terms` in the app.

## License purchase

Manual intake and all exports are free. The $19 one-time workshop license adds camera scanning. Checkout and license verification use Sociobot’s billing API; no payment provider is embedded here.

## Deployment

Deploy `dist/` as a static site. `staticwebapp.config.json` provides SPA routing, the 404 response, security headers, and MIME types. The factory manages DNS and infrastructure.

## Project notes

- Visual system and image provenance: [`.factory/design.md`](.factory/design.md)
- Verifiable product claims: [`.factory/claims.json`](.factory/claims.json)
- Demo contract: [`.factory/demo.md`](.factory/demo.md)
- Final verification: [`.factory/handoff.md`](.factory/handoff.md)

## License

MIT. See [`LICENSE`](LICENSE).
