import { test, expect } from '@playwright/test';

test('tarot thumbnails never own an internal scroll container',async({page})=>{
  await page.goto('/?dm=1');
  await page.waitForSelector('.tarot-card.image-only-card');
  const offenders=await page.locator('#app .tarot-card *').evaluateAll(nodes=>nodes.filter(node=>{
    const style=getComputedStyle(node);const oy=style.overflowY;const ox=style.overflowX;
    return ['auto','scroll'].includes(oy)||['auto','scroll'].includes(ox);
  }).map(node=>({tag:node.tagName,className:node.className,overflow:getComputedStyle(node).overflow})));
  expect(offenders).toEqual([]);
});

test('full-card modal exposes the cached DM details instead of scrolling the thumbnail',async({page})=>{
  await page.goto('/?dm=1');
  await page.waitForSelector('[data-slot="location"] .tarot-card.image-only-card');
  await page.locator('[data-slot="location"] .tarot-card.image-only-card').click();
  await expect(page.locator('.large-card-modal')).toBeVisible();
  await expect(page.locator('.large-card-back')).toContainText('Back / Full Details');
});
