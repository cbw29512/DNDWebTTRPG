import { test, expect } from '@playwright/test';

test('loading an adventure creates the canonical local session',async({page})=>{
  await page.goto('/?launch=1');
  await expect(page.locator('.adventure-loader')).toBeVisible();
  await page.locator('[data-load-pack]').click();
  await expect(page.locator('.local-session-bar strong')).toHaveText('The Wishing Cake');
  await expect(page.locator('.local-session-bar')).toContainText('ready');
  const session=await page.evaluate(()=>{
    try{return JSON.parse(localStorage.getItem('living-table-local-session-v1')||'null');}
    catch(error){console.error('[Living Table test] Could not read local session.',error);return null;}
  });
  expect(session?.packId).toBe('wishing-cake');
  expect(session?.currentSceneId).toBeTruthy();
  expect(session?.status).toBe('ready');
  await expect(page.locator('[data-combat-start]')).toBeVisible();
});
