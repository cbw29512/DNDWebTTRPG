import { test, expect } from '@playwright/test';

const fakePeerTransport = () => {
  class Emitter {
    constructor(){ this.handlers=new Map(); }
    on(name,fn){ const list=this.handlers.get(name)||[]; list.push(fn); this.handlers.set(name,list); return this; }
    emit(name,...args){ for(const fn of this.handlers.get(name)||[]) fn(...args); }
  }
  class FakeConnection extends Emitter {
    constructor(owner,peer){ super(); this.owner=owner; this.peer=peer; this.open=false; }
    send(data){ if(this.open) this.owner.bus.postMessage({type:'data',from:this.owner.id,to:this.peer,data}); }
    close(){ if(!this.open)return; this.open=false; this.emit('close'); this.owner.bus.postMessage({type:'close',from:this.owner.id,to:this.peer}); }
  }
  class FakePeer extends Emitter {
    constructor(id){
      super();
      this.id=id||`fake-player-${Math.random().toString(36).slice(2)}`;
      this.connections=new Map();
      this.bus=new BroadcastChannel('living-table-fake-peer-bus');
      this.bus.onmessage=event=>this.receive(event.data||{});
      setTimeout(()=>this.emit('open',this.id),0);
    }
    connect(target){
      const conn=new FakeConnection(this,target);
      this.connections.set(target,conn);
      this.bus.postMessage({type:'connect',from:this.id,to:target});
      return conn;
    }
    receive(message){
      if(message.to!==this.id)return;
      if(message.type==='connect'){
        let conn=this.connections.get(message.from);
        if(!conn){ conn=new FakeConnection(this,message.from); this.connections.set(message.from,conn); }
        this.emit('connection',conn);
        conn.open=true;
        setTimeout(()=>conn.emit('open'),0);
        this.bus.postMessage({type:'ack',from:this.id,to:message.from});
      }else if(message.type==='ack'){
        const conn=this.connections.get(message.from);
        if(conn&&!conn.open){ conn.open=true; conn.emit('open'); }
      }else if(message.type==='data'){
        this.connections.get(message.from)?.emit('data',message.data);
      }else if(message.type==='close'){
        const conn=this.connections.get(message.from);
        if(conn?.open){ conn.open=false; conn.emit('close'); }
      }
    }
    destroy(){
      for(const conn of this.connections.values()) if(conn.open) conn.close();
      this.connections.clear();
      this.bus.close();
    }
  }
  window.Peer=FakePeer;
};

test('DM and Player complete a live host, join, reveal, and disconnect journey',async({browser})=>{
  const context=await browser.newContext();
  await context.addInitScript(fakePeerTransport);
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

  await context.close();
});