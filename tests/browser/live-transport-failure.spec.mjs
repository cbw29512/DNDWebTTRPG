import { test, expect } from '@playwright/test';

const blockPeerSources=async page=>{
  const requested=[];
  await page.route(/https:\/\/(?:cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com)\/.*peerjs.*\.js(?:\?.*)?$/i,async route=>{
    requested.push(route.request().url());
    await route.abort('failed');
  });
  return requested;
};

test('DM table stays playable when every PeerJS provider is unavailable',async({page})=>{
  const requested=await blockPeerSources(page);
  await page.goto('/?launch=1');
  await expect(page.locator('.adventure-loader')).toBeVisible();
  await page.locator('[data-load-pack]').click();
  await expect(page.locator('.fixed-board > .board-slot[data-slot]')).toHaveCount(7);

  const panel=page.locator('.live-session-dm');
  await panel.getByRole('button',{name:'Start Live Game'}).click();
  await expect(panel.locator('[data-live-status]')).toContainText('Your DM table still works locally');
  await expect(panel.locator('[data-live-status]')).toHaveAttribute('data-kind','error');
  await expect(panel.getByRole('button',{name:'Start Live Game'})).toBeEnabled();
  await expect(panel.getByRole('button',{name:'Stop Live Game'})).toBeDisabled();
  await expect(page.locator('.encounter-board')).toBeVisible();
  await expect(page.locator('.fixed-board .tarot-card:visible').first()).toBeVisible();

  expect(requested).toHaveLength(3);
  expect(requested[0]).toContain('cdn.jsdelivr.net/npm/peerjs@1.5.5');
  expect(requested[1]).toContain('cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.5');
  expect(requested[2]).toContain('unpkg.com/peerjs@1.5.5');
});

test('Player character sheet stays usable when every PeerJS provider is unavailable',async({page})=>{
  const requested=await blockPeerSources(page);
  await page.goto('/player.html?character=wendy-birthday-hero&edition=2024&game=ABCDEFGH');
  await expect(page.locator('.full-character-sheet')).toBeVisible();

  const panel=page.locator('.live-session-player');
  await panel.locator('input[name="playerName"]').fill('Offline Hero');
  await panel.getByRole('button',{name:'Join Game'}).click();
  await expect(panel.locator('[data-live-status]')).toContainText('Your character sheet still works');
  await expect(panel.locator('[data-live-status]')).toHaveAttribute('data-kind','error');
  await expect(page.locator('.full-character-sheet')).toBeVisible();
  await expect(page.locator('.rpg-paper-doll')).toBeVisible();
  await expect(page.locator('.backpack')).toBeVisible();

  expect(requested).toHaveLength(3);
});