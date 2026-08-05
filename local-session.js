import { activateCharacterCard } from './src/player/character-cards.js';

export const LOCAL_SESSION_KEY = 'living-table-local-session-v1';
const SLOT_IDS = ['location','room','npc','monster','hazard','treasure'];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const clone = value => JSON.parse(JSON.stringify(value));
const safeParse = value => { try { return JSON.parse(value); } catch { return null; } };

export function createLocalSession(manifest, selectedSystem = manifest.systems?.[0] || 'dnd-2014') {
  return {
    schemaVersion: 1,
    sessionId: `${manifest.packId}-${Date.now()}`,
    packId: manifest.packId,
    releaseId: manifest.releaseId,
    version: manifest.version,
    title: manifest.title,
    selectedSystem,
    status: 'prepared',
    currentSceneId: manifest.entrySceneId,
    board: clone(manifest.startingBoard || {}),
    quests: clone(manifest.startingQuests || []),
    players: [{ seatId:'seat-1', characterId:'wendy-birthday-hero', claimedBy:null, ready:false }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function loadLocalSession(storage = localStorage) {
  return safeParse(storage.getItem(LOCAL_SESSION_KEY));
}

export function saveLocalSession(session, storage = localStorage) {
  const next = { ...session, updatedAt:new Date().toISOString() };
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
  for (const slotId of SLOT_IDS) {
    const desired = [...(targetBoard?.[slotId] || [])];
    let slot = document.querySelector(`[data-slot="${slotId}"]`);
    if (!slot) continue;
    await openStack(slot);
    let existing = uniqueInstances(document.querySelector(`[data-slot="${slotId}"]`));

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
  return `<section class="local-session-bar" aria-label="Local adventure session">
    <div><small>LOCAL SESSION</small><strong>${session?.title || 'No adventure prepared'}</strong><span>${session ? `${session.version} · ${session.selectedSystem} · ${session.status}` : 'Load an Adventure Master Card to begin.'}</span></div>
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

async function restoreSession(session = loadLocalSession()) {
  if (!session || applying) return;
  applying = true;
  message('Building the opening board from the adventure manifest…');
  activateCharacterCard(session.players?.[0]?.characterId || 'wendy-birthday-hero');
  const actual = await reconcileBoard(session.board, { onProgress:message });
  saveLocalSession({ ...session, board:actual, status:'ready' });
  applying = false;
  renderToolbar();
  message('Opening board, quest references, edition, and Wendy’s pregen are saved locally.');
}

function bindToolbar() {
  document.querySelector('[data-session-save]')?.addEventListener('click', () => {
    const session = loadLocalSession();
    if (!session) return;
    saveLocalSession({ ...session, board:readBoardFromDom(), status:'in-progress' });
    renderToolbar();
    message('Session saved in this browser.');
  });
  document.querySelector('[data-session-restore]')?.addEventListener('click', () => restoreSession());
  document.querySelector('[data-session-reset]')?.addEventListener('click', async () => {
    const session = loadLocalSession();
    if (!session || !confirm('Reset this local session to the adventure opening board?')) return;
    const manifest = window.__DND_ADVENTURE_PACK__;
    const fresh = manifest ? createLocalSession(manifest, session.selectedSystem) : { ...session, status:'prepared' };
    saveLocalSession(fresh);
    await restoreSession(fresh);
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
  await restoreSession(session);
});

const app = document.querySelector('#app');
if (app) new MutationObserver(scheduleBoardSave).observe(app, { childList:true, subtree:true });

window.LivingTableLocalSession = Object.freeze({ createLocalSession, loadLocalSession, saveLocalSession, clearLocalSession, readBoardFromDom, reconcileBoard, restoreSession });

renderToolbar();
const saved = loadLocalSession();
if (saved) setTimeout(() => restoreSession(saved), 180);
