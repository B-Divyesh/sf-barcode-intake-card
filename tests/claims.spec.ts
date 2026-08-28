import { expect, test } from '@playwright/test';

test('@claim:offline-reload works offline after the first visit', async ({ page, context }) => {
  await page.goto('http://127.0.0.1:4173/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review sample intake cards');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('/assets/app-v1.js')))).toBe(true);
  await context.setOffline(true);
  await page.getByRole('link', { name: 'Edit card' }).first().click();
  await expect(page.getByRole('heading', { name: 'Review this item card' })).toBeVisible();
  await page.goBack();
  await expect(page.getByText('608ZZ shielded bearing')).toBeVisible();
});

test('@claim:local-only keeps demo item data on the same origin', async ({ page }) => {
  const outside: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') outside.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Edit card' }).first().click();
  await page.getByLabel('Review notes').fill('Checked without a supplier request.');
  await page.getByRole('button', { name: 'Save card changes' }).click();
  await expect(page.getByRole('heading', { name: 'Print one item card' })).toBeVisible();
  expect(outside).toEqual([]);
});

test('@claim:manual-intake saves a free manual item card', async ({ page }) => {
  await page.goto('/intake');
  await page.getByLabel('Barcode or SKU').fill('TEST-4042');
  await page.getByLabel('Item name').fill('Brass hose adapter');
  await page.getByLabel('Location note').fill('Bin B-08');
  await page.getByRole('button', { name: 'Save item card' }).click();
  await expect(page.getByText('Brass hose adapter')).toBeVisible();
  await page.goto('/records');
  await expect(page.getByText('TEST-4042')).toBeVisible();
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

test('@claim:camera-ready opens the device camera only after a scan action', async ({ page, context }) => {
  await context.grantPermissions(['camera'], { origin: 'http://127.0.0.1:4173' });
  await page.goto('/intake?demo=1');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'Scan with camera' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/Camera ready|Hold one barcode/)).toBeVisible();
});
