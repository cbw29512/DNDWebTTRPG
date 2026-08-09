import { dispatchLocalSession, loadLocalSession } from './src/session/local-session-state.js';
import { SESSION_COMMANDS } from './src/session/session-commands.js';
import { buildCombatSetup } from './src/session/combat-party-model.js';
import { createInitiativeIntent } from './src/session/live-combat-protocol.js';
import { getCharacterCard, getCharacterProfile, resolveRequestedCharacter } from './src/player/character-cards.js';
import { wishingCakeMonsterStats } from './src/wishing-cake-monster-stats.js';
import { rollD20 } from './src/dnd/rules-engine.js';
import { renderCombatPanel } from './combat-rounds-view.js';

const isDM=document.querySelector('meta[name="living-table-role"]')?.content==='dm';
let message='';let scheduled=false;let lastPanel=null;let lastRenderKey='';

function monsterInstances(){
  try{
    const seen=new Set();const result=[];
    document.querySelectorAll('#app .slot-monster [data-card-instance][data-card-id]').forEach(card=>{
      if(seen.has(card.dataset.cardInstance))return;seen.add(card.dataset.cardInstance);
      result.push({instanceId:card.dataset.cardInstance,cardId:card.dataset.cardId,name:card.querySelector('h3')?.textContent?.trim()||card.dataset.cardId});
    });
    return result;
  }catch(error){console.error('[Living Table] Could not collect monster combatants.',error);return [];}
}

function currentSession(){return loadLocalSession();}
function send(command){
  try{const result=dispatchLocalSession(command);message='Combat state saved.';schedule();return result.state;}
  catch(error){console.error(`[Living Table] Combat command ${command?.type||'unknown'} failed.`,error);message=error?.message||'Combat command failed.';schedule();return null;}
}

function ensureCombat(){
  const session=currentSession();if(!session)throw new Error('Load an adventure before starting combat.');
  if(session.combatState)return session.combatState;
  const setup=buildCombatSetup({session,monsterInstances:monsterInstances(),monsterStats:wishingCakeMonsterStats,resolveCharacter:getCharacterCard,resolveProfile:getCharacterProfile});
  return send({type:SESSION_COMMANDS.START_COMBAT,combatState:setup})?.combatState||null;
}

function setPlayerInitiative(combatantId,value){
  const numeric=Number(value);if(!Number.isFinite(numeric)){message='Enter a numeric initiative result.';schedule();return;}
  send({type:SESSION_COMMANDS.SET_COMBAT_INITIATIVE,combatantId,initiative:numeric});
}

function render(){
  scheduled=false;
  try{
    const panel=document.querySelector('#app .turn-panel');if(!panel)return;
    const session=currentSession();const own=resolveRequestedCharacter().id;const combat=session?.combatState||null;
    const renderKey=JSON.stringify({combat,isDM,own,message});
    if(panel===lastPanel&&renderKey===lastRenderKey)return;
    panel.innerHTML=renderCombatPanel({combat,isDM,ownCharacterId:own,message});
    lastPanel=panel;lastRenderKey=renderKey;
  }catch(error){console.error('[Living Table] Could not hydrate combat-round controls.',error);}
}
function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(render);}

function handleClick(event){
  const button=event.target.closest('[data-combat-start],[data-combat-begin],[data-combat-next],[data-combat-end],[data-player-init-set],[data-player-init-roll]');
  if(!button)return;
  try{
    if(button.dataset.combatStart!==undefined&&isDM){ensureCombat();return;}
    if(button.dataset.combatBegin!==undefined&&isDM){send({type:SESSION_COMMANDS.BEGIN_COMBAT_ROUNDS});return;}
    if(button.dataset.combatNext!==undefined&&isDM){send({type:SESSION_COMMANDS.ADVANCE_COMBAT_TURN});return;}
    if(button.dataset.combatEnd!==undefined&&isDM){send({type:SESSION_COMMANDS.END_COMBAT});message='Combat ended.';return;}
    const id=button.dataset.playerInitSet||button.dataset.playerInitRoll;if(!id)return;
    if(button.dataset.playerInitSet){const input=document.querySelector(`[data-player-init-input="${CSS.escape(id)}"]`);setPlayerInitiative(id,input?.value);return;}
    const session=currentSession();const player=session?.combatState?.combatants?.[id];
    const profile=getCharacterProfile(getCharacterCard(player?.cardId),session?.selectedSystem);
    const result=rollD20(Number(profile?.initiative?.modifier)||0,{advantage:Boolean(profile?.initiative?.advantage)});
    if(isDM)setPlayerInitiative(id,result.total);
    else{
      const intent=createInitiativeIntent(player?.cardId,result.total);
      message=`Initiative ${result.total} rolled. Sending to the DM…`;schedule();
      window.dispatchEvent(new CustomEvent('living-table:combat-initiative-intent',{detail:{intent}}));
    }
  }catch(error){console.error('[Living Table] Combat-round control failed.',error);message=error?.message||'Combat control failed.';schedule();}
}

document.addEventListener('click',handleClick,true);
window.addEventListener('living-table:rules-initiative',event=>{
  if(!isDM)return;
  try{
    const combat=ensureCombat();if(combat?.status!=='setup')return;
    const group=Object.values(combat.initiativeGroups||{}).find(entry=>entry.memberIds.some(id=>combat.combatants[id]?.cardId===event.detail?.cardId));
    if(group)send({type:SESSION_COMMANDS.SET_COMBAT_GROUP_INITIATIVE,groupId:group.id,initiative:Number(event.detail.initiative)});
  }catch(error){console.error('[Living Table] Could not persist grouped initiative.',error);message=error?.message||'Monster initiative could not be saved.';schedule();}
});
window.addEventListener('living-table:combat-initiative-status',event=>{if(!isDM){message=event.detail?.message||message;schedule();}});
window.addEventListener('living-table:session-updated',schedule);
const app=document.querySelector('#app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
window.addEventListener('DOMContentLoaded',schedule);schedule();