const finite=value=>value!==null&&value!==''&&Number.isFinite(Number(value));

export const LIVE_COMBAT_MESSAGE=Object.freeze({INITIATIVE:'combat-initiative'});

export function createInitiativeIntent(characterId,initiative){
  try{
    const id=String(characterId??'').trim();
    const value=Number(initiative);
    if(!id)throw new Error('Combat initiative requires a character id.');
    if(!finite(initiative))throw new Error('Combat initiative requires a numeric result.');
    return Object.freeze({type:LIVE_COMBAT_MESSAGE.INITIATIVE,characterId:id,initiative:value});
  }catch(error){console.error('[Living Table] Could not create combat initiative intent.',error);throw error;}
}

export function normalizeInitiativeIntent(value){
  try{
    if(!value||value.type!==LIVE_COMBAT_MESSAGE.INITIATIVE)return null;
    return createInitiativeIntent(value.characterId,value.initiative);
  }catch(error){console.warn('[Living Table] Rejected invalid combat initiative intent.',error);return null;}
}

export function combatantIdForCharacter(combatState,characterId){
  try{
    const match=Object.values(combatState?.combatants||{}).find(entry=>entry.kind==='player'&&entry.cardId===characterId);
    return match?.id||null;
  }catch(error){console.error('[Living Table] Could not resolve player combatant.',error);return null;}
}

export function initiativeIntentMatchesPlayer(intent,player){
  try{
    const normalized=normalizeInitiativeIntent(intent);
    if(!normalized)return false;
    return Boolean(player?.characterId)&&normalized.characterId===player.characterId;
  }catch(error){console.error('[Living Table] Could not validate combat intent ownership.',error);return false;}
}
