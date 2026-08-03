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

const board = {
  location: [],
  room: ["room"],
  npc: [],
  monster: ["priest", "skeleton"],
  hazard: [],
  objective: [],
  treasure: []
};

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

const escapeHtml = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const detailsMarkup = details => Object.entries(details ?? {}).map(([key, value]) => {
  const label = key.replace(/([A-Z])/g, " $1");
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(Array.isArray(value) ? value.join(", ") : value)}</p>`;
}).join("");

const tarotCard = (card, { isDM, inDeck = false } = {}) => {
  const isFlipped = flipped.has(card.id);
  const face = isDM ? card.dmFace : card.face;
  const revealControl = isDM && !inDeck
    ? `<button class="card-control" type="button" data-reveal="${card.id}">${card.revealed ? "Hide" : "Reveal"}</button>`
    : "";
  const removeControl = isDM && !inDeck
    ? `<button class="card-control danger" type="button" data-remove-card="${card.id}">Remove</button>`
    : "";
  return `<article class="tarot-card type-${card.type} ${isFlipped ? "is-flipped" : ""}" data-card-id="${card.id}" ${inDeck ? `draggable="true" tabindex="0"` : ""}>
    <div class="tarot-inner">
      <section class="tarot-face tarot-front" aria-label="${escapeHtml(card.title)} front">
        <span class="category-ribbon">${escapeHtml(card.type)}</span>
        <div class="card-art" aria-hidden="true"><span>${slotForCard(card)?.icon ?? "◇"}</span></div>
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.playerFace?.summary ?? "Adventure card")}</p>
      </section>
      <section class="tarot-face tarot-back" aria-label="${escapeHtml(card.title)} back">
        <span class="category-ribbon">${isDM ? "DM BACK" : "CARD BACK"}</span>
        <h3>${escapeHtml(card.title)}</h3>
        <div class="card-copy">${detailsMarkup(face)}</div>
      </section>
    </div>
    <footer class="card-controls">
      <button class="card-control" type="button" data-flip-card="${card.id}">${isFlipped ? "Show Front" : "Flip Card"}</button>
      ${revealControl}${removeControl}
    </footer>
  </article>`;
};

const renderSlot = (slot, projected, isDM) => {
  const authorizedIds = new Set(projected.cards.map(card => card.id));
  const placedCards = board[slot.id]
    .map(cardById)
    .filter(Boolean)
    .filter(card => isDM || authorizedIds.has(card.id));
  const empty = placedCards.length === 0;
  return `<section class="board-slot slot-${slot.id} ${empty ? "is-empty" : ""}" data-slot="${slot.id}" data-accepts="${slot.accepts.join(",")}">
    <header class="slot-heading">
      <span class="slot-icon" aria-hidden="true">${slot.icon}</span>
      <div><h2>${slot.label}</h2><small>${slot.stackable ? "Stackable tarot cards" : "One active card"}</small></div>
      ${isDM ? `<button class="slot-add" type="button" data-open-picker="${slot.id}">+ Add</button>` : ""}
    </header>
    <div class="slot-cards ${slot.stackable ? "stackable" : ""}">
      ${empty
        ? `<button class="empty-slot" type="button" ${isDM ? `data-open-picker="${slot.id}"` : "disabled"}><span>${slot.icon}</span><strong>${isDM ? `Add ${slot.label} card` : `No ${slot.label.toLowerCase()} revealed`}</strong></button>`
        : placedCards.map(card => tarotCard(card, { isDM })).join("")}
    </div>
  </section>`;
};

const filteredDeckCards = () => session.cards.filter(card => {
  const matchesCategory = deckFilter === "all" || card.type === deckFilter;
  const query = deckSearch.trim().toLowerCase();
  return matchesCategory && (!query || card.title.toLowerCase().includes(query) || card.type.includes(query));
});

const renderDeck = () => `<aside class="panel adventure-deck">
  <header><h2>Adventure Deck</h2><span class="deck-count">${session.cards.length} cards</span></header>
  <label class="field-label" for="deckSearch">Find a card</label>
  <input id="deckSearch" class="deck-search" type="search" value="${escapeHtml(deckSearch)}" placeholder="Search this adventure">
  <div class="deck-filters" aria-label="Card filters">
    ${["all", ...new Set(session.cards.map(card => card.type))].map(type => `<button type="button" data-deck-filter="${type}" class="${deckFilter === type ? "selected" : ""}">${type}</button>`).join("")}
  </div>
  <p class="deck-help">Drag a card to its matching slot, or click any board slot to choose a compatible card.</p>
  <div class="deck-card-list">${filteredDeckCards().map(card => `<div class="deck-card-wrap ${isPlaced(card.id) ? "is-placed" : ""}">${tarotCard(card, { isDM: true, inDeck: true })}<small>${isPlaced(card.id) ? "On board" : "Available"}</small></div>`).join("")}</div>
  <button class="reveal" id="undo" type="button" ${state.undoStack.length ? "" : "disabled"}>Undo Last Rules Action</button>
  <p><small>Board placement is a working UI prototype. Server-authoritative placement is tracked in Issue #21.</small></p>
</aside>`;

const pickerMarkup = () => {
  if (!pickerSlot) return "";
  const slot = SLOT_DEFINITIONS.find(entry => entry.id === pickerSlot);
  const compatible = session.cards.filter(card => slot.accepts.includes(card.type));
  return `<div class="picker-backdrop" role="presentation"><section class="card-picker" role="dialog" aria-modal="true" aria-labelledby="pickerTitle">
    <header><div><small>${slot.icon} ${slot.label}</small><h2 id="pickerTitle">Choose a compatible card</h2></div><button type="button" class="picker-close" data-close-picker aria-label="Close picker">×</button></header>
    <div class="picker-grid">${compatible.map(card => `<button type="button" class="picker-option" data-place-card="${card.id}" data-place-slot="${slot.id}"><strong>${escapeHtml(card.title)}</strong><span>${escapeHtml(card.type)}</span><small>${isPlaced(card.id) ? "Add another runtime copy" : "Add to board"}</small></button>`).join("") || `<p>No compatible cards are in this adventure deck.</p>`}</div>
  </section></div>`;
};

const placeCard = (cardId, slotId) => {
  const card = cardById(cardId);
  const slot = SLOT_DEFINITIONS.find(entry => entry.id === slotId);
  if (!card || !slot || !slot.accepts.includes(card.type)) return;
  if (!slot.stackable) board[slot.id] = [card.id];
  else if (!board[slot.id].includes(card.id)) board[slot.id].push(card.id);
  pickerSlot = null;
  render();
};

const removeCard = cardId => {
  Object.keys(board).forEach(slotId => { board[slotId] = board[slotId].filter(id => id !== cardId); });
  render();
};

const activeTurnPanel = projected => {
  const source = state.actors[state.active];
  const actor = projected.actors.find(entry => entry.name === source[0]);
  if (!actor) return `<article class="character"><h2>Hidden turn</h2><p>This combatant is not visible to this participant.</p></article>`;
  const controlled = viewRole === ROLES.DM || actor.controllerId === projected.participant.id;
  if (!controlled) return `<article class="character"><h2>${actor.name}'s Turn</h2><p>Waiting for ${actor.kind === "monster" ? "the DM" : "another player"}.</p></article>`;
  return `<article class="character"><h2>${actor.name}'s Turn</h2><p>1 Action · 1 Bonus Action · Reaction available</p><div class="actions">${["Attack", "Cast Spell", "Dash", "Disengage", "Hide", "Help", "Ready Action", "Use Item", "Reaction"].map(label => `<button class="action" type="button" disabled>${label}</button>`).join("")}</div><p class="prototype-note">Action resolution remains the next rules-engine layer.</p><button class="endturn" id="endTurn">End Turn</button></article>`;
};

function bindInteractions() {
  document.querySelectorAll("[data-role]").forEach(button => button.addEventListener("click", () => { viewRole = button.dataset.role; render(); }));
  document.querySelectorAll("[data-die]").forEach(button => button.addEventListener("click", () => dispatch({ type: COMMANDS.ROLL_DIE, sides: Number(button.dataset.die) })));
  document.querySelectorAll("[data-d20-mode]").forEach(button => button.addEventListener("click", () => dispatch({ type: COMMANDS.ROLL_D20, mode: button.dataset.d20Mode })));
  document.querySelectorAll("[data-reveal]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); dispatch({ type: COMMANDS.TOGGLE_CARD, key: button.dataset.reveal }); }));
  document.querySelectorAll("[data-flip-card]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); const id = button.dataset.flipCard; flipped.has(id) ? flipped.delete(id) : flipped.add(id); render(); }));
  document.querySelectorAll("[data-remove-card]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); removeCard(button.dataset.removeCard); }));
  document.querySelectorAll("[data-open-picker]").forEach(button => button.addEventListener("click", () => { pickerSlot = button.dataset.openPicker; render(); }));
  document.querySelectorAll("[data-place-card]").forEach(button => button.addEventListener("click", () => placeCard(button.dataset.placeCard, button.dataset.placeSlot)));
  document.querySelector("[data-close-picker]")?.addEventListener("click", () => { pickerSlot = null; render(); });
  document.querySelectorAll("[data-deck-filter]").forEach(button => button.addEventListener("click", () => { deckFilter = button.dataset.deckFilter; render(); }));
  document.querySelector("#deckSearch")?.addEventListener("input", event => { deckSearch = event.target.value; render(); document.querySelector("#deckSearch")?.focus(); });
  document.querySelectorAll("[draggable='true']").forEach(card => card.addEventListener("dragstart", event => { event.dataTransfer.setData("text/card-id", card.dataset.cardId); event.dataTransfer.effectAllowed = "copy"; }));
  document.querySelectorAll("[data-slot]").forEach(slot => {
    slot.addEventListener("dragover", event => { const card = cardById(event.dataTransfer.getData("text/card-id")); if (card && slot.dataset.accepts.split(",").includes(card.type)) { event.preventDefault(); slot.classList.add("drop-ready"); } });
    slot.addEventListener("dragleave", () => slot.classList.remove("drop-ready"));
    slot.addEventListener("drop", event => { event.preventDefault(); slot.classList.remove("drop-ready"); placeCard(event.dataTransfer.getData("text/card-id"), slot.dataset.slot); });
  });
  document.querySelector("#endTurn")?.addEventListener("click", () => dispatch({ type: COMMANDS.END_TURN }));
  document.querySelector("#undo")?.addEventListener("click", () => dispatch({ type: COMMANDS.UNDO }));
}

function render() {
  const projected = projection();
  const isDM = viewRole === ROLES.DM;
  document.querySelector("#app").innerHTML = `<div class="app">
    <header class="topbar">
      <div class="brand">⬡ THE LIVING TABLE<br><small>${isDM ? "DM Card Board" : "Player Card Board"}</small></div>
      <div class="dice" aria-label="Dice roller">${dice.map(die => `<button data-die="${die}">d${die}</button>`).join("")}<button data-d20-mode="advantage">Adv.</button><button data-d20-mode="disadvantage">Dis.</button></div>
      <div class="result" aria-live="polite">${state.roll}<br>${state.total !== null ? `<strong>${state.total}</strong><small>${state.rollDetail}</small>` : state.rollDetail}</div>
    </header>
    <nav class="view-switch panel" aria-label="Board role preview"><strong>Live preview:</strong><button class="reveal ${isDM ? "selected" : ""}" data-role="dm">DM View</button><button class="reveal ${!isDM ? "selected" : ""}" data-role="player">Player View</button><span>${isDM ? "Private backs, deck and placement controls" : "Only revealed cards and player-safe backs"}</span></nav>
    <div class="workspace ${isDM ? "dm-workspace" : "player-workspace"}">
      ${isDM ? renderDeck() : ""}
      <main class="panel encounter-board" aria-label="Fixed encounter card board">
        <header class="board-header"><div><small>THE CURRENT ENCOUNTER</small><h1>Fixed Card Board</h1></div><p>The board grammar never moves. The DM changes the cards in each slot.</p></header>
        <div class="fixed-board">${SLOT_DEFINITIONS.map(slot => renderSlot(slot, projected, isDM)).join("")}</div>
      </main>
      <aside class="panel turn-panel"><h2>Initiative — Round ${state.round}</h2><ol class="initiative">${projected.actors.map(actor => `<li class="${actor.name === state.actors[state.active][0] ? "active" : ""}"><span>${actor.name}<small> ${actor.kind}</small></span><strong>${actor.initiative}</strong></li>`).join("")}</ol><h3>Event Log</h3><div class="log" aria-live="polite">${eventText(state).map(entry => `<p>${escapeHtml(entry)}</p>`).join("")}</div></aside>
    </div>
    <section class="bottom"><article class="character"><h2>Lyria</h2><p>Rogue · Level 5</p><div class="hpbar"><span></span></div><p><strong>HP 32/38</strong> · <span aria-label="Armor Class">🛡 15</span> · Init +4</p><p>Character doll and owned-card slots remain persistent.</p></article>${activeTurnPanel(projected)}<article class="character resources"><div><h2>Owned Cards</h2><p>Rapier · Shortbow · Potions (2)</p></div><div><h2>Persistent State</h2><p>Equipment, treasure, spells, features and conditions attach here.</p></div></article></section>
    ${pickerMarkup()}
  </div>`;
  bindInteractions();
}

render();
