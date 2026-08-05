import { COMMANDS, applyCommand, createInitialState } from "./state.js";
import { createRuinedChapelSession } from "./encounter.js";
import { projectSessionFor } from "./projection.js";
import { ROLES } from "./schema.js";
import { resolveRuntimeRole } from "./role-context.js";

let state = createInitialState();
const viewRole = resolveRuntimeRole();
const session = createRuinedChapelSession();
const freeDice = [20, 12, 10, 8, 6, 4, 100];

const SLOTS = Object.freeze([
  { id: "location", label: "Location", icon: "⌖", accepts: ["location"], stackable: false },
  { id: "site", label: "Site", icon: "◆", accepts: ["site"], stackable: false },
  { id: "room", label: "Area / Room", icon: "▣", accepts: ["room"], stackable: false },
  { id: "scene", label: "Current Scene", icon: "▶", accepts: ["scene"], stackable: false },
  { id: "npc", label: "NPCs", icon: "♟", accepts: ["npc"], stackable: true },
  { id: "monster", label: "Monsters", icon: "☠", accepts: ["monster"], stackable: true },
  { id: "hazard", label: "Traps / Hazards", icon: "⚠", accepts: ["hazard"], stackable: true },
  { id: "objective", label: "Objective / Quest", icon: "◇", accepts: ["objective"], stackable: false },
  { id: "treasure", label: "Treasure / Rewards", icon: "✦", accepts: ["treasure", "item"], stackable: true }
]);

const cardById = id => session.cards.find(card => card.id === id);
let nextInstance = 1;
const makeInstance = cardId => {
  const card = cardById(cardId);
  return {
    instanceId: `${cardId}-${nextInstance++}`,
    cardId,
    hp: null,
    initiative: null,
    conditions: [],
    usesRemaining: card?.uses?.max ?? null
  };
};
const board = {
  location: [makeInstance("location")],
  site: [makeInstance("site-wishing-cake-inn")],
  room: [makeInstance("room")],
  scene: [makeInstance("scene-stolen-wish")],
  npc: [makeInstance("caretaker")],
  monster: [makeInstance("priest"), makeInstance("skeleton"), makeInstance("skeleton"), makeInstance("skeleton"), makeInstance("skeleton")],
  hazard: [],
  objective: [makeInstance("objective")],
  treasure: [makeInstance("lantern")]
};

const flipped = new Set();
const expandedStacks = new Set();
let pickerSlot = null;
let deckFilter = "all";
let deckSearch = "";
let cardRoll = "Choose a card action";

const participant = () => session.participants.find(entry => entry.role === viewRole);
const projection = () => {
  session.cards.forEach(card => { if (card.id in state.revealed) card.revealed = state.revealed[card.id]; });
  return projectSessionFor(session, participant());
};
const dispatch = command => { state = applyCommand(state, command).state; render(); };
const slotForCard = card => SLOTS.find(slot => slot.accepts.includes(card.type));
const escapeHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
const d20 = modifier => Math.floor(Math.random() * 20) + 1 + modifier;
const labelForKey = key => key.replace(/([A-Z])/g, " $1").replace(/^./, letter => letter.toUpperCase());

const faceDetails = face => Object.entries(face ?? {}).map(([key, value]) => {
  const text = Array.isArray(value) ? value.join(" • ") : value;
  const dialogueClass = key === "openingDialogue" || key === "readAloud" ? " read-aloud-copy" : "";
  return `<p class="card-detail${dialogueClass}"><strong>${escapeHtml(labelForKey(key))}:</strong> ${escapeHtml(text)}</p>`;
}).join("");

const cardActions = (card, instance, isDM) => {
  if (!isDM) return "";
  const actions = [];
  if (card.type === "monster") actions.push(["Initiative", "initiative"], ["Attack", "attack"], ["Save", "save"], ["Damage", "damage"]);
  else if (["npc", "hazard"].includes(card.type)) actions.push(["Check", "check"], ["Save", "save"]);
  if (card.uses && instance) actions.push(["Use 1", "use-charge"], ["Restore 1", "restore-charge"]);
  if (!actions.length) return "";
  const uses = card.uses && instance ? `<div class="item-uses" aria-live="polite"><strong>${instance.usesRemaining}/${card.uses.max}</strong> ${escapeHtml(card.uses.label ?? "uses")} remaining</div>` : "";
  return `${uses}<div class="inside-card-rolls">${actions.map(([label, action]) => `<button type="button" data-card-roll="${action}" data-instance="${instance.instanceId}">${label}</button>`).join("")}</div><small class="card-roll-note">Rules and tracking happen here</small>`;
};

const tarotCard = (card, instance, { isDM, inDeck = false, compact = false } = {}) => {
  const key = instance?.instanceId ?? card.id;
  const isFlipped = flipped.has(key);
  const face = isDM ? card.dmFace : card.face;
  const visibleSummary = isDM ? (card.dmFace?.readAloud ?? card.dmFace?.openingDialogue ?? card.playerFace?.summary) : (card.face?.readAloud ?? card.face?.openingDialogue ?? card.face?.summary);
  return `<article class="tarot-card type-${card.type} ${isFlipped ? "is-flipped" : ""} ${compact ? "compact-card" : ""}" data-card-id="${card.id}" data-card-type="${card.type}" ${instance ? `data-card-instance="${instance.instanceId}"` : ""} ${inDeck ? `draggable="true" tabindex="0"` : ""}>
    <div class="tarot-inner">
      <section class="tarot-face tarot-front"><span class="category-ribbon">${escapeHtml(card.type)}</span><div class="card-art">${slotForCard(card)?.icon ?? "◇"}</div><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(visibleSummary ?? "Adventure card")}</p>${instance && card.type === "monster" ? `<div class="instance-strip"><span>${escapeHtml(instance.instanceId)}</span><strong>Init ${instance.initiative ?? "—"}</strong></div>` : ""}${instance ? cardActions(card, instance, isDM) : ""}</section>
      <section class="tarot-face tarot-back"><span class="category-ribbon">${isDM ? "DM FULL CARD" : "PLAYER CARD"}</span><h3>${escapeHtml(card.title)}</h3><div class="card-copy">${faceDetails(face)}</div>${instance ? cardActions(card, instance, isDM) : ""}</section>
    </div>
    ${!compact ? `<footer class="card-controls"><button class="card-control" data-flip-card="${key}">${isFlipped ? "Front" : "Flip"}</button>${isDM && !inDeck ? `<button class="card-control" data-reveal="${card.id}">${card.revealed ? "Hide" : "Reveal"}</button><button class="card-control danger" data-remove-instance="${instance?.instanceId}">Remove</button>` : ""}</footer>` : ""}
  </article>`;
};

const renderStack = (slot, instances, isDM) => {
  const expanded = expandedStacks.has(slot.id);
  const top = instances[0];
  const topCard = cardById(top.cardId);
  return `<div class="card-stack ${expanded ? "expanded" : ""}">
    <div class="stack-toggle" role="button" tabindex="0" data-toggle-stack="${slot.id}" aria-expanded="${expanded}">
      <span class="stack-shadow shadow-two"></span><span class="stack-shadow shadow-one"></span>
      <span class="stack-count" aria-label="${instances.length} cards">${instances.length}</span>
      ${tarotCard(topCard, top, { isDM, compact: true })}
      <span class="stack-label">${expanded ? "Close stack" : `Open ${instances.length}-card stack`}</span>
    </div>
    ${expanded ? `<div class="stack-drawer">${instances.map(instance => tarotCard(cardById(instance.cardId), instance, { isDM })).join("")}</div>` : ""}
  </div>`;
};

const renderSlot = (slot, projected, isDM) => {
  const allowed = new Set(projected.cards.map(card => card.id));
  const instances = board[slot.id].filter(item => isDM || allowed.has(item.cardId));
  const content = !instances.length
    ? `<button class="empty-slot" ${isDM ? `data-open-picker="${slot.id}"` : "disabled"}><span>${slot.icon}</span><strong>${isDM ? `Add ${slot.label}` : "Nothing revealed"}</strong></button>`
    : slot.stackable ? renderStack(slot, instances, isDM) : tarotCard(isDM ? cardById(instances[0].cardId) : projected.cards.find(card => card.id === instances[0].cardId), instances[0], { isDM });
  return `<section class="board-slot slot-${slot.id}" data-slot="${slot.id}" data-accepts="${slot.accepts.join(",")}"><header class="slot-heading"><span class="slot-icon">${slot.icon}</span><div><h2>${slot.label}</h2><small>${isDM ? `Accepts ${slot.accepts.map(labelForKey).join(" / ")} cards only` : "Revealed by the Dungeon Master"}</small></div>${isDM ? `<button class="slot-add" data-open-picker="${slot.id}">+ Add</button>` : ""}</header><div class="single-card-holder">${content}</div></section>`;
};

const groupedInitiative = () => {
  const groups = new Map();
  Object.values(board).flat().filter(instance => instance.initiative !== null).forEach(instance => {
    const key = instance.cardId;
    if (!groups.has(key)) groups.set(key, { cardId:key, initiative:instance.initiative, count:0 });
    groups.get(key).count += 1;
  });
  return [...groups.values()].sort((a, b) => b.initiative - a.initiative);
};
const renderInitiative = isDM => {
  const entries = groupedInitiative();
  const controls = isDM ? `<button class="reveal" data-roll-all-monsters>Roll grouped monster initiative</button>` : "";
  return `<aside class="panel turn-panel"><h2>Combat Initiative</h2>${controls}<ol class="initiative">${entries.length ? entries.map((entry, index) => `<li><span><strong>${index + 1}.</strong> ${escapeHtml(cardById(entry.cardId)?.title ?? entry.cardId)}${entry.count > 1 ? ` ×${entry.count}` : ""}</span><strong>${entry.initiative}</strong></li>`).join("") : `<li>No initiative has been revealed yet.</li>`}</ol><p class="card-roll-result" aria-live="polite">${escapeHtml(cardRoll)}</p><small>${isDM ? "Identical monsters share one initiative value." : "The DM controls monsters and advances the encounter."}</small></aside>`;
};

const filteredDeck = () => session.cards.filter(card => (deckFilter === "all" || card.type === deckFilter) && (!deckSearch.trim() || `${card.title} ${card.type}`.toLowerCase().includes(deckSearch.trim().toLowerCase())));
const renderDeck = () => `<aside class="panel adventure-deck"><h2>Adventure Deck</h2><input id="deckSearch" class="deck-search" value="${escapeHtml(deckSearch)}" placeholder="Search cards"><div class="deck-filters">${["all", ...new Set(session.cards.map(card => card.type))].map(type => `<button data-deck-filter="${type}" class="${deckFilter === type ? "selected" : ""}">${type}</button>`).join("")}</div><div class="deck-card-list">${filteredDeck().map(card => tarotCard(card, null, { isDM: true, inDeck: true })).join("")}</div></aside>`;

const pickerMarkup = () => {
  if (!pickerSlot || viewRole !== ROLES.DM) return "";
  const slot = SLOTS.find(entry => entry.id === pickerSlot);
  return `<div class="picker-backdrop"><section class="card-picker" role="dialog" aria-modal="true"><header><h2>Add to ${slot.label}</h2><button class="picker-close" data-close-picker>×</button></header><p>This slot only accepts ${slot.accepts.map(labelForKey).join(" or ")} cards.</p><div class="picker-grid">${session.cards.filter(card => slot.accepts.includes(card.type)).map(card => `<button class="picker-option" data-place-card="${card.id}" data-place-slot="${slot.id}"><strong>${escapeHtml(card.title)}</strong><span>${escapeHtml(card.type)}</span></button>`).join("")}</div></section></div>`;
};

const renderPlayerStation = projected => {
  const actor = projected.actors.find(entry => entry.kind === "player");
  return `<section class="player-station panel"><header class="player-station-header"><div><small>YOUR CHARACTER</small><h2>${escapeHtml(actor?.name ?? "Character")}</h2></div><div class="action-economy"><span>Action ●</span><span>Bonus ●</span><span>Reaction ●</span></div></header><div class="player-station-grid"><article class="player-card-near-doll"><span class="category-ribbon">PLAYER CARD</span><h3>${escapeHtml(actor?.name ?? "Lyria")}</h3><p>Rogue · Level 5</p><p><strong>HP ${actor?.hp?.current ?? 32}/${actor?.hp?.max ?? 38}</strong></p><div class="inside-card-rolls"><button data-free-character-roll="check">Check</button><button data-free-character-roll="save">Save</button><button data-free-character-roll="attack">Attack</button></div></article><div class="character-doll"><div class="doll-head"></div><div class="doll-body"><span>${escapeHtml((actor?.name ?? "L").slice(0,1))}</span></div><div class="equipment-slot weapon-slot">Weapon</div><div class="equipment-slot armor-slot">Armor</div><div class="equipment-slot item-slot">Equipped</div></div><section class="backpack"><header><span class="backpack-icon">🎒</span><div><h3>Backpack</h3><small>Cards not equipped</small></div></header><div class="backpack-cards"><article class="mini-card">🗡 Rapier</article><article class="mini-card">🏹 Shortbow</article><article class="mini-card">🧪 Potion ×2</article><article class="mini-card">🧰 Tools</article></div></section></div></section>`;
};

function placeCard(cardId, slotId) {
  if (viewRole !== ROLES.DM) return;
  const card = cardById(cardId); const slot = SLOTS.find(entry => entry.id === slotId);
  if (!card || !slot || !slot.accepts.includes(card.type)) { cardRoll = "That card type does not belong in this slot."; render(); return; }
  if (slot.stackable) board[slotId].push(makeInstance(cardId)); else board[slotId] = [makeInstance(cardId)];
  pickerSlot = null; render();
}
function rollForInstance(instanceId, action) {
  if (viewRole !== ROLES.DM) return;
  const instance = Object.values(board).flat().find(item => item.instanceId === instanceId);
  if (!instance) return;
  const card = cardById(instance.cardId);
  if (action === "initiative") {
    const shared = d20(card?.dmFace?.initiative ?? 0);
    board.monster.filter(item => item.cardId === instance.cardId).forEach(item => { item.initiative = shared; });
    cardRoll = `${card.title} group initiative: ${shared}`;
  } else if (action === "use-charge") {
    if (instance.usesRemaining === null) return;
    if (instance.usesRemaining > 0) { instance.usesRemaining -= 1; cardRoll = `${card.title}: ${instance.usesRemaining} ${card.uses.label ?? "uses"} remaining.`; }
    else cardRoll = `${card.title} has no uses remaining.`;
  } else if (action === "restore-charge") {
    if (instance.usesRemaining === null) return;
    instance.usesRemaining = Math.min(card.uses.max, instance.usesRemaining + 1);
    cardRoll = `${card.title}: restored to ${instance.usesRemaining}/${card.uses.max}.`;
  } else {
    const total = d20(4); cardRoll = `${card.title} ${instance.instanceId} ${action}: ${total}`;
  }
  render();
}

function bind() {
  document.querySelectorAll("[data-die]").forEach(button => button.onclick = () => dispatch({ type: COMMANDS.ROLL_DIE, sides: Number(button.dataset.die) }));
  document.querySelectorAll("[data-d20-mode]").forEach(button => button.onclick = () => dispatch({ type: COMMANDS.ROLL_D20, mode: button.dataset.d20Mode }));
  document.querySelectorAll("[data-open-picker]").forEach(button => button.onclick = () => { if (viewRole === ROLES.DM) { pickerSlot = button.dataset.openPicker; render(); } });
  document.querySelectorAll("[data-place-card]").forEach(button => button.onclick = () => placeCard(button.dataset.placeCard, button.dataset.placeSlot));
  document.querySelector("[data-close-picker]")?.addEventListener("click", () => { pickerSlot = null; render(); });
  document.querySelectorAll("[data-toggle-stack]").forEach(control => {
    const toggle = event => {
      if (event?.target?.closest(".tarot-card")) return;
      const id = control.dataset.toggleStack;
      expandedStacks.has(id) ? expandedStacks.delete(id) : expandedStacks.add(id);
      render();
    };
    control.onclick = toggle;
    control.onkeydown = event => { if ((event.key === "Enter" || event.key === " ") && !event.target.closest(".tarot-card")) { event.preventDefault(); toggle(event); } };
  });
  document.querySelectorAll("[data-card-roll]").forEach(button => button.onclick = event => { event.stopPropagation(); rollForInstance(button.dataset.instance, button.dataset.cardRoll); });
  document.querySelectorAll("[data-flip-card]").forEach(button => button.onclick = () => { const key = button.dataset.flipCard; flipped.has(key) ? flipped.delete(key) : flipped.add(key); render(); });
  document.querySelectorAll("[data-reveal]").forEach(button => button.onclick = () => { if (viewRole === ROLES.DM) dispatch({ type: COMMANDS.TOGGLE_CARD, key: button.dataset.reveal }); });
  document.querySelectorAll("[data-remove-instance]").forEach(button => button.onclick = () => { if (viewRole !== ROLES.DM) return; Object.keys(board).forEach(slot => board[slot] = board[slot].filter(item => item.instanceId !== button.dataset.removeInstance)); render(); });
  document.querySelector("[data-roll-all-monsters]")?.addEventListener("click", () => {
    if (viewRole !== ROLES.DM) return;
    [...new Set(board.monster.map(instance => instance.cardId))].forEach(cardId => {
      const card = cardById(cardId); const shared = d20(card?.dmFace?.initiative ?? 0);
      board.monster.filter(instance => instance.cardId === cardId).forEach(instance => { instance.initiative = shared; });
    });
    cardRoll = "Grouped monster initiative rolled and sorted."; render();
  });
  document.querySelectorAll("[data-free-character-roll]").forEach(button => button.onclick = () => { cardRoll = `Character card ${button.dataset.freeCharacterRoll}: ${d20(4)}`; render(); });
  document.querySelectorAll("[data-deck-filter]").forEach(button => button.onclick = () => { if (viewRole === ROLES.DM) { deckFilter = button.dataset.deckFilter; render(); } });
  document.querySelector("#deckSearch")?.addEventListener("input", event => { if (viewRole === ROLES.DM) { deckSearch = event.target.value; render(); } });
  if (viewRole === ROLES.DM) {
    document.querySelectorAll("[draggable='true']").forEach(card => card.addEventListener("dragstart", event => event.dataTransfer.setData("text/card-id", card.dataset.cardId)));
    document.querySelectorAll("[data-slot]").forEach(slot => { slot.ondragover = event => event.preventDefault(); slot.ondrop = event => { event.preventDefault(); placeCard(event.dataTransfer.getData("text/card-id"), slot.dataset.slot); }; });
  }
}

function render() {
  const projected = projection(); const isDM = viewRole === ROLES.DM;
  const boardMarkup = `<main class="panel encounter-board"><header class="board-header"><div><small>${isDM ? "RUN THE CURRENT ADVENTURE STATE" : "EXPERIENCE THE CURRENT ADVENTURE"}</small><h1>${isDM ? "Dungeon Master Card Board" : "Revealed Adventure Cards"}</h1></div><p>${isDM ? "Track where the party is, what is happening now, the people and threats present, and every lasting result." : "See where your character is, what is happening, and the cards the Dungeon Master has revealed."}</p></header><div class="fixed-board">${SLOTS.map(slot => renderSlot(slot, projected, isDM)).join("")}</div></main>`;
  document.querySelector("#app").innerHTML = `<div class="app"><header class="topbar"><div class="brand">⬡ THE LIVING TABLE<br><small>${isDM ? "Dungeon Master Table" : "Player Table"}</small></div><div class="dice" aria-label="Freeform dice roller">${freeDice.map(die => `<button data-die="${die}">d${die}</button>`).join("")}<button data-d20-mode="advantage">Adv.</button><button data-d20-mode="disadvantage">Dis.</button></div><div class="result" aria-live="polite">${state.roll}<br>${state.total !== null ? `<strong>${state.total}</strong><small>${state.rollDetail}</small>` : state.rollDetail}</div></header>${isDM ? `<div class="workspace dm-workspace">${renderDeck()}${boardMarkup}${renderInitiative(true)}</div>` : `<div class="player-layout">${boardMarkup}${renderInitiative(false)}${renderPlayerStation(projected)}</div>`}${pickerMarkup()}</div>`;
  bind();
}
render();
