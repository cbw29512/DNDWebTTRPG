import { activateCharacterCard, resolveRequestedCharacter } from "./src/player/character-cards.js";

let activeCharacter = resolveRequestedCharacter();
let showingBack = false;

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[char]));

function cardMarkup(character) {
  const face = showingBack
    ? `<div class="pregen-character-back"><small>CHARACTER CARD · PLAYER BACK</small><h3>${esc(character.name)}</h3><p>${esc(character.back.summary)}</p><ul>${character.back.playNotes.map(note=>`<li>${esc(note)}</li>`).join("")}</ul><div class="pregen-card-code">Character ID: ${esc(character.id)} · v${esc(character.version)}</div></div>`
    : `<div class="pregen-character-front"><small>PREGENERATED CHARACTER</small><div class="pregen-portrait" role="img" aria-label="${esc(character.front.artAlt)}">${character.front.portrait}</div><h3>${esc(character.front.title)}</h3><p>${esc(character.front.subtitle)}</p><span>${esc(character.classLine)}</span></div>`;
  return `<section class="loaded-pregen-card" data-loaded-character="${esc(character.id)}">
    ${face}
    <div class="pregen-card-controls"><button type="button" data-flip-character-card>${showingBack ? "Show Picture Front" : "Show Information Back"}</button><span>Loaded into Player View</span></div>
  </section>`;
}

function enhancePlayerCard() {
  const host = document.querySelector("#app .character-source-card");
  if (!host || host.querySelector(".loaded-pregen-card")) return;
  host.insertAdjacentHTML("afterbegin", cardMarkup(activeCharacter));
  host.querySelector("[data-flip-character-card]")?.addEventListener("click", () => {
    showingBack = !showingBack;
    host.querySelector(".loaded-pregen-card")?.remove();
    enhancePlayerCard();
  });
}

function loadCharacter(id) {
  activeCharacter = activateCharacterCard(id);
  showingBack = false;
  document.querySelector(".loaded-pregen-card")?.remove();
  enhancePlayerCard();
}

window.addEventListener("living-table:character-requested", event => loadCharacter(event.detail.characterId));
window.addEventListener("living-table:character-loaded", event => { activeCharacter = event.detail.character; });

const requested = new URLSearchParams(location.search).get("character");
if (requested) loadCharacter(requested);

const app = document.querySelector("#app");
if (app) new MutationObserver(enhancePlayerCard).observe(app, { childList:true, subtree:true });
window.addEventListener("DOMContentLoaded", enhancePlayerCard);
enhancePlayerCard();
