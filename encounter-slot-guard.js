(() => {
  /* Objective cards remain in the board DOM as the canonical source for the
     dedicated Quest Tracker, even when that slot is visually hidden. */
  const BOARD_SLOT_IDS = new Set(["location", "site", "room", "scene", "npc", "monster", "hazard", "objective", "treasure"]);

  function enforceAdventureStateBoard() {
    const board = document.querySelector("#app .fixed-board");
    if (!board) return;

    board.querySelectorAll(":scope > .board-slot[data-slot]").forEach(slot => {
      if (!BOARD_SLOT_IDS.has(slot.dataset.slot)) slot.remove();
    });

    board.dataset.slotCount = String(board.querySelectorAll(":scope > .board-slot[data-slot]").length);
  }

  const app = document.querySelector("#app");
  if (app) {
    new MutationObserver(enforceAdventureStateBoard).observe(app, { childList: true });
  }

  window.addEventListener("DOMContentLoaded", enforceAdventureStateBoard);
  enforceAdventureStateBoard();
})();
