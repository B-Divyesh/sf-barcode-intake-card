# Barcode Intake Card

Turn a barcode scan into a private, printable item card.

Barcode Intake Card records incoming stock for micro-sellers and workshops, and works offline after your first visit. Cards, supplier CSV rows, and item photos stay in the browser. It is free to use with no account or checkout.

Live site: <https://barcode-intake-card.sociobot.in>

## Try the isolated demo

Open `/demo`, or visit <https://barcode-intake-card.sociobot.in/?demo=1>. It opens sample workshop cards stored separately from your real cards. Choose **Reset demo** to restore the samples. Choose **Start for real** to clear the demo and leave without copying it.

## What it does

- Records a barcode, item name, supplier, location, quantity, notes, and a reduced photo.
- Opens a camera preview only after you choose Scan with camera.
- Fills the barcode field when the camera reader decodes a barcode.
- Matches a barcode against a supplier CSV you choose.
- Warns about saved cards with the same barcode.
- Searches saved cards and prints one item card per page with a Code 128 barcode. Printable codes use English letters, numbers, spaces, and punctuation.
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

Build the deployable files with `npm run build`. Static output lands in `dist/`, with `dist/index.html` at its root.

## Data and privacy

Real cards use IndexedDB database `barcode-intake-real`. Demo cards use `barcode-intake-demo`. The app sends no item, barcode, CSV, or photo data to a third party. It has no account, sync, checkout, or billing request.

The service worker caches the app shell. Export a JSON backup before clearing site data or moving devices. See `/privacy` and `/terms` in the app.

## Camera scanning

Camera scanning, manual entry, and exports are free to use. Choose **Scan with camera** to open the preview. A decoded barcode fills the barcode field. You can always type it instead.

## Deployment

Deploy `dist/` as a static site. `staticwebapp.config.json` provides SPA routing, the 404 response, security headers, and MIME types. The factory manages DNS and infrastructure.

## Project notes

- Visual system and image provenance: [`.factory/design.md`](.factory/design.md)
- Verifiable product claims: [`.factory/claims.json`](.factory/claims.json)
- Demo contract: [`.factory/demo.md`](.factory/demo.md)
- Final verification: [`.factory/handoff.md`](.factory/handoff.md)

## License

MIT. See [`LICENSE`](LICENSE).
