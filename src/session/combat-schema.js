export const COMBAT_SCHEMA_VERSION=1;

export const DEFAULT_ACTION_ECONOMY=Object.freeze({
  action:true,
  bonusAction:true,
  reaction:true,
  objectInteraction:true,
  movementMax:0,
  movementRemaining:0,
  readiedAction:null
});

const clone=value=>structuredClone(value);
const numberOr=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
const nullableNumber=value=>value==null||value===''?null:numberOr(value,null);

function normalizeCondition(condition,index){
  const source=condition&&typeof condition==='object'?condition:{name:String(condition||'Condition')};
  return {
    id:String(source.id||`${String(source.name||'condition').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${index+1}`),
    name:String(source.name||'Condition'),
    sourceId:source.sourceId??null,
    duration:source.duration??null,
    endTiming:source.endTiming??null,
    save:source.save??null
  };
}

function normalizeResources(resources={}){
  return Object.fromEntries(Object.entries(resources||{}).map(([id,value])=>{
    const source=value&&typeof value==='object'?value:{};
    const max=Math.max(0,numberOr(source.max,0));
    return [id,{
      current:Math.max(0,Math.min(max,numberOr(source.current,max))),
      max,
      label:String(source.label||id),
      recharge:source.recharge??null
    }];
  }));
}

export function normalizeCombatant(input={}){
  if(!input.id)throw new TypeError('Combatant requires id.');
  const maxHp=Math.max(0,numberOr(input.hp?.max,input.maxHp??0));
  const currentHp=Math.max(0,Math.min(maxHp,numberOr(input.hp?.current,input.currentHp??maxHp)));
  const movementMax=Math.max(0,numberOr(input.actionEconomy?.movementMax,input.speed??0));
  return {
    id:String(input.id),
    kind:String(input.kind||'creature'),
    name:String(input.name||input.id),
    cardId:input.cardId??null,
    instanceId:input.instanceId??null,
    seatId:input.seatId??null,
    initiative:nullableNumber(input.initiative),
    hp:{current:currentHp,max:maxHp,temp:Math.max(0,numberOr(input.hp?.temp,input.tempHp??0))},
    conditions:(input.conditions||[]).map(normalizeCondition),
    concentration:input.concentration?clone(input.concentration):null,
    resources:normalizeResources(input.resources),
    actionEconomy:{
      ...DEFAULT_ACTION_ECONOMY,
      ...clone(input.actionEconomy||{}),
      movementMax,
      movementRemaining:Math.max(0,Math.min(movementMax,numberOr(input.actionEconomy?.movementRemaining,movementMax)))
    },
    deathSaves:{successes:Math.max(0,Math.min(3,numberOr(input.deathSaves?.successes,0))),failures:Math.max(0,Math.min(3,numberOr(input.deathSaves?.failures,0)))}
  };
}

export function normalizeCombatState(input){
  if(input==null)return null;
  const combatants=Object.fromEntries((Array.isArray(input.combatants)?input.combatants:Object.values(input.combatants||{})).map(entry=>{
    const normalized=normalizeCombatant(entry);return [normalized.id,normalized];
  }));
  const turnOrder=[...new Set((input.turnOrder||[]).filter(id=>id in combatants))];
  const activeTurnId=input.activeTurnId&&turnOrder.includes(input.activeTurnId)?input.activeTurnId:(turnOrder[0]||null);
  return {
    schemaVersion:COMBAT_SCHEMA_VERSION,
    encounterId:String(input.encounterId||'encounter'),
    edition:String(input.edition||'dnd-2014'),
    status:String(input.status||'active'),
    round:Math.max(1,numberOr(input.round,1)),
    activeTurnId,
    turnOrder,
    combatants,
    hazards:Array.isArray(input.hazards)?clone(input.hazards):[],
    recurringTriggers:Array.isArray(input.recurringTriggers)?clone(input.recurringTriggers):[]
  };
}
