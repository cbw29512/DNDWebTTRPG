import { SESSION_SCHEMA_VERSION, LIVE_BOARD_SLOT_IDS, normalizeBoard, normalizeSessionState } from './session-schema.js';
import { applySessionCommand } from './session-reducer.js';

export const LOCAL_SESSION_KEY = 'living-table-local-session-v1';
const clone = value => structuredClone(value);
const unique = values => [...new Set(values.filter(Boolean))];
const manifestFromWindow = () => globalThis.window?.__DND_ADVENTURE_PACK__;

function emit(name, detail) {
  try {
    globalThis.window?.dispatchEvent?.(new CustomEvent(name,{detail}));
  } catch (error) {
    console.warn(`[Living Table] Could not emit ${name}.`,error);
  }
}

function safeParse(value) {
  try { return JSON.parse(value); }
  catch (error) { console.warn('[Living Table] Ignoring invalid saved session JSON.',error); return null; }
}

export function activeManifestScene(session, manifest=manifestFromWindow()) {
  const scenes=manifest?.scenes||[];
  return scenes.find(scene=>scene.id===session?.currentSceneId)
    || scenes.find(scene=>scene.roomId===session?.currentRoomId)
    || scenes.find(scene=>scene.roomId===session?.currentSceneId)
    || scenes.find(scene=>scene.id===manifest?.entrySceneId)
    || scenes[0] || null;
}

export function migrateSpatialSession(input, manifest=manifestFromWindow()) {
  try {
    const session=clone(input||{});
    const previousSchema=session.schemaVersion||1;
    const rawBoard=clone(session.board||{});
    const rawOpeningBoard=clone(session.openingBoard||rawBoard);
    const active=activeManifestScene(session,manifest);
    const legacyObjectiveIds=unique([
      ...(rawBoard.objective||[]),...(rawOpeningBoard.objective||[]),
      ...(manifest?.persistentBoard?.objective||[]),...(active?.board?.objective||[])
    ]);

    session.schemaVersion=SESSION_SCHEMA_VERSION;
    session.board=normalizeBoard(rawBoard);
    session.openingBoard=normalizeBoard(rawOpeningBoard);
    if(active){
      if(!session.currentSceneId)session.currentSceneId=active.id;
      session.currentLocationId ||= active.locationId||session.board.location[0]||null;
      session.currentSiteId ||= active.siteId||null;
      session.currentRoomId ||= active.roomId||session.board.room[0]||null;
      session.currentSceneCardId ||= active.sceneCardId||null;
      if(!session.board.location.length&&active.locationId)session.board.location=[active.locationId];
      if(!session.board.site.length&&active.siteId)session.board.site=[active.siteId];
      if(!session.board.room.length&&active.roomId)session.board.room=[active.roomId];
    }

    const start=normalizeBoard(manifest?.startingBoard||{});
    for(const slotId of LIVE_BOARD_SLOT_IDS){
      if(!session.openingBoard[slotId].length&&start[slotId].length)session.openingBoard[slotId]=start[slotId];
    }

    const startingQuests=clone(manifest?.startingQuests||[]);
    const mainQuestId=startingQuests[0]||session.quests?.[0]||legacyObjectiveIds[0]||null;
    const existingActive=session.questState?.active||(session.quests||[]).filter(id=>id!==mainQuestId);
    const activeQuestIds=unique([...existingActive,...legacyObjectiveIds,...(active?.questIds||[])]).filter(id=>id!==mainQuestId);
    session.quests=unique([mainQuestId,...activeQuestIds]);
    session.questState={active:activeQuestIds,revealed:unique([...(session.questState?.revealed||[]),mainQuestId,...activeQuestIds])};

    const normalized=normalizeSessionState(session);
    if(previousSchema<SESSION_SCHEMA_VERSION&&!normalized.eventHistory.some(event=>event.type==='session-live-board-migrated')){
      normalized.eventHistory.push({
        id:`migration-${Date.now()}`,type:'session-live-board-migrated',fromSchema:previousSchema,toSchema:SESSION_SCHEMA_VERSION,
        removedBoardSlots:['scene','objective'],sceneId:active?.id||normalized.currentSceneId||null,at:new Date().toISOString()
      });
    }
    return normalized;
  } catch (error) {
    console.error('[Living Table] Session migration failed.',error);
    throw error;
  }
}

export function createLocalSession(manifest, selectedSystem=manifest.systems?.[0]||'dnd-2014') {
  try {
    const openingBoard=normalizeBoard(manifest.startingBoard||{});
    const entry=manifest.scenes?.find(scene=>scene.id===manifest.entrySceneId)||manifest.scenes?.[0]||{};
    const startingQuests=clone(manifest.startingQuests||[]);
    const now=new Date().toISOString();
    return normalizeSessionState({
      sessionId:`${manifest.packId}-${Date.now()}`,packId:manifest.packId,releaseId:manifest.releaseId,version:manifest.version,title:manifest.title,
      selectedSystem,status:'prepared',currentSceneId:entry.id||manifest.entrySceneId,currentLocationId:entry.locationId||openingBoard.location[0]||null,
      currentSiteId:entry.siteId||openingBoard.site[0]||null,currentRoomId:entry.roomId||openingBoard.room[0]||null,currentSceneCardId:entry.sceneCardId||null,
      openingBoard,board:clone(openingBoard),quests:startingQuests,questState:{active:startingQuests.slice(1),revealed:startingQuests},roomHistory:[],
      discoveredScenes:entry.id?[entry.id]:[],players:[{seatId:'seat-1',characterId:'wendy-birthday-hero',claimedBy:null,ready:false}],createdAt:now,updatedAt:now
    });
  } catch (error) {
    console.error('[Living Table] Could not create local session.',error);
    throw error;
  }
}

export function loadLocalSession(storage=globalThis.localStorage, manifest=manifestFromWindow()) {
  try { const parsed=safeParse(storage?.getItem?.(LOCAL_SESSION_KEY)); return parsed?migrateSpatialSession(parsed,manifest):null; }
  catch (error) { console.error('[Living Table] Could not load local session.',error); return null; }
}

export function saveLocalSession(session, storage=globalThis.localStorage, manifest=manifestFromWindow()) {
  try {
    const next=migrateSpatialSession(session,manifest); next.updatedAt=new Date().toISOString();
    storage?.setItem?.(LOCAL_SESSION_KEY,JSON.stringify(next)); emit('living-table:session-updated',{session:next}); return next;
  } catch (error) { console.error('[Living Table] Could not save local session.',error); throw error; }
}

export function dispatchLocalSession(command, storage=globalThis.localStorage, manifest=manifestFromWindow(), dependencies={}) {
  try {
    const current=loadLocalSession(storage,manifest); if(!current)throw new Error('No local session is loaded.');
    const result=applySessionCommand(current,command,dependencies); if(!result.event)return result;
    return {...result,state:saveLocalSession(result.state,storage,manifest)};
  } catch (error) { console.error(`[Living Table] Could not dispatch ${command?.type||'session command'}.`,error); throw error; }
}

export function clearLocalSession(storage=globalThis.localStorage) {
  try { storage?.removeItem?.(LOCAL_SESSION_KEY); emit('living-table:session-cleared'); }
  catch (error) { console.error('[Living Table] Could not clear local session.',error); throw error; }
}