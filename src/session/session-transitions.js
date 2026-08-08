import { SESSION_COMMANDS } from './session-commands.js';
import { LIVE_BOARD_SLOT_IDS, normalizeBoard } from './session-schema.js';
import { applyCombatTransition } from './combat-transitions.js';

const clone = value => structuredClone(value);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function validateSlot(slotId) {
  if (!LIVE_BOARD_SLOT_IDS.includes(slotId)) throw new RangeError(`Unknown board slot: ${slotId}`);
}

function updateSceneContext(state, command) {
  const mapping = {
    currentLocationId:'locationId',
    currentSiteId:'siteId',
    currentRoomId:'roomId',
    currentSceneId:'sceneId',
    currentSceneCardId:'sceneCardId'
  };
  let changed=false;
  for(const [stateKey,commandKey] of Object.entries(mapping)){
    if(!(commandKey in command)&&!(stateKey in command))continue;
    const next=(command[commandKey]??command[stateKey])??null;
    if(!Object.is(state[stateKey]??null,next))changed=true;
    state[stateKey]=next;
  }
  return changed;
}

function loadScene(state, command) {
  if (!command.sceneId) throw new TypeError('LOAD_SCENE requires sceneId.');
  const before = {
    board:state.board, currentLocationId:state.currentLocationId, currentSiteId:state.currentSiteId,
    currentRoomId:state.currentRoomId, currentSceneId:state.currentSceneId,
    currentSceneCardId:state.currentSceneCardId, quests:state.quests,
    questState:state.questState, roomHistory:state.roomHistory,
    discoveredScenes:state.discoveredScenes, status:state.status
  };
  state.board=normalizeBoard(command.board);
  updateSceneContext(state,command);
  if(Array.isArray(command.quests))state.quests=clone(command.quests);
  if(command.questState&&typeof command.questState==='object')state.questState=clone(command.questState);
  if(Array.isArray(command.roomHistory))state.roomHistory=clone(command.roomHistory);
  if(Array.isArray(command.discoveredScenes))state.discoveredScenes=clone(command.discoveredScenes);
  state.status=String(command.status||'in-progress');
  const after = {
    board:state.board, currentLocationId:state.currentLocationId, currentSiteId:state.currentSiteId,
    currentRoomId:state.currentRoomId, currentSceneId:state.currentSceneId,
    currentSceneCardId:state.currentSceneCardId, quests:state.quests,
    questState:state.questState, roomHistory:state.roomHistory,
    discoveredScenes:state.discoveredScenes, status:state.status
  };
  return !same(before,after);
}

function updatePlayer(state, command) {
  if (!command.seatId) throw new TypeError('UPDATE_PLAYER requires seatId.');
  const index=state.players.findIndex(player=>player.seatId===command.seatId);
  if(index<0)throw new RangeError(`Unknown player seat: ${command.seatId}`);
  const patch=command.patch&&typeof command.patch==='object'?command.patch:{};
  const next={...state.players[index],...clone(patch),seatId:state.players[index].seatId};
  if(same(state.players[index],next))return false;
  state.players[index]=next;
  return true;
}

export function applySessionTransition(state, command) {
  const combatChanged=applyCombatTransition(state,command);
  if(combatChanged!==null)return combatChanged;
  switch(command.type){
    case SESSION_COMMANDS.REPLACE_BOARD:{
      const next=normalizeBoard(command.board); const changed=!same(state.board,next); state.board=next; return changed;
    }
    case SESSION_COMMANDS.PLACE_CARD:
      validateSlot(command.slotId); if(!command.cardId)throw new TypeError('PLACE_CARD requires cardId.'); state.board[command.slotId].push(command.cardId); return true;
    case SESSION_COMMANDS.REMOVE_CARD:{
      validateSlot(command.slotId); if(!command.cardId)throw new TypeError('REMOVE_CARD requires cardId.');
      const index=state.board[command.slotId].indexOf(command.cardId); if(index<0)throw new RangeError(`${command.cardId} is not present in ${command.slotId}.`);
      state.board[command.slotId].splice(index,1); return true;
    }
    case SESSION_COMMANDS.LOAD_SCENE:return loadScene(state,command);
    case SESSION_COMMANDS.SET_SCENE_CONTEXT:return updateSceneContext(state,command);
    case SESSION_COMMANDS.SET_STATUS:{const next=String(command.status||'prepared');const changed=!same(state.status,next);state.status=next;return changed;}
    case SESSION_COMMANDS.SET_COMBAT_STATE:{const next=command.combatState==null?null:clone(command.combatState);const changed=!same(state.combatState,next);state.combatState=next;return changed;}
    case SESSION_COMMANDS.UPDATE_PLAYER:return updatePlayer(state,command);
    default:throw new RangeError(`Unsupported session command: ${command.type}`);
  }
}