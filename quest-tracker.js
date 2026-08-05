import { createRuinedChapelSession } from "./src/encounter.js";
import { loadSession, updateSession } from "./src/session/session-state.js";

const encounter = createRuinedChapelSession();
const objectiveCards = encounter.cards.filter(card => card.type === "objective");
const fallbackMainQuestId = objectiveCards.find(card => card.id === "objective")?.id ?? objectiveCards[0]?.id;

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

function normalizedQuestState() {
  const local = loadSession();
  const mainQuestId = local?.quests?.[0] || fallbackMainQuestId;
  const active = Array.isArray(local?.questState?.active) ? local.questState.active : (local?.quests || []).filter(id => id !== mainQuestId);
  const revealed = Array.isArray(local?.questState?.revealed) ? local.questState.revealed : [mainQuestId, ...active].filter(Boolean);
  return { mainQuestId, active:new Set(active), revealed:new Set(revealed) };
}

function saveQuestState(state) {
  updateSession(session => ({
    ...session,
    quests:[state.mainQuestId, ...state.active].filter(Boolean),
    questState:{ active:[...state.active], revealed:[...state.revealed] }
  }));
}

function questCard(card, isDM) {
  const face = isDM ? card.dmFace : card.playerFace;
  const summary = card.playerFace?.summary ?? card.playerFace?.readAloud ?? "Quest objective";
  return `<article class="tarot-card type-objective" data-card-id="${escapeHtml(card.id)}" data-card-type="objective" tabindex="0">
    <div class="tarot-inner">
      <section class="tarot-face tarot-front"><span class="category-ribbon">objective</span><div class="card-art">◆</div><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(summary)}</p></section>
      <section class="tarot-face tarot-back"><span class="category-ribbon">${isDM ? "DM FULL CARD" : "PLAYER CARD"}</span><h3>${escapeHtml(card.title)}</h3><div class="card-copy">${faceDetails(face)}</div></section>
    </div>
  </article>`;
}

function isDMView() { return Boolean(document.querySelector('[data-role="dm"].selected')); }

function trackerState() {
  const isDM = isDMView();
  const state = normalizedQuestState();
  const renderKey = JSON.stringify({
    isDM,
    mainQuestId:state.mainQuestId,
    active:[...state.active].sort(),
    revealed:[...state.revealed].sort()
  });
  return { isDM, state, renderKey };
}

function trackerMarkup(snapshot) {
  const { isDM, state, renderKey } = snapshot;
  const mainQuest = objectiveCards.find(card => card.id === state.mainQuestId);
  const visibleSideQuests = objectiveCards.filter(card => state.active.has(card.id) && (isDM || state.revealed.has(card.id)));
  const available = objectiveCards.filter(card => card.id !== state.mainQuestId && !state.active.has(card.id));
  const controls = isDM ? `<div class="quest-add-controls"><select id="questCardSelect" aria-label="Choose a side quest">${available.length ? available.map(card => `<option value="${escapeHtml(card.id)}">${escapeHtml(card.title)}</option>`).join("") : '<option value="">No undiscovered side quests</option>'}</select><button type="button" data-add-side-quest ${available.length ? "" : "disabled"}>+ Add Side Quest</button></div>` : "";
  const mainMarkup = mainQuest ? `<div class="quest-entry main-quest">${questCard(mainQuest, isDM)}</div>` : "";
  const sideMarkup = visibleSideQuests.map(card => `<div class="quest-entry side-quest">${questCard(card, isDM)}${isDM ? `<button type="button" class="quest-remove" data-remove-side-quest="${escapeHtml(card.id)}">Remove</button>` : ""}</div>`).join("");
  const empty = !sideMarkup ? '<div class="quest-empty">Side quests appear here as the party discovers them.</div>' : "";
  return `<section class="panel quest-tracker" data-quest-render-key="${escapeHtml(renderKey)}" aria-labelledby="questTrackerTitle"><header class="quest-tracker-header"><div><small>SAVED WITH THE ADVENTURE SESSION</small><h2 id="questTrackerTitle">Quest Tracker</h2></div><p>Main and side quests now persist with the local adventure session.</p></header>${controls}<div class="quest-row">${mainMarkup}${sideMarkup}${empty}</div></section>`;
}

function bindTracker(tracker) {
  tracker.querySelector("[data-add-side-quest]")?.addEventListener("click", () => {
    const id = tracker.querySelector("#questCardSelect")?.value;
    if (!id) return;
    const state = normalizedQuestState();
    state.active.add(id);
    state.revealed.add(id);
    saveQuestState(state);
    scheduleTrackerRender();
  });
  tracker.querySelectorAll("[data-remove-side-quest]").forEach(button => button.addEventListener("click", () => {
    const state = normalizedQuestState();
    state.active.delete(button.dataset.removeSideQuest);
    state.revealed.delete(button.dataset.removeSideQuest);
    saveQuestState(state);
    scheduleTrackerRender();
  }));
}

let renderQueued = false;
function renderTracker() {
  const app = document.querySelector("#app .app");
  if (!app) return false;
  const snapshot = trackerState();
  const existing = app.querySelector(":scope > .quest-tracker");
  if (existing?.dataset.questRenderKey === snapshot.renderKey) return true;
  const next = document.createElement("template");
  next.innerHTML = trackerMarkup(snapshot).trim();
  const tracker = next.content.firstElementChild;
  if (!tracker) return false;
  existing?.replaceWith(tracker) ?? app.append(tracker);
  bindTracker(tracker);
  return true;
}

function scheduleTrackerRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderTracker();
  });
}

const appRoot = document.querySelector("#app");
if (appRoot) {
  const bootObserver = new MutationObserver(() => {
    if (renderTracker()) bootObserver.disconnect();
  });
  bootObserver.observe(appRoot, { childList:true });
}

document.addEventListener("click", event => {
  if (event.target.closest('[data-role]')) scheduleTrackerRender();
}, true);
window.addEventListener("living-table:session-updated", scheduleTrackerRender);
window.addEventListener("DOMContentLoaded", scheduleTrackerRender);
scheduleTrackerRender();
