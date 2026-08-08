import { test, expect } from '@playwright/test';

test('cards start closed and no card modal exists on initial load', async ({page})=>{
  await page.goto('/?launch=1',{waitUntil:'domcontentloaded'});
  await page.locator('[data-load-pack]').click();
  await expect(page.locator('.fixed-board .tarot-card.image-only-card').first()).toBeVisible();
  await expect(page.locator('.large-card-backdrop')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/modal-open/);
});

test('browser history restoration cannot reopen a card modal', async ({page})=>{
  await page.goto('/?launch=1',{waitUntil:'domcontentloaded'});
  await page.locator('[data-load-pack]').click();
  const card=page.locator('.fixed-board .tarot-card.image-only-card').first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page.locator('.large-card-backdrop')).toBeVisible();

  await page.goto('/player.html',{waitUntil:'domcontentloaded'});
  await page.goBack({waitUntil:'domcontentloaded'});

  await expect(page.locator('.large-card-backdrop')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/modal-open/);
});
