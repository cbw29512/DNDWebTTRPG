import { COMMANDS, applyCommand, createInitialState, eventText } from "./state.js";
import { createRuinedChapelSession } from "./encounter.js";
import { projectSessionFor } from "./projection.js";
import { ROLES } from "./schema.js";

let state = createInitialState();
let viewRole = ROLES.DM;
const session = createRuinedChapelSession();
const dice = [20,12,10,8,6,4,100];

const participant = () => session.participants.find(entry => entry.role === viewRole);
const projection = () => {
  session.cards.forEach(card => { if (card.id in state.revealed) card.revealed = state.revealed[card.id]; });
  return projectSessionFor(session, participant());
};
const dispatch = command => { state = applyCommand(state, command).state; render(); };
const plannedButton = label => `<button class="action" type="button" disabled title="Planned for the synchronized MVP">${label}<span class="sr-only"> — planned feature</span></button>`;

const renderCard = card => {
  const details = viewRole === ROLES.DM ? card.dmFace : card.face;
  const body = Object.entries(details).map(([key,value]) => `<p><strong>${key.replace(/([A-Z])/g," $1")}:</strong> ${Array.isArray(value)?value.join(", "):value}</p>`).join("");
  const control = viewRole === ROLES.DM ? `<button class="reveal" data-reveal="${card.id}">${card.revealed?"Hide":"Reveal"}</button>` : "";
  return `<article class="card"><small>${card.type}</small><h3>${card.title}</h3>${body}${control}</article>`;
};

const activeTurnPanel = projected => {
  const source = state.actors[state.active];
  const actor = projected.actors.find(entry => entry.name === source[0]);
  if (!actor) return `<article class="character"><h2>Hidden turn</h2><p>This combatant is not visible to this participant.</p></article>`;
  const controlled = viewRole === ROLES.DM || actor.controllerId === projected.participant.id;
  if (!controlled) return `<article class="character"><h2>${actor.name}'s Turn</h2><p>Waiting for ${actor.kind === "monster" ? "the DM" : "another player"}.</p></article>`;
  return `<article class="character"><h2>${actor.name}'s Turn</h2><p>1 Action · 1 Bonus Action · Reaction available</p><div class="actions">${["Attack","Cast Spell","Dash","Disengage","Hide","Help","Ready Action","Use Item","Reaction"].map(plannedButton).join("")}</div><p class="prototype-note">Action resolution is the next MVP layer.</p><button class="endturn" id="endTurn">End Turn</button></article>`;
};

function render(){
  const projected = projection();
  const isDM = viewRole === ROLES.DM;
  const visibleCards = projected.cards;
  document.querySelector("#app").innerHTML = `<div class="app">
    <header class="topbar">
      <div class="brand">⬡ THE LIVING TABLE<br><small>${isDM?"DM Battle Board":"Player Battle Board"}</small></div>
      <div class="dice" aria-label="Dice roller">${dice.map(d=>`<button data-die="${d}">d${d}</button>`).join("")}<button data-d20-mode="advantage">Adv.</button><button data-d20-mode="disadvantage">Dis.</button></div>
      <div class="result" aria-live="polite">${state.roll}<br>${state.total!==null?`<strong>${state.total}</strong><small>${state.rollDetail}</small>`:state.rollDetail}</div>
    </header>
    <nav class="view-switch panel" aria-label="Prototype role preview"><strong>Preview:</strong><button class="reveal ${isDM?"selected":""}" data-role="dm">DM View</button><button class="reveal ${!isDM?"selected":""}" data-role="player">Player View</button><span>${isDM?"Complete authoritative state":"Filtered player projection—no DM secrets"}</span></nav>
    <div class="layout">
      ${isDM?`<aside class="panel"><h2>Encounter Deck</h2><div class="deck">${session.cards.map(card=>`<div class="deck-item"><span><strong>${card.title}</strong><br><small>${card.type}</small></span><button class="reveal" data-reveal="${card.id}">${card.revealed?"◉":"○"}</button></div>`).join("")}</div><h3>DM Notes</h3><p>The priest completes the ritual at the end of round 3. A secret door lies behind the northern tapestry.</p><button class="reveal" id="undo" ${state.undoStack.length?"":"disabled"}>Undo Last Action</button><p><small>Revision ${state.revision} · ${state.events.length} events</small></p></aside>`:`<aside class="panel"><h2>Your Information</h2><p>You see revealed world cards, public actor states, and your own complete character information.</p><p class="safe-note">Monster HP, AC, tactics, unrevealed cards, and DM notes are absent from this projection.</p></aside>`}
      <main class="panel board"><div class="scene"><section class="room"><div><small>ROOM CARD</small><h2>The Ruined Chapel</h2><p>Fallen arches and whispering shadows.</p></div></section><section class="map" aria-label="Battle map"><div class="token" style="left:18%;top:12%">SK</div><div class="token" style="left:42%;top:10%">SK</div><div class="token" style="left:68%;top:14%">CP</div><div class="token player" style="left:20%;top:68%">TH</div><div class="token player" style="left:43%;top:67%">LY</div><div class="token player" style="left:65%;top:70%">DA</div><div class="token player" style="left:82%;top:66%">EL</div></section></div><div class="cards">${visibleCards.map(renderCard).join("") || `<article class="card hidden"><strong>No world cards revealed</strong></article>`}</div></main>
      <aside class="panel"><h2>Initiative — Round ${state.round}</h2><ol class="initiative">${projected.actors.map(actor=>`<li class="${actor.name===state.actors[state.active][0]?"active":""}"><span>${actor.name}<small> ${actor.kind}</small></span><strong>${actor.initiative}</strong></li>`).join("")}</ol><h3>Objectives</h3><p>◇ Stop the ritual<br>◇ Defeat all enemies</p><h3>Event Log</h3><div class="log">${eventText(state).map(entry=>`<p>${entry}</p>`).join("")}</div></aside>
    </div>
    <section class="bottom"><article class="character"><h2>Lyria</h2><p>Rogue · Level 5</p><div class="hpbar"><span></span></div><p><strong>HP 32/38</strong> · AC 15 · Init +4</p><p>Condition: ${isDM||projected.participant.id==="player-lyria"?"Hidden":"Private"}</p>${plannedButton("View Full Sheet")}</article>${activeTurnPanel(projected)}<article class="character resources"><div><h2>Resources</h2><p>Movement: 30/30 ft</p><p>Sneak Attack: ◆◆◆◆◇◇</p></div><div><h2>Spells & Items</h2><p>Rapier · Shortbow · Potions (2)</p></div></article></section>
  </div>`;
  document.querySelectorAll("[data-role]").forEach(button=>button.onclick=()=>{viewRole=button.dataset.role;render();});
  document.querySelectorAll("[data-die]").forEach(button=>button.onclick=()=>dispatch({type:COMMANDS.ROLL_DIE,sides:Number(button.dataset.die)}));
  document.querySelectorAll("[data-d20-mode]").forEach(button=>button.onclick=()=>dispatch({type:COMMANDS.ROLL_D20,mode:button.dataset.d20Mode}));
  document.querySelectorAll("[data-reveal]").forEach(button=>button.onclick=()=>dispatch({type:COMMANDS.TOGGLE_CARD,key:button.dataset.reveal}));
  document.querySelector("#endTurn")?.addEventListener("click",()=>dispatch({type:COMMANDS.END_TURN}));
  document.querySelector("#undo")?.addEventListener("click",()=>dispatch({type:COMMANDS.UNDO}));
}
render();
