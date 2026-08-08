import { SESSION_COMMANDS, SESSION_COMMAND_TYPES } from './session-commands.js';
import { normalizeSessionState } from './session-schema.js';
import { applySessionTransition } from './session-transitions.js';

const clone=value=>structuredClone(value);

function validateCommand(command){
  if(!command||typeof command!=='object')throw new TypeError('Session command must be an object.');
  if(!SESSION_COMMAND_TYPES.includes(command.type))throw new RangeError(`Unsupported session command: ${command.type}`);
}

function boardCounts(board={}){
  return Object.fromEntries(Object.entries(board).map(([slotId,cards])=>[slotId,Array.isArray(cards)?cards.length:0]));
}

function eventData(command,state){
  switch(command.type){
    case SESSION_COMMANDS.REPLACE_BOARD:
      return {slotCounts:boardCounts(state.board)};
    case SESSION_COMMANDS.PLACE_CARD:
    case SESSION_COMMANDS.REMOVE_CARD:
      return {slotId:command.slotId,cardId:command.cardId};
    case SESSION_COMMANDS.LOAD_SCENE:
      return {
        sceneId:command.sceneId,locationId:command.locationId??null,siteId:command.siteId??null,
        roomId:command.roomId??null,sceneCardId:command.sceneCardId??null,status:state.status,
        activatedQuestIds:clone(command.activatedQuestIds||[]),slotCounts:boardCounts(state.board)
      };
    case SESSION_COMMANDS.SET_SCENE_CONTEXT:
      return {
        currentLocationId:state.currentLocationId??null,currentSiteId:state.currentSiteId??null,
        currentRoomId:state.currentRoomId??null,currentSceneId:state.currentSceneId??null,
        currentSceneCardId:state.currentSceneCardId??null
      };
    case SESSION_COMMANDS.SET_STATUS:
      return {status:state.status};
    case SESSION_COMMANDS.SET_COMBAT_STATE:
      return {
        active:Boolean(state.combatState),encounterId:state.combatState?.encounterId??null,
        round:state.combatState?.round??null,activeTurn:state.combatState?.activeTurn??null
      };
    case SESSION_COMMANDS.UPDATE_PLAYER:
      return {seatId:command.seatId,patch:clone(command.patch||{})};
    default:
      return {};
  }
}

function appendEvent(state,command,now){
  const event={id:`session-${state.revision}-${now}`,type:command.type,at:new Date(now).toISOString(),data:eventData(command,state)};
  state.eventHistory.push(event);
  return event;
}

export function applySessionCommand(currentState,command,dependencies={}){
  try{
    validateCommand(command);
    const state=normalizeSessionState(currentState);
    const now=Number(dependencies.now??Date.now());
    if(!Number.isFinite(now))throw new TypeError('Session command timestamp must be numeric.');

    const changed=applySessionTransition(state,command);
    if(!changed)return {state:normalizeSessionState(currentState),event:null};

    state.revision+=1;
    state.updatedAt=new Date(now).toISOString();
    const event=appendEvent(state,command,now);
    return {state,event};
  }catch(error){
    console.error(`[Living Table] Session reducer failed for ${command?.type||'unknown command'}.`,error);
    throw error;
  }
}