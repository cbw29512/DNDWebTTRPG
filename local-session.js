import { activateCharacterCard } from './src/player/character-cards.js';

export const LOCAL_SESSION_KEY = 'living-table-local-session-v1';
const SLOT_IDS = ['location','site','room','scene','npc','monster','hazard','objective','treasure'];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const clone = value => JSON.parse(JSON.stringify(value));
const safeParse = value => { try { return JSON.parse(value); } catch { return null; } };
const normalizedBoard = board => Object.fromEntries(SLOT_IDS.map(slotId => [slotId, clone(board?.[slotId] || [])]));

function activeManifestScene(session, manifest) {
  const scenes = manifest?.scenes || [];
  return scenes.find(scene => scene.id === session.currentSceneId)
    || scenes.find(scene => scene.roomId === session.currentRoomId)
    || scenes.find(scene => scene.roomId === session.currentSceneId)
    || scenes.find(scene => scene.id === manifest?.entrySceneId)
    || scenes[0]
    || null;
}

function migrateSpatialSession(session, manifest = window.__DND_ADVENTURE_PACK__) {
  const previousSchema = session.schemaVersion || 1;
  session.schemaVersion = 2;
  session.board = normalizedBoard(session.board || {});
  session.openingBoard = normalizedBoard(session.openingBoard || session.board);
  const active = activeManifestScene(session, manifest);

  if (active) {
    session.currentSceneId = active.id;
    session.currentLocationId ||= active.locationId || session.board.location[0] || null;
    session.currentSiteId ||= active.siteId || null;
    session.currentRoomId ||= active.roomId || session.board.room[0] || null;
    session.currentSceneCardId ||= active.sceneCardId || null;
    if (!session.board.location.length && active.locationId) session.board.location = [active.locationId];
    if (!session.board.site.length && active.siteId) session.board.site = [active.siteId];
    if (!session.board.room.length && active.roomId) session.board.room = [active.roomId];
    if (!session.board.scene.length && active.sceneCardId) session.board.scene = [active.sceneCardId];
    if (!session.board.objective.length) {
      session.board.objective = [...new Set([...(manifest?.persistentBoard?.objective || []), ...(active.board?.objective || [])])];
    }
  }

  const start = normalizedBoard(manifest?.startingBoard || {});
  for (const slotId of SLOT_IDS) {
    if (!session.openingBoard[slotId].length && start[slotId].length) session.openingBoard[slotId] = start[slotId];
  }

  session.roomHistory ||= [];
  session.discoveredScenes ||= active?.id ? [active.id] : [];
  session.worldState ||= {};
  session.locationState ||= {};
  session.siteState ||= {};
  session.roomState ||= {};
  session.sceneState ||= {};
  session.eventHistory ||= [];
  if (!('combatState' in session)) session.combatState = null;
  if (previousSchema < 2 && !session.eventHistory.some(event => event.type === 'session-spatial-migrated')) {
    session.eventHistory.push({
      id: `migration-${Date.now()}`,
      type: 'session-spatial-migrated',
      fromSchema: previousSchema,
      toSchema: 2,
      sceneId: active?.id || null,
      at: new Date().toISOString()
    });
  }
  return session;
}

export function createLocalSession(manifest, selectedSystem = manifest.systems?.[0] || 'dnd-2014') {
  const openingBoard = normalizedBoard(manifest.startingBoard || {});
  const entry = manifest.scenes?.find(scene => scene.id === manifest.entrySceneId) || manifest.scenes?.[0] || {};
  return {
    schemaVersion: 2,
    sessionId: `${manifest.packId}-${Date.now()}`,
    packId: manifest.packId,
    releaseId: manifest.releaseId,
    version: manifest.version,
    title: manifest.title,
    selectedSystem,
    status: 'prepared',
    currentSceneId: entry.id || manifest.entrySceneId,
    currentLocationId: entry.locationId || openingBoard.location[0] || null,
    currentSiteId: entry.siteId || openingBoard.site[0] || null,
    currentRoomId: entry.roomId || openingBoard.room[0] || null,
    currentSceneCardId: entry.sceneCardId || openingBoard.scene[0] || null,
    openingBoard,
    board: clone(openingBoard),
    quests: clone(manifest.startingQuests || []),
    roomHistory: [],
    discoveredScenes: entry.id ? [entry.id] : [],
    worldState: {},
    locationState: {},
    siteState: {},
    roomState: {},
    sceneState: {},
    combatState: null,
    eventHistory: [],
    players: [{ seatId:'seat-1', characterId:'wendy-birthday-hero', claimedBy:null, ready:false }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function loadLocalSession(storage = localStorage) {
  const session = safeParse(storage.getItem(LOCAL_SESSION_KEY));
  return session ? migrateSpatialSession(session) : null;
}

export function saveLocalSession(session, storage = localStorage) {
  const next = migrateSpatialSession({ ...session, board:normalizedBoard(session.board) });
  next.updatedAt = new Date().toISOString();
  storage.setItem(LOCAL_SESSION_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('living-table:session-updated', { detail:{ session:next } }));
  return next;
}

export function clearLocalSession(storage = localStorage) {
  storage.removeItem(LOCAL_SESSION_KEY);
  window.dispatchEvent(new CustomEvent('living-table:session-cleared'));
}

function uniqueInstances(slot) {
  const byId = new Map();
  slot?.querySelectorAll('[data-card-instance]').forEach(card => {
    if (!byId.has(card.dataset.cardInstance)) byId.set(card.dataset.cardInstance, card.dataset.cardId);
  });
  return [...byId].map(([instanceId, cardId]) => ({ instanceId, cardId }));
}

export function readBoardFromDom(root = document) {
  return Object.fromEntries(SLOT_IDS.map(slotId => {
    const slot = root.querySelector(`[data-slot="${slotId}"]`);
    return [slotId, uniqueInstances(slot).map(instance => instance.cardId)];
  }));
}

async function openStack(slot) {
  const toggle = slot?.querySelector('.stack-toggle[aria-expanded="false"]');
  if (toggle) { toggle.click(); await delay(40); }
}

async function removeOne(slotId, instanceId) {
  let slot = document.querySelector(`[data-slot="${slotId}"]`);
  if (!slot) return false;
  await openStack(slot);
  slot = document.querySelector(`[data-slot="${slotId}"]`);
  const button = slot?.querySelector(`[data-remove-instance="${CSS.escape(instanceId)}"]`);
  if (!button) return false;
  button.click();
  await delay(45);
  return true;
}

async function addOne(slotId, cardId) {
  const add = document.querySelector(`[data-open-picker="${slotId}"]`);
  if (!add) return false;
  add.click();
  await delay(35);
  const option = document.querySelector(`[data-place-slot="${slotId}"][data-place-card="${CSS.escape(cardId)}"]`);
  if (!option) {
    document.querySelector('[data-close-picker]')?.click();
    return false;
  }
  option.click();
  await delay(45);
  return true;
}

export async function reconcileBoard(targetBoard, { onProgress = () => {} } = {}) {
  const normalizedTarget = normalizedBoard(targetBoard);
  for (const slotId of SLOT_IDS) {
    const desired = [...normalizedTarget[slotId]];
    let slot = document.querySelector(`[data-slot="${slotId}"]`);
    if (!slot) continue;
    await openStack(slot);
    const existing = uniqueInstances(document.querySelector(`[data-slot="${slotId}"]`));
    const remaining = [...desired];
    const removals = [];
    existing.forEach(instance => {
      const match = remaining.indexOf(instance.cardId);
      if (match >= 0) remaining.splice(match, 1);
      else removals.push(instance);
    });
    for (const instance of removals) {
      onProgress(`Removing ${instance.cardId} from ${slotId}`);
      await removeOne(slotId, instance.instanceId);
    }
    for (const cardId of remaining) {
      onProgress(`Adding ${cardId} to ${slotId}`);
      await addOne(slotId, cardId);
    }
  }
  return readBoardFromDom();
}

function toolbarMarkup(session) {
  const breadcrumb = session ? [session.currentLocationId, session.currentSiteId, session.currentRoomId, session.currentSceneCardId].filter(Boolean).join(' → ') : '';
  return `<section class="local-session-bar" aria-label="Local adventure session">
    <div><small>LOCAL SESSION</small><strong>${session?.title || 'No adventure prepared'}</strong><span>${session ? `${session.version} · ${session.selectedSystem} · ${session.status}` : 'Load an Adventure Master Card to begin.'}</span>${breadcrumb ? `<small>${breadcrumb}</small>` : ''}</div>
    <p data-session-message aria-live="polite"></p>
    <div class="local-session-actions">
      <button type="button" data-session-save ${session?'':'disabled'}>Save</button>
      <button type="button" data-session-restore ${session?'':'disabled'}>Restore Opening Board</button>
      <button type="button" data-session-reset ${session?'':'disabled'}>Reset Session</button>
    </div>
  </section>`;
}

let applying = false;
let saveTimer;

function renderToolbar() {
  document.querySelector('.local-session-bar')?.remove();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = toolbarMarkup(loadLocalSession());
  document.body.insertBefore(wrapper.firstElementChild, document.querySelector('.library-hub') || document.body.firstChild);
  bindToolbar();
}

function message(text) {
  const node = document.querySelector('[data-session-message]');
  if (node) node.textContent = text;
}

async function applySessionBoard(session, targetBoard = session.board, finalStatus = session.status) {
  if (!session || applying) return;
  applying = true;
  message('Restoring the exact adventure, place, scene, and cards…');
  activateCharacterCard(session.players?.[0]?.characterId || 'wendy-birthday-hero');
  const actual = await reconcileBoard(targetBoard, { onProgress:message });
  saveLocalSession({ ...session, board:actual, status:finalStatus || 'ready' });
  applying = false;
  renderToolbar();
  message('Location, Site, Area, Scene, cards, quests, edition, and character state are saved locally.');
}

function bindToolbar() {
  document.querySelector('[data-session-save]')?.addEventListener('click', () => {
    const session = loadLocalSession();
    if (!session) return;
    saveLocalSession({ ...session, board:readBoardFromDom(), status:'in-progress' });
    renderToolbar();
    message('Session saved in this browser.');
  });
  document.querySelector('[data-session-restore]')?.addEventListener('click', async () => {
    const session = loadLocalSession();
    if (session) await applySessionBoard(session, session.openingBoard, 'ready');
  });
  document.querySelector('[data-session-reset]')?.addEventListener('click', async () => {
    const session = loadLocalSession();
    if (!session || !confirm('Reset this local session to the adventure opening board?')) return;
    const manifest = window.__DND_ADVENTURE_PACK__;
    const fresh = manifest ? createLocalSession(manifest, session.selectedSystem) : { ...session, board:clone(session.openingBoard), status:'prepared' };
    saveLocalSession(fresh);
    await applySessionBoard(fresh, fresh.openingBoard, 'ready');
  });
}

function scheduleBoardSave() {
  if (applying || !loadLocalSession()) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const session = loadLocalSession();
    if (!session || applying) return;
    saveLocalSession({ ...session, board:readBoardFromDom() });
  }, 250);
}

window.addEventListener('dnd:adventure-loaded', async event => {
  const manifest = event.detail;
  const session = createLocalSession(manifest, manifest.selectedSystem);
  saveLocalSession(session);
  renderToolbar();
  await delay(100);
  await applySessionBoard(session, session.openingBoard, 'ready');
});

const app = document.querySelector('#app');
if (app) new MutationObserver(scheduleBoardSave).observe(app, { childList:true, subtree:true });

window.LivingTableLocalSession = Object.freeze({ createLocalSession, loadLocalSession, saveLocalSession, clearLocalSession, readBoardFromDom, reconcileBoard, applySessionBoard });

renderToolbar();
const saved = loadLocalSession();
if (saved) setTimeout(() => applySessionBoard(saved, saved.board, saved.status), 180);
