import './src/player/pregen-library-sync.js';
import {
  activateCharacterCard,
  resolveRequestedCharacter,
  resolveRequestedEdition,
  getCharacterProfile,
  normalizeEdition
} from "./src/player/character-cards.js";
import { proficiencyBonus } from "./src/dnd/rules-engine.js";
import { createInventory, deriveStats } from "./src/player/item-system.js";

let activeCharacter=resolveRequestedCharacter();
let requestedEdition=resolveRequestedEdition();
let showingBack=false;
const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char]));
const fmt=value=>value>=0?`+${value}`:String(value);

function currentEdition(){const toggle=document.querySelector("#app [data-edition-toggle]");if(toggle)return toggle.textContent.includes("2024")?"dnd-2014":"dnd-2024";return requestedEdition;}
function startingStats(character,profile){const inventory=createInventory(character.ownedItemIds);return deriveStats({edition:profile.rulesId,equipped:{...character.startingEquipment}},inventory,character);}
function frontMarkup(character,profile){
 const stats=startingStats(character,profile);const initiative=`${fmt(profile.initiative.modifier)}${profile.initiative.advantage?" ADV":""}`;const attack=stats.attackProfile;
 const attackLine=attack?`<div class="pregen-primary-attack"><span aria-hidden="true">⚔</span><strong>${esc(attack.name)} ${fmt(stats.attack)}</strong><small>💥 ${esc(attack.damageDice)}${fmt(stats.damage)} ${esc(attack.damageType)}</small></div>`:`<div class="pregen-primary-attack"><strong>No weapon equipped</strong></div>`;
 return `<div class="pregen-character-front"><small>PREGENERATED CHARACTER · ${profile.rulesId==="dnd-2024"?"2024":"2014"}</small><div class="pregen-portrait"><img src="assets/characters/${esc(character.id)}.svg" alt="${esc(character.front.artAlt)}"></div><h3>${esc(character.front.title)}</h3><p>${esc(profile.species)} ${esc(profile.className)} ${profile.level} · ${esc(profile.subclass)}</p><div class="pregen-combat-line" aria-label="Basic combat statistics"><span><small>AC</small><b>${stats.ac}</b></span><span><small>HP</small><b>${profile.maxHp}</b></span><span><small>INIT</small><b>${initiative}</b></span><span><small>PB</small><b>${fmt(proficiencyBonus(profile.level))}</b></span></div>${attackLine}</div>`;
}
function backMarkup(character,profile){const code=character.back.importCodes[profile.rulesId];const path=character.back.qrPaths[profile.rulesId];return `<div class="pregen-character-back"><small>CHARACTER CARD · IMPORT BACK · ${profile.rulesId==="dnd-2024"?"2024":"2014"}</small><h3>${esc(character.name)}</h3><p>${esc(character.back.summary)}</p><ul>${character.back.playNotes.map(note=>`<li>${esc(note)}</li>`).join("")}</ul><div class="pregen-card-code"><small>CHARACTER IMPORT CODE</small><strong>${esc(code)}</strong><span>Enter this code on the Player Table to load the complete character sheet.</span></div><a class="pregen-open-build" href="${esc(path)}">Open this build</a><div class="pregen-qr-ready" aria-label="QR-ready character path"><span aria-hidden="true">▦</span><div><small>QR-READY PATH</small><code>${esc(path)}</code></div></div></div>`;}
function cardMarkup(character){const profile=getCharacterProfile(character,currentEdition());const face=showingBack?backMarkup(character,profile):frontMarkup(character,profile);return `<section class="loaded-pregen-card" data-loaded-character="${esc(character.id)}" data-character-edition="${profile.rulesId}">${face}<div class="pregen-card-controls"><button type="button" data-flip-character-card>${showingBack?"Show Picture Front":"Show Import Back"}</button><span>Loaded into Player View</span></div></section>`;}
function enhancePlayerCard(){const host=document.querySelector("#app .character-source-card");if(!host)return;const existing=host.querySelector(".loaded-pregen-card");const expectedEdition=currentEdition();if(existing&&existing.dataset.loadedCharacter===activeCharacter.id&&existing.dataset.characterEdition===expectedEdition)return;existing?.remove();host.insertAdjacentHTML("afterbegin",cardMarkup(activeCharacter));host.querySelector("[data-flip-character-card]")?.addEventListener("click",()=>{showingBack=!showingBack;host.querySelector(".loaded-pregen-card")?.remove();enhancePlayerCard();});}
function loadCharacter(id,edition=null){if(edition)requestedEdition=normalizeEdition(edition);activeCharacter=activateCharacterCard(id,localStorage,requestedEdition);showingBack=false;document.querySelector(".loaded-pregen-card")?.remove();enhancePlayerCard();}
window.addEventListener("living-table:character-requested",event=>loadCharacter(event.detail.characterId,event.detail.edition));
window.addEventListener("living-table:character-loaded",event=>{activeCharacter=event.detail.character;if(event.detail.edition)requestedEdition=normalizeEdition(event.detail.edition);setTimeout(enhancePlayerCard,20);});
document.addEventListener("click",event=>{if(event.target.closest("#app [data-edition-toggle], #app [data-full-sheet-edition]"))setTimeout(()=>{document.querySelector(".loaded-pregen-card")?.remove();enhancePlayerCard();},40);},true);
const params=new URLSearchParams(location.search);const requested=params.get("character");if(requested)loadCharacter(requested,params.get("edition"));
const app=document.querySelector("#app");if(app)new MutationObserver(enhancePlayerCard).observe(app,{childList:true,subtree:true});window.addEventListener("DOMContentLoaded",enhancePlayerCard);enhancePlayerCard();
