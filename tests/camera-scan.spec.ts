import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test('@claim:camera-scan camera scanning fills the barcode field', async ({ page }) => {
  await page.route('**/assets/scanner-v13.js', async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `export class BrowserMultiFormatReader {
        async decodeFromVideoDevice(_device, video, callback) {
          const canvas = document.createElement('canvas');
          const stream = canvas.captureStream(1);
          video.srcObject = stream;
          setTimeout(() => callback({ getText: () => '5901234123457' }), 75);
          return { stop() { stream.getTracks().forEach((track) => track.stop()); video.srcObject = null; } };
        }
      }`
    });
  });

  await page.goto('/intake');
  await page.getByRole('button', { name: 'Scan with camera' }).click();
  await expect(page.getByLabel('Barcode or SKU')).toHaveValue('5901234123457');
  await expect(page.getByRole('dialog')).toBeHidden();
});
