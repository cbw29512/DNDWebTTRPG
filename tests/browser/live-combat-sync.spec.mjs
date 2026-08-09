import { test, expect } from '@playwright/test';
import { installFakePeerTransport } from './fake-peer-transport.mjs';

const sessionCombat=page=>page.evaluate(()=>{
  try{return JSON.parse(localStorage.getItem('living-table-local-session-v1')||'null')?.combatState||null;}
  catch(error){console.error('[Living Table test] Could not read combat state.',error);return null;}
});

test('player initiative round-trips through the DM canonical combat reducer',async({browser})=>{
  const context=await browser.newContext();
  await context.addInitScript(installFakePeerTransport);
  const dm=await context.newPage();
  const player=await context.newPage();

  try{
    await dm.goto('/?launch=1');
    await dm.locator('[data-load-pack]').click();
    await expect(dm.locator('.fixed-board > .board-slot[data-slot]')).toHaveCount(7);

    const dmLive=dm.locator('.live-session-dm');
    await dmLive.getByRole('button',{name:'Start Live Game'}).click();
    await expect(dmLive.locator('[data-live-status]')).toContainText('Live room is open');
    const code=(await dmLive.locator('[data-live-code]').textContent()).replace(/\s/g,'');

    await player.goto(`/player.html?game=${code}`);
    const playerLive=player.locator('.live-session-player');
    await playerLive.locator('input[name="playerName"]').fill('Initiative Hero');
    await playerLive.getByRole('button',{name:'Join Game'}).click();
    await expect(playerLive.locator('[data-live-status]')).toContainText(`Connected to game ${code}`);
    await expect(dmLive.locator('[data-live-roster]')).toContainText('Initiative Hero');

    const startCombat=dm.locator('[data-combat-start]');
    await expect(startCombat).toBeVisible();
    await startCombat.click();
    await expect(dm.locator('.turn-panel')).toContainText('INITIATIVE SETUP');
    await expect.poll(()=>sessionCombat(player).then(combat=>combat?.status)).toBe('setup');

    const playerCombatBefore=await sessionCombat(player);
    expect(Object.values(playerCombatBefore.combatants).filter(entry=>entry.kind==='monster')).toHaveLength(0);
    const dmCombatBefore=await sessionCombat(dm);
    expect(Object.values(dmCombatBefore.combatants).filter(entry=>entry.kind==='monster')).toHaveLength(2);

    const roll=player.locator('[data-player-init-roll]');
    await expect(roll).toBeVisible();
    await roll.click();
    await expect(player.locator('.combat-round-message')).toContainText('sent to the DM');

    await expect.poll(async()=>{
      const combat=await sessionCombat(dm);
      return combat?.combatants?.['player:seat-1']?.initiative ?? null;
    }).not.toBeNull();

    const hostCombat=await sessionCombat(dm);
    const hostInitiative=hostCombat.combatants['player:seat-1'].initiative;
    expect(Number.isFinite(hostInitiative)).toBe(true);

    await expect.poll(async()=>{
      const combat=await sessionCombat(player);
      return combat?.combatants?.['player:seat-1']?.initiative ?? null;
    }).toBe(hostInitiative);
    await expect(player.locator('.combat-player-init')).toContainText(`Initiative ${hostInitiative}`);

    const playerCombatAfter=await sessionCombat(player);
    expect(Object.values(playerCombatAfter.combatants).filter(entry=>entry.kind==='monster')).toHaveLength(0);
    expect(playerCombatAfter.combatants['player:seat-1'].hp).toBeUndefined();
  }finally{
    await context.close();
  }
});
