import { test, expect } from '@playwright/test';

async function loadDM(page){
  await page.goto('/?dm=1');
  await page.waitForSelector('.encounter-board');
}

test('public Home explains remote live play without exposing DM hosting controls',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.site-landing')).toBeVisible();
  await expect(page.locator('.landing-note')).toContainText('Remote playtest is live.');
  await expect(page.locator('.landing-note')).toContainText('8-character game code');
  await expect(page.locator('.landing-note')).toContainText('separate computers or phones');
  await expect(page.locator('.live-session-dm')).toHaveCount(0);
  await expect(page.getByRole('link',{name:'DM Table'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Join as a Player'})).toBeVisible();
});

test('DM table explains hosting and exposes a player-link action',async({page})=>{
  await loadDM(page);
  const panel=page.locator('.live-session-dm');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('heading',{name:'Host This Table'})).toBeVisible();
  await expect(page.locator('.live-dm-guide')).toContainText('HOST → SHARE → RUN THE WORLD');
  await expect(panel.getByRole('button',{name:'Copy Player Link'})).toBeDisabled();
});

test('Always-used dice tools appear above the live DM board',async({page})=>{
  await loadDM(page);
  const topbar=await page.locator('#app .topbar').boundingBox();
  const board=await page.locator('#app .encounter-board').boundingBox();
  expect(topbar).not.toBeNull();expect(board).not.toBeNull();
  expect(topbar.y+topbar.height).toBeLessThanOrEqual(board.y+2);
  await expect(page.locator('#app .topbar [data-die="20"]')).toBeVisible();
});

test('Player cannot confuse the local demo board with a live DM table before joining',async({page})=>{
  await page.goto('/player.html');
  await page.waitForSelector('.live-session-player');
  await expect(page.locator('.live-player-guide')).toContainText('JOIN → CONFIRM CHARACTER → PLAY');
  await expect(page.locator('body')).toHaveClass(/live-player-awaiting/);
  await expect(page.locator('#app .encounter-board')).toBeHidden();
  await expect(page.locator('.live-session-player input[name="playerName"]')).toBeVisible();
  await expect(page.locator('.live-session-player input[name="gameCode"]')).toBeVisible();
});

test('Repeated cards display their actual in-play quantity on the DM stack',async({page})=>{
  await loadDM(page);
  const npc=page.locator('[data-slot="npc"] .live-stack-quantity');
  await expect(npc).toBeVisible();
  await expect(npc).toContainText(/×\d+ in play/);
  const count=await page.locator('[data-slot="npc"] .stack-count').textContent();
  await expect(npc).toHaveText(`×${count.trim()} in play`);
});
