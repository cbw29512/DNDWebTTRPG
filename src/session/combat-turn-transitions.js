import { SESSION_COMMANDS } from './session-commands.js';
import { DEFAULT_ACTION_ECONOMY } from './combat-schema.js';

const clone=value=>structuredClone(value);
const same=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

function requireCombatant(combat,id){
  const combatant=combat.combatants?.[id];
  if(!combatant)throw new RangeError(`Unknown combatant: ${id}`);
  return combatant;
}

function requireInitiativeGroup(combat,id){
  const group=combat.initiativeGroups?.[id];
  if(!group)throw new RangeError(`Unknown initiative group: ${id}`);
  return group;
}

function initiativeEntries(combat){
  const groups=Object.values(combat.initiativeGroups||{}).filter(group=>group.initiative!=null).map(group=>({id:group.id,initiative:group.initiative}));
  const individuals=Object.values(combat.combatants).filter(entry=>!entry.initiativeGroupId&&entry.initiative!=null).map(entry=>({id:entry.id,initiative:entry.initiative}));
  return [...groups,...individuals];
}

function sortedTurnOrder(combat){
  const previous=new Map((combat.turnOrder||[]).map((id,index)=>[id,index]));
  return initiativeEntries(combat).sort((a,b)=>{
    const initiative=b.initiative-a.initiative;
    if(initiative)return initiative;
    return (previous.get(a.id)??Number.MAX_SAFE_INTEGER)-(previous.get(b.id)??Number.MAX_SAFE_INTEGER);
  }).map(entry=>entry.id);
}

function resetTurn(combatant){
  const movementMax=combatant.actionEconomy?.movementMax??0;
  combatant.actionEconomy={
    ...DEFAULT_ACTION_ECONOMY,...combatant.actionEconomy,
    action:true,bonusAction:true,reaction:true,objectInteraction:true,
    movementMax,movementRemaining:movementMax,readiedAction:null
  };
}

function resetTurnEntry(combat,id){
  const group=combat.initiativeGroups?.[id];
  if(group){
    for(const memberId of group.memberIds)resetTurn(requireCombatant(combat,memberId));
    return;
  }
  resetTurn(requireCombatant(combat,id));
}

function setInitiative(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  if(combatant.initiativeGroupId)throw new Error(`${combatant.name} uses grouped initiative (${combatant.initiativeGroupId}).`);
  const initiative=Number(command.initiative);
  if(!Number.isFinite(initiative))throw new TypeError('SET_COMBAT_INITIATIVE requires numeric initiative.');
  if(combatant.initiative===initiative)return false;
  combatant.initiative=initiative;
  combat.turnOrder=sortedTurnOrder(combat);
  if(combat.status==='setup')combat.activeTurnId=null;
  return true;
}

function setGroupInitiative(combat,command){
  const group=requireInitiativeGroup(combat,command.groupId);
  const initiative=Number(command.initiative);
  if(!Number.isFinite(initiative))throw new TypeError('SET_COMBAT_GROUP_INITIATIVE requires numeric initiative.');
  if(group.initiative===initiative)return false;
  group.initiative=initiative;
  combat.turnOrder=sortedTurnOrder(combat);
  if(combat.status==='setup')combat.activeTurnId=null;
  return true;
}

function beginRounds(combat){
  combat.turnOrder=sortedTurnOrder(combat);
  if(!combat.turnOrder.length)throw new Error('Cannot begin combat rounds without initiative results.');
  const active=combat.turnOrder[0];
  const changed=combat.status!=='active'||combat.round!==1||combat.activeTurnId!==active;
  combat.status='active';combat.round=1;combat.activeTurnId=active;
  resetTurnEntry(combat,active);
  return changed;
}

function advanceTurn(combat){
  if(combat.status!=='active')throw new Error('Combat rounds have not begun.');
  if(!combat.turnOrder.length)return false;
  const current=Math.max(0,combat.turnOrder.indexOf(combat.activeTurnId));
  const next=(current+1)%combat.turnOrder.length;
  if(next===0)combat.round+=1;
  combat.activeTurnId=combat.turnOrder[next];
  resetTurnEntry(combat,combat.activeTurnId);
  return true;
}

function updateActionEconomy(combat,command){
  const combatant=requireCombatant(combat,command.combatantId);
  const previous=clone(combatant.actionEconomy);
  const patch=command.patch&&typeof command.patch==='object'?clone(command.patch):{};
  const movementMax=Math.max(0,Number(patch.movementMax??previous.movementMax)||0);
  const movementRemaining=Math.max(0,Math.min(movementMax,Number(patch.movementRemaining??previous.movementRemaining)||0));
  combatant.actionEconomy={...previous,...patch,movementMax,movementRemaining};
  return !same(previous,combatant.actionEconomy);
}

export function applyCombatTurnTransition(combat,command){
  switch(command.type){
    case SESSION_COMMANDS.SET_COMBAT_INITIATIVE:return setInitiative(combat,command);
    case SESSION_COMMANDS.SET_COMBAT_GROUP_INITIATIVE:return setGroupInitiative(combat,command);
    case SESSION_COMMANDS.BEGIN_COMBAT_ROUNDS:return beginRounds(combat);
    case SESSION_COMMANDS.ADVANCE_COMBAT_TURN:return advanceTurn(combat);
    case SESSION_COMMANDS.UPDATE_COMBAT_ACTION_ECONOMY:return updateActionEconomy(combat,command);
    case SESSION_COMMANDS.RESET_COMBATANT_TURN:{
      const combatant=requireCombatant(combat,command.combatantId);const previous=clone(combatant.actionEconomy);resetTurn(combatant);return !same(previous,combatant.actionEconomy);
    }
    default:return null;
  }
}