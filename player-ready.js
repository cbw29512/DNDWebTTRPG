(() => {
  const playerState = {
    ready: false,
    hp: 28,
    maxHp: 28,
    actions: { action: true, bonus: true, reaction: true },
    equipped: { weapon: "Rapier", armor: "Leather Armor", item: "Birthday Spark" },
    backpack: [
      { id: "shortbow", name: "Shortbow", icon: "🏹", count: 1, equip: "weapon" },
      { id: "healing-candy", name: "Healing Candy", icon: "🍬", count: 3, usable: true },
      { id: "tools", name: "Thieves’ Tools", icon: "🧰", count: 1 },
      { id: "rope", name: "Gift Rope", icon: "🪢", count: 1, equip: "item" }
    ],
    message: "Choose Ready when your character and equipment look correct."
  };

  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function stationMarkup() {
    const actionButton = (key, label) => `<button type="button" class="economy-button ${playerState.actions[key] ? "available" : "spent"}" data-spend-action="${key}" aria-pressed="${!playerState.actions[key]}">${label} ${playerState.actions[key] ? "●" : "○"}</button>`;
    const inventory = playerState.backpack.map(item => `<article class="interactive-item" data-item-id="${item.id}">
      <span class="item-icon">${item.icon}</span>
      <div><strong>${escapeHtml(item.name)}</strong><small>${item.count > 1 ? `×${item.count}` : "Ready"}</small></div>
      <div class="item-buttons">
        ${item.equip ? `<button type="button" data-equip-item="${item.id}">Equip</button>` : ""}
        ${item.usable ? `<button type="button" data-use-item="${item.id}" ${item.count < 1 ? "disabled" : ""}>Use</button>` : ""}
      </div>
    </article>`).join("");

    return `<header class="player-station-header">
      <div><small>PLAYER STATION · LOCAL DEMO</small><h2>Wendy’s Birthday Hero</h2><p>Level 3 adventurer · AC 15 · Speed 30 ft.</p></div>
      <button type="button" class="ready-button ${playerState.ready ? "is-ready" : ""}" data-player-ready aria-pressed="${playerState.ready}">${playerState.ready ? "✓ Ready to Play" : "Mark Ready"}</button>
    </header>
    <div class="player-status-bar">
      <div class="hp-controls"><strong>HP ${playerState.hp}/${playerState.maxHp}</strong><button type="button" data-hp-change="-1">−1</button><button type="button" data-hp-change="1">+1</button></div>
      <div class="action-economy">${actionButton("action", "Action")}${actionButton("bonus", "Bonus")}${actionButton("reaction", "Reaction")}<button type="button" data-reset-turn>Reset Turn</button></div>
    </div>
    <div class="player-station-grid">
      <article class="player-card-near-doll">
        <span class="category-ribbon">PLAYER CHARACTER CARD</span>
        <h3>Wendy’s Birthday Hero</h3>
        <p><strong>Birthday Spark:</strong> Spend one candle token after a failed check to add 1d4.</p>
        <p><strong>Current goal:</strong> Recover the stolen cake and Wendy’s birthday wish.</p>
        <div class="inside-card-rolls"><button type="button" data-player-roll="check">Check</button><button type="button" data-player-roll="save">Save</button><button type="button" data-player-roll="attack">Attack</button></div>
      </article>
      <div class="character-doll" aria-label="Character equipment paper doll">
        <div class="doll-head"></div><div class="doll-body"><span>W</span></div>
        <button type="button" class="equipment-slot weapon-slot" data-cycle-slot="weapon"><small>Weapon</small><strong>${escapeHtml(playerState.equipped.weapon)}</strong></button>
        <button type="button" class="equipment-slot armor-slot" data-cycle-slot="armor"><small>Armor</small><strong>${escapeHtml(playerState.equipped.armor)}</strong></button>
        <button type="button" class="equipment-slot item-slot" data-cycle-slot="item"><small>Equipped Item</small><strong>${escapeHtml(playerState.equipped.item)}</strong></button>
      </div>
      <section class="backpack">
        <header><span class="backpack-icon">🎒</span><div><h3>Backpack</h3><small>Equip or use your player-known items</small></div></header>
        <div class="backpack-cards">${inventory}</div>
      </section>
    </div>
    <p class="player-feedback" aria-live="polite">${escapeHtml(playerState.message)}</p>`;
  }

  function roll(label) {
    const value = Math.floor(Math.random() * 20) + 5;
    playerState.message = `${label}: ${value}`;
    enhance();
  }

  function bind(station) {
    station.querySelector("[data-player-ready]")?.addEventListener("click", () => {
      playerState.ready = !playerState.ready;
      playerState.message = playerState.ready ? "Ready! Waiting for the DM to begin or reveal the next card." : "Ready status cleared.";
      enhance();
    });
    station.querySelectorAll("[data-spend-action]").forEach(button => button.addEventListener("click", () => {
      const key = button.dataset.spendAction;
      playerState.actions[key] = !playerState.actions[key];
      playerState.message = `${key[0].toUpperCase()}${key.slice(1)} ${playerState.actions[key] ? "restored" : "spent"}.`;
      enhance();
    }));
    station.querySelector("[data-reset-turn]")?.addEventListener("click", () => {
      Object.keys(playerState.actions).forEach(key => { playerState.actions[key] = true; });
      playerState.message = "Action, bonus action, and reaction restored for a new turn.";
      enhance();
    });
    station.querySelectorAll("[data-hp-change]").forEach(button => button.addEventListener("click", () => {
      playerState.hp = Math.max(0, Math.min(playerState.maxHp, playerState.hp + Number(button.dataset.hpChange)));
      playerState.message = `HP updated to ${playerState.hp}/${playerState.maxHp}.`;
      enhance();
    }));
    station.querySelectorAll("[data-player-roll]").forEach(button => button.addEventListener("click", () => roll(button.dataset.playerRoll)));
    station.querySelectorAll("[data-use-item]").forEach(button => button.addEventListener("click", () => {
      const item = playerState.backpack.find(entry => entry.id === button.dataset.useItem);
      if (!item || item.count < 1) return;
      item.count -= 1;
      if (item.id === "healing-candy") playerState.hp = Math.min(playerState.maxHp, playerState.hp + Math.floor(Math.random() * 4) + 1);
      playerState.message = `${item.name} used. ${item.count} remaining.`;
      enhance();
    }));
    station.querySelectorAll("[data-equip-item]").forEach(button => button.addEventListener("click", () => {
      const item = playerState.backpack.find(entry => entry.id === button.dataset.equipItem);
      if (!item?.equip) return;
      playerState.equipped[item.equip] = item.name;
      playerState.message = `${item.name} equipped in the ${item.equip} slot.`;
      enhance();
    }));
    station.querySelectorAll("[data-cycle-slot]").forEach(button => button.addEventListener("click", () => {
      playerState.message = `${button.dataset.cycleSlot} slot selected. Choose an Equip button from the backpack.`;
      enhance();
    }));
  }

  function enhance() {
    const station = document.querySelector("#app .player-station");
    if (!station) return;
    station.innerHTML = stationMarkup();
    station.dataset.playerReadyEnhanced = "true";
    bind(station);
  }

  const app = document.querySelector("#app");
  if (app) new MutationObserver(enhance).observe(app, { childList: true });
  window.addEventListener("DOMContentLoaded", enhance);
  enhance();
})();
