(() => {
  const ENCOUNTER_SLOT_IDS = new Set(["location", "room", "npc", "monster", "hazard", "treasure"]);

  function enforceSixSlotBoard() {
    const board = document.querySelector("#app .fixed-board");
    if (!board) return;

    board.querySelectorAll(":scope > .board-slot[data-slot]").forEach(slot => {
      if (!ENCOUNTER_SLOT_IDS.has(slot.dataset.slot)) slot.remove();
    });

    board.dataset.slotCount = String(board.querySelectorAll(":scope > .board-slot[data-slot]").length);
  }

  const app = document.querySelector("#app");
  if (app) {
    new MutationObserver(enforceSixSlotBoard).observe(app, { childList: true });
  }

  window.addEventListener("DOMContentLoaded", enforceSixSlotBoard);
  enforceSixSlotBoard();
})();
