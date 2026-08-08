import { test, expect } from '@playwright/test';

test('The Stolen Wish real illustration loads and replaces the SVG fallback', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const art = page.locator('.art-scene-stolen-wish').first();
  await expect(art).toBeVisible();

  const img = art.locator('img.card-art-raster');
  await expect(img).toBeVisible();

  await expect.poll(async () => img.evaluate(node => ({
    complete: node.complete,
    naturalWidth: node.naturalWidth,
    naturalHeight: node.naturalHeight,
  }))).toMatchObject({
    complete: true,
    naturalWidth: expect.any(Number),
    naturalHeight: expect.any(Number),
  });

  const dimensions = await img.evaluate(node => ({ width: node.naturalWidth, height: node.naturalHeight }));
  expect(dimensions.width).toBeGreaterThan(0);
  expect(dimensions.height).toBeGreaterThan(0);

  await expect(art).toHaveClass(/has-raster-art/);
  await expect(img).toHaveCSS('opacity', '1');

  const svg = art.locator('svg.card-art-placeholder');
  await expect(svg).toHaveCSS('opacity', '0');
});
