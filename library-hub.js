import { characterCards, activateCharacterCard } from "./src/player/character-cards.js";
import { loadDungeonCardsCatalog, catalogCounts, filterCatalog, DND_CARDS_SOURCE } from "./src/library/dndcards-catalog.js";

const STORAGE_KEY="living-table-library-v2";
const app=document.querySelector("#app");
const defaults={
  dmPacks:[{id:"wishing-cake",title:"The Wishing Cake",system:"D&D 2014 / 2024",status:"Ready",code:"WISH-CAKE-001"}],
  drafts:[],
  player:{
    characters:characterCards.map(card=>({id:card.id,name:card.name,level:3,system:"D&D 5e",version:card.version,portrait:card.front.portrait,subtitle:card.front.subtitle,local:true})),
    items:["Rapier +1","Cloak of Protection","Potion of Healing","Gift Rope"],
    collectedCardIds:[],
    invitations:[{id:"wish-invite",title:"The Wishing Cake",dm:"Birthday DM",status:"Accepted"}],
    adventures:[{id:"wishing-cake",title:"The Wishing Cake",version:"1.0.0",state:"In Progress"}]
  }
};
const loadState=()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");return{...defaults,...saved,player:{...defaults.player,...(saved.player||{})}};}catch{return structuredClone(defaults);}};
const state=loadState();
const save=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));

let catalog=[];
let catalogStatus="loading";
let catalogError="";
let catalogKind="all";
let catalogSearch="";
let activeTab="table";

const shell=document.createElement("div");
shell.className="library-hub";
shell.innerHTML=`<nav class="library-tabs" aria-label="Workspace"><button data-library-tab="table" class="active">Current Card Board</button><button data-library-tab="dm">DM Library</button><button data-library-tab="player">Player Library</button></nav><section id="library-panel" class="library-panel" hidden></section>`;
document.body.insertBefore(shell,app);
const panel=shell.querySelector("#library-panel");

const kindLabel=kind=>({character:"Characters",item:"Items",monster:"Monsters",room:"Rooms",npc:"NPCs",hazard:"Hazards",rule:"Rules",event:"Events"}[kind]||`${kind.slice(0,1).toUpperCase()}${kind.slice(1)}`);
const cardGlyph=kind=>({character:"🧙",item:"✨",monster:"🐲",room:"🚪",npc:"♟",hazard:"⚠",rule:"📖",event:"🎲"}[kind]||"🎴");

function catalogCardMarkup(card,{collect=false}={}){
  const owned=state.player.collectedCardIds.includes(card.id);
  const stats=card.quickStats.length?`<p class="catalog-quick-stats">${card.quickStats.map(esc).join(" · ")}</p>`:"";
  return `<article class="library-card catalog-library-card type-${esc(card.kind)}" data-catalog-card="${esc(card.id)}">
    <div class="library-card-art"><span>${esc(typeof card.art==="string"&&card.art.length<8?card.art:cardGlyph(card.kind))}</span><small>${esc(kindLabel(card.kind))}</small></div>
    <div><small>DungeonCards · ${esc(card.kind)}</small><h3>${esc(card.title)}</h3><p>${esc(card.playerText||"Premade card ready for the library.")}</p>${stats}</div>
    <div class="catalog-card-actions"><button data-preview-catalog-card="${esc(card.id)}">Preview</button>${collect?`<button data-collect-card="${esc(card.id)}" ${owned?"disabled":""}>${owned?"In My Library":"Add to My Library"}</button>`:""}</div>
  </article>`;
}

function catalogControls(){
  const kinds=["all",...new Set(catalog.map(card=>card.kind))];
  return `<div class="catalog-toolbar"><label>Search cards<input data-catalog-search value="${esc(catalogSearch)}" placeholder="Name, type, or card text"></label><div class="deck-filters">${kinds.map(kind=>`<button data-catalog-kind="${esc(kind)}" class="${catalogKind===kind?"selected":""}">${esc(kind==="all"?"All":kindLabel(kind))}</button>`).join("")}</div></div>`;
}

function catalogSection({collect=false,playerKinds=null}={}){
  if(catalogStatus==="loading") return `<section class="library-section"><h3>DungeonCards Catalog</h3><p>Loading the premade card library…</p></section>`;
  if(catalogStatus==="error") return `<section class="library-section"><h3>DungeonCards Catalog</h3><p>${esc(catalogError||"Catalog unavailable.")}</p></section>`;
  const sourceCards=playerKinds?catalog.filter(card=>playerKinds.includes(card.kind)):catalog;
  const filtered=filterCatalog(sourceCards,{kind:catalogKind,search:catalogSearch});
  const counts=catalogCounts(sourceCards);
  return `<section class="library-section dungeoncards-catalog"><header class="library-heading"><div><small>PINNED SOURCE ${esc(DND_CARDS_SOURCE.commit.slice(0,8))}</small><h3>DungeonCards Premade Card Catalog</h3><p>${counts.total} premade cards loaded from ${esc(DND_CARDS_SOURCE.repository)}. These remain source definitions until copied into a player collection or live adventure.</p></div></header>${catalogControls()}<div class="library-grid catalog-grid">${filtered.length?filtered.map(card=>catalogCardMarkup(card,{collect})).join(""):`<p>No cards match this filter.</p>`}</div></section>`;
}

function dmMarkup(){
  const packs=[...state.dmPacks,...state.drafts].map(pack=>`<article class="library-card"><span class="library-card-art">🎴</span><div><small>${esc(pack.system)}</small><h3>${esc(pack.title)}</h3><p>${esc(pack.status)}${pack.code?` · ${esc(pack.code)}`:""}</p></div><button data-open-pack="${esc(pack.id)}">Open</button></article>`).join("");
  return `<header class="library-heading"><div><small>DM WORKSPACE</small><h2>One-Shot and Card Library</h2><p>Build adventures with the existing DungeonCards catalog instead of recreating cards.</p></div></header><div class="library-actions"><button data-new-one-shot>+ Build One-Shot</button><label class="upload-button">Upload Adventure JSON<input type="file" accept="application/json,.json" data-upload-adventure></label><a href="?pack=wishing-cake">Test Master Card Loader</a></div><form class="one-shot-builder" data-one-shot-form hidden><label>Title<input name="title" required placeholder="Adventure title"></label><label>Rules<select name="system"><option>D&D 2014</option><option>D&D 2024</option><option>D&D 2014 / 2024</option></select></label><button type="submit">Create Draft</button><button type="button" data-cancel-builder>Cancel</button></form><section class="library-section"><h3>Adventure Packs</h3><div class="library-grid">${packs}</div></section>${catalogSection()}`;
}

function playerMarkup(){
  const localCharacters=state.player.characters.map(c=>`<article class="library-card character-library-card"><div class="library-card-art character-card-link"><span>${esc(c.portrait||"🧙")}</span><strong>${esc(c.name)}</strong><small>${esc(c.subtitle||"Pregenerated character card")}</small></div><div><small>${esc(c.system)} · Card v${esc(c.version||"1.0.0")}</small><h3>${esc(c.name)}</h3><p>Picture front · information back · loads the complete character</p></div><button data-load-character="${esc(c.id)}">Load Character</button></article>`).join("");
  const collected=catalog.filter(card=>state.player.collectedCardIds.includes(card.id));
  const items=state.player.items.map(name=>`<article class="mini-item-card"><span>✨</span><strong>${esc(name)}</strong><small>Owned item card</small></article>`).join("");
  const collectedMarkup=collected.length?collected.map(card=>catalogCardMarkup(card,{collect:true})).join(""):`<p>No DungeonCards have been added to this player library yet.</p>`;
  const invites=state.player.invitations.map(a=>`<article class="library-row"><div><strong>${esc(a.title)}</strong><small>Invited by ${esc(a.dm)}</small></div><span>${esc(a.status)}</span></article>`).join("");
  const adventures=state.player.adventures.map(a=>`<article class="library-row"><div><strong>${esc(a.title)}</strong><small>Version ${esc(a.version)}</small></div><button data-open-pack="${esc(a.id)}">${esc(a.state)}</button></article>`).join("");
  return `<header class="library-heading"><div><small>PLAYER WORKSPACE</small><h2>Player Library</h2><p>Loaded characters, owned cards, invitations, and current adventures.</p></div></header><section class="library-section"><h3>Playable Character Cards</h3><div class="library-grid">${localCharacters}</div></section><section class="library-section"><h3>My Collected DungeonCards</h3><div class="library-grid">${collectedMarkup}</div></section><section class="library-section"><h3>Owned Item Cards</h3><div class="item-library-grid">${items}</div></section><section class="library-columns"><div><h3>Adventure Invitations</h3>${invites}</div><div><h3>Current Adventures</h3>${adventures}</div></section>${catalogSection({collect:true,playerKinds:["character","item","rule"]})}<button class="return-board" data-library-tab="table">Return to Current Card Board</button>`;
}

function previewCard(card){
  document.querySelector(".catalog-preview-dialog")?.remove();
  const dialog=document.createElement("dialog");dialog.className="catalog-preview-dialog";
  dialog.innerHTML=`<article><button class="dialog-close" aria-label="Close">×</button><small>${esc(card.source)} · ${esc(card.kind)}</small><h2>${esc(card.title)}</h2><section><h3>Picture Front</h3><div class="catalog-preview-art">${esc(typeof card.art==="string"&&card.art.length<8?card.art:cardGlyph(card.kind))}</div></section><section><h3>Player Back</h3><p>${esc(card.playerText||"No player text supplied.")}</p>${card.quickStats.length?`<p>${card.quickStats.map(esc).join(" · ")}</p>`:""}</section><section><h3>DM Back</h3><p>${esc(card.dmText||"No additional DM text supplied.")}</p></section><small>Definition ID: ${esc(card.id)} · Source commit ${esc(card.sourceCommit.slice(0,8))}</small></article>`;
  document.body.append(dialog);dialog.querySelector(".dialog-close").onclick=()=>dialog.close();dialog.addEventListener("close",()=>dialog.remove());dialog.showModal();
}

function showTab(tab){activeTab=tab;shell.querySelectorAll("[data-library-tab]").forEach(button=>button.classList.toggle("active",button.dataset.libraryTab===tab));const table=tab==="table";panel.hidden=table;app.hidden=!table;if(table)return;renderPanel();}
function renderPanel(){panel.innerHTML=activeTab==="dm"?dmMarkup():playerMarkup();bindPanel();}
function bindPanel(){
  panel.querySelector("[data-new-one-shot]")?.addEventListener("click",()=>panel.querySelector("[data-one-shot-form]").hidden=false);
  panel.querySelector("[data-cancel-builder]")?.addEventListener("click",()=>panel.querySelector("[data-one-shot-form]").hidden=true);
  panel.querySelector("[data-one-shot-form]")?.addEventListener("submit",event=>{event.preventDefault();const data=new FormData(event.currentTarget);state.drafts.push({id:`draft-${Date.now()}`,title:data.get("title").trim(),system:data.get("system"),status:"Draft"});save();renderPanel();});
  panel.querySelector("[data-upload-adventure]")?.addEventListener("change",async event=>{const file=event.target.files?.[0];if(!file)return;try{const pack=JSON.parse(await file.text());state.dmPacks.push({id:pack.packId||`upload-${Date.now()}`,title:pack.title||file.name,system:(pack.supportedSystems||[pack.system||"Unknown"]).join(" / "),status:"Uploaded",code:pack.backupCode||""});save();renderPanel();}catch{alert("That file is not a valid adventure JSON package.");}});
  panel.querySelectorAll("[data-open-pack]").forEach(button=>button.onclick=()=>location.href=`?pack=${encodeURIComponent(button.dataset.openPack)}`);
  panel.querySelectorAll("[data-load-character]").forEach(button=>button.onclick=()=>{activateCharacterCard(button.dataset.loadCharacter);showTab("table");setTimeout(()=>document.querySelector("[data-view='player']")?.click(),0);});
  panel.querySelectorAll("[data-preview-catalog-card]").forEach(button=>button.onclick=()=>{const card=catalog.find(entry=>entry.id===button.dataset.previewCatalogCard);if(card)previewCard(card);});
  panel.querySelectorAll("[data-collect-card]").forEach(button=>button.onclick=()=>{if(!state.player.collectedCardIds.includes(button.dataset.collectCard))state.player.collectedCardIds.push(button.dataset.collectCard);save();renderPanel();});
  panel.querySelectorAll("[data-catalog-kind]").forEach(button=>button.onclick=()=>{catalogKind=button.dataset.catalogKind;renderPanel();});
  panel.querySelector("[data-catalog-search]")?.addEventListener("input",event=>{catalogSearch=event.target.value;renderPanel();const input=panel.querySelector("[data-catalog-search]");input?.focus();input?.setSelectionRange(catalogSearch.length,catalogSearch.length);});
  panel.querySelectorAll("[data-library-tab]").forEach(button=>button.onclick=()=>showTab(button.dataset.libraryTab));
}

shell.querySelectorAll(".library-tabs [data-library-tab]").forEach(button=>button.onclick=()=>showTab(button.dataset.libraryTab));
showTab("table");
loadDungeonCardsCatalog().then(cards=>{catalog=cards;catalogStatus="ready";if(activeTab!=="table")renderPanel();}).catch(error=>{catalogStatus="error";catalogError=error.message;if(activeTab!=="table")renderPanel();});
