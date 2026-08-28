import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/demo', '/intake', '/records', '/privacy', '/terms']) {
  test(`page basics and axe: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Barcode Intake Card/);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('mobile intake fits at 390 pixels and supports keyboard entry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/intake');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('@regression:mobile-lcp hero is discovered before JavaScript and uses the mobile asset at its intrinsic ratio', async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 823 });
  let mobileHeroRequested = false;
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/assets/receiving-desk-600.webp') mobileHeroRequested = true;
  });
  await page.route('**/assets/app-v10.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 750));
    expect(mobileHeroRequested, 'the initial HTML must discover the mobile hero before the app module runs').toBe(true);
    await route.continue();
  });

  await page.goto('/');
  const hero = page.locator('.hero-figure img');
  await expect(hero).toBeVisible();
  const metrics = await hero.evaluate((image: HTMLImageElement) => {
    const rect = image.getBoundingClientRect();
    return { source: new URL(image.currentSrc).pathname, width: rect.width, height: rect.height };
  });
  expect(metrics.source).toBe('/assets/receiving-desk-600.webp');
  expect(metrics.width / metrics.height).toBeCloseTo(1.5, 1);
  expect(metrics.height).toBeLessThan(300);
});

test('camera tracks end after Escape and route teardown', async ({ page }) => {
  await page.goto('/intake');
  await page.getByRole('button', { name: 'Scan with camera' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect.poll(() => page.locator('#scanner-video').evaluate((video: HTMLVideoElement) => video.srcObject?.getTracks()[0]?.readyState)).toBe('live');
  await page.locator('#scanner-video').evaluate((video: HTMLVideoElement) => {
    (window as typeof window & { qaCameraTrack?: MediaStreamTrack }).qaCameraTrack = video.srcObject?.getTracks()[0];
  });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { qaCameraTrack?: MediaStreamTrack }).qaCameraTrack?.readyState)).toBe('ended');
  await expect(page.getByRole('button', { name: 'Scan with camera' })).toBeFocused();

  await page.getByRole('button', { name: 'Scan with camera' }).click();
  await expect.poll(() => page.locator('#scanner-video').evaluate((video: HTMLVideoElement) => video.srcObject?.getTracks()[0]?.readyState)).toBe('live');
  await page.locator('#scanner-video').evaluate((video: HTMLVideoElement) => {
    (window as typeof window & { qaRouteTrack?: MediaStreamTrack }).qaRouteTrack = video.srcObject?.getTracks()[0];
  });
  await page.evaluate(() => {
    history.pushState({}, '', '/records');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.getByRole('heading', { name: 'Find your saved cards' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as typeof window & { qaRouteTrack?: MediaStreamTrack }).qaRouteTrack?.readyState)).toBe('ended');
});

test('corrupt photos show an announced recovery message without an unhandled error', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/intake');
  await page.getByLabel('Item photo').setInputFiles({ name: 'corrupt.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await expect(page.locator('#form-status')).toHaveText('That image could not be read. Choose a JPG, PNG, or WebP photo and try again.');
  await expect(page.locator('#photo-preview')).toBeHidden();
  expect(errors).toEqual([]);
});

test('visible controls meet the 44 pixel touch target at 390 pixels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo', '/intake', '/records', '/privacy', '/terms', '/print/demo-bearing?demo=1']) {
    await page.goto(route);
    const small = await page.locator('a, button, input:not([type="hidden"]), textarea').evaluateAll((elements) => elements
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { label: element.getAttribute('aria-label') || element.textContent?.trim() || element.getAttribute('name'), width: rect.width, height: rect.height };
      })
      .filter(({ width, height }) => width < 44 || height < 44));
    expect(small, `${route} has undersized controls`).toEqual([]);
  }
});

test('the retired license URL redirects to the intake form', async ({ page }) => {
  const response = await page.goto('/license');
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/intake$/);
  await expect(page.getByRole('heading', { name: 'Record a new item' })).toBeVisible();
});

test('external Param Factory links say they leave the product', async ({ page }) => {
  for (const route of ['/', '/privacy', '/terms']) {
    await page.goto(route);
    await expect(page.getByRole('link', { name: 'Built by Param Factory (external site)' })).toHaveAttribute('href', 'https://sociobot.in');
  }
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: 'Built by Param Factory (external site)' })).toHaveAttribute('href', 'https://sociobot.in');
});

test('unknown documents return HTTP 404 with the designed recovery page', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the intake form' })).toBeVisible();
  await expect(page.locator('header, footer')).toHaveCount(2);
  await expect(page.locator('meta[name="description"], link[rel="canonical"], meta[property="og:title"], meta[name="twitter:title"]')).toHaveCount(4);
});
