import { loadLocalSession, saveLocalSession, dispatchLocalSession } from './local-session.js';
import { SESSION_COMMANDS } from './src/session/session-commands.js';
import { boardForScene, findScene, questStateForScene, sceneList, uniqueIds } from './src/session/scene-model.js';
import { isDungeonMaster } from './src/role-context.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
const sceneLabel=scene=>`${scene.order}. ${scene.title}`;
const breadcrumb=scene=>[scene.locationTitle,scene.siteTitle,scene.roomTitle].filter(Boolean).map(esc).join(' → ');

function sceneControlsMarkup(manifest,activeId){
  const scenes=sceneList(manifest);
  const activeIndex=Math.max(0,scenes.findIndex(scene=>scene.id===activeId));
  const active=scenes[activeIndex]||scenes[0];
  if(!active)return '';
  const exits=(active.exits||[]).map(exit=>{
    const target=findScene(exit.sceneId,manifest);
    return target?`<button type="button" data-load-scene="${esc(target.id)}">${esc(exit.label||target.title)}</button>`:'';
  }).join('');
  return `<section class="scene-runtime" aria-labelledby="scene-runtime-title">
    <div class="scene-runtime-heading"><div><small>DM ADVENTURE CONTROL</small><h2 id="scene-runtime-title">${esc(manifest.title)}</h2><p class="scene-breadcrumb">${breadcrumb(active)}</p><p><strong>Current scene:</strong> ${esc(active.title)}</p></div><div class="scene-runtime-progress">Scene ${activeIndex+1} of ${scenes.length}</div></div>
    <label>Current scene<select data-scene-select>${scenes.map(scene=>`<option value="${esc(scene.id)}" ${scene.id===active.id?'selected':''}>${esc(sceneLabel(scene))}</option>`).join('')}</select></label>
    <div class="scene-runtime-actions"><button type="button" data-scene-previous ${activeIndex<1?'disabled':''}>← Previous</button><button type="button" data-scene-load>Load Scene</button><button type="button" data-scene-next ${activeIndex>=scenes.length-1?'disabled':''}>Next →</button></div>
    ${exits?`<div class="scene-runtime-exits"><small>CONNECTED PATHS</small>${exits}</div>`:''}
    <p data-scene-status aria-live="polite">Location, Site, and Area describe where the party is. The active Scene is carried by the Area card and saved separately from the live board.</p>
  </section>`;
}

let loading=false;

async function loadScene(sceneId,manifest=window.__DND_ADVENTURE_PACK__){
  if(!isDungeonMaster||loading)return false;
  const scene=findScene(sceneId,manifest);
  const api=window.LivingTableLocalSession;
  if(!scene||!api?.reconcileSessionBoard)return false;
  loading=true;
  const status=document.querySelector('[data-scene-status]');
  if(status)status.textContent=`Preparing ${[scene.locationTitle,scene.siteTitle,scene.roomTitle,scene.title].filter(Boolean).join(' / ')}…`;
  try{
    const actual=await api.reconcileSessionBoard(boardForScene(scene,manifest),{
      onProgress:text=>{const node=document.querySelector('[data-scene-status]');if(node)node.textContent=text;}
    });
    const session=loadLocalSession()||saveLocalSession(api.createLocalSession(manifest,manifest.selectedSystem));
    const history=[...(session.roomHistory||[])];
    if(session.currentRoomId&&history.at(-1)!==session.currentRoomId)history.push(session.currentRoomId);
    const quests=questStateForScene(session,scene,manifest);
    dispatchLocalSession({
      type:SESSION_COMMANDS.LOAD_SCENE,
      sceneId:scene.id,locationId:scene.locationId,siteId:scene.siteId,roomId:scene.roomId,sceneCardId:scene.sceneCardId,
      board:actual,quests:quests.quests,questState:quests.questState,roomHistory:history,
      discoveredScenes:uniqueIds([...(session.discoveredScenes||[]),scene.id]),status:'in-progress',
      activatedQuestIds:structuredClone(scene.questIds||[])
    });
    renderSceneRuntime();
    const nextStatus=document.querySelector('[data-scene-status]');
    if(nextStatus)nextStatus.textContent=`${scene.roomTitle}: ${scene.title} is active. Area context, quests, and the exact adventure state are saved; hidden information remains absent from player projections until revealed.`;
    window.dispatchEvent(new CustomEvent('living-table:scene-loaded',{detail:{scene,board:actual}}));
    return true;
  }catch(error){
    console.error(`[Living Table] Could not load scene ${scene?.id||sceneId}.`,error);
    const failure=document.querySelector('[data-scene-status]');
    if(failure)failure.textContent=`Could not load ${scene.title}. ${error?.message||'The current board was left unchanged.'}`;
    return false;
  }finally{loading=false;}
}

function bindSceneRuntime(root,manifest){
  if(!root||!isDungeonMaster)return;
  const select=root.querySelector('[data-scene-select]');
  root.querySelector('[data-scene-load]')?.addEventListener('click',()=>loadScene(select.value,manifest));
  root.querySelector('[data-scene-previous]')?.addEventListener('click',()=>{
    const scenes=sceneList(manifest);const index=scenes.findIndex(scene=>scene.id===select.value);if(index>0)loadScene(scenes[index-1].id,manifest);
  });
  root.querySelector('[data-scene-next]')?.addEventListener('click',()=>{
    const scenes=sceneList(manifest);const index=scenes.findIndex(scene=>scene.id===select.value);if(index>=0&&index<scenes.length-1)loadScene(scenes[index+1].id,manifest);
  });
  root.querySelectorAll('[data-load-scene]').forEach(button=>button.addEventListener('click',()=>loadScene(button.dataset.loadScene,manifest)));
}

export function renderSceneRuntime(){
  if(!isDungeonMaster){document.querySelector('.scene-runtime')?.remove();return;}
  const manifest=window.__DND_ADVENTURE_PACK__;
  if(!sceneList(manifest).length)return;
  document.querySelector('.scene-runtime')?.remove();
  const session=loadLocalSession();
  const wrapper=document.createElement('div');
  wrapper.innerHTML=sceneControlsMarkup(manifest,session?.currentSceneId||manifest.entrySceneId);
  const toolbar=document.querySelector('.local-session-bar');
  (toolbar?.parentNode||document.body).insertBefore(wrapper.firstElementChild,toolbar?.nextSibling||document.body.firstChild);
  bindSceneRuntime(document.querySelector('.scene-runtime'),manifest);
}

if(isDungeonMaster){
  window.addEventListener('living-table:session-updated',renderSceneRuntime);
  window.addEventListener('dnd:adventure-loaded',()=>setTimeout(renderSceneRuntime,120));
  window.addEventListener('DOMContentLoaded',renderSceneRuntime);
}
window.LivingTableScenes=Object.freeze({sceneList,findScene,boardForScene,questStateForScene,loadScene,renderSceneRuntime});
renderSceneRuntime();