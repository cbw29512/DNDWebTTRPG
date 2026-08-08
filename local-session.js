import { activateCharacterCard } from './src/player/character-cards.js';
import { SESSION_COMMANDS } from './src/session/session-commands.js';
import { LIVE_BOARD_SLOT_IDS } from './src/session/session-schema.js';
import {
  LOCAL_SESSION_KEY, activeManifestScene, createLocalSession, loadLocalSession,
  saveLocalSession, dispatchLocalSession, clearLocalSession
} from './src/session/local-session-state.js';
import { readBoardFromDom, reconcileBoard } from './src/session/board-dom-adapter.js';

export {
  LOCAL_SESSION_KEY, LIVE_BOARD_SLOT_IDS, createLocalSession, loadLocalSession,
  saveLocalSession, dispatchLocalSession, clearLocalSession, readBoardFromDom, reconcileBoard
};

const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let applying=false;
let saveTimer;

function sceneBreadcrumb(session,manifest=window.__DND_ADVENTURE_PACK__){
  const active=activeManifestScene(session,manifest);
  return [active?.locationTitle||session?.currentLocationId,active?.siteTitle||session?.currentSiteId,active?.roomTitle||session?.currentRoomId,active?.title||session?.currentSceneId].filter(Boolean).join(' → ');
}

function toolbarMarkup(session){
  const breadcrumb=session?sceneBreadcrumb(session):'';
  return `<section class="local-session-bar" aria-label="Local adventure session">
    <div><small>LOCAL SESSION</small><strong>${session?.title||'No adventure prepared'}</strong><span>${session?`${session.version} · ${session.selectedSystem} · ${session.status}`:'Load an Adventure Master Card to begin.'}</span>${breadcrumb?`<small>${breadcrumb}</small>`:''}</div>
    <p data-session-message aria-live="polite"></p>
    <div class="local-session-actions"><button type="button" data-session-save ${session?'':'disabled'}>Save</button><button type="button" data-session-restore ${session?'':'disabled'}>Restore Opening Board</button><button type="button" data-session-reset ${session?'':'disabled'}>Reset Session</button></div>
  </section>`;
}

function message(text){const node=document.querySelector('[data-session-message]');if(node)node.textContent=text;}
function renderToolbar(){
  try{
    document.querySelector('.local-session-bar')?.remove();
    const wrapper=document.createElement('div');wrapper.innerHTML=toolbarMarkup(loadLocalSession());
    document.body.insertBefore(wrapper.firstElementChild,document.querySelector('.library-hub')||document.body.firstChild);bindToolbar();
  }catch(error){console.error('[Living Table] Could not render local session toolbar.',error);}
}
function syncBoardCommand(board){return dispatchLocalSession({type:SESSION_COMMANDS.REPLACE_BOARD,board});}

export async function reconcileSessionBoard(targetBoard,options={}){
  if(applying)throw new Error('A board reconciliation transaction is already active.');
  applying=true;
  try{return await reconcileBoard(targetBoard,options);}
  catch(error){console.error('[Living Table] Guarded board reconciliation failed.',error);throw error;}
  finally{applying=false;}
}

export async function applySessionBoard(session,targetBoard=session.board,finalStatus=session.status){
  if(!session||applying)return false;
  message('Restoring the exact Location, Site, Area, active Scene context, and cards…');
  try{
    activateCharacterCard(session.players?.[0]?.characterId||'wendy-birthday-hero');
    const actual=await reconcileSessionBoard(targetBoard,{onProgress:message});
    syncBoardCommand(actual);dispatchLocalSession({type:SESSION_COMMANDS.SET_STATUS,status:finalStatus||'ready'});
    renderToolbar();message('Location, Site, Area, Scene context, cards, quests, edition, and character state are saved locally.');return true;
  }catch(error){console.error('[Living Table] Could not apply saved board state.',error);message(`Could not restore the saved board. ${error?.message||''}`.trim());return false;}
}

function bindToolbar(){
  document.querySelector('[data-session-save]')?.addEventListener('click',()=>{
    try{if(!loadLocalSession())return;syncBoardCommand(readBoardFromDom());dispatchLocalSession({type:SESSION_COMMANDS.SET_STATUS,status:'in-progress'});renderToolbar();message('Session saved in this browser.');}
    catch(error){console.error('[Living Table] Manual session save failed.',error);message('Session save failed.');}
  });
  document.querySelector('[data-session-restore]')?.addEventListener('click',async()=>{const session=loadLocalSession();if(session)await applySessionBoard(session,session.openingBoard,'ready');});
  document.querySelector('[data-session-reset]')?.addEventListener('click',async()=>{
    try{
      const session=loadLocalSession();if(!session||!confirm('Reset this local session to the adventure opening board?'))return;
      const manifest=window.__DND_ADVENTURE_PACK__;const fresh=manifest?createLocalSession(manifest,session.selectedSystem):{...session,board:structuredClone(session.openingBoard),status:'prepared'};
      saveLocalSession(fresh);await applySessionBoard(fresh,fresh.openingBoard,'ready');
    }catch(error){console.error('[Living Table] Session reset failed.',error);message('Session reset failed.');}
  });
}

function scheduleBoardSave(){
  if(applying||!loadLocalSession())return;
  clearTimeout(saveTimer);saveTimer=setTimeout(()=>{
    try{if(!applying&&loadLocalSession())syncBoardCommand(readBoardFromDom());}
    catch(error){console.error('[Living Table] Automatic board save failed.',error);}
  },250);
}

window.addEventListener('dnd:adventure-loaded',async event=>{
  try{const manifest=event.detail;const session=createLocalSession(manifest,manifest.selectedSystem);saveLocalSession(session);renderToolbar();await delay(100);await applySessionBoard(session,session.openingBoard,'ready');}
  catch(error){console.error('[Living Table] Adventure session initialization failed.',error);}
});

const app=document.querySelector('#app');if(app)new MutationObserver(scheduleBoardSave).observe(app,{childList:true,subtree:true});
window.LivingTableLocalSession=Object.freeze({LIVE_BOARD_SLOT_IDS,createLocalSession,loadLocalSession,saveLocalSession,dispatchLocalSession,clearLocalSession,readBoardFromDom,reconcileBoard,reconcileSessionBoard,applySessionBoard});
renderToolbar();const saved=loadLocalSession();if(saved)setTimeout(()=>applySessionBoard(saved,saved.board,saved.status),180);