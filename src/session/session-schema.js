export const SESSION_SCHEMA_VERSION = 3;
export const LIVE_BOARD_SLOT_IDS = Object.freeze([
  'location',
  'site',
  'room',
  'npc',
  'monster',
  'hazard',
  'treasure'
]);

const clone = value => structuredClone(value);

export function normalizeBoard(board = {}) {
  try {
    return Object.fromEntries(
      LIVE_BOARD_SLOT_IDS.map(slotId => [slotId, clone(Array.isArray(board?.[slotId]) ? board[slotId] : [])])
    );
  } catch (error) {
    console.error('[Living Table] Failed to normalize board state.', error);
    throw error;
  }
}

export function normalizeSessionState(input = {}) {
  try {
    const session = clone(input || {});
    session.schemaVersion = SESSION_SCHEMA_VERSION;
    session.revision = Number.isInteger(session.revision) && session.revision >= 0 ? session.revision : 0;
    session.board = normalizeBoard(session.board);
    session.openingBoard = normalizeBoard(session.openingBoard || session.board);
    session.quests = Array.isArray(session.quests) ? session.quests : [];
    session.questState = {
      active: Array.isArray(session.questState?.active) ? session.questState.active : [],
      revealed: Array.isArray(session.questState?.revealed) ? session.questState.revealed : []
    };
    session.roomHistory = Array.isArray(session.roomHistory) ? session.roomHistory : [];
    session.discoveredScenes = Array.isArray(session.discoveredScenes) ? session.discoveredScenes : [];
    session.worldState = session.worldState && typeof session.worldState === 'object' ? session.worldState : {};
    session.locationState = session.locationState && typeof session.locationState === 'object' ? session.locationState : {};
    session.siteState = session.siteState && typeof session.siteState === 'object' ? session.siteState : {};
    session.roomState = session.roomState && typeof session.roomState === 'object' ? session.roomState : {};
    session.sceneState = session.sceneState && typeof session.sceneState === 'object' ? session.sceneState : {};
    session.eventHistory = Array.isArray(session.eventHistory) ? session.eventHistory : [];
    session.players = Array.isArray(session.players) ? session.players : [];
    if (!('combatState' in session)) session.combatState = null;
    return session;
  } catch (error) {
    console.error('[Living Table] Failed to normalize session state.', error);
    throw error;
  }
}