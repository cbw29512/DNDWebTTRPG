(() => {
  const characterCard = Object.freeze({
    id: "wendy-birthday-hero",
    name: "Wendy’s Birthday Hero",
    classLine: "Level 3 Adventurer",
    base: {
      maxHp: 28,
      ac: 14,
      speed: 30,
      proficiency: 2,
      attack: 5,
      damage: 3,
      saves: { strength: 1, dexterity: 5, constitution: 3, intelligence: 1, wisdom: 2, charisma: 4 },
      abilities: { strength: 10, dexterity: 16, constitution: 14, intelligence: 10, wisdom: 12, charisma: 15 }
    },
    features: [
      "Birthday Spark: spend one candle token after a failed check to add 1d4.",
      "Keeper of the Wish: Wendy decides how the recovered wish is shared."
    ]
  });

  const itemCards = Object.freeze([
    { id: "rapier", name: "Rapier", icon: "🗡️", slot: "mainHand", known: "Finesse melee weapon.", modifiers: { attack: 0, damage: 0 } },
    { id: "shortbow", name: "Shortbow", icon: "🏹", slot: "mainHand", known: "Ranged weapon, 80/320 feet.", modifiers: { attack: 0, damage: 0 } },
    { id: "leather", name: "Leather Armor", icon: "🥋", slot: "armor", known: "Light armor used by the character card’s base AC.", modifiers: {} },
    { id: "wish-crown", name: "Keeper of the Wish Crown", icon: "👑", slot: "head", known: "Marks Wendy as the birthday heart.", modifiers: { charisma: 1, wisdomSave: 1 } },
    { id: "lantern", name: "Lantern of Last Light", icon: "🏮", slot: "wondrous", known: "Sheds warm light and preserves three magical charges.", modifiers: { wisdom: 1 }, uses: { max: 3, current: 3 } },
    { id: "cloak", name: "Cloak of Celebration", icon: "🧥", slot: "shoulders", known: "A magical cloak that protects its wearer.", modifiers: { ac: 1, dexteritySave: 1 } },
    { id: "ring", name: "Ring of Candlelight", icon: "💍", slot: "ring", known: "A bright ring that sharpens magical attacks.", modifiers: { attack: 1 } },
    { id: "boots", name: "Ribbonstep Boots", icon: "🥾", slot: "feet", known: "Magical boots that increase walking speed.", modifiers: { speed: 5 } },
    { id: "shield", name: "Cake-Tray Shield", icon: "🛡️", slot: "offHand", known: "A polished enchanted tray used as a shield.", modifiers: { ac: 2 } },
    { id: "healing-candy", name: "Healing Candy", icon: "🍬", slot: null, known: "Bonus action: regain 1d4 hit points.", modifiers: {}, count: 3, usable: true },
    { id: "gift-rope", name: "Sixty-Foot Gift Rope", icon: "🪢", slot: "wondrous", known: "Grants advantage when secured for the Wrapping Room crossing.", modifiers: {} }
  ]);

  const cloneItem = item => ({ ...item, modifiers: { ...(item.modifiers ?? {}) }, uses: item.uses ? { ...item.uses } : null, count: item.count ?? 1 });
  const inventory = itemCards.map(cloneItem);

  const playerState = {
    ready: false,
    hp: characterCard.base.maxHp,
    actions: { action: true, bonus: true, reaction: true },
    equipped: {
      head: "wish-crown",
      neck: null,
      shoulders: "cloak",
      armor: "leather",
      hands: null,
      mainHand: "rapier",
      offHand: null,
      ring1: "ring",
      ring2: null,
      feet: "boots",
      wondrous: "lantern"
    },
    selectedSlot: null,
    message: "Base statistics come from the player character card. Equipped magic-item cards modify them automatically."
  };

  const slotLabels = Object.freeze({
    head: "Head", neck: "Neck", shoulders: "Shoulders", armor: "Armor", hands: "Hands",
    mainHand: "Main Hand", offHand: "Off Hand", ring1: "Ring 1", ring2: "Ring 2", feet: "Feet", wondrous: "Wondrous"
  });

  const escapeHtml = value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const itemById = id => inventory.find(item => item.id === id);
  const equippedIds = () => new Set(Object.values(playerState.equipped).filter(Boolean));

  function validSlots(item) {
    if (!item?.slot) return [];
    if (item.slot === "ring") return ["ring1", "ring2"];
    return [item.slot];
  }

  function derivedStats() {
    const stats = {
      ...characterCard.base,
      abilities: { ...characterCard.base.abilities },
      saves: { ...characterCard.base.saves }
    };
    equippedIds().forEach(id => {
      const mod = itemById(id)?.modifiers ?? {};
      stats.ac += mod.ac ?? 0;
      stats.speed += mod.speed ?? 0;
      stats.attack += mod.attack ?? 0;
      stats.damage += mod.damage ?? 0;
      stats.abilities.strength += mod.strength ?? 0;
      stats.abilities.dexterity += mod.dexterity ?? 0;
      stats.abilities.constitution += mod.constitution ?? 0;
      stats.abilities.intelligence += mod.intelligence ?? 0;
      stats.abilities.wisdom += mod.wisdom ?? 0;
      stats.abilities.charisma += mod.charisma ?? 0;
      stats.saves.strength += mod.strengthSave ?? 0;
      stats.saves.dexterity += mod.dexteritySave ?? 0;
      stats.saves.constitution += mod.constitutionSave ?? 0;
      stats.saves.intelligence += mod.intelligenceSave ?? 0;
      stats.saves.wisdom += mod.wisdomSave ?? 0;
      stats.saves.charisma += mod.charismaSave ?? 0;
    });
    return stats;
  }

  function slotMarkup(slot) {
    const id = playerState.equipped[slot];
    const item = itemById(id);
    const selected = playerState.selectedSlot === slot;
    return `<button type="button" class="rpg-slot slot-${slot} ${item ? "filled" : "empty"} ${selected ? "selected" : ""}" data-equipment-slot="${slot}" aria-pressed="${selected}">
      <small>${slotLabels[slot]}</small>
      <span class="slot-icon">${item?.icon ?? "+"}</span>
      <strong>${escapeHtml(item?.name ?? "Empty")}</strong>
    </button>`;
  }

  function modifierText(item) {
    const parts = Object.entries(item.modifiers ?? {}).filter(([, value]) => value).map(([key, value]) => `${key.replace(/Save$/, " save")} ${value > 0 ? "+" : ""}${value}`);
    return parts.length ? parts.join(" · ") : "No numerical modifier";
  }

  function stationMarkup() {
    const stats = derivedStats();
    const actionButton = (key, label) => `<button type="button" class="economy-button ${playerState.actions[key] ? "available" : "spent"}" data-spend-action="${key}" aria-pressed="${!playerState.actions[key]}">${label} ${playerState.actions[key] ? "●" : "○"}</button>`;
    const equipped = equippedIds();
    const inventoryMarkup = inventory.map(item => {
      const equippedNow = equipped.has(item.id);
      const availableSlots = validSlots(item);
      const canEquipSelected = playerState.selectedSlot && availableSlots.includes(playerState.selectedSlot);
      const uses = item.uses ? `<small>${item.uses.current}/${item.uses.max} charges</small>` : `<small>${item.count > 1 ? `×${item.count}` : modifierText(item)}</small>`;
      return `<article class="magic-item-card ${equippedNow ? "is-equipped" : ""}" data-item-id="${item.id}" tabindex="0">
        <span class="item-icon">${item.icon}</span>
        <div class="item-copy"><strong>${escapeHtml(item.name)}</strong>${uses}<p>${escapeHtml(item.known)}</p></div>
        <div class="item-buttons">
          ${item.slot ? `<button type="button" data-equip-item="${item.id}" ${playerState.selectedSlot && !canEquipSelected ? "disabled" : ""}>${equippedNow ? "Move / Equip" : "Equip"}</button>` : ""}
          ${equippedNow ? `<button type="button" data-unequip-item="${item.id}">Unequip</button>` : ""}
          ${item.usable || item.uses ? `<button type="button" data-use-item="${item.id}" ${(item.count ?? item.uses?.current ?? 0) < 1 ? "disabled" : ""}>Use</button>` : ""}
          <button type="button" data-read-item="${item.id}">Read Card</button>
        </div>
      </article>`;
    }).join("");

    const abilityMarkup = Object.entries(stats.abilities).map(([name, value]) => `<div><small>${name.slice(0, 3).toUpperCase()}</small><strong>${value}</strong></div>`).join("");
    const saveMarkup = Object.entries(stats.saves).map(([name, value]) => `<span>${name.slice(0, 3).toUpperCase()} ${value >= 0 ? "+" : ""}${value}</span>`).join("");

    return `<header class="player-station-header">
      <div><small>PLAYER CHARACTER CARD + EQUIPMENT</small><h2>${escapeHtml(characterCard.name)}</h2><p>${escapeHtml(characterCard.classLine)} · statistics recalculate from equipped cards</p></div>
      <button type="button" class="ready-button ${playerState.ready ? "is-ready" : ""}" data-player-ready aria-pressed="${playerState.ready}">${playerState.ready ? "✓ Ready to Play" : "Mark Ready"}</button>
    </header>
    <div class="player-status-bar">
      <div class="hp-controls"><strong>HP ${playerState.hp}/${stats.maxHp}</strong><button type="button" data-hp-change="-1">−1</button><button type="button" data-hp-change="1">+1</button></div>
      <div class="action-economy">${actionButton("action", "Action")}${actionButton("bonus", "Bonus")}${actionButton("reaction", "Reaction")}<button type="button" data-reset-turn>Reset Turn</button></div>
    </div>
    <div class="derived-stat-strip">
      <div><small>AC</small><strong>${stats.ac}</strong></div><div><small>Speed</small><strong>${stats.speed} ft.</strong></div><div><small>Attack</small><strong>+${stats.attack}</strong></div><div><small>Damage</small><strong>+${stats.damage}</strong></div><div><small>Proficiency</small><strong>+${stats.proficiency}</strong></div>
    </div>
    <div class="player-station-grid rpg-station-grid">
      <article class="player-card-near-doll character-source-card">
        <span class="category-ribbon">PLAYER CHARACTER CARD</span><h3>${escapeHtml(characterCard.name)}</h3>
        <div class="ability-grid">${abilityMarkup}</div><div class="save-row">${saveMarkup}</div>
        ${characterCard.features.map(feature => `<p>${escapeHtml(feature)}</p>`).join("")}
        <div class="inside-card-rolls"><button type="button" data-player-roll="check">Check</button><button type="button" data-player-roll="save">Save</button><button type="button" data-player-roll="attack">Attack</button></div>
      </article>
      <section class="rpg-paper-doll" aria-label="RPG character equipment paper doll">
        <div class="doll-title"><strong>Equipment</strong><small>Select a slot, then equip a matching magic-item card</small></div>
        <div class="rpg-silhouette" aria-hidden="true"><div class="silhouette-head"></div><div class="silhouette-torso"></div><div class="silhouette-arm left"></div><div class="silhouette-arm right"></div><div class="silhouette-leg left"></div><div class="silhouette-leg right"></div></div>
        ${Object.keys(slotLabels).map(slotMarkup).join("")}
      </section>
      <section class="backpack magic-inventory">
        <header><span class="backpack-icon">🎒</span><div><h3>Magic Item Cards</h3><small>${playerState.selectedSlot ? `Selected slot: ${slotLabels[playerState.selectedSlot]}` : "Select a doll slot or equip automatically"}</small></div></header>
        <div class="backpack-cards">${inventoryMarkup}</div>
      </section>
    </div>
    <p class="player-feedback" aria-live="polite">${escapeHtml(playerState.message)}</p>`;
  }

  function chooseSlotForItem(item) {
    const valid = validSlots(item);
    if (playerState.selectedSlot && valid.includes(playerState.selectedSlot)) return playerState.selectedSlot;
    return valid.find(slot => !playerState.equipped[slot]) ?? valid[0];
  }

  function enhance() {
    const station = document.querySelector("#app .player-station");
    if (!station) return;
    station.innerHTML = stationMarkup();
    station.dataset.playerReadyEnhanced = "true";
    bind(station);
  }

  function bind(station) {
    station.querySelector("[data-player-ready]")?.addEventListener("click", () => { playerState.ready = !playerState.ready; playerState.message = playerState.ready ? "Ready! Your character card and equipped item bonuses are locked in for the demo." : "Ready status cleared."; enhance(); });
    station.querySelectorAll("[data-spend-action]").forEach(button => button.addEventListener("click", () => { const key = button.dataset.spendAction; playerState.actions[key] = !playerState.actions[key]; playerState.message = `${key} ${playerState.actions[key] ? "restored" : "spent"}.`; enhance(); }));
    station.querySelector("[data-reset-turn]")?.addEventListener("click", () => { Object.keys(playerState.actions).forEach(key => { playerState.actions[key] = true; }); playerState.message = "Action, bonus action, and reaction restored."; enhance(); });
    station.querySelectorAll("[data-hp-change]").forEach(button => button.addEventListener("click", () => { const max = derivedStats().maxHp; playerState.hp = Math.max(0, Math.min(max, playerState.hp + Number(button.dataset.hpChange))); playerState.message = `HP updated to ${playerState.hp}/${max}.`; enhance(); }));
    station.querySelectorAll("[data-player-roll]").forEach(button => button.addEventListener("click", () => { const stats = derivedStats(); const kind = button.dataset.playerRoll; const modifier = kind === "attack" ? stats.attack : kind === "save" ? stats.saves.dexterity : Math.floor((stats.abilities.dexterity - 10) / 2); playerState.message = `${kind}: ${Math.floor(Math.random() * 20) + 1 + modifier}`; enhance(); }));
    station.querySelectorAll("[data-equipment-slot]").forEach(button => button.addEventListener("click", () => { playerState.selectedSlot = playerState.selectedSlot === button.dataset.equipmentSlot ? null : button.dataset.equipmentSlot; playerState.message = playerState.selectedSlot ? `${slotLabels[playerState.selectedSlot]} selected. Choose a matching card.` : "Equipment slot selection cleared."; enhance(); }));
    station.querySelectorAll("[data-equip-item]").forEach(button => button.addEventListener("click", () => {
      const item = itemById(button.dataset.equipItem); const slot = chooseSlotForItem(item);
      if (!slot) return;
      Object.keys(playerState.equipped).forEach(key => { if (playerState.equipped[key] === item.id) playerState.equipped[key] = null; });
      playerState.equipped[slot] = item.id; playerState.selectedSlot = null;
      playerState.message = `${item.name} equipped in ${slotLabels[slot]}. Statistics recalculated.`; enhance();
    }));
    station.querySelectorAll("[data-unequip-item]").forEach(button => button.addEventListener("click", () => { const id = button.dataset.unequipItem; Object.keys(playerState.equipped).forEach(slot => { if (playerState.equipped[slot] === id) playerState.equipped[slot] = null; }); playerState.message = `${itemById(id)?.name} unequipped. Statistics recalculated.`; enhance(); }));
    station.querySelectorAll("[data-use-item]").forEach(button => button.addEventListener("click", () => {
      const item = itemById(button.dataset.useItem); if (!item) return;
      if (item.uses) { if (item.uses.current < 1) return; item.uses.current -= 1; playerState.message = `${item.name} used. ${item.uses.current}/${item.uses.max} charges remain.`; }
      else { if (item.count < 1) return; item.count -= 1; if (item.id === "healing-candy") playerState.hp = Math.min(derivedStats().maxHp, playerState.hp + Math.floor(Math.random() * 4) + 1); playerState.message = `${item.name} used. ${item.count} remain.`; }
      enhance();
    }));
    station.querySelectorAll("[data-read-item]").forEach(button => button.addEventListener("click", () => { const item = itemById(button.dataset.readItem); playerState.message = `${item.name}: ${item.known} ${modifierText(item)}.`; enhance(); }));
  }

  const app = document.querySelector("#app");
  if (app) new MutationObserver(enhance).observe(app, { childList: true });
  window.addEventListener("DOMContentLoaded", enhance);
  enhance();
})();
