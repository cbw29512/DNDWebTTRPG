import { isDungeonMaster } from "./src/role-context.js";

const SESSION_KEY = "living-table-local-session-v1";
const CONTEXT_SLOT_IDS = Object.freeze(["location", "site", "room"]);
const CONTEXT_LABELS = Object.freeze({ location:"Location", site:"Site", room:"Area" });

let observer;
let scheduled = false;
let applying = false;
let lastContextKey = "";

const safeParse = value => {
  try { return JSON.parse(value); }
  catch { return null; }
};
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#039;"
}[character]));

function currentSceneDefinition() {
  const manifest = window.__DND_ADVENTURE_PACK__;
  const session = safeParse(localStorage.getItem(SESSION_KEY));
  const scenes = manifest?.scenes || [];
  return scenes.find(scene => scene.id === session?.currentSceneId)
    || scenes.find(scene => scene.id === manifest?.entrySceneId)
    || scenes[0]
    || null;
}

function visibleCardTitle(slotId) {
  const slot = document.querySelector(`#app [data-slot="${slotId}"]`);
  const card = slot?.querySelector(".single-card-holder .tarot-card");
  return card?.querySelector(".tarot-front h3")?.textContent?.trim()
    || card?.querySelector("h3")?.textContent?.trim()
    || "";
}

function preparedContext() {
  const manifest = window.__DND_ADVENTURE_PACK__;
  if (!manifest?.entrySceneId) return null;
  const scene = currentSceneDefinition();

  if (isDungeonMaster) {
    return {
      location: scene?.locationTitle || visibleCardTitle("location"),
      site: scene?.siteTitle || visibleCardTitle("site"),
      area: scene?.roomTitle || visibleCardTitle("room"),
      event: scene?.title || ""
    };
  }

  return {
    location: visibleCardTitle("location"),
    site: visibleCardTitle("site"),
    area: visibleCardTitle("room"),
    event: ""
  };
}

function contextMarkup(context) {
  const places = [
    ["Location", context.location],
    ["Site", context.site],
    ["Area", context.area]
  ].filter(([, value]) => value);

  return `<div class="prepared-place-path">${places.map(([label, value]) =>
    `<span><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></span>`
  ).join('<b aria-hidden="true">→</b>')}</div>
  ${context.event ? `<span class="prepared-current-event"><small>Current event</small><strong>${escapeHtml(context.event)}</strong></span>` : ""}`;
}

function lockPreparedContextSlots() {
  for (const slotId of CONTEXT_SLOT_IDS) {
    const slot = document.querySelector(`#app [data-slot="${slotId}"]`);
    if (!slot) continue;

    slot.dataset.preparedContext = "true";
    slot.setAttribute("aria-label", `${CONTEXT_LABELS[slotId]} — controlled by the prepared adventure`);

    slot.querySelectorAll("[data-open-picker]").forEach(button => {
      button.disabled = true;
      button.removeAttribute("data-open-picker");
      if (button.classList.contains("empty-slot")) {
        const label = button.querySelector("strong");
        if (label) label.textContent = "Loaded by the adventure";
      }
    });

    slot.querySelectorAll("[data-remove-instance]").forEach(button => button.remove());
  }
}

function renderContextBar(context) {
  const board = document.querySelector("#app .encounter-board");
  const header = board?.querySelector(".board-header");
  if (!board || !header) return;

  let bar = board.querySelector(":scope > .prepared-adventure-context");
  if (!bar) {
    bar = document.createElement("nav");
    bar.className = "prepared-adventure-context";
    bar.setAttribute("aria-label", "Current adventure position");
    header.insertAdjacentElement("afterend", bar);
  }

  const key = JSON.stringify(context);
  if (key !== lastContextKey || !bar.innerHTML.trim()) {
    bar.innerHTML = contextMarkup(context);
    lastContextKey = key;
  }
}

function removePlayerSceneLeak(areaSlot) {
  areaSlot.querySelectorAll(
    ".area-current-scene, .prepared-area-event, .prepared-area-card-event"
  ).forEach(node => node.remove());

  areaSlot.querySelectorAll(".card-detail").forEach(detail => {
    const label = detail.querySelector("strong")?.textContent
      ?.replace(/:\s*$/, "")
      .trim()
      .toLowerCase();
    if (label === "current scene") detail.remove();
  });
}

function renderAreaEvent(context) {
  const areaSlot = document.querySelector('#app [data-slot="room"]');
  if (!areaSlot) return;

  if (!isDungeonMaster) {
    removePlayerSceneLeak(areaSlot);
    return;
  }

  const headingCopy = areaSlot.querySelector(".slot-heading > div");
  let headingEvent = areaSlot.querySelector(".prepared-area-event");

  if (!context.event) {
    headingEvent?.remove();
  } else {
    if (!headingEvent && headingCopy) {
      headingEvent = document.createElement("span");
      headingEvent.className = "prepared-area-event";
      headingCopy.append(headingEvent);
    }
    if (headingEvent) {
      headingEvent.innerHTML = `<small>Current event</small><strong>${escapeHtml(context.event)}</strong>`;
    }
  }

  areaSlot.querySelectorAll(".tarot-face").forEach(face => {
    let badge = face.querySelector(".prepared-area-card-event");
    if (!context.event) {
      badge?.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "prepared-area-card-event";
      face.querySelector("h3")?.insertAdjacentElement("afterend", badge);
    }
    if (badge) {
      badge.innerHTML = `<small>Current event</small>${escapeHtml(context.event)}`;
    }
  });
}

function applyPreparedPlayBoard() {
  const app = document.querySelector("#app");
  const context = preparedContext();
  if (!app || !context || applying) return;

  applying = true;
  observer?.disconnect();
  try {
    document.body.classList.add("prepared-play-active");
    lockPreparedContextSlots();
    renderContextBar(context);
    renderAreaEvent(context);
  } finally {
    observer?.observe(app, { childList:true, subtree:true });
    applying = false;
  }
}

function schedulePreparedPlayBoard() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    applyPreparedPlayBoard();
  });
}

function blockPreparedContextMutation(event) {
  if (!window.__DND_ADVENTURE_PACK__?.entrySceneId) return;
  const slot = event.target?.closest?.("[data-prepared-context='true']");
  if (!slot) return;

  if (event.type === "click" && event.target.closest("[data-open-picker], .slot-add")) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  if (event.type === "dragover" || event.type === "drop") {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
  }
}

const app = document.querySelector("#app");
if (app) {
  observer = new MutationObserver(schedulePreparedPlayBoard);
  observer.observe(app, { childList:true, subtree:true });
}

document.addEventListener("click", blockPreparedContextMutation, true);
document.addEventListener("dragover", blockPreparedContextMutation, true);
document.addEventListener("drop", blockPreparedContextMutation, true);
window.addEventListener("living-table:scene-loaded", schedulePreparedPlayBoard);
window.addEventListener("living-table:session-updated", schedulePreparedPlayBoard);
window.addEventListener("dnd:adventure-loaded", schedulePreparedPlayBoard);
window.addEventListener("DOMContentLoaded", schedulePreparedPlayBoard);
schedulePreparedPlayBoard();
