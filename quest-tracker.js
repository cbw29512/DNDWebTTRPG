import { createRuinedChapelSession } from "./src/encounter.js";

const session = createRuinedChapelSession();
const objectiveCards = session.cards.filter(card => card.type === "objective");
const mainQuestId = objectiveCards.find(card => card.id === "objective")?.id ?? objectiveCards[0]?.id;
const activeSideQuests = new Set();
const revealedQuests = new Set(mainQuestId ? [mainQuestId] : []);

const escapeHtml = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const labelForKey = key => key.replace(/([A-Z])/g, " $1").replace(/^./, letter => letter.toUpperCase());

const faceDetails = face => Object.entries(face ?? {}).map(([key, value]) => {
  const text = Array.isArray(value) ? value.join(" • ") : value;
  return `<p><strong>${escapeHtml(labelForKey(key))}:</strong> ${escapeHtml(text)}</p>`;
}).join("");

function questCard(card, isDM) {
  const face = isDM ? card.dmFace : card.playerFace;
  const summary = card.playerFace?.summary ?? card.playerFace?.readAloud ?? "Quest objective";
  return `<article class="tarot-card type-objective" data-card-id="${escapeHtml(card.id)}" data-card-type="objective" tabindex="0">
    <div class="tarot-inner">
      <section class="tarot-face tarot-front">
        <span class="category-ribbon">objective</span>
        <div class="card-art">◆</div>
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(summary)}</p>
      </section>
      <section class="tarot-face tarot-back">
        <span class="category-ribbon">${isDM ? "DM FULL CARD" : "PLAYER CARD"}</span>
        <h3>${escapeHtml(card.title)}</h3>
        <div class="card-copy">${faceDetails(face)}</div>
      </section>
    </div>
  </article>`;
}

function isDMView() {
  return Boolean(document.querySelector('[data-role="dm"].selected'));
}

function availableSideQuests() {
  return objectiveCards.filter(card => card.id !== mainQuestId && !activeSideQuests.has(card.id));
}

function trackerMarkup() {
  const isDM = isDMView();
  const mainQuest = objectiveCards.find(card => card.id === mainQuestId);
  const visibleSideQuests = objectiveCards.filter(card => activeSideQuests.has(card.id) && (isDM || revealedQuests.has(card.id)));
  const available = availableSideQuests();

  const controls = isDM ? `<div class="quest-add-controls">
    <select id="questCardSelect" aria-label="Choose a side quest">
      ${available.length ? available.map(card => `<option value="${escapeHtml(card.id)}">${escapeHtml(card.title)}</option>`).join("") : '<option value="">No undiscovered side quests</option>'}
    </select>
    <button type="button" data-add-side-quest ${available.length ? "" : "disabled"}>+ Add Side Quest</button>
  </div>` : "";

  const mainMarkup = mainQuest ? `<div class="quest-entry main-quest">${questCard(mainQuest, isDM)}</div>` : "";
  const sideMarkup = visibleSideQuests.map(card => `<div class="quest-entry side-quest">
    ${questCard(card, isDM)}
    ${isDM ? `<button type="button" class="quest-remove" data-remove-side-quest="${escapeHtml(card.id)}">Remove</button>` : ""}
  </div>`).join("");
  const empty = !sideMarkup ? '<div class="quest-empty">Side quests appear here as the party discovers them.</div>' : "";

  return `<section class="panel quest-tracker" aria-labelledby="questTrackerTitle">
    <header class="quest-tracker-header">
      <div><small>KEEP THE ADVENTURE ON TRACK</small><h2 id="questTrackerTitle">Quest Tracker</h2></div>
      <p>The main quest stays visible. Newly discovered side quests are added beside it and only appear to players after they are revealed.</p>
    </header>
    ${controls}
    <div class="quest-row">${mainMarkup}${sideMarkup}${empty}</div>
  </section>`;
}

function bindTracker(tracker) {
  tracker.querySelector("[data-add-side-quest]")?.addEventListener("click", () => {
    const select = tracker.querySelector("#questCardSelect");
    const id = select?.value;
    if (!id) return;
    activeSideQuests.add(id);
    revealedQuests.add(id);
    renderTracker();
  });

  tracker.querySelectorAll("[data-remove-side-quest]").forEach(button => {
    button.addEventListener("click", () => {
      activeSideQuests.delete(button.dataset.removeSideQuest);
      revealedQuests.delete(button.dataset.removeSideQuest);
      renderTracker();
    });
  });
}

function renderTracker() {
  const app = document.querySelector("#app .app");
  if (!app) return;
  app.querySelector(".quest-tracker")?.remove();
  app.insertAdjacentHTML("beforeend", trackerMarkup());
  const tracker = app.querySelector(".quest-tracker");
  if (tracker) bindTracker(tracker);
}

const appRoot = document.querySelector("#app");
if (appRoot) {
  new MutationObserver(() => renderTracker()).observe(appRoot, { childList: true });
}
window.addEventListener("DOMContentLoaded", renderTracker);
renderTracker();
