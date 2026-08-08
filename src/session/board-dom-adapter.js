import { LIVE_BOARD_SLOT_IDS, normalizeBoard } from './session-schema.js';

const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function uniqueInstances(slot){
  try{
    const byId=new Map();
    slot?.querySelectorAll('[data-card-instance]').forEach(card=>{
      if(!byId.has(card.dataset.cardInstance))byId.set(card.dataset.cardInstance,card.dataset.cardId);
    });
    return [...byId].map(([instanceId,cardId])=>({instanceId,cardId}));
  }catch(error){
    console.error('[Living Table] Could not read card instances from the board.',error);
    throw error;
  }
}

export function readBoardFromDom(root=document){
  try{
    return Object.fromEntries(LIVE_BOARD_SLOT_IDS.map(slotId=>{
      const slot=root.querySelector(`[data-slot="${slotId}"]`);
      return [slotId,uniqueInstances(slot).map(instance=>instance.cardId)];
    }));
  }catch(error){
    console.error('[Living Table] Could not read live board state.',error);
    throw error;
  }
}

async function openStack(slot){
  try{
    const toggle=slot?.querySelector('.stack-toggle[aria-expanded="false"]');
    if(toggle){toggle.click();await delay(40);}
  }catch(error){
    console.error('[Living Table] Could not open board stack.',error);
    throw error;
  }
}

async function removeOne(slotId,instanceId){
  try{
    let slot=document.querySelector(`[data-slot="${slotId}"]`);
    if(!slot)return false;
    await openStack(slot);
    slot=document.querySelector(`[data-slot="${slotId}"]`);
    const button=slot?.querySelector(`[data-remove-instance="${CSS.escape(instanceId)}"]`);
    if(!button)return false;
    button.click();
    await delay(45);
    return true;
  }catch(error){
    console.error(`[Living Table] Could not remove ${instanceId} from ${slotId}.`,error);
    throw error;
  }
}

async function addOne(slotId,cardId){
  try{
    const add=document.querySelector(`[data-open-picker="${slotId}"]`);
    if(!add)return false;
    add.click();
    await delay(35);
    const option=document.querySelector(`[data-place-slot="${slotId}"][data-place-card="${CSS.escape(cardId)}"]`);
    if(!option){document.querySelector('[data-close-picker]')?.click();return false;}
    option.click();
    await delay(45);
    return true;
  }catch(error){
    console.error(`[Living Table] Could not add ${cardId} to ${slotId}.`,error);
    throw error;
  }
}

export async function reconcileBoard(targetBoard,{onProgress=()=>{}}={}){
  try{
    const normalizedTarget=normalizeBoard(targetBoard);
    for(const slotId of LIVE_BOARD_SLOT_IDS){
      const desired=[...normalizedTarget[slotId]];
      let slot=document.querySelector(`[data-slot="${slotId}"]`);
      if(!slot)continue;
      await openStack(slot);
      const existing=uniqueInstances(document.querySelector(`[data-slot="${slotId}"]`));
      const remaining=[...desired];
      const removals=[];
      existing.forEach(instance=>{
        const match=remaining.indexOf(instance.cardId);
        if(match>=0)remaining.splice(match,1);else removals.push(instance);
      });
      for(const instance of removals){
        onProgress(`Removing ${instance.cardId} from ${slotId}`);
        await removeOne(slotId,instance.instanceId);
      }
      for(const cardId of remaining){
        onProgress(`Adding ${cardId} to ${slotId}`);
        await addOne(slotId,cardId);
      }
    }
    return readBoardFromDom();
  }catch(error){
    console.error('[Living Table] Board reconciliation failed.',error);
    throw error;
  }
}