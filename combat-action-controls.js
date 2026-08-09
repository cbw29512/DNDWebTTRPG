import { loadLocalSession, dispatchLocalSession } from './src/session/local-session-state.js';
import { SESSION_COMMANDS } from './src/session/session-commands.js';
import { createActionEconomyIntent } from './src/session/combat-action-intent.js';

const isDM=document.querySelector('meta[name="living-table-role"]')?.content==='dm';

function status(message){
  try{const node=document.querySelector('[data-combat-action-status]');if(node)node.textContent=message;}
  catch(error){console.error('[Living Table] Could not update combat action status.',error);}
}

function combatant(id){
  const entry=loadLocalSession()?.combatState?.combatants?.[id];
  if(!entry)throw new RangeError(`Unknown combatant: ${id}`);
  return entry;
}

function applyPatch(id,patch){
  try{
    if(isDM){
      dispatchLocalSession({type:SESSION_COMMANDS.UPDATE_COMBAT_ACTION_ECONOMY,combatantId:id,patch});
      status('Turn resources updated.');return;
    }
    const entry=combatant(id);
    const intent=createActionEconomyIntent(entry.cardId,patch);
    window.dispatchEvent(new CustomEvent('living-table:combat-action-intent',{detail:{intent}}));
    status('Sending turn update to the DM…');
  }catch(error){console.error('[Living Table] Could not update action economy.',error);status(error?.message||'Turn resource update failed.');}
}

function spend(button){
  const key=button.dataset.combatSpend;const id=button.dataset.combatantId;
  if(!key||!id)return;applyPatch(id,{[key]:false});
}

function move(button){
  const id=button.dataset.combatantId;const amount=Math.max(0,Number(button.dataset.combatMove)||0);
  if(!id||!amount)return;
  try{const remaining=Math.max(0,Number(combatant(id).actionEconomy?.movementRemaining||0)-amount);applyPatch(id,{movementRemaining:remaining});}
  catch(error){console.error('[Living Table] Could not spend movement.',error);status(error?.message||'Movement update failed.');}
}

function triggerReady(button){applyPatch(button.dataset.combatantId,{reaction:false,readiedAction:null});}
function dropReady(button){applyPatch(button.dataset.combatantId,{readiedAction:null});}

function resetBudget(button){
  if(!isDM)return;
  try{dispatchLocalSession({type:SESSION_COMMANDS.RESET_COMBATANT_TURN,combatantId:button.dataset.combatantId});status('Turn budget reset by the DM.');}
  catch(error){console.error('[Living Table] Could not reset turn budget.',error);status(error?.message||'Reset failed.');}
}

function handleClick(event){
  const button=event.target.closest('[data-combat-spend],[data-combat-move],[data-combat-trigger-ready],[data-combat-drop-ready],[data-combat-reset-turn]');
  if(!button)return;
  try{
    if(button.dataset.combatSpend)spend(button);
    else if(button.dataset.combatMove)move(button);
    else if(button.dataset.combatTriggerReady!==undefined)triggerReady(button);
    else if(button.dataset.combatDropReady!==undefined)dropReady(button);
    else if(button.dataset.combatResetTurn!==undefined)resetBudget(button);
  }catch(error){console.error('[Living Table] Combat action click failed.',error);status(error?.message||'Combat action failed.');}
}

function handleReadySubmit(event){
  const form=event.target.closest('[data-combat-ready-form]');if(!form)return;
  event.preventDefault();
  try{
    const data=new FormData(form);
    const readiedAction={trigger:String(data.get('readyTrigger')||'').trim(),response:String(data.get('readyResponse')||'').trim()};
    applyPatch(form.dataset.combatantId,{action:false,readiedAction});
  }catch(error){console.error('[Living Table] Could not ready action.',error);status(error?.message||'Ready action failed.');}
}

document.addEventListener('click',handleClick,true);
document.addEventListener('submit',handleReadySubmit,true);
window.addEventListener('living-table:combat-action-status',event=>status(event.detail?.message||''));
