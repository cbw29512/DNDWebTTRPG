import { test, expect } from '@playwright/test';
import { installFakePeerTransport } from './fake-peer-transport.mjs';

test('DM and Player complete a live host, join, reveal, and disconnect journey',async({browser})=>{
  const context=await browser.newContext();
  await context.addInitScript(installFakePeerTransport);
  const dm=await context.newPage();
  const player=await context.newPage();

  await dm.goto('/?launch=1');
  await expect(dm.locator('.adventure-loader')).toBeVisible();
  await dm.locator('[data-load-pack]').click();
  await expect(dm.locator('.fixed-board > .board-slot[data-slot]')).toHaveCount(7);
  const dmPanel=dm.locator('.live-session-dm');
  await expect(dmPanel).toBeVisible();
  await dmPanel.getByRole('button',{name:'Start Live Game'}).click();
  await expect(dmPanel.locator('[data-live-status]')).toContainText('Live room is open');
  await expect(dmPanel.getByRole('button',{name:'Stop Live Game'})).toBeEnabled();
  const code=(await dmPanel.locator('[data-live-code]').textContent()).replace(/\s/g,'');
  expect(code).toMatch(/^[A-Z2-9]{8}$/);

  await player.goto(`/player.html?game=${code}`);
  const playerPanel=player.locator('.live-session-player');
  await expect(playerPanel).toBeVisible();
  await playerPanel.locator('input[name="playerName"]').fill('Remote Hero');
  await playerPanel.getByRole('button',{name:'Join Game'}).click();
  await expect(playerPanel.locator('[data-live-status]')).toContainText(`Connected to game ${code}`);
  await expect(player.locator('.remote-live-table')).toBeVisible();
  await expect(player.locator('.remote-live-table')).toHaveAttribute('data-connection','live');
  await expect(player.locator('body')).toHaveClass(/live-player-connected/);
  await expect(dmPanel.locator('[data-live-roster]')).toContainText('Remote Hero');

  for(const slot of ['location','site','room']){
    expect(await player.locator(`.remote-live-slot.slot-${slot} .remote-card`).count()).toBeGreaterThan(0);
  }
  for(const slot of ['npc','monster','hazard','treasure']){
    await expect(player.locator(`.remote-live-slot.slot-${slot} .remote-card`)).toHaveCount(0);
    await expect(player.locator(`.remote-live-slot.slot-${slot}`)).toContainText('Nothing revealed');
  }

  const npcStack=dm.locator('[data-slot="npc"] .card-stack').first();
  await expect(npcStack).toBeVisible();
  await npcStack.locator('.stack-toggle').click();
  await expect(npcStack).toHaveClass(/expanded/);

  const npcCard=npcStack.locator('.stack-drawer .tarot-card').first();
  await expect(npcCard).toBeVisible();
  const cardId=await npcCard.getAttribute('data-card-id');
  expect(cardId).toBeTruthy();
  await npcCard.click();

  const modal=dm.locator('.large-card-modal');
  await expect(modal).toBeVisible();
  const reveal=modal.locator('[data-reveal]').filter({hasText:'Reveal'}).first();
  await expect(reveal).toBeVisible();
  await expect(reveal).toHaveAttribute('data-reveal',cardId);
  await reveal.click();
  await expect(modal).toHaveCount(0);

  await expect(player.locator(`.remote-card[data-card-id="${cardId}"]`)).toBeVisible();
  await expect(player.locator(`.remote-card[data-card-id="${cardId}"] .tarot-back`)).toHaveCount(0);
  await expect(player.locator(`.remote-card[data-card-id="${cardId}"] button`)).toHaveCount(0);

  await dmPanel.getByRole('button',{name:'Stop Live Game'}).click();
  await expect(dmPanel.locator('[data-live-status]')).toContainText('Live room closed');
  await expect(dmPanel.getByRole('button',{name:'Stop Live Game'})).toBeDisabled();
  await expect(playerPanel.locator('[data-live-status]')).toContainText('Disconnected from the DM');
  await expect(player.locator('.remote-live-table')).toHaveAttribute('data-connection','disconnected');
  await expect(player.locator('body')).toHaveClass(/live-player-awaiting/);
  await expect(player.locator('body')).not.toHaveClass(/live-player-connected/);

  await context.close();
});