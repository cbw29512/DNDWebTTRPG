import { test, expect } from '@playwright/test';
import { installFakePeerTransport } from './fake-peer-transport.mjs';

async function combatState(page){
  return page.evaluate(()=>{
    try{return JSON.parse(localStorage.getItem('living-table-local-session-v1')||'null')?.combatState||null;}
    catch(error){console.error('[Living Table test] Could not read combat state.',error);return null;}
  });
}

async function preparePlayerTurn(dm){
  await dm.locator('[data-combat-start]').click();
  await expect(dm.locator('.turn-panel')).toContainText('INITIATIVE SETUP');
  await dm.evaluate(async()=>{
    const {dispatchLocalSession,loadLocalSession}=await import('/src/session/local-session-state.js');
    const {SESSION_COMMANDS}=await import('/src/session/session-commands.js');
    const combat=loadLocalSession()?.combatState;
    dispatchLocalSession({type:SESSION_COMMANDS.SET_COMBAT_INITIATIVE,combatantId:'player:seat-1',initiative:20});
    for(const group of Object.values(combat?.initiativeGroups||{})){
      dispatchLocalSession({type:SESSION_COMMANDS.SET_COMBAT_GROUP_INITIATIVE,groupId:group.id,initiative:10});
    }
    dispatchLocalSession({type:SESSION_COMMANDS.BEGIN_COMBAT_ROUNDS});
  });
  await expect(dm.locator('.turn-panel')).toContainText('ROUND 1');
}

test('player spends turn resources and resolves a readied action through the DM host',async({browser})=>{
  const context=await browser.newContext();
  await context.addInitScript(installFakePeerTransport);
  const dm=await context.newPage();
  const player=await context.newPage();
  try{
    await dm.goto('/?launch=1');
    await dm.locator('[data-load-pack]').click();
    const dmLive=dm.locator('.live-session-dm');
    await dmLive.getByRole('button',{name:'Start Live Game'}).click();
    await expect(dmLive.locator('[data-live-status]')).toContainText('Live room is open');
    const code=(await dmLive.locator('[data-live-code]').textContent()).replace(/\s/g,'');

    await player.goto(`/player.html?game=${code}`);
    const playerLive=player.locator('.live-session-player');
    await playerLive.locator('input[name="playerName"]').fill('Action Hero');
    await playerLive.getByRole('button',{name:'Join Game'}).click();
    await expect(playerLive.locator('[data-live-status]')).toContainText(`Connected to game ${code}`);
    await expect(dmLive.locator('[data-live-roster]')).toContainText('Action Hero');

    await preparePlayerTurn(dm);
    await expect(player.locator('.combat-action-console')).toContainText('Your Turn Resources');
    await expect(player.locator('[data-combat-spend="action"]')).toBeEnabled();

    await player.locator('[data-combat-spend="action"]').click();
    await expect.poll(async()=>((await combatState(dm))?.combatants?.['player:seat-1']?.actionEconomy?.action)).toBe(false);
    await expect(player.locator('[data-combat-spend="action"]')).toContainText('Action Spent');

    await player.locator('[data-combat-move="5"]').click();
    await expect.poll(async()=>((await combatState(dm))?.combatants?.['player:seat-1']?.actionEconomy?.movementRemaining)).toBe(25);
    await expect(player.locator('.combat-movement')).toContainText('25/30 ft.');

    await dm.locator('[data-combat-reset-turn][data-combatant-id="player:seat-1"]').click();
    await expect.poll(async()=>((await combatState(player))?.combatants?.['player:seat-1']?.actionEconomy?.action)).toBe(true);

    const ready=player.locator('[data-combat-ready-form]');
    await ready.locator('input[name="readyTrigger"]').fill('The cultist opens the door');
    await ready.locator('input[name="readyResponse"]').fill('I loose an arrow');
    await ready.getByRole('button',{name:'Ready · Spend Action'}).click();
    await expect.poll(async()=>((await combatState(dm))?.combatants?.['player:seat-1']?.actionEconomy?.readiedAction?.trigger)).toBe('The cultist opens the door');
    await expect(player.locator('.combat-ready.is-ready')).toContainText('I loose an arrow');

    await dm.locator('[data-combat-next]').click();
    await expect.poll(async()=>((await combatState(dm))?.activeTurnId)).not.toBe('player:seat-1');
    await player.locator('[data-combat-trigger-ready]').click();
    await expect.poll(async()=>((await combatState(dm))?.combatants?.['player:seat-1']?.actionEconomy?.reaction)).toBe(false);
    const finalState=await combatState(dm);
    expect(finalState.combatants['player:seat-1'].actionEconomy.readiedAction).toBeNull();
  }finally{
    await context.close();
  }
});
