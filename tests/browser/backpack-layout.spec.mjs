import { test, expect } from '@playwright/test';

test('desktop backpack shows complete item cards without clipping a partial row', async ({ page }) => {
  await page.setViewportSize({ width: 1524, height: 934 });
  await page.goto('/player.html?character=wendy-birthday-hero&edition=2014', { waitUntil: 'networkidle' });

  const panel = page.locator('.magic-inventory');
  const grid = panel.locator('.backpack-cards');
  const cards = grid.locator('.equipment-card');

  await expect(panel).toBeVisible();
  await expect(grid).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(4);

  const metrics = await grid.evaluate(node => {
    const style = getComputedStyle(node);
    const last = node.querySelector('.equipment-card:last-child');
    const gridRect = node.getBoundingClientRect();
    const lastRect = last?.getBoundingClientRect();
    const panelRect = node.closest('.magic-inventory')?.getBoundingClientRect();
    return {
      overflowY: style.overflowY,
      clientHeight: node.clientHeight,
      scrollHeight: node.scrollHeight,
      gridBottom: gridRect.bottom,
      lastBottom: lastRect?.bottom ?? 0,
      panelBottom: panelRect?.bottom ?? 0
    };
  });

  expect(metrics.overflowY).toBe('visible');
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1);
  expect(metrics.lastBottom).toBeLessThanOrEqual(metrics.gridBottom + 1);
  expect(metrics.lastBottom).toBeLessThanOrEqual(metrics.panelBottom + 1);
});
