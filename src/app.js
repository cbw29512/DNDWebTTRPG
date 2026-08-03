import { COMMANDS, applyCommand, createInitialState, eventText } from "./state.js";

let state = createInitialState();
const dice = [20, 12, 10, 8, 6, 4, 100];

const dispatch = command => {
  state = applyCommand(state, command).state;
  render();
};

const worldCard = (key, title, type, detail) => state.revealed[key]
  ? `<article class="card"><small>${type}</small><h3>${title}</h3><p>${detail}</p><button class="reveal" data-reveal="${key}">Hide</button></article>`
  : `<article class="card hidden"><div><strong>FACEDOWN</strong><br><button class="reveal" data-reveal="${key}">Reveal</button></div></article>`;

const plannedButton = label => `<button class="action" type="button" disabled title="Planned for the synchronized MVP">${label}<span class="sr-only"> — planned feature</span></button>`;

const activeTurnPanel = () => {
  const [name, role] = state.actors[state.active];
  if (role === "Monster") {
    return `<article class="character"><h2>${name}'s Turn</h2><p>DM-controlled combatant.</p><p>Monster actions and resolution controls are planned for the synchronized MVP.</p><button class="endturn" id="endTurn">End ${name}'s Turn</button></article>`;
  }

  return `<article class="character"><h2>${name}'s Turn</h2><p>1 Action · 1 Bonus Action · Reaction available</p><div class="actions">${[
    "Attack", "Cast Spell", "Dash", "Disengage", "Hide", "Help", "Cunning Action", "Off-Hand Attack", "Uncanny Dodge"
  ].map(plannedButton).join("")}</div><p class="prototype-note">Action buttons are visual placeholders in this static prototype.</p><button class="endturn" id="endTurn">End Turn</button></article>`;
};

function render() {
  const activeName = state.actors[state.active][0];
  document.querySelector("#app").innerHTML = `
    <div class="app">
      <header class="topbar">
        <div class="brand">⬡ THE LIVING TABLE<br><small>DM Battle Board</small></div>
        <div class="dice" aria-label="Dice roller">
          ${dice.map(die => `<button type="button" data-die="${die}">d${die}</button>`).join("")}
          <button type="button" data-d20-mode="advantage" title="Roll two d20s and keep the higher result">Adv.</button>
          <button type="button" data-d20-mode="disadvantage" title="Roll two d20s and keep the lower result">Dis.</button>
        </div>
        <div class="result" aria-live="polite">
          ${state.roll}<br>
          ${state.total !== null ? `<strong>${state.total}</strong><small>${state.rollDetail}</small>` : state.rollDetail}
        </div>
      </header>

      <div class="layout">
        <aside class="panel">
          <h2>Encounter Deck</h2>
          <div class="deck">
            ${[
              ["room", "The Ruined Chapel", "Room"],
              ["priest", "Cult Priest", "NPC / Monster"],
              ["skeleton", "Skeletons (2)", "Monster"],
              ["hazard", "Falling Stones", "Hazard"],
              ["treasure", "Treasure Chest", "Treasure"]
            ].map(([key, title, type]) => `<div class="deck-item"><span><strong>${title}</strong><br><small>${type}</small></span><button class="reveal" type="button" data-reveal="${key}" aria-label="${state.revealed[key] ? "Hide" : "Reveal"} ${title}">${state.revealed[key] ? "◉" : "○"}</button></div>`).join("")}
          </div>
          <h3>DM Notes</h3>
          <p>The priest completes the ritual at the end of round 3. A secret door lies behind the northern tapestry.</p>
          <button class="reveal" id="undo" type="button" ${state.undoStack.length ? "" : "disabled"}>Undo Last Action</button>
          <p><small>Revision ${state.revision} · ${state.events.length} recorded events</small></p>
        </aside>

        <main class="panel board" id="board">
          <div class="scene">
            <section class="room"><div><small>ROOM CARD</small><h2>The Ruined Chapel</h2><p>Fallen arches and whispering shadows.</p></div></section>
            <section class="map" aria-label="Battle map">
              <div class="token" style="left:18%;top:12%">SK</div><div class="token" style="left:42%;top:10%">SK</div><div class="token" style="left:68%;top:14%">CP</div>
              <div class="token player" style="left:20%;top:68%">TH</div><div class="token player" style="left:43%;top:67%">LY</div><div class="token player" style="left:65%;top:70%">DA</div><div class="token player" style="left:82%;top:66%">EL</div>
            </section>
          </div>
          <div class="cards">
            ${worldCard("room", "The Ruined Chapel", "Room Card", "Dim light. Rubble is difficult terrain.")}
            ${worldCard("priest", "Cult Priest", "Monster Card", "AC 12 · HP 32 · Dark Devotion")}
            ${worldCard("skeleton", "Skeleton", "Monster Card", "AC 13 · HP 13 · Undead")}
            ${worldCard("hazard", "Falling Stones", "Hazard Card", "DEX save DC 14")}
            ${worldCard("treasure", "Treasure Chest", "Treasure Card", "Contents remain unknown.")}
          </div>
        </main>

        <aside class="panel">
          <h2>Initiative — Round ${state.round}</h2>
          <ol class="initiative">${state.actors.map((actor, index) => `<li class="${index === state.active ? "active" : ""}"><span>${actor[0]}<small> ${actor[1]}</small></span><strong>${actor[2]}</strong></li>`).join("")}</ol>
          <h3>Objectives</h3><p>◇ Stop the ritual<br>◇ Defeat all enemies</p>
          <h3>Event Log</h3><div class="log" aria-live="polite">${eventText(state).map(entry => `<p>${entry}</p>`).join("")}</div>
        </aside>
      </div>

      <section class="bottom">
        <article class="character"><h2>Lyria</h2><p>Rogue · Level 5 · Half-Elf</p><div class="hpbar"><span></span></div><p><strong>HP 32/38</strong> · AC 15 · Init +4</p><p>Condition: Hidden</p>${plannedButton("View Full Sheet")}</article>
        ${activeTurnPanel()}
        <article class="character resources"><div><h2>Resources</h2><p>Movement: 30/30 ft</p><p>Sneak Attack: ◆◆◆◆◇◇</p><p>Inspiration: ●</p></div><div><h2>Spells & Items</h2><p>1st: <span class="slots"><i class="slot used"></i><i class="slot"></i><i class="slot"></i><i class="slot"></i></span></p><p>Rapier · Shortbow · Thieves' Tools · Potions (2)</p></div></article>
      </section>
      <p class="sr-only" aria-live="polite">Active combatant: ${activeName}. Revision ${state.revision}.</p>
    </div>`;

  document.querySelectorAll("[data-die]").forEach(button => {
    button.onclick = () => dispatch({ type: COMMANDS.ROLL_DIE, sides: Number(button.dataset.die) });
  });
  document.querySelectorAll("[data-d20-mode]").forEach(button => {
    button.onclick = () => dispatch({ type: COMMANDS.ROLL_D20, mode: button.dataset.d20Mode });
  });
  document.querySelectorAll("[data-reveal]").forEach(button => {
    button.onclick = () => dispatch({ type: COMMANDS.TOGGLE_CARD, key: button.dataset.reveal });
  });
  document.querySelector("#endTurn").onclick = () => dispatch({ type: COMMANDS.END_TURN });
  document.querySelector("#undo").onclick = () => dispatch({ type: COMMANDS.UNDO });
}

render();
