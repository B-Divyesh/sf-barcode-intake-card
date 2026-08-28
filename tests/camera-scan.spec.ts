import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('@claim:camera-scan camera scanning fills the barcode field', async ({ page }) => {
  await page.route('**/assets/scanner-v8.js', async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `export class BrowserMultiFormatReader {
        async decodeFromVideoDevice(_device, _video, callback) {
          setTimeout(() => callback({ getText: () => '5901234123457' }), 25);
          return { stop() {} };
        }
      }`
    });
  });

  await page.goto('/intake');
  await page.getByRole('button', { name: 'Scan with camera' }).click();
  await expect(page.getByLabel('Barcode or SKU')).toHaveValue('5901234123457');
  await expect(page.getByRole('dialog')).toBeHidden();
});
