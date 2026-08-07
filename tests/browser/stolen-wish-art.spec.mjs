import { test, expect } from '@playwright/test';

test('The Stolen Wish uses the upgraded raster illustration instead of the placeholder SVG', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const art = page.locator('.art-scene-stolen-wish').first();
  await expect(art).toBeVisible();
  await expect(art).toHaveCSS('background-image', /stolen-wish\.jpg/);
  const svg = art.locator('svg');
  await expect(svg).toHaveCSS('opacity', '0');
});
