const clone=value=>structuredClone(value);
const finite=value=>value!==null&&value!==''&&Number.isFinite(Number(value));
const firstNumber=value=>Number(String(value??'').match(/\d+/)?.[0]??0);

export function monsterMaxHp(stat,partySize=4){
  try{
    const text=String(stat?.dmFace?.hp??'0');
    const scaled=text.match(/(\d+)\s+for four characters;\s*(\d+)\s+for five or six/i);
    if(scaled)return Number(partySize>=5?scaled[2]:scaled[1]);
    return firstNumber(text);
  }catch(error){console.error('[Living Table] Could not read monster HP.',error);throw error;}
}

export function monsterSpeed(stat){
  try{return firstNumber(stat?.dmFace?.speed);}
  catch(error){console.error('[Living Table] Could not read monster Speed.',error);throw error;}
}

function resourceMap(profile){
  return Object.fromEntries((profile?.resources||[]).map(resource=>[
    resource.id,{current:Number(resource.max)||0,max:Number(resource.max)||0,label:resource.name||resource.id,recharge:resource.recharge||null}
  ]));
}

export function buildPlayerCombatant({seat,session,resolveCharacter,resolveProfile}){
  try{
    const character=resolveCharacter(seat.characterId);
    const profile=resolveProfile(character,session.selectedSystem);
    const maxHp=Number(profile?.maxHp??character?.base?.maxHp??1)||1;
    const saved=session.playerState?.characterId===character.id?Number(session.playerState.hp):NaN;
    return {
      id:`player:${seat.seatId}`,kind:'player',name:character.name,cardId:character.id,seatId:seat.seatId,
      initiative:null,speed:Number(profile?.speed??character?.base?.speed??0)||0,
      hp:{current:finite(saved)?Math.max(0,Math.min(maxHp,saved)):maxHp,max:maxHp,temp:0},resources:resourceMap(profile)
    };
  }catch(error){console.error('[Living Table] Could not build player combatant.',error);throw error;}
}

export function buildCombatSetup({session,monsterInstances=[],monsterStats={},resolveCharacter,resolveProfile}){
  try{
    const players=(session.players||[]).map(seat=>buildPlayerCombatant({seat,session,resolveCharacter,resolveProfile}));
    const partySize=Math.max(1,players.length);
    const monsters=monsterInstances.map((instance,index)=>{
      const stat=monsterStats[instance.cardId];
      const maxHp=monsterMaxHp(stat,partySize);
      return {
        id:`monster:${instance.instanceId||`${instance.cardId}-${index+1}`}`,kind:'monster',name:instance.name||instance.cardId,
        cardId:instance.cardId,instanceId:instance.instanceId||null,initiativeGroupId:`group:${instance.cardId}`,
        speed:monsterSpeed(stat),hp:{current:maxHp,max:maxHp,temp:0}
      };
    });
    const combatants=Object.fromEntries([...players,...monsters].map(entry=>[entry.id,entry]));
    const initiativeGroups={};
    for(const monster of monsters){
      const id=monster.initiativeGroupId;
      initiativeGroups[id]||={id,label:monster.name,memberIds:[],initiative:null};
      initiativeGroups[id].memberIds.push(monster.id);
    }
    return {
      encounterId:`scene:${session.currentSceneId||'encounter'}`,edition:session.selectedSystem||'dnd-2014',status:'setup',round:1,
      activeTurnId:null,turnOrder:[],combatants,initiativeGroups,hazards:[],recurringTriggers:[]
    };
  }catch(error){console.error('[Living Table] Could not build combat setup.',error);throw error;}
}

export function initiativeComplete(combat){
  try{
    if(!combat)return false;
    const individuals=Object.values(combat.combatants||{}).filter(entry=>!entry.initiativeGroupId);
    return individuals.length+Object.keys(combat.initiativeGroups||{}).length>0
      && individuals.every(entry=>finite(entry.initiative))
      && Object.values(combat.initiativeGroups||{}).every(group=>finite(group.initiative));
  }catch(error){console.error('[Living Table] Could not evaluate initiative readiness.',error);return false;}
}

export function turnLabel(combat,id){
  try{
    const group=combat?.initiativeGroups?.[id];
    if(group)return `${group.label}${group.memberIds.length>1?` ×${group.memberIds.length}`:''}`;
    return combat?.combatants?.[id]?.name||id||'—';
  }catch(error){console.error('[Living Table] Could not resolve turn label.',error);return id||'—';}
}

export function publicCombatProjection(combat,{visibleMonsterCardIds=[]}={}){
  try{
    if(!combat)return null;
    const visible=new Set(visibleMonsterCardIds);
    const canPublish=entry=>entry.kind==='player'||visible.has(entry.cardId);
    const publishedEntries=Object.values(combat.combatants||{}).filter(canPublish);
    const combatants=Object.fromEntries(publishedEntries.map(entry=>[entry.id,{
      id:entry.id,kind:entry.kind,name:entry.name,cardId:entry.cardId,seatId:entry.seatId??null,
      initiativeGroupId:entry.initiativeGroupId??null,initiative:entry.initiative??null,
      actionEconomy:entry.kind==='player'?clone(entry.actionEconomy||{}):undefined
    }]));
    const initiativeGroups=Object.fromEntries(Object.values(combat.initiativeGroups||{}).map(group=>{
      const memberIds=group.memberIds.filter(id=>Boolean(combatants[id]));
      return memberIds.length?[group.id,{...clone(group),memberIds}]:null;
    }).filter(Boolean));
    const turnOrder=(combat.turnOrder||[]).filter(id=>Boolean(combatants[id]||initiativeGroups[id]));
    const activeTurnId=combatants[combat.activeTurnId]||initiativeGroups[combat.activeTurnId]?combat.activeTurnId:null;
    return {schemaVersion:combat.schemaVersion,encounterId:combat.encounterId,edition:combat.edition,status:combat.status,
      round:combat.round,activeTurnId,turnOrder,combatants,initiativeGroups};
  }catch(error){console.error('[Living Table] Could not project public combat state.',error);throw error;}
}
