import { characterCard, itemCards, slotLabels, createInventory, validSlots, equippedItems, attunementCount, deriveStats, equipItem, unequipItem, useItem } from "./src/player/item-system.js";

const inventory = createInventory();
const state = {
  ready:false,
  hp:characterCard.base.maxHp,
  actions:{ action:true, bonus:true, reaction:true },
  equipped:{ head:"keeper-crown", neck:null, shoulders:"cloak-protection", armor:"leather-armor", hands:null, mainHand:"rapier", offHand:"shield", ring1:null, ring2:null, feet:"boots-elvenkind", wondrous:"birthday-spark" },
  selectedSlot:null,
  edition:"2014",
  message:"Drag an item card onto a compatible doll slot. Base statistics come from the character card."
};

const esc = value => String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const itemById = id => inventory.find(item => item.id === id);
const equippedIds = () => new Set(Object.values(state.equipped).filter(Boolean));
const fmt = value => value >= 0 ? `+${value}` : String(value);

function itemCard(item) {
  const equipped = equippedIds().has(item.id);
  const resource = item.uses ? `${item.uses.current}/${item.uses.max} charges` : item.consumable ? `${item.consumable.count} remaining` : item.attunement ? "Requires attunement" : "No attunement";
  return `<article class="equipment-card ${item.color} ${equipped ? "is-equipped" : ""}" draggable="true" tabindex="0" data-drag-item="${item.id}" data-item-id="${item.id}">
    <div class="equipment-card-front"><span class="item-source">${esc(item.source)}</span><div class="item-picture" aria-hidden="true">${item.image}</div><span class="item-category">${esc(item.category)}</span><h4>${esc(item.name)}</h4><small>${esc(item.rarity)} · ${esc(item.edition)}</small></div>
    <div class="equipment-card-actions"><button type="button" data-read-item="${item.id}">Read</button>${item.validSlots.length ? `<button type="button" data-auto-equip="${item.id}">${equipped ? "Move" : "Equip"}</button>` : ""}${equipped ? `<button type="button" data-unequip-item="${item.id}">Unequip</button>` : ""}${item.uses || item.consumable ? `<button type="button" data-use-item="${item.id}" ${(item.uses?.current ?? item.consumable?.count ?? 0) < 1 ? "disabled" : ""}>Use</button>` : ""}</div>
    <small class="item-resource">${esc(resource)}</small>
  </article>`;
}

function slotCard(slot) {
  const item = itemById(state.equipped[slot]);
  const selected = state.selectedSlot === slot;
  return `<button type="button" class="rpg-slot slot-${slot} ${item ? "filled" : "empty"} ${selected ? "selected" : ""}" data-equipment-slot="${slot}" data-drop-slot="${slot}" aria-pressed="${selected}">
    <small>${slotLabels[slot]}</small><span class="slot-card-picture">${item?.image ?? "+"}</span><strong>${esc(item?.name ?? "Empty")}</strong>${item?.attunement ? `<em>Attuned</em>` : ""}
  </button>`;
}

function statMarkup(stats) {
  const currentAttack = stats.attackProfile ? `${stats.attackProfile.name}: ${fmt(stats.attack)} to hit, ${stats.attackProfile.damageDice} ${fmt(stats.damage)} ${stats.attackProfile.damageType}` : `${fmt(stats.attack)} to hit`;
  return `<div class="derived-stat-strip"><div><small>AC</small><strong>${stats.ac}</strong><span>Base ${characterCard.base.baseAc}</span></div><div><small>Speed</small><strong>${stats.speed} ft.</strong></div><div><small>Attack</small><strong>${fmt(stats.attack)}</strong></div><div><small>Damage</small><strong>${fmt(stats.damage)}</strong></div><div><small>Attuned</small><strong>${attunementCount(state,inventory)}/3</strong></div></div><p class="active-attack"><strong>Active attack:</strong> ${esc(currentAttack)}</p>`;
}

function stationMarkup() {
  const stats = deriveStats(state, inventory);
  const actions = Object.entries(state.actions).map(([key,ready]) => `<button type="button" class="economy-button ${ready ? "available" : "spent"}" data-spend-action="${key}">${key === "bonus" ? "Bonus Action" : key[0].toUpperCase()+key.slice(1)} ${ready ? "●" : "○"}</button>`).join("");
  const abilities = Object.entries(stats.abilities).map(([name,value]) => `<div><small>${name.slice(0,3).toUpperCase()}</small><strong>${value}</strong></div>`).join("");
  const saves = Object.entries(stats.saves).map(([name,value]) => `<span>${name.slice(0,3).toUpperCase()} ${fmt(value)}</span>`).join("");
  const traits = stats.traits.length ? stats.traits.map(text=>`<span>${esc(text)}</span>`).join("") : "<span>No conditional item traits</span>";
  return `<header class="player-station-header"><div><small>PLAYER CHARACTER CARD + EQUIPMENT CARDS</small><h2>${esc(characterCard.name)}</h2><p>${esc(characterCard.classLine)} · ${state.edition} rules preview</p></div><div class="player-head-actions"><button type="button" data-edition-toggle>Use ${state.edition === "2014" ? "2024" : "2014"} rules</button><button type="button" class="ready-button ${state.ready ? "is-ready" : ""}" data-player-ready>${state.ready ? "✓ Ready to Play" : "Mark Ready"}</button></div></header>
  <div class="player-status-bar"><div class="hp-controls"><strong>HP ${state.hp}/${stats.maxHp}</strong><button data-hp-change="-1">−1</button><button data-hp-change="1">+1</button></div><div class="action-economy">${actions}<button data-reset-turn>Reset Turn</button></div></div>
  ${statMarkup(stats)}
  <div class="player-station-grid rpg-station-grid"><article class="player-card-near-doll character-source-card"><span class="category-ribbon">PLAYER CHARACTER CARD</span><h3>${esc(characterCard.name)}</h3><div class="ability-grid">${abilities}</div><div class="save-row">${saves}</div>${characterCard.features.map(text=>`<p>${esc(text)}</p>`).join("")}<div class="trait-row">${traits}</div><div class="inside-card-rolls"><button data-player-roll="check">Check</button><button data-player-roll="save">Dex Save</button><button data-player-roll="attack">Attack</button></div></article>
  <section class="rpg-paper-doll"><div class="doll-title"><strong>RPG Equipment Doll</strong><small>Drag cards to legal slots; click a slot to filter/equip</small></div><div class="rpg-silhouette" aria-hidden="true"><div class="silhouette-head"></div><div class="silhouette-torso"></div><div class="silhouette-arm left"></div><div class="silhouette-arm right"></div><div class="silhouette-leg left"></div><div class="silhouette-leg right"></div></div>${Object.keys(slotLabels).map(slotCard).join("")}</section>
  <section class="backpack magic-inventory"><header><span class="backpack-icon">🎴</span><div><h3>Item Card Deck</h3><small>${state.selectedSlot ? `Compatible with ${slotLabels[state.selectedSlot]}` : "SRD cards and clearly labeled adventure cards"}</small></div></header><div class="item-legend"><span class="srd-key">SRD item</span><span class="custom-key">Adventure item</span></div><div class="backpack-cards">${inventory.filter(item => !state.selectedSlot || validSlots(item).includes(state.selectedSlot)).map(itemCard).join("")}</div></section></div>
  <p class="player-feedback" aria-live="polite">${esc(state.message)}</p>`;
}

function chooseSlot(item) { return state.selectedSlot && validSlots(item).includes(state.selectedSlot) ? state.selectedSlot : validSlots(item).find(slot=>!state.equipped[slot]) ?? validSlots(item)[0]; }
function equip(id, slot) { const item=itemById(id); const result=equipItem(state,inventory,id,slot); state.message=result.ok ? `${item.name} equipped in ${slotLabels[slot]}. All derived statistics recalculated from the character card.` : result.reason; if(result.ok) state.selectedSlot=null; enhance(); }
function healingRoll() { return [0,0].reduce(total=>total+Math.floor(Math.random()*4)+1,2); }

function openItem(item) {
  document.querySelector(".item-detail-dialog")?.remove();
  const effects = item.effects.length ? item.effects.map(effect=>`<li>${esc(effect.kind === "add" ? `${effect.target} ${fmt(effect.value)}` : effect.kind === "allSaves" ? `All saves ${fmt(effect.value)}` : effect.kind === "armorFormula" ? `AC formula: ${effect.base} + Dexterity modifier` : effect.label ?? `${effect.kind}: ${effect.target}`)}</li>`).join("") : "<li>No numerical modifier</li>";
  const dialog=document.createElement("dialog"); dialog.className="item-detail-dialog"; dialog.innerHTML=`<article class="item-detail-card ${item.color}"><button class="dialog-close" aria-label="Close">×</button><div class="item-picture">${item.image}</div><p class="item-source">${esc(item.source)} · ${esc(item.edition)}</p><h2>${esc(item.name)}</h2><h3>Player Back</h3><p>${esc(item.playerText)}</p><h3>DM / Rules Back</h3><p>${esc(item.dmText)}</p><ul>${effects}</ul></article>`; document.body.append(dialog); dialog.querySelector(".dialog-close").onclick=()=>dialog.close(); dialog.addEventListener("close",()=>dialog.remove()); dialog.showModal();
}

function bind(station) {
  station.querySelector("[data-player-ready]")?.addEventListener("click",()=>{state.ready=!state.ready;state.message=state.ready?"Ready. Character card, equipment, attunement, and item uses are set for this local demo.":"Ready status cleared.";enhance();});
  station.querySelector("[data-edition-toggle]")?.addEventListener("click",()=>{state.edition=state.edition==="2014"?"2024":"2014";state.message=`Using ${state.edition} action wording. Item cards keep their edition tags visible.`;enhance();});
  station.querySelectorAll("[data-spend-action]").forEach(button=>button.onclick=()=>{const key=button.dataset.spendAction;state.actions[key]=!state.actions[key];state.message=`${key} ${state.actions[key]?"restored":"spent"}.`;enhance();});
  station.querySelector("[data-reset-turn]")?.addEventListener("click",()=>{Object.keys(state.actions).forEach(key=>state.actions[key]=true);state.message="Turn resources restored.";enhance();});
  station.querySelectorAll("[data-hp-change]").forEach(button=>button.onclick=()=>{const max=deriveStats(state,inventory).maxHp;state.hp=Math.max(0,Math.min(max,state.hp+Number(button.dataset.hpChange)));state.message=`HP ${state.hp}/${max}.`;enhance();});
  station.querySelectorAll("[data-player-roll]").forEach(button=>button.onclick=()=>{const stats=deriveStats(state,inventory);const kind=button.dataset.playerRoll;const mod=kind==="attack"?stats.attack:kind==="save"?stats.saves.dexterity:Math.floor((stats.abilities.dexterity-10)/2);state.message=`${kind}: ${Math.floor(Math.random()*20)+1+mod}`;enhance();});
  station.querySelectorAll("[data-equipment-slot]").forEach(button=>{button.onclick=()=>{state.selectedSlot=state.selectedSlot===button.dataset.equipmentSlot?null:button.dataset.equipmentSlot;state.message=state.selectedSlot?`${slotLabels[state.selectedSlot]} selected.`:"Slot filter cleared.";enhance();};button.ondragover=event=>{event.preventDefault();button.classList.add("drag-over")};button.ondragleave=()=>button.classList.remove("drag-over");button.ondrop=event=>{event.preventDefault();equip(event.dataTransfer.getData("text/item-id"),button.dataset.dropSlot);};});
  station.querySelectorAll("[data-drag-item]").forEach(card=>card.ondragstart=event=>{event.dataTransfer.setData("text/item-id",card.dataset.dragItem);state.message=`Dragging ${itemById(card.dataset.dragItem).name}.`;});
  station.querySelectorAll("[data-auto-equip]").forEach(button=>button.onclick=()=>{const item=itemById(button.dataset.autoEquip);const slot=chooseSlot(item);if(slot)equip(item.id,slot);});
  station.querySelectorAll("[data-unequip-item]").forEach(button=>button.onclick=()=>{const item=itemById(button.dataset.unequipItem);unequipItem(state,item.id);state.message=`${item.name} unequipped. Bonuses removed.`;enhance();});
  station.querySelectorAll("[data-read-item]").forEach(button=>button.onclick=()=>openItem(itemById(button.dataset.readItem)));
  station.querySelectorAll("[data-use-item]").forEach(button=>button.onclick=()=>{const item=itemById(button.dataset.useItem);const result=useItem(item);if(result.ok&&item.id==="potion-healing"){const healed=healingRoll();state.hp=Math.min(deriveStats(state,inventory).maxHp,state.hp+healed);state.actions[state.edition==="2024"?"bonus":"action"]=false;state.message=`Potion restored ${healed} HP; ${result.text}`;}else state.message=result.ok?`${item.name} used; ${result.text}`:result.reason;enhance();});
}

function enhance(){const station=document.querySelector("#app .player-station");if(!station)return;station.innerHTML=stationMarkup();station.dataset.playerReadyEnhanced="true";bind(station);}
const app=document.querySelector("#app");if(app)new MutationObserver(enhance).observe(app,{childList:true});window.addEventListener("DOMContentLoaded",enhance);enhance();
