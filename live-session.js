import { loadSession, saveSession } from './src/session/session-state.js';

const role = document.querySelector('meta[name="living-table-role"]')?.content || 'player';
const isDM = role === 'dm';
const PEER_PREFIX = 'living-table-';
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const HOST_KEY = 'living-table-live-host-code-v1';
const PLAYER_KEY = 'living-table-live-player-v1';
const peers = new Map();
let hostPeer = null;
let hostConnection = null;
let applyingRemote = false;
let revealSet = new Set();
let renderTimer = 0;

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
const normalizeCode = value => String(value ?? '').toUpperCase().replace(/[^A-Z2-9]/g,'').slice(0,8);
const newCode = () => Array.from({length:8}, () => CODE_ALPHABET[Math.floor(Math.random()*CODE_ALPHABET.length)]).join('');
const peerIdFor = code => `${PEER_PREFIX}${normalizeCode(code).toLowerCase()}`;

function peerCtor(){ return window.Peer; }
function connectionOpen(conn){ return Boolean(conn?.open); }
function send(conn, message){ if(connectionOpen(conn)) conn.send(message); }

function safeSessionProjection(){
  const session = loadSession();
  if(!session) return null;
  return {
    schemaVersion: session.schemaVersion,
    sessionId: session.sessionId,
    packId: session.packId,
    releaseId: session.releaseId,
    version: session.version,
    title: session.title,
    selectedSystem: session.selectedSystem,
    status: session.status,
    currentSceneId: session.currentSceneId,
    currentLocationId: session.currentLocationId,
    currentSiteId: session.currentSiteId,
    currentRoomId: session.currentRoomId,
    currentSceneCardId: session.currentSceneCardId,
    quests: session.quests || [],
    questState: session.questState || {active:[],revealed:[]},
    updatedAt: session.updatedAt
  };
}

function sanitizedFront(card){
  const front = card.querySelector('.tarot-front')?.cloneNode(true);
  if(!front) return '';
  front.querySelectorAll('.inside-card-rolls,.card-roll-note,.instance-strip,.prepared-area-card-event,.area-current-scene,button,[data-card-roll]').forEach(node=>node.remove());
  front.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
  return front.innerHTML;
}

function revealedInCurrentDOM(cardId){
  if(!cardId) return false;
  const selector=`[data-reveal="${CSS.escape(cardId)}"]`;
  return [...document.querySelectorAll(selector)].some(button=>button.textContent?.trim()==='Hide');
}

function visibleOnDM(card){
  const type = card.dataset.cardType;
  if(['location','site','room'].includes(type)) return true;
  const id=card.dataset.cardId;
  return revealSet.has(id) || revealedInCurrentDOM(id);
}

function captureDMTable(){
  const slots = {};
  document.querySelectorAll('#app [data-slot]').forEach(slot => {
    const slotId = slot.dataset.slot;
    const seen = new Set();
    slots[slotId] = [];
    slot.querySelectorAll('.tarot-card[data-card-id]').forEach(card => {
      const id = card.dataset.cardId;
      if(seen.has(id) || !visibleOnDM(card)) return;
      seen.add(id);
      slots[slotId].push({ id, type:card.dataset.cardType || '', title:card.querySelector('.tarot-front h3')?.textContent?.trim() || id, front:sanitizedFront(card) });
    });
  });
  const initiative = [...document.querySelectorAll('#app .initiative li')].map(node=>node.textContent.trim()).filter(Boolean);
  return { schemaVersion:1, slots, initiative, capturedAt:new Date().toISOString() };
}

function broadcast(message){ peers.forEach(({conn})=>send(conn,message)); }
function broadcastSnapshot(){ if(!isDM || !peers.size) return; broadcast({type:'table-snapshot',session:safeSessionProjection(),table:captureDMTable()}); }
function scheduleBroadcast(){ clearTimeout(renderTimer); renderTimer=setTimeout(broadcastSnapshot,100); }

function markRemoteConnectionState(state,label){
  if(isDM) return;
  const remote=document.querySelector('.remote-live-table');
  if(!remote) return;
  remote.dataset.connection=state;
  const dot=remote.querySelector('.live-dot');
  if(dot) dot.textContent=`● ${label}`;
}

function renderRemoteTable(table){
  if(isDM || !table) return;
  const current = document.querySelector('.remote-live-table');
  const section = current || document.createElement('section');
  section.className='remote-live-table panel';
  section.dataset.connection='live';
  section.setAttribute('aria-label','Live table revealed by the Dungeon Master');
  const labels={location:'Location',site:'Site',room:'Area',npc:'NPCs',monster:'Monsters',hazard:'Traps / Hazards',treasure:'Treasure / Rewards'};
  const slotOrder=['location','site','room','npc','monster','hazard','treasure'];
  section.innerHTML=`<header class="remote-live-header"><div><small>LIVE FROM THE DM</small><h1>Revealed Adventure Table</h1></div><span class="live-dot">● Connected</span></header><div class="remote-live-grid">${slotOrder.map(slotId=>{
    const cards=table.slots?.[slotId]||[];
    return `<section class="remote-live-slot slot-${slotId}"><header><h2>${labels[slotId]}</h2></header><div class="remote-live-cards">${cards.length?cards.map(card=>`<article class="tarot-card type-${escapeHtml(card.type)} remote-card" data-card-id="${escapeHtml(card.id)}"><section class="tarot-face tarot-front">${card.front}</section></article>`).join(''):'<div class="remote-empty">Nothing revealed</div>'}</div></section>`;
  }).join('')}</div>${table.initiative?.length?`<aside class="remote-initiative"><h2>Combat Initiative</h2><ol>${table.initiative.map(text=>`<li>${escapeHtml(text)}</li>`).join('')}</ol></aside>`:''}`;
  if(!current){
    const localBoard=document.querySelector('#app .encounter-board');
    if(localBoard){ localBoard.hidden=true; localBoard.insertAdjacentElement('beforebegin',section); }
    else document.querySelector('#app')?.prepend(section);
  }
}

function mergeRemoteSession(remote){
  if(!remote) return;
  const local=loadSession()||{};
  applyingRemote=true;
  try { saveSession({...local,...remote,playerState:local.playerState}); }
  finally { setTimeout(()=>{applyingRemote=false;},0); }
}

function playerStatus(){
  const session=loadSession();
  const state=session?.playerState||{};
  let saved={}; try{saved=JSON.parse(localStorage.getItem(PLAYER_KEY)||'{}');}catch{}
  return {name:saved.name||'Player',characterId:state.characterId||'wendy-birthday-hero',hp:Number.isFinite(state.hp)?state.hp:null,ready:Boolean(state.ready),edition:state.edition||'',updatedAt:new Date().toISOString()};
}
function sendPlayerStatus(){ if(!isDM && hostConnection?.open && !applyingRemote) send(hostConnection,{type:'player-state',player:playerStatus()}); }

function updateHostRoster(){
  if(!isDM) return;
  const list=document.querySelector('[data-live-roster]');
  if(!list) return;
  const rows=[...peers.values()].map(peer=>peer.player||{name:'Connecting…'});
  list.innerHTML=rows.length?rows.map(p=>`<li><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.characterId||'Character')}${p.hp!==null&&p.hp!==undefined?` · HP ${p.hp}`:''}${p.ready?' · Ready':''}</span></li>`).join(''):'<li><span>No players connected yet.</span></li>';
}

function handleHostConnection(conn){
  const record={conn,player:{name:'Connecting…',characterId:'',hp:null,ready:false}};
  peers.set(conn.peer,record); updateHostRoster();
  conn.on('open',()=>{ send(conn,{type:'table-snapshot',session:safeSessionProjection(),table:captureDMTable()}); updateHostRoster(); });
  conn.on('data',data=>{ if(data?.type==='player-state'&&data.player){record.player=data.player;updateHostRoster();} });
  conn.on('close',()=>{peers.delete(conn.peer);updateHostRoster();});
  conn.on('error',()=>{peers.delete(conn.peer);updateHostRoster();});
}

function hostGame(code){
  const Peer=peerCtor();
  if(!Peer){setStatus('Live connection library could not load. Refresh the page or check your connection.','error');return;}
  hostPeer?.destroy?.(); peers.clear(); updateHostRoster();
  hostPeer=new Peer(peerIdFor(code),{debug:1});
  setStatus('Starting live room…');
  hostPeer.on('open',()=>{localStorage.setItem(HOST_KEY,code);renderHostCode(code);setStatus('Live room is open. Players can join now.','ok');});
  hostPeer.on('connection',handleHostConnection);
  hostPeer.on('error',error=>setStatus(error?.type==='unavailable-id'?'That game code is already in use. Create another code.':`Live room error: ${error?.type||'connection failed'}`,'error'));
}

function joinGame(code,name){
  const Peer=peerCtor();
  if(!Peer){setStatus('Live connection library could not load. Refresh the page or check your connection.','error');return;}
  if(code.length!==8){setStatus('Enter the 8-character game code from your DM.','error');return;}
  hostConnection?.close?.();
  hostConnection=null;
  hostPeer?.destroy?.();
  markRemoteConnectionState('connecting','Connecting…');
  hostPeer=new Peer(undefined,{debug:1});
  localStorage.setItem(PLAYER_KEY,JSON.stringify({code,name:name||'Player'}));
  setStatus('Connecting to the DM…');
  hostPeer.on('open',()=>{
    const conn=hostPeer.connect(peerIdFor(code),{reliable:true,serialization:'json'}); hostConnection=conn;
    conn.on('open',()=>{setStatus(`Connected to game ${code}.`,'ok');sendPlayerStatus();});
    conn.on('data',data=>{
      if(data?.type==='table-snapshot'){
        mergeRemoteSession(data.session); renderRemoteTable(data.table); sendPlayerStatus();
      }
    });
    conn.on('close',()=>{markRemoteConnectionState('disconnected','Disconnected');setStatus('Disconnected from the DM.','error');});
    conn.on('error',()=>{markRemoteConnectionState('disconnected','Disconnected');setStatus('Could not connect to that game code.','error');});
  });
  hostPeer.on('error',()=>{markRemoteConnectionState('disconnected','Disconnected');setStatus('Could not reach the live-game service.','error');});
}

function setStatus(text,kind=''){ const node=document.querySelector('[data-live-status]'); if(node){node.textContent=text;node.dataset.kind=kind;} }
function renderHostCode(code){ const node=document.querySelector('[data-live-code]'); if(node)node.textContent=code; const copy=document.querySelector('[data-copy-live-code]'); if(copy)copy.disabled=false; }

function markup(){
  if(isDM) return `<section class="live-session-panel live-session-dm" aria-label="Live multiplayer"><div><small>LIVE MULTIPLAYER</small><h2>Host This Table</h2><p>Start a room, give players the code, and keep this DM page open while you run the game.</p></div><div class="live-code-box"><span>Game code</span><strong data-live-code>— — — — — — — —</strong><button type="button" data-copy-live-code disabled>Copy Code</button></div><div class="live-actions"><button type="button" data-start-live>Start Live Game</button><button type="button" data-new-live-code>New Code</button></div><p data-live-status aria-live="polite">Not hosting yet.</p><div class="live-roster"><h3>Connected Players</h3><ul data-live-roster><li><span>No players connected yet.</span></li></ul></div></section>`;
  let saved={}; try{saved=JSON.parse(localStorage.getItem(PLAYER_KEY)||'{}');}catch{}
  return `<section class="live-session-panel live-session-player" aria-label="Join live multiplayer"><div><small>LIVE MULTIPLAYER</small><h2>Join the DM's Table</h2><p>Enter the game code from your Dungeon Master. Revealed cards will update here live.</p></div><form data-live-join><label>Your name<input name="playerName" value="${escapeHtml(saved.name||'')}" required maxlength="32"></label><label>Game code<input name="gameCode" value="${escapeHtml(normalizeCode(new URLSearchParams(location.search).get('game')||saved.code||''))}" required maxlength="8" autocomplete="off"></label><button>Join Game</button></form><p data-live-status aria-live="polite">Not connected.</p></section>`;
}

function mount(){
  if(isDM && document.body.classList.contains('site-home-active')) return;
  if(document.querySelector('.live-session-panel'))return;
  const wrapper=document.createElement('div');wrapper.innerHTML=markup();
  const panel=wrapper.firstElementChild;
  const nav=document.querySelector('.site-shell-nav');
  if(nav)nav.insertAdjacentElement('afterend',panel);else document.body.prepend(panel);
  if(isDM){
    panel.querySelector('[data-start-live]')?.addEventListener('click',()=>hostGame(localStorage.getItem(HOST_KEY)||newCode()));
    panel.querySelector('[data-new-live-code]')?.addEventListener('click',()=>hostGame(newCode()));
    panel.querySelector('[data-copy-live-code]')?.addEventListener('click',async()=>{const code=panel.querySelector('[data-live-code]')?.textContent?.trim();if(code&&navigator.clipboard){await navigator.clipboard.writeText(code);setStatus('Game code copied.','ok');}});
    const saved=normalizeCode(localStorage.getItem(HOST_KEY)); if(saved)renderHostCode(saved);
  }else{
    panel.querySelector('[data-live-join]')?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.currentTarget);joinGame(normalizeCode(data.get('gameCode')),String(data.get('playerName')||'Player').trim());});
  }
}

if(isDM){
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-reveal]');
    if(!button)return;
    const id=button.dataset.reveal;
    setTimeout(()=>{const latest=[...document.querySelectorAll(`[data-reveal="${CSS.escape(id)}"]`)].find(Boolean);if(latest?.textContent?.trim()==='Hide')revealSet.add(id);else revealSet.delete(id);scheduleBroadcast();},0);
  },true);
  const app=document.querySelector('#app'); if(app)new MutationObserver(scheduleBroadcast).observe(app,{childList:true,subtree:true,characterData:true});
  window.addEventListener('living-table:session-updated',scheduleBroadcast);
}else{
  window.addEventListener('living-table:session-updated',sendPlayerStatus);
  document.addEventListener('click',event=>{if(event.target.closest('.player-station,.full-character-sheet'))setTimeout(sendPlayerStatus,80);},true);
}

window.addEventListener('beforeunload',()=>{hostConnection?.close?.();hostPeer?.destroy?.();});
window.addEventListener('DOMContentLoaded',mount);
setTimeout(mount,100);
