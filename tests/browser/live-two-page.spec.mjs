import { test, expect } from '@playwright/test';

const FAKE_PEER_SCRIPT=`
(()=>{
 const registry=new Map();
 class Link{
  constructor(){this.handlers=new Map();this.peer=null;this.open=false;}
  on(name,fn){if(!this.handlers.has(name))this.handlers.set(name,[]);this.handlers.get(name).push(fn);return this;}
  emit(name,...args){for(const fn of this.handlers.get(name)||[])fn(...args);}
  send(data){if(this.peer?.open)this.peer.emit('data',structuredClone(data));}
  close(){if(!this.open)return;this.open=false;const other=this.peer;if(other?.open){other.open=false;queueMicrotask(()=>other.emit('close'));}queueMicrotask(()=>this.emit('close'));}
 }
 class FakePeer{
  constructor(id){this.handlers=new Map();this.id=id||('peer-'+Math.random().toString(36).slice(2));this.destroyed=false;registry.set(this.id,this);queueMicrotask(()=>this.emit('open',this.id));}
  on(name,fn){if(!this.handlers.has(name))this.handlers.set(name,[]);this.handlers.get(name).push(fn);return this;}
  emit(name,...args){for(const fn of this.handlers.get(name)||[])fn(...args);}
  connect(targetId){
   const target=registry.get(targetId);const left=new Link(),right=new Link();left.peer=right;right.peer=left;
   if(!target){queueMicrotask(()=>left.emit('error',new Error('Peer unavailable')));return left;}
   queueMicrotask(()=>{target.emit('connection',right);left.open=true;right.open=true;left.emit('open');right.emit('open');});
   return left;
  }
  destroy(){if(this.destroyed)return;this.destroyed=true;registry.delete(this.id);this.emit('close');}
 }
 window.Peer=FakePeer;
})();`;

test('DM and Player complete the real host, join, reveal, and disconnect journey', async ({ browser }) => {
  const context=await browser.newContext();
  await context.addInitScript(FAKE_PEER_SCRIPT);
  const dm=await context.newPage();
  const player=await context.newPage();
  const errors=[];
  for(const page of [dm,player]){
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(`console: ${message.text()}`);});
  }

  await dm.goto('/?dm=1',{waitUntil:'domcontentloaded'});
  const dmPanel=dm.locator('.live-session-dm');
  await expect(dmPanel).toBeVisible();
  await dmPanel.getByRole('button',{name:'Start Live Game'}).click();
  await expect(dmPanel.locator('[data-live-status]')).toContainText('Live room is open');
  const code=(await dmPanel.locator('[data-live-code]').textContent()).replace(/\s/g,'');
  expect(code).toMatch(/^[A-Z2-9]{8}$/);

  await player.goto(`/player.html?game=${code}`,{waitUntil:'domcontentloaded'});
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

  const npcStack=dm.locator('[data-slot="npc"] .stack-toggle');
  await expect(npcStack).toBeVisible();
  await npcStack.click();
  const reveal=dm.locator('[data-slot="npc"] [data-reveal]').filter({hasText:'Reveal'}).first();
  await expect(reveal).toBeVisible();
  const cardId=await reveal.getAttribute('data-reveal');
  await reveal.click();
  await expect(reveal).toHaveText('Hide');
  await expect(player.locator(`.remote-card[data-card-id="${cardId}"]`)).toBeVisible();
  await expect(player.locator(`.remote-card[data-card-id="${cardId}"] .tarot-back`)).toHaveCount(0);
  await expect(player.locator(`.remote-card[data-card-id="${cardId}"] button`)).toHaveCount(0);

  await dm.close();
  await expect(playerPanel.locator('[data-live-status]')).toContainText('Disconnected from the DM');
  await expect(player.locator('.remote-live-table')).toHaveAttribute('data-connection','disconnected');
  await expect(player.locator('body')).toHaveClass(/live-player-awaiting/);
  await expect(player.locator('body')).not.toHaveClass(/live-player-connected/);

  expect(errors,`Browser errors: ${errors.join(' | ')}`).toEqual([]);
  await context.close();
});
