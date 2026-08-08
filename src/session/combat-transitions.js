import { SESSION_COMMANDS } from './session-commands.js';
import { DEFAULT_ACTION_ECONOMY, normalizeCombatState, normalizeCombatant } from './combat-schema.js';

const clone=value=>structuredClone(value);
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

function requireCombat(state){
  if(!state.combatState)throw new Error('No active combat state.');
  return state.combatState;
}

function requireCombatant(combat,id){
  const combatant=combat.combatants?.[id];
  if(!combatant)throw new RangeError(`Unknown combatant: ${id}`);
  return combatant;
}

function sortedTurnOrder(combat){
  const previous=new Map((combat.turnOrder||[]).map((id,index)=>[id,index]));
  return Object.values(combat.combatants).filter(entry=>entry.initiative!=null).sort((a,b)=>{
    const initiative=b.initiative-a.initiative;
    if(initiative)return initiative;
    return (previous.get(a.id)??Number.MAX_SAFE_INTEGER)-(previous.get(b.id)??Number.MAX_SAFE_INTEGER);
  }).map(entry=>entry.id);
}

function startCombat(state,command){
  const next=normalizeCombatState(command.combatState||command);
  if(!next.encounterId)throw new TypeError('START_COMBAT requires encounterId.');
  const changed=!same(state.combatState,next);
  state.combatState=next;
  return changed;
}

function setInitiative(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  const initiative=Number(command.initiative);
  if(!Number.isFinite(initiative))throw new TypeError('SET_COMBAT_INITIATIVE requires numeric initiative.');
  if(combatant.initiative===initiative)return false;
  combatant.initiative=initiative;
  combat.turnOrder=sortedTurnOrder(combat);
  if(!combat.activeTurnId&&combat.turnOrder.length)combat.activeTurnId=combat.turnOrder[0];
  return true;
}

function advanceTurn(combat){
  if(!combat.turnOrder.length)return false;
  const current=Math.max(0,combat.turnOrder.indexOf(combat.activeTurnId));
  const next=(current+1)%combat.turnOrder.length;
  if(next===0)combat.round+=1;
  combat.activeTurnId=combat.turnOrder[next];
  const combatant=requireCombatant(combat,combat.activeTurnId);
  const movementMax=combatant.actionEconomy?.movementMax??0;
  combatant.actionEconomy={...DEFAULT_ACTION_ECONOMY,...combatant.actionEconomy,movementMax,movementRemaining:movementMax};
  return true;
}

function setHp(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  const next=clone(combatant.hp);
  if(command.max!=null)next.max=Math.max(0,Number(command.max)||0);
  if(command.current!=null)next.current=Math.max(0,Math.min(next.max,Number(command.current)||0));
  if(command.temp!=null)next.temp=Math.max(0,Number(command.temp)||0);
  if(same(next,combatant.hp))return false;
  combatant.hp=next;
  return true;
}

function applyCondition(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  const normalized=normalizeCombatant({id:combatant.id,conditions:[command.condition]}).conditions[0];
  const index=combatant.conditions.findIndex(entry=>entry.id===normalized.id);
  if(index>=0&&same(combatant.conditions[index],normalized))return false;
  if(index>=0)combatant.conditions[index]=normalized;else combatant.conditions.push(normalized);
  return true;
}

function removeCondition(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  const before=combatant.conditions.length;
  combatant.conditions=combatant.conditions.filter(entry=>entry.id!==command.conditionId);
  return combatant.conditions.length!==before;
}

function setConcentration(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  const next=command.concentration?clone(command.concentration):null;
  if(same(combatant.concentration,next))return false;
  combatant.concentration=next;
  return true;
}

function updateResource(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  if(!command.resourceId)throw new TypeError('UPDATE_COMBAT_RESOURCE requires resourceId.');
  const previous=combatant.resources[command.resourceId]||{current:0,max:0,label:command.resourceId,recharge:null};
  const max=Math.max(0,Number(command.max??previous.max)||0);
  const next={current:Math.max(0,Math.min(max,Number(command.current??previous.current)||0)),max,label:String(command.label??previous.label),recharge:command.recharge??previous.recharge};
  if(same(previous,next))return false;
  combatant.resources[command.resourceId]=next;
  return true;
}

export function applyCombatTransition(state,command){
  if(command.type===SESSION_COMMANDS.START_COMBAT)return startCombat(state,command);
  if(command.type===SESSION_COMMANDS.END_COMBAT){if(!state.combatState)return false;state.combatState=null;return true;}
  const combat=requireCombat(state);
  switch(command.type){
    case SESSION_COMMANDS.SET_COMBAT_INITIATIVE:return setInitiative(combat,command);
    case SESSION_COMMANDS.ADVANCE_COMBAT_TURN:return advanceTurn(combat);
    case SESSION_COMMANDS.SET_COMBATANT_HP:return setHp(combat,command);
    case SESSION_COMMANDS.APPLY_COMBAT_CONDITION:return applyCondition(combat,command);
    case SESSION_COMMANDS.REMOVE_COMBAT_CONDITION:return removeCondition(combat,command);
    case SESSION_COMMANDS.SET_COMBAT_CONCENTRATION:return setConcentration(combat,command);
    case SESSION_COMMANDS.UPDATE_COMBAT_RESOURCE:return updateResource(combat,command);
    case SESSION_COMMANDS.RESET_COMBATANT_TURN:{
      const combatant=requireCombatant(combat,command.combatantId);const max=combatant.actionEconomy?.movementMax??0;
      const next={...DEFAULT_ACTION_ECONOMY,...combatant.actionEconomy,movementMax:max,movementRemaining:max};
      const changed=!same(combatant.actionEconomy,next);combatant.actionEconomy=next;return changed;
    }
    default:return null;
  }
}
