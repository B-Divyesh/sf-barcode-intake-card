import { expect, test } from '@playwright/test';

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('http://127.0.0.1:4173/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review sample intake cards');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('/assets/app-v2.js')))).toBe(true);
  await context.setOffline(true);
  await page.getByRole('link', { name: 'Edit card' }).first().click();
  await expect(page.getByRole('heading', { name: 'Review this item card' })).toBeVisible();
  await page.goBack();
  await expect(page.getByText('608ZZ shielded bearing')).toBeVisible();
});

test('PWA repair cache activates with the versioned app shell', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).includes('barcode-intake-v2'))).toBe(true);
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('/assets/app-v2.js')))).toBe(true);
});

test('@claim:local-only keeps item data in this browser without an account or sync', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url());
  });
  await page.goto('/intake');
  await page.getByLabel('Choose CSV').setInputFiles({ name: 'supplier.csv', mimeType: 'text/csv', buffer: Buffer.from('barcode,name,supplier,location,quantity\nLOCAL-1,Local test item,Private Supply,Bench 5,3') });
  await page.getByLabel('Barcode or SKU').fill('LOCAL-1');
  await page.getByLabel('Barcode or SKU').press('Tab');
  await page.getByLabel('Item photo').setInputFiles({ name: 'item.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64') });
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByText('Local test item')).toBeVisible();
  await page.goto('/records');
  await expect(page.getByText('LOCAL-1')).toBeVisible();
  await expect(page.getByRole('link', { name: /sign in|log in|create account/i })).toHaveCount(0);
  expect(outside).toEqual([]);
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
  await page.getByLabel('Choose CSV').setInputFiles({ name: 'supplier.csv', mimeType: 'text/csv', buffer: Buffer.from('barcode,name,supplier,location,quantity\n3210009,M6 flange nut,Acme Trade,Rack 7,25') });
  await expect(page.getByText('1 lookup rows are ready')).toBeVisible();
  await page.getByLabel('Barcode or SKU').fill('3210009');
  await page.getByLabel('Barcode or SKU').press('Tab');
  await expect(page.getByLabel('Item name')).toHaveValue('M6 flange nut');
  await expect(page.getByLabel('Location note')).toHaveValue('Rack 7');
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

test('@claim:search-cards filters saved cards by location', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Search cards').fill('Drawer C-03');
  await expect(page.getByText('USB-C panel cable, 30 cm')).toBeVisible();
  await expect(page.getByText('608ZZ shielded bearing')).toBeHidden();
});

test('@claim:json-backup restores exported cards', async ({ page }) => {
  await page.goto('/intake');
  await page.getByLabel('Barcode or SKU').fill('BACKUP-1');
  await page.getByLabel('Item name').fill('Backup test washer');
  await page.getByLabel('Location note').fill('Tray 4');
  await page.getByRole('button', { name: 'Save item card' }).click();
  await page.goto('/records');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'No item cards yet' })).toBeVisible();
  await page.getByLabel('Import backup').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.concat(chunks) });
  await expect(page.getByText('Backup test washer')).toBeVisible();
});

test('@claim:print-card renders a scannable barcode on a one-up card', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Print card' }).first().click();
  const barcode = page.locator('#print-barcode');
  await expect(barcode).toHaveAttribute('aria-label', /Barcode/);
  await expect(barcode.locator('rect')).not.toHaveCount(0);
  await expect(page.getByText('Bin A-14')).toBeVisible();
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

test('@claim:camera-ready opens the included device camera only after a scan action', async ({ page, context }) => {
  await context.grantPermissions(['camera'], { origin: 'http://127.0.0.1:4173' });
  const outside: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url());
  });
  await page.goto('/intake');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('a[href*="checkout"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Scan with camera' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/Camera ready|Hold one barcode/)).toBeVisible();
  expect(outside).toEqual([]);
});

test('@regression:checkout-dead-link keeps camera scanning usable without the unavailable billing SKU', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href*="api.sociobot.in"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Open the intake desk' }).click();
  await expect(page.getByRole('button', { name: 'Scan with camera' })).toBeEnabled();
});
