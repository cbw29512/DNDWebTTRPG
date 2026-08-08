import { SESSION_COMMANDS } from './session-commands.js';
import { normalizeCombatState } from './combat-schema.js';
import { applyCombatTurnTransition } from './combat-turn-transitions.js';
import { applyCombatantTransition } from './combatant-transitions.js';

const clone=value=>structuredClone(value);
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

function requireCombat(state){
  if(!state.combatState)throw new Error('No active combat state.');
  return state.combatState;
}

function startCombat(state,command){
  const source=clone(command.combatState||command);
  source.status=source.status||'setup';
  if(source.status==='setup')source.activeTurnId=null;
  const next=normalizeCombatState(source);
  const changed=!same(state.combatState,next);
  state.combatState=next;
  return changed;
}

function setEnvironment(combat,command){
  const nextHazards=Array.isArray(command.hazards)?clone(command.hazards):combat.hazards;
  const nextTriggers=Array.isArray(command.recurringTriggers)?clone(command.recurringTriggers):combat.recurringTriggers;
  const changed=!same(combat.hazards,nextHazards)||!same(combat.recurringTriggers,nextTriggers);
  combat.hazards=nextHazards;
  combat.recurringTriggers=nextTriggers;
  return changed;
}

export function applyCombatTransition(state,command){
  if(command.type===SESSION_COMMANDS.START_COMBAT)return startCombat(state,command);
  if(command.type===SESSION_COMMANDS.END_COMBAT){if(!state.combatState)return false;state.combatState=null;return true;}
  const combatCommands=new Set([
    SESSION_COMMANDS.SET_COMBAT_INITIATIVE,SESSION_COMMANDS.BEGIN_COMBAT_ROUNDS,SESSION_COMMANDS.ADVANCE_COMBAT_TURN,
    SESSION_COMMANDS.SET_COMBATANT_HP,SESSION_COMMANDS.APPLY_COMBAT_CONDITION,SESSION_COMMANDS.REMOVE_COMBAT_CONDITION,
    SESSION_COMMANDS.SET_COMBAT_CONCENTRATION,SESSION_COMMANDS.UPDATE_COMBAT_RESOURCE,SESSION_COMMANDS.UPDATE_COMBAT_ACTION_ECONOMY,
    SESSION_COMMANDS.SET_COMBAT_DEATH_SAVES,SESSION_COMMANDS.SET_COMBAT_ENVIRONMENT,SESSION_COMMANDS.RESET_COMBATANT_TURN
  ]);
  if(!combatCommands.has(command.type))return null;
  const combat=requireCombat(state);
  const turnChanged=applyCombatTurnTransition(combat,command);
  if(turnChanged!==null)return turnChanged;
  const combatantChanged=applyCombatantTransition(combat,command);
  if(combatantChanged!==null)return combatantChanged;
  if(command.type===SESSION_COMMANDS.SET_COMBAT_ENVIRONMENT)return setEnvironment(combat,command);
  return null;
}