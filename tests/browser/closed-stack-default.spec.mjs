import { test, expect } from '@playwright/test';

test('stackable board cards start closed and reveal faces only after opening the stack', async ({ page }) => {
  await page.goto('/?dm=1');

  const stack = page.locator('#app [data-slot="npc"] .card-stack').first();
  const toggle = stack.locator('.stack-toggle');
  const topCard = toggle.locator(':scope > .tarot-card');

  await expect(stack).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(topCard).toHaveCSS('visibility', 'hidden');

  const coverText = await toggle.evaluate(node => getComputedStyle(node, '::before').content);
  expect(coverText).toContain('CLOSED STACK');

  await toggle.click();
  await expect(stack).toHaveClass(/expanded/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(topCard).toHaveCSS('visibility', 'visible');
  await expect(stack.locator('.stack-drawer .tarot-card').first()).toBeVisible();
});
