(() => {
  const VISIBLE_SLOT_IDS = new Set([
    "location",
    "site",
    "room",
    "npc",
    "monster",
    "hazard",
    "treasure"
  ]);

  const SESSION_KEY = "living-table-local-session-v1";
  let enforceQueued = false;

  function activeSceneTitle() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      const manifest = window.__DND_ADVENTURE_PACK__;
      const scene = manifest?.scenes?.find(entry => entry.id === session?.currentSceneId)
        || manifest?.scenes?.find(entry => entry.id === manifest?.entrySceneId)
        || manifest?.scenes?.[0];
      return scene?.title || "";
    } catch {
      return "";
    }
  }

  function relabelArea(board) {
    const areaSlot = board.querySelector(':scope > .board-slot[data-slot="room"]');
    if (!areaSlot) return;

    const heading = areaSlot.querySelector(".slot-heading");
    const title = heading?.querySelector("h2");
    const helper = heading?.querySelector("small");
    if (title) title.textContent = "Area";
    if (helper) helper.textContent = "The party's immediate playable surroundings";

    areaSlot.querySelectorAll(".category-ribbon").forEach(ribbon => {
      if (ribbon.textContent.trim().toLowerCase() === "room") ribbon.textContent = "area";
    });

    const sceneTitle = activeSceneTitle();
    let sceneLabel = heading?.querySelector(".area-current-scene");
    if (!sceneTitle) {
      sceneLabel?.remove();
      return;
    }
    if (!sceneLabel && heading) {
      sceneLabel = document.createElement("span");
      sceneLabel.className = "area-current-scene";
      heading.append(sceneLabel);
    }
    if (sceneLabel) sceneLabel.textContent = `Now: ${sceneTitle}`;
  }

  function pruneRedundantDeckCards() {
    const deck = document.querySelector("#app .adventure-deck");
    if (!deck) return;
    deck.querySelectorAll('[data-card-type="scene"], [data-card-type="objective"]').forEach(card => card.remove());
    deck.querySelectorAll('[data-deck-filter="scene"], [data-deck-filter="objective"]').forEach(button => button.remove());
    deck.querySelectorAll(".type-room .category-ribbon").forEach(ribbon => {
      if (ribbon.textContent.trim().toLowerCase() === "room") ribbon.textContent = "area";
    });
  }

  function enforceLeanAdventureBoard() {
    const board = document.querySelector("#app .fixed-board");
    if (!board) return;

    board.querySelectorAll(":scope > .board-slot[data-slot]").forEach(slot => {
      if (!VISIBLE_SLOT_IDS.has(slot.dataset.slot)) slot.remove();
    });

    relabelArea(board);
    pruneRedundantDeckCards();
    board.dataset.slotCount = String(board.querySelectorAll(":scope > .board-slot[data-slot]").length);
  }

  function scheduleEnforcement() {
    if (enforceQueued) return;
    enforceQueued = true;
    requestAnimationFrame(() => {
      enforceQueued = false;
      enforceLeanAdventureBoard();
    });
  }

  const app = document.querySelector("#app");
  if (app) new MutationObserver(scheduleEnforcement).observe(app, { childList: true });

  window.addEventListener("living-table:session-updated", scheduleEnforcement);
  window.addEventListener("living-table:scene-loaded", scheduleEnforcement);
  window.addEventListener("DOMContentLoaded", scheduleEnforcement);
  scheduleEnforcement();
})();