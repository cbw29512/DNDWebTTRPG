import { SESSION_COMMANDS } from './session-commands.js';
import { normalizeCombatant } from './combat-schema.js';

const clone=value=>structuredClone(value);
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

function requireCombatant(combat,id){
  const combatant=combat.combatants?.[id];
  if(!combatant)throw new RangeError(`Unknown combatant: ${id}`);
  return combatant;
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
  if(!command.condition)throw new TypeError('APPLY_COMBAT_CONDITION requires condition.');
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
  const next={
    current:Math.max(0,Math.min(max,Number(command.current??previous.current)||0)),
    max,label:String(command.label??previous.label),recharge:command.recharge??previous.recharge
  };
  if(same(previous,next))return false;
  combatant.resources[command.resourceId]=next;
  return true;
}

function setDeathSaves(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  const next={
    successes:Math.max(0,Math.min(3,Number(command.successes??combatant.deathSaves.successes)||0)),
    failures:Math.max(0,Math.min(3,Number(command.failures??combatant.deathSaves.failures)||0))
  };
  if(same(next,combatant.deathSaves))return false;
  combatant.deathSaves=next;
  return true;
}

export function applyCombatantTransition(combat,command){
  switch(command.type){
    case SESSION_COMMANDS.SET_COMBATANT_HP:return setHp(combat,command);
    case SESSION_COMMANDS.APPLY_COMBAT_CONDITION:return applyCondition(combat,command);
    case SESSION_COMMANDS.REMOVE_COMBAT_CONDITION:return removeCondition(combat,command);
    case SESSION_COMMANDS.SET_COMBAT_CONCENTRATION:return setConcentration(combat,command);
    case SESSION_COMMANDS.UPDATE_COMBAT_RESOURCE:return updateResource(combat,command);
    case SESSION_COMMANDS.SET_COMBAT_DEATH_SAVES:return setDeathSaves(combat,command);
    default:return null;
  }
}
