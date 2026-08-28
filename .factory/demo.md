# Demo sandbox

- URL: `https://barcode-intake-card.sociobot.in/demo` (local: `http://localhost:5173/demo`). `?demo=1` keeps demo mode on app routes.
- Sample data: three workshop items — a shielded bearing, a panel cable, and thermal label rolls — with realistic barcodes, suppliers, quantities, notes, and locations.
- Reset: choose **Reset demo** in the persistent banner. This clears and reseeds only the demo database.
- Leave: choose **Start for real**. Demo data is not copied.
- Storage: IndexedDB database `barcode-intake-demo`. Real cards use `barcode-intake-real`.
- Offline: visit the demo once, wait for the service worker, then disconnect and keep using its intake routes.
