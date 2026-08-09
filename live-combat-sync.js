import { dispatchLocalSession, loadLocalSession } from './src/session/local-session-state.js';
import { SESSION_COMMANDS } from './src/session/session-commands.js';
import { validatePlayerActionEconomyIntent } from './src/session/combat-action-intent.js';
import { combatantIdForCharacter, normalizeInitiativeIntent } from './src/session/live-combat-protocol.js';

function applyRemoteInitiative(rawIntent){
  try{
    const intent=normalizeInitiativeIntent(rawIntent);
    if(!intent)throw new Error('Remote initiative payload is invalid.');
    const session=loadLocalSession();
    const combat=session?.combatState;
    if(!combat||combat.status!=='setup')throw new Error('Initiative can only be submitted during combat setup.');
    const combatantId=combatantIdForCharacter(combat,intent.characterId);
    if(!combatantId)throw new Error(`No active player combatant matches ${intent.characterId}.`);
    dispatchLocalSession({type:SESSION_COMMANDS.SET_COMBAT_INITIATIVE,combatantId,initiative:intent.initiative});
    window.dispatchEvent(new CustomEvent('living-table:remote-combat-applied',{detail:{characterId:intent.characterId,initiative:intent.initiative}}));
  }catch(error){console.warn('[Living Table] Remote combat initiative was not applied.',error);}
}

function applyRemoteActionEconomy(rawIntent){
  try{
    const session=loadLocalSession();const combat=session?.combatState;
    const characterId=String(rawIntent?.characterId??'');
    const combatantId=combatantIdForCharacter(combat,characterId);
    if(!combatantId)throw new Error(`No active player combatant matches ${characterId||'the submitted character'}.`);
    const intent=validatePlayerActionEconomyIntent(rawIntent,combat,combatantId);
    dispatchLocalSession({type:SESSION_COMMANDS.UPDATE_COMBAT_ACTION_ECONOMY,combatantId,patch:intent.patch});
    window.dispatchEvent(new CustomEvent('living-table:remote-combat-applied',{detail:{characterId:intent.characterId,actionEconomy:true}}));
  }catch(error){console.warn('[Living Table] Remote action economy update was not applied.',error);}
}

window.addEventListener('living-table:remote-combat-initiative',event=>applyRemoteInitiative(event.detail?.intent));
window.addEventListener('living-table:remote-combat-action-economy',event=>applyRemoteActionEconomy(event.detail?.intent));