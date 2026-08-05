export const LOCAL_SESSION_KEY = 'living-table-local-session-v1';

const clone = value => JSON.parse(JSON.stringify(value));
const safeParse = value => { try { return JSON.parse(value); } catch { return null; } };

export function loadSession(storage = localStorage) {
  return safeParse(storage.getItem(LOCAL_SESSION_KEY));
}

export function saveSession(session, storage = localStorage) {
  if (!session) return null;
  const next = { ...clone(session), updatedAt:new Date().toISOString() };
  storage.setItem(LOCAL_SESSION_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('living-table:session-updated', { detail:{ session:next } }));
  return next;
}

export function updateSession(updater, storage = localStorage) {
  const current = loadSession(storage);
  if (!current) return null;
  const updated = updater(clone(current));
  return saveSession(updated || current, storage);
}

export function ensurePlayerState(session, character) {
  const existing = session.playerState || {};
  return {
    characterId: character?.id || existing.characterId || 'wendy-birthday-hero',
    hp: Number.isFinite(existing.hp) ? existing.hp : (character?.base?.maxHp ?? 1),
    ready: Boolean(existing.ready),
    actions: { action:true, bonus:true, reaction:true, ...(existing.actions || {}) },
    equipped: { ...(character?.startingEquipment || {}), ...(existing.equipped || {}) },
    edition: existing.edition || (session.selectedSystem === 'dnd-2024' ? '2024' : '2014'),
    itemResources: clone(existing.itemResources || {})
  };
}
