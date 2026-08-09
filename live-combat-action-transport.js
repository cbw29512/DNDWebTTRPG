import { normalizeActionEconomyIntent } from './src/session/combat-action-intent.js';

const isDM=document.querySelector('meta[name="living-table-role"]')?.content==='dm';

function report(message,ok=false){
  try{window.dispatchEvent(new CustomEvent('living-table:combat-action-status',{detail:{message,ok}}));}
  catch(error){console.error('[Living Table] Could not report combat action transport status.',error);}
}

function sendPlayerIntent(rawIntent){
  try{
    if(isDM)return;
    const intent=normalizeActionEconomyIntent(rawIntent);
    if(!intent)throw new TypeError('Action economy update is invalid.');
    const transport=window.LivingTableLiveTransport;
    if(!transport?.sendToHost?.({type:'combat-intent',intent})){
      report('Turn update was not sent because you are not connected to the DM.');return;
    }
    report('Turn update sent to the DM.',true);
  }catch(error){console.error('[Living Table] Could not send combat action intent.',error);report(error?.message||'Turn update could not be sent.');}
}

function routeHostIntent(detail){
  try{
    if(!isDM)return;
    const intent=normalizeActionEconomyIntent(detail?.intent);
    if(!intent)return;
    const claimedCharacter=String(detail?.player?.characterId??'');
    if(!claimedCharacter||intent.characterId!==claimedCharacter)throw new Error('Combat action intent does not match the connected player identity.');
    window.dispatchEvent(new CustomEvent('living-table:remote-combat-action-economy',{detail:{intent,peer:detail?.peer||null}}));
  }catch(error){console.warn('[Living Table] Rejected live combat action intent.',error);}
}

window.addEventListener('living-table:combat-action-intent',event=>sendPlayerIntent(event.detail?.intent));
window.addEventListener('living-table:live-combat-extension-intent',event=>routeHostIntent(event.detail));
