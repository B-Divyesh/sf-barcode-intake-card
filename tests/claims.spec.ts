import { expect, test } from '@playwright/test';
import { BarcodeFormat, BinaryBitmap, DecodeHintType, HybridBinarizer, MultiFormatReader, RGBLuminanceSource } from '@zxing/library';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';
const baseOrigin = new URL(baseURL).origin;

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review sample intake cards');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('/assets/app-v13.js')))).toBe(true);
  await context.setOffline(true);
  await page.getByRole('link', { name: 'Edit card' }).first().click();
  await expect(page.getByRole('heading', { name: 'Review this item card' })).toBeVisible();
  await page.goBack();
  await expect(page.getByText('608ZZ shielded bearing')).toBeVisible();
});

test('PWA repair cache activates with the versioned app shell', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.evaluate(async () => {
    await caches.open('barcode-intake-v4');
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  });
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).includes('barcode-intake-v13'))).toBe(true);
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).includes('barcode-intake-v4'))).toBe(false);
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('/assets/app-v13.js')))).toBe(true);
});

test('@claim:local-only keeps cards, chosen CSV rows, and photos in this browser without an account or sync', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== baseOrigin) outside.push(request.url());
  });
  await page.goto('/intake');
  await page.getByLabel('Choose CSV').setInputFiles({ name: 'supplier.csv', mimeType: 'text/csv', buffer: Buffer.from('barcode,name,supplier,location,quantity\nLOCAL-1,Local test item,Private Supply,Bench 5,3') });
  await page.getByLabel('Barcode or SKU').fill('LOCAL-1');
  await page.getByLabel('Barcode or SKU').press('Tab');
  await page.getByLabel('Item photo').setInputFiles({ name: 'item.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64') });
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByText('Local test item')).toBeVisible();
  await page.goto('/records');
  await page.reload();
  await expect(page.getByText('LOCAL-1')).toBeVisible();
  await page.getByRole('link', { name: 'Edit card' }).click();
  await expect(page.getByLabel('Item name')).toHaveValue('Local test item');
  await expect(page.getByLabel('Supplier')).toHaveValue('Private Supply');
  await expect(page.getByLabel('Location note')).toHaveValue('Bench 5');
  await expect(page.getByLabel('Quantity')).toHaveValue('3');
  await expect(page.locator('#photo-preview')).toHaveAttribute('src', /^data:image\/jpeg/);
  await expect(page.getByRole('link', { name: /sign in|log in|create account/i })).toHaveCount(0);
  expect(outside).toEqual([]);
});

test('@claim:free-no-checkout records, prints, and exports without an account or checkout', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await expect(page.getByText('Free to use — no account or checkout')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scan barcodes with the camera' })).toBeVisible();
  await expect(page.getByText('Camera scanning, manual entry, and exports are free to use.')).toBeVisible();
  await page.getByRole('link', { name: 'Record an item' }).click();
  await expect(page.getByRole('button', { name: 'Scan with camera' })).toBeEnabled();
  await page.getByLabel('Barcode or SKU').fill('FREE-1');
  await page.getByLabel('Item name').fill('Free flow item');
  await page.getByLabel('Location note').fill('Bench F-01');
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByRole('heading', { name: 'Print one item card' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to cards' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await downloadPromise;
  await expect(page.locator('a[href*="checkout"], a[href*="api.sociobot.in"], form[action*="checkout"]')).toHaveCount(0);
  expect(requests.every((url) => new URL(url).origin === baseOrigin)).toBe(true);
});

test('@claim:manual-intake saves a manually entered item card', async ({ page }) => {
  await page.goto('/intake');
  await page.getByLabel('Barcode or SKU').fill('TEST-4042');
  await page.getByLabel('Item name').fill('Brass hose adapter');
  await page.getByLabel('Location note').fill('Bin B-08');
  await page.getByLabel('Supplier').fill('Harbour Fasteners');
  await page.getByLabel('Quantity').fill('9');
  await page.getByLabel('Review notes').fill('Check thread before use.');
  await page.getByLabel('Item photo').setInputFiles({ name: 'adapter.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64') });
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByText('Brass hose adapter')).toBeVisible();
  await page.goto('/records');
  await expect(page.getByText('TEST-4042')).toBeVisible();
  await page.getByRole('link', { name: 'Edit card' }).click();
  await expect(page.getByLabel('Supplier')).toHaveValue('Harbour Fasteners');
  await expect(page.locator('#photo-preview')).toHaveAttribute('src', /^data:image\/jpeg/);
});

test('@claim:duplicate-review shows saved cards with the same barcode', async ({ page }) => {
  await page.goto('/intake?demo=1');
  await page.getByLabel('Barcode or SKU').fill('5901234123457');
  await page.getByLabel('Barcode or SKU').press('Tab');
  await expect(page.getByText('1 possible duplicate')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Review this card' })).toBeVisible();
});

test('@claim:csv-lookup fills fields from a chosen supplier CSV', async ({ page }) => {
  await page.goto('/intake');
  await page.getByLabel('Choose CSV').setInputFiles({ name: 'supplier.csv', mimeType: 'text/csv', buffer: Buffer.from('barcode,name,supplier,location,quantity\n3210009,M6 flange nut,Acme Trade,Rack 7,0') });
  await expect(page.getByText('1 lookup rows are ready')).toBeVisible();
  await page.getByLabel('Barcode or SKU').fill('3210009');
  await page.getByLabel('Barcode or SKU').press('Tab');
  await expect(page.getByLabel('Item name')).toHaveValue('M6 flange nut');
  await expect(page.getByLabel('Supplier')).toHaveValue('Acme Trade');
  await expect(page.getByLabel('Location note')).toHaveValue('Rack 7');
  await expect(page.getByLabel('Quantity')).toHaveValue('0');
});

test('@claim:csv-export exports one row per demo card', async ({ page }) => {
  await page.goto('/demo');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream) text += chunk.toString();
  const lines = text.trim().split('\n');
  expect(lines[0]).toBe('barcode,name,supplier,location,quantity,notes,updated_at');
  expect(lines).toHaveLength(4);
});

test('@claim:search-cards filters saved cards by barcode, item, supplier, and location', async ({ page }) => {
  await page.goto('/demo');
  const search = page.getByLabel('Search cards');
  await expect(search).toHaveAttribute('placeholder', 'Barcode, item, supplier, or location');
  const cases = [
    ['5901234123457', '608ZZ shielded bearing'],
    ['USB-C panel cable', 'USB-C panel cable, 30 cm'],
    ['Pack & Post Trade', 'Thermal labels, 50 × 30 mm'],
    ['Drawer C-03', 'USB-C panel cable, 30 cm']
  ];
  for (const [query, name] of cases) {
    await search.fill(query);
    await expect(page.getByRole('heading', { name, level: 2 })).toBeVisible();
    await expect(page.locator('.record:not([hidden])')).toHaveCount(1);
  }
});

test('@claim:json-backup exports and restores every saved field including the photo', async ({ page }) => {
  await page.goto('/intake');
  await page.getByLabel('Barcode or SKU').fill('BACKUP-1');
  await page.getByLabel('Item name').fill('Backup test washer');
  await page.getByLabel('Supplier').fill('Full Field Supply');
  await page.getByLabel('Location note').fill('Tray 4');
  await page.getByLabel('Quantity').fill('7');
  await page.getByLabel('Review notes').fill('Every saved field must return.');
  await page.getByLabel('Item photo').setInputFiles({ name: 'backup.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64') });
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByRole('heading', { name: 'Print one item card' })).toBeVisible();
  await page.goto('/records');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  const backup = JSON.parse(Buffer.concat(chunks).toString());
  expect(backup.items).toHaveLength(1);
  const expected = backup.items[0];
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'No item cards yet' })).toBeVisible();
  await page.getByLabel('Import backup').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.concat(chunks) });
  await expect(page.getByText('Backup test washer')).toBeVisible();
  const restored = await page.evaluate(async (id) => new Promise((resolve, reject) => {
    const request = indexedDB.open('barcode-intake-real', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const read = db.transaction('items').objectStore('items').get(id);
      read.onsuccess = () => { db.close(); resolve(read.result); };
      read.onerror = () => reject(read.error);
    };
  }), expected.id);
  expect(restored).toEqual(expected);
});

test('@regression:backup-validation rejects bad shape, version, and types without changing stored cards', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/intake');
  await page.getByLabel('Barcode or SKU').fill('KEEP-1');
  await page.getByLabel('Item name').fill('Existing keeper card');
  await page.getByLabel('Location note').fill('Shelf K');
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByRole('heading', { name: 'Print one item card' })).toBeVisible();
  await page.goto('/records');

  const now = new Date().toISOString();
  const complete = {
    id: 'must-not-import', barcode: 'VALID-2', name: 'Must not import', supplier: '',
    location: 'Shelf V', quantity: 2, notes: '', createdAt: now, updatedAt: now
  };
  const invalidBackups = [
    { version: 1, exportedAt: now, items: [complete, { id: 'bad-a', barcode: 'BAD-A', name: 'Missing fields A' }] },
    { version: 2, exportedAt: now, items: [complete] },
    { version: 1, exportedAt: now, items: [{ ...complete, quantity: '2' }] }
  ];
  for (const [index, backup] of invalidBackups.entries()) {
    await page.getByLabel('Import backup').setInputFiles({
      name: `invalid-${index}.json`, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup))
    });
    await expect(page.locator('#records-status')).toHaveText('The backup could not be imported. Choose a Barcode Intake Card JSON backup.');
    await expect(page.getByText('Existing keeper card')).toBeVisible();
    await expect(page.getByText('Must not import')).toHaveCount(0);
  }

  await page.reload();
  await expect(page.getByText('Existing keeper card')).toBeVisible();
  await expect(page.getByText('Must not import')).toHaveCount(0);
  await expect(page.getByText('1 card stored in this browser.')).toBeVisible();

  // The repair must also recover browsers already damaged by the previous importer.
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('barcode-intake-real', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('items', 'readwrite');
      tx.objectStore('items').put({ id: 'bad-a', barcode: 'BAD-A', name: 'Missing fields A' });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await page.reload();
  await expect(page.getByText('Missing fields A')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Find your saved cards' })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('@claim:print-card prints English letters, numbers, spaces, and punctuation as a decodable Code 128 barcode', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/intake');
  await page.getByLabel('Barcode or SKU').fill('部品-１２３');
  await page.getByLabel('Item name').fill('Unsupported code test');
  await page.getByLabel('Location note').fill('Print bench');
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.locator('#form-status')).toHaveText('Use English letters, numbers, spaces, or standard punctuation. This barcode format cannot print other scripts.');
  await expect(page).toHaveURL(/\/intake$/);

  await page.getByLabel('Barcode or SKU').fill('PART A-12/3');
  await page.getByLabel('Item name').fill('Printable character set test');
  await page.getByLabel('Location note').fill('Print bench');
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByRole('heading', { name: 'Print one item card' })).toBeVisible();
  const barcode = page.locator('#print-barcode');
  await expect(barcode).toHaveAttribute('aria-label', /Barcode/);
  await expect.poll(() => barcode.evaluate((canvas: HTMLCanvasElement) => canvas.width)).toBeGreaterThan(250);
  const pixels = await barcode.evaluate((canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Barcode canvas has no drawing context.');
    const rgba = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const luminances = new Array<number>(canvas.width * canvas.height);
    const colors = new Set<number>();
    for (let pixel = 0; pixel < luminances.length; pixel += 1) {
      luminances[pixel] = rgba[pixel * 4];
      colors.add(rgba[pixel * 4]);
    }
    return { width: canvas.width, height: canvas.height, luminances, colorCount: colors.size };
  });
  expect(pixels.colorCount).toBeGreaterThan(1);
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);
  hints.set(DecodeHintType.TRY_HARDER, true);
  const source = new RGBLuminanceSource(Uint8ClampedArray.from(pixels.luminances), pixels.width, pixels.height);
  const decoded = new MultiFormatReader().decode(new BinaryBitmap(new HybridBinarizer(source)), hints);
  expect(decoded.getText()).toBe('PART A-12/3');
  await expect(page.getByText('Print bench')).toBeVisible();
  expect(errors).toEqual([]);
});

test('@regression:barcode-render-error gives legacy unsupported codes a visible recovery path', async ({ page }) => {
  await page.goto('/records');
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('barcode-intake-real', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('items', 'readwrite');
      tx.objectStore('items').put({
        id: 'legacy-unicode', barcode: '部品-１２３', name: 'Legacy imported part', supplier: '',
        location: 'Old shelf', quantity: 1, notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await page.goto('/print/legacy-unicode');
  await expect(page.getByRole('alert')).toContainText('This code cannot be printed as a Code 128 barcode. Use English letters, numbers, spaces, or standard punctuation.');
  await expect(page.getByRole('button', { name: 'Print card' })).toBeDisabled();
  await expect(page.locator('#print-barcode')).toHaveAttribute('aria-label', 'Barcode image unavailable. Code 部品-１２３');
  await expect(page.getByRole('link', { name: 'Edit this card' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to cards' })).toBeVisible();
});

test('@claim:photo-reduction reduces a large photo before storing it', async ({ page }) => {
  await page.goto('/intake');
  const source = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1000;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#d9cbb4';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#171714';
    for (let x = 0; x < canvas.width; x += 80) context.fillRect(x, 0, 24, canvas.height);
    return canvas.toDataURL('image/png');
  });
  await page.getByLabel('Item photo').setInputFiles({ name: 'large.png', mimeType: 'image/png', buffer: Buffer.from(source.split(',')[1], 'base64') });
  await expect(page.locator('#form-status')).toContainText('Photo ready at 1200 × 750 pixels.');
  await page.getByLabel('Barcode or SKU').fill('PHOTO-1200');
  await page.getByLabel('Item name').fill('Reduced photo test');
  await page.getByLabel('Location note').fill('Photo bench');
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByRole('heading', { name: 'Print one item card' })).toBeVisible();
  await page.goto('/records');
  await page.getByRole('link', { name: 'Edit card' }).click();
  const dimensions = await page.locator('#photo-preview').evaluate(async (image: HTMLImageElement) => {
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight, source: image.src };
  });
  expect(dimensions).toEqual(expect.objectContaining({ width: 1200, height: 750 }));
  expect(dimensions.source).toMatch(/^data:image\/jpeg/);
});

test('@claim:no-web-lookup entering a barcode makes no automatic web lookup', async ({ page }) => {
  await page.goto('/intake');
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.method()} ${request.url()}`));
  await page.getByLabel('Barcode or SKU').fill('UNKNOWN-LOOKUP-19');
  await page.getByLabel('Barcode or SKU').press('Tab');
  await page.waitForTimeout(300);
  expect(requests).toEqual([]);
  await expect(page.getByLabel('Item name')).toHaveValue('');
});

test('@claim:no-purchase-orders saving a card creates no purchase order', async ({ page }) => {
  const mutations: string[] = [];
  page.on('request', (request) => {
    if (!['GET', 'HEAD'].includes(request.method())) mutations.push(`${request.method()} ${request.url()}`);
  });
  await page.goto('/intake');
  await page.getByLabel('Barcode or SKU').fill('NO-PO-1');
  await page.getByLabel('Item name').fill('Arrival record only');
  await page.getByLabel('Location note').fill('Receiving shelf');
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByRole('heading', { name: 'Print one item card' })).toBeVisible();
  await page.goto('/records');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const stream = await (await downloadPromise).createReadStream();
  let backup = '';
  for await (const chunk of stream) backup += chunk.toString();
  expect(JSON.parse(backup)).not.toHaveProperty('purchaseOrders');
  expect(backup.toLowerCase()).not.toContain('purchaseorder');
  expect(mutations).toEqual([]);
});

test('@claim:demo-isolated keeps sample cards separate from real cards', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('608ZZ shielded bearing')).toBeVisible();
  await page.goto('/records');
  await expect(page.getByRole('heading', { name: 'No item cards yet' })).toBeVisible();
  await expect(page.getByText('608ZZ shielded bearing')).toHaveCount(0);
});

test('@claim:demo-edit searches, edits, and prints a sample card', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Search cards').fill('608ZZ');
  await expect(page.getByText('608ZZ shielded bearing')).toBeVisible();
  await page.getByLabel('Search cards').fill('');
  await page.getByRole('link', { name: 'Edit card' }).first().click();
  await page.getByLabel('Review notes').fill('Edited in the isolated demo.');
  await page.getByRole('button', { name: 'Save card changes' }).click();
  await expect(page.getByText('Edited in the isolated demo.')).toBeVisible();
  await page.getByRole('link', { name: 'Back to cards' }).click();
  await page.getByRole('link', { name: 'Print card' }).first().click();
  await expect(page.getByRole('heading', { name: 'Print one item card' })).toBeVisible();
});

test('@claim:demo-reset-exit restores samples and discards demo changes before real use', async ({ page }) => {
  const resetNote = 'Verifier edit that Reset demo must discard';
  const exitNote = 'Verifier edit that Start for real must discard';
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { name: 'Review sample intake cards' })).toBeVisible();
  await expect(page.getByLabel('Demo status')).toContainText('nothing is saved to your real cards');
  await page.getByRole('link', { name: 'Edit card' }).first().click();
  await page.getByLabel('Review notes').fill(resetNote);
  await page.getByRole('button', { name: 'Save card changes' }).click();
  await expect(page.getByText(resetNote)).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('608ZZ shielded bearing')).toBeVisible();
  await page.getByRole('link', { name: 'Edit card' }).first().click();
  await expect(page.getByLabel('Review notes')).toHaveValue('Check bore before restocking.');
  await page.getByLabel('Review notes').fill(exitNote);
  await page.getByRole('button', { name: 'Save card changes' }).click();
  await expect(page.getByText(exitNote)).toBeVisible();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/intake$/);
  await page.goto('/records');
  await expect(page.getByRole('heading', { name: 'No item cards yet' })).toBeVisible();
  await page.goto('/?demo=1');
  await page.getByRole('link', { name: 'Edit card' }).first().click();
  await expect(page.getByLabel('Review notes')).toHaveValue('Check bore before restocking.');
  await expect(page.getByLabel('Review notes')).not.toHaveValue(exitNote);
});

test('@claim:camera-ready opens camera preview only after the scan action', async ({ page, context }) => {
  await context.grantPermissions(['camera'], { origin: baseOrigin });
  const outside: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== baseOrigin) outside.push(request.url());
  });
  await page.goto('/intake');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('a[href*="checkout"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Scan with camera' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/Camera ready|Hold one barcode/)).toBeVisible();
  expect(outside).toEqual([]);
});

test('@regression:camera-preview needs no billing SKU', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="api.sociobot.in"]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText('$19');
  await page.getByRole('link', { name: 'Record an item' }).click();
  await expect(page.getByRole('button', { name: 'Scan with camera' })).toBeEnabled();
});
