export const COMBAT_ACTION_INTENT='combat-action-economy';
export const READY_ACTION_MAX_TEXT=180;

const BOOLEAN_COSTS=Object.freeze(['action','bonusAction','reaction','objectInteraction']);
const TURN_ONLY_COSTS=new Set(['action','bonusAction','objectInteraction','movementRemaining']);
const finite=value=>value!==null&&value!==''&&Number.isFinite(Number(value));
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);

function normalizeReady(value){
  if(value===null)return null;
  if(!value||typeof value!=='object')throw new TypeError('Readied action must include a trigger and response.');
  const trigger=String(value.trigger??'').trim();
  const response=String(value.response??'').trim();
  if(!trigger||!response)throw new TypeError('Readied action requires both trigger and response.');
  if(trigger.length>READY_ACTION_MAX_TEXT||response.length>READY_ACTION_MAX_TEXT)throw new RangeError(`Ready text is limited to ${READY_ACTION_MAX_TEXT} characters per field.`);
  return Object.freeze({kind:'action',trigger,response});
}

export function createActionEconomyIntent(characterId,patch){
  try{
    const id=String(characterId??'').trim();
    if(!id)throw new TypeError('Action economy intent requires a character id.');
    if(!patch||typeof patch!=='object'||Array.isArray(patch))throw new TypeError('Action economy intent requires a patch object.');
    const allowed=new Set([...BOOLEAN_COSTS,'movementRemaining','readiedAction']);
    const unknown=Object.keys(patch).filter(key=>!allowed.has(key));
    if(unknown.length)throw new TypeError(`Unsupported action economy field: ${unknown[0]}.`);
    const next={};
    for(const key of BOOLEAN_COSTS){
      if(!own(patch,key))continue;
      if(patch[key]!==false)throw new TypeError(`Players may only spend ${key}, not restore it.`);
      next[key]=false;
    }
    if(own(patch,'movementRemaining')){
      if(!finite(patch.movementRemaining)||Number(patch.movementRemaining)<0)throw new TypeError('Movement remaining must be a non-negative number.');
      next.movementRemaining=Number(patch.movementRemaining);
    }
    if(own(patch,'readiedAction'))next.readiedAction=normalizeReady(patch.readiedAction);
    if(!Object.keys(next).length)throw new TypeError('Action economy intent cannot be empty.');
    return Object.freeze({type:COMBAT_ACTION_INTENT,characterId:id,patch:Object.freeze(next)});
  }catch(error){console.error('[Living Table] Could not create action economy intent.',error);throw error;}
}

export function normalizeActionEconomyIntent(value){
  try{
    if(!value||value.type!==COMBAT_ACTION_INTENT)return null;
    return createActionEconomyIntent(value.characterId,value.patch);
  }catch(error){console.warn('[Living Table] Rejected invalid action economy intent.',error);return null;}
}

export function validatePlayerActionEconomyIntent(intent,combat,combatantId){
  try{
    const normalized=normalizeActionEconomyIntent(intent);
    if(!normalized)throw new TypeError('Action economy intent is invalid.');
    if(combat?.status!=='active')throw new Error('Action economy can only be spent during active combat.');
    const combatant=combat?.combatants?.[combatantId];
    if(!combatant||combatant.kind!=='player')throw new RangeError('Action economy intent must target an active player combatant.');
    const current=combatant.actionEconomy||{};
    const ownTurn=combat.activeTurnId===combatantId;
    for(const key of TURN_ONLY_COSTS){
      if(own(normalized.patch,key)&&!ownTurn)throw new Error(`${key} can only be spent on your turn.`);
    }
    for(const key of BOOLEAN_COSTS){
      if(own(normalized.patch,key)&&current[key]!==true)throw new Error(`${key} is already spent.`);
    }
    if(own(normalized.patch,'movementRemaining')&&normalized.patch.movementRemaining>Number(current.movementRemaining??0))throw new Error('Players cannot restore movement with a combat intent.');
    if(own(normalized.patch,'readiedAction')&&normalized.patch.readiedAction){
      if(!ownTurn)throw new Error('Ready can only be declared on your turn.');
      if(current.action!==true||current.reaction!==true)throw new Error('Ready requires an available Action and Reaction.');
      if(normalized.patch.action!==false)throw new Error('Ready must spend the Action when declared.');
    }
    return normalized;
  }catch(error){console.warn('[Living Table] Rejected action economy mutation.',error);throw error;}
}
