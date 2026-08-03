import { COMMANDS, applyCommand, createInitialState, eventText } from "./state.js";
import { createRuinedChapelSession } from "./encounter.js";
import { projectSessionFor } from "./projection.js";
import { ROLES } from "./schema.js";

let state = createInitialState();
let viewRole = ROLES.DM;
const session = createRuinedChapelSession();
const dice = [20, 12, 10, 8, 6, 4, 100];

const SLOT_DEFINITIONS = Object.freeze([
  { id: "location", label: "Location", icon: "⌖", accepts: ["location"], stackable: false },
  { id: "room", label: "Room / Scene", icon: "▣", accepts: ["room"], stackable: false },
  { id: "npc", label: "NPCs", icon: "♟", accepts: ["npc"], stackable: true },
  { id: "monster", label: "Monsters", icon: "☠", accepts: ["monster"], stackable: true },
  { id: "hazard", label: "Traps / Hazards", icon: "⚠", accepts: ["hazard"], stackable: true },
  { id: "objective", label: "Objective / Quest", icon: "◆", accepts: ["objective"], stackable: false },
  { id: "treasure", label: "Treasure / Rewards", icon: "✦", accepts: ["treasure", "item"], stackable: true }
]);

const board = { location: [], room: ["room"], npc: [], monster: ["priest", "skeleton"], hazard: [], objective: [], treasure: [] };
const flipped = new Set();
let pickerSlot = null;
let deckFilter = "all";
let deckSearch = "";

const participant = () => session.participants.find(entry => entry.role === viewRole);
const projection = () => {
  session.cards.forEach(card => { if (card.id in state.revealed) card.revealed = state.revealed[card.id]; });
  return projectSessionFor(session, participant());
};
const dispatch = command => { state = applyCommand(state, command).state; render(); };
const cardById = id => session.cards.find(card => card.id === id);
const slotForCard = card => SLOT_DEFINITIONS.find(slot => slot.accepts.includes(card.type));
const isPlaced = id => Object.values(board).some(cards => cards.includes(id));
const escapeHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const detailsMarkup = details => Object.entries(details ?? {}).map(([key, value]) => `<p><strong>${escapeHtml(key.replace(/([A-Z])/g, " $1"))}:</strong> ${escapeHtml(Array.isArray(value) ? value.join(", ") : value)}</p>`).join("");

const tarotCard = (card, { isDM, inDeck = false } = {}) => {
  const isFlipped = flipped.has(card.id);
  const face = isDM ? card.dmFace : card.face;
  return `<article class="tarot-card type-${card.type} ${isFlipped ? "is-flipped" : ""}" data-card-id="${card.id}" ${inDeck ? `draggable="true" tabindex="0"` : ""}>
    <div class="tarot-inner">
      <section class="tarot-face tarot-front"><span class="category-ribbon">${escapeHtml(card.type)}</span><div class="card-art"><span>${slotForCard(card)?.icon ?? "◇"}</span></div><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.playerFace?.summary ?? "Adventure card")}</p></section>
      <section class="tarot-face tarot-back"><span class="category-ribbon">${isDM ? "DM BACK" : "CARD BACK"}</span><h3>${escapeHtml(card.title)}</h3><div class="card-copy">${detailsMarkup(face)}</div></section>
    </div>
    <footer class="card-controls"><button class="card-control" type="button" data-flip-card="${card.id}">${isFlipped ? "Show Front" : "Flip Card"}</button>${isDM && !inDeck ? `<button class="card-control" type="button" data-reveal="${card.id}">${card.revealed ? "Hide" : "Reveal"}</button><button class="card-control danger" type="button" data-remove-card="${card.id}">Remove</button>` : ""}</footer>
  </article>`;
};

const renderSlot = (slot, projected, isDM) => {
  const authorized = new Set(projected.cards.map(card => card.id));
  const cards = board[slot.id].map(cardById).filter(Boolean).filter(card => isDM || authorized.has(card.id));
  return `<section class="board-slot slot-${slot.id} ${cards.length ? "" : "is-empty"}" data-slot="${slot.id}" data-accepts="${slot.accepts.join(",")}">
    <header class="slot-heading"><span class="slot-icon">${slot.icon}</span><div><h2>${slot.label}</h2><small>${slot.stackable ? "Stackable tarot cards" : "One active card"}</small></div>${isDM ? `<button class="slot-add" data-open-picker="${slot.id}">+ Add</button>` : ""}</header>
    <div class="slot-cards ${slot.stackable ? "stackable" : ""}">${cards.length ? cards.map(card => tarotCard(card, { isDM })).join("") : `<button class="empty-slot" ${isDM ? `data-open-picker="${slot.id}"` : "disabled"}><span>${slot.icon}</span><strong>${isDM ? `Add ${slot.label} card` : `No ${slot.label.toLowerCase()} revealed`}</strong></button>`}</div>
  </section>`;
};

const filteredDeckCards = () => session.cards.filter(card => (deckFilter === "all" || card.type === deckFilter) && (!deckSearch.trim() || `${card.title} ${card.type}`.toLowerCase().includes(deckSearch.trim().toLowerCase())));
const renderDeck = () => `<aside class="panel adventure-deck"><header><h2>Adventure Deck</h2><span class="deck-count">${session.cards.length} cards</span></header><input id="deckSearch" class="deck-search" type="search" value="${escapeHtml(deckSearch)}" placeholder="Search this adventure"><div class="deck-filters">${["all", ...new Set(session.cards.map(card => card.type))].map(type => `<button data-deck-filter="${type}" class="${deckFilter === type ? "selected" : ""}">${type}</button>`).join("")}</div><p class="deck-help">Drag a card to its matching slot, or click a slot.</p><div class="deck-card-list">${filteredDeckCards().map(card => `<div class="deck-card-wrap ${isPlaced(card.id) ? "is-placed" : ""}">${tarotCard(card, { isDM: true, inDeck: true })}<small>${isPlaced(card.id) ? "On board" : "Available"}</small></div>`).join("")}</div><button class="reveal" id="undo" ${state.undoStack.length ? "" : "disabled"}>Undo Last Rules Action</button></aside>`;

const pickerMarkup = () => {
  if (!pickerSlot) return "";
  const slot = SLOT_DEFINITIONS.find(entry => entry.id === pickerSlot);
  const compatible = session.cards.filter(card => slot.accepts.includes(card.type));
  return `<div class="picker-backdrop"><section class="card-picker" role="dialog" aria-modal="true"><header><h2>Choose ${slot.label} card</h2><button class="picker-close" data-close-picker>×</button></header><div class="picker-grid">${compatible.map(card => `<button class="picker-option" data-place-card="${card.id}" data-place-slot="${slot.id}"><strong>${escapeHtml(card.title)}</strong><span>${escapeHtml(card.type)}</span></button>`).join("")}</div></section></div>`;
};

const placeCard = (cardId, slotId) => {
  const card = cardById(cardId); const slot = SLOT_DEFINITIONS.find(entry => entry.id === slotId);
  if (!card || !slot || !slot.accepts.includes(card.type)) return;
  if (!slot.stackable) board[slot.id] = [card.id]; else if (!board[slot.id].includes(card.id)) board[slot.id].push(card.id);
  pickerSlot = null; render();
};
const removeCard = cardId => { Object.keys(board).forEach(slot => { board[slot] = board[slot].filter(id => id !== cardId); }); render(); };

const renderEncounterBoard = (projected, isDM) => `<main class="panel encounter-board"><header class="board-header"><div><small>THE CURRENT ENCOUNTER</small><h1>${isDM ? "Fixed Card Board" : "Revealed Encounter Cards"}</h1></div><p>${isDM ? "The board grammar never moves. The DM changes the cards in each slot." : "These are the cards the DM has revealed to the party."}</p></header><div class="fixed-board">${SLOT_DEFINITIONS.map(slot => renderSlot(slot, projected, isDM)).join("")}</div></main>`;

const playerInventoryCard = (icon, title, detail) => `<article class="mini-card"><span>${icon}</span><div><strong>${title}</strong><small>${detail}</small></div></article>`;
const renderPlayerStation = projected => {
  const actor = projected.actors.find(entry => entry.id === "lyria") ?? projected.actors.find(entry => entry.kind === "player");
  return `<section class="player-station panel" aria-label="Player character board">
    <header class="player-station-header"><div><small>YOUR CHARACTER</small><h2>${escapeHtml(actor?.name ?? "Character")}</h2></div><div class="action-economy"><span>Action ●</span><span>Bonus ●</span><span>Reaction ●</span></div></header>
    <div class="player-station-grid">
      <article class="player-card-near-doll"><span class="category-ribbon">PLAYER CARD</span><h3>${escapeHtml(actor?.name ?? "Lyria")}</h3><p>Rogue · Level 5</p><p><strong>HP ${actor?.hp?.current ?? 32}/${actor?.hp?.max ?? 38}</strong></p><p><span aria-label="Armor Class">🛡 ${actor?.ac ?? 15}</span> · Initiative +4</p><p>Click the character card later to open the complete playable back.</p></article>
      <div class="character-doll"><div class="doll-head"></div><div class="doll-body"><span>${escapeHtml((actor?.name ?? "L").slice(0, 1))}</span></div><div class="equipment-slot weapon-slot">Weapon</div><div class="equipment-slot armor-slot">Armor</div><div class="equipment-slot item-slot">Equipped Item</div></div>
      <section class="backpack"><header><span class="backpack-icon">🎒</span><div><h3>Backpack</h3><small>Cards not currently equipped</small></div></header><div class="backpack-cards">${playerInventoryCard("🗡", "Rapier", "Unequipped weapon")}${playerInventoryCard("🏹", "Shortbow", "Unequipped weapon")}${playerInventoryCard("🧪", "Healing Potion ×2", "Consumable")}${playerInventoryCard("🧰", "Thieves’ Tools", "Utility")}${playerInventoryCard("📜", "Scroll Slot", "Future owned card")}</div></section>
    </div>
  </section>`;
};

function bindInteractions() {
  document.querySelectorAll("[data-role]").forEach(button => button.onclick = () => { viewRole = button.dataset.role; render(); });
  document.querySelectorAll("[data-die]").forEach(button => button.onclick = () => dispatch({ type: COMMANDS.ROLL_DIE, sides: Number(button.dataset.die) }));
  document.querySelectorAll("[data-d20-mode]").forEach(button => button.onclick = () => dispatch({ type: COMMANDS.ROLL_D20, mode: button.dataset.d20Mode }));
  document.querySelectorAll("[data-reveal]").forEach(button => button.onclick = event => { event.stopPropagation(); dispatch({ type: COMMANDS.TOGGLE_CARD, key: button.dataset.reveal }); });
  document.querySelectorAll("[data-flip-card]").forEach(button => button.onclick = event => { event.stopPropagation(); const id = button.dataset.flipCard; flipped.has(id) ? flipped.delete(id) : flipped.add(id); render(); });
  document.querySelectorAll("[data-remove-card]").forEach(button => button.onclick = () => removeCard(button.dataset.removeCard));
  document.querySelectorAll("[data-open-picker]").forEach(button => button.onclick = () => { pickerSlot = button.dataset.openPicker; render(); });
  document.querySelectorAll("[data-place-card]").forEach(button => button.onclick = () => placeCard(button.dataset.placeCard, button.dataset.placeSlot));
  document.querySelector("[data-close-picker]")?.addEventListener("click", () => { pickerSlot = null; render(); });
  document.querySelectorAll("[data-deck-filter]").forEach(button => button.onclick = () => { deckFilter = button.dataset.deckFilter; render(); });
  document.querySelector("#deckSearch")?.addEventListener("input", event => { deckSearch = event.target.value; render(); });
  document.querySelectorAll("[draggable='true']").forEach(card => card.addEventListener("dragstart", event => event.dataTransfer.setData("text/card-id", card.dataset.cardId)));
  document.querySelectorAll("[data-slot]").forEach(slot => { slot.addEventListener("dragover", event => event.preventDefault()); slot.addEventListener("drop", event => { event.preventDefault(); placeCard(event.dataTransfer.getData("text/card-id"), slot.dataset.slot); }); });
  document.querySelector("#undo")?.addEventListener("click", () => dispatch({ type: COMMANDS.UNDO }));
}

function render() {
  const projected = projection(); const isDM = viewRole === ROLES.DM;
  document.querySelector("#app").innerHTML = `<div class="app">
    <header class="topbar"><div class="brand">⬡ THE LIVING TABLE<br><small>${isDM ? "DM Card Board" : "Player Card Board"}</small></div><div class="dice" aria-label="Dice roller">${dice.map(die => `<button data-die="${die}">d${die}</button>`).join("")}<button data-d20-mode="advantage">Adv.</button><button data-d20-mode="disadvantage">Dis.</button></div><div class="result" aria-live="polite">${state.roll}<br>${state.total !== null ? `<strong>${state.total}</strong><small>${state.rollDetail}</small>` : state.rollDetail}</div></header>
    <nav class="view-switch panel"><strong>Live preview:</strong><button class="reveal ${isDM ? "selected" : ""}" data-role="dm">DM View</button><button class="reveal ${!isDM ? "selected" : ""}" data-role="player">Player View</button><span>${isDM ? "Private backs, deck and placement controls" : "Dice above, encounter cards center, character station below"}</span></nav>
    ${isDM ? `<div class="workspace dm-workspace">${renderDeck()}${renderEncounterBoard(projected, true)}<aside class="panel turn-panel"><h2>Initiative — Round ${state.round}</h2><ol class="initiative">${projected.actors.map(actor => `<li class="${actor.name === state.actors[state.active][0] ? "active" : ""}"><span>${actor.name}</span><strong>${actor.initiative}</strong></li>`).join("")}</ol><h3>Event Log</h3><div class="log">${eventText(state).map(entry => `<p>${escapeHtml(entry)}</p>`).join("")}</div></aside></div>` : `<div class="player-layout">${renderEncounterBoard(projected, false)}${renderPlayerStation(projected)}</div>`}
    ${pickerMarkup()}
  </div>`;
  bindInteractions();
}
render();
