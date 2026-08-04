(() => {
  const STORAGE_KEY = 'living-table-grouped-initiative-v1';
  const grouped = new Map(Object.entries(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')));
  let pendingCardId = null;
  let pendingRollAll = false;
  let scheduled = false;

  const save = () => sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(grouped)));
  const parseInitiative = element => {
    const match = element?.textContent?.match(/Init\s+(-?\d+)/i);
    return match ? Number(match[1]) : null;
  };

  function collectMonsterGroups() {
    const groups = new Map();
    document.querySelectorAll('.slot-monster .tarot-card[data-card-id]').forEach(card => {
      const cardId = card.dataset.cardId;
      const title = card.querySelector('h3')?.textContent?.trim() || cardId;
      const record = groups.get(cardId) || { cardId, title, count: 0, cards: [] };
      record.count += 1;
      record.cards.push(card);
      groups.set(cardId, record);
    });
    return groups;
  }

  function captureFreshRolls(groups) {
    if (pendingRollAll) {
      groups.forEach(group => {
        const value = group.cards.map(card => parseInitiative(card.querySelector('.instance-strip strong'))).find(Number.isFinite);
        if (Number.isFinite(value)) grouped.set(group.cardId, value);
      });
      pendingRollAll = false;
      save();
    } else if (pendingCardId && groups.has(pendingCardId)) {
      const group = groups.get(pendingCardId);
      const value = group.cards.map(card => parseInitiative(card.querySelector('.instance-strip strong'))).find(Number.isFinite);
      if (Number.isFinite(value)) {
        grouped.set(pendingCardId, value);
        save();
      }
      pendingCardId = null;
    }
  }

  function renderGroupedInitiative() {
    scheduled = false;
    const groups = collectMonsterGroups();
    captureFreshRolls(groups);

    groups.forEach(group => {
      const value = grouped.get(group.cardId);
      if (value === undefined) return;
      group.cards.forEach(card => {
        const label = card.querySelector('.instance-strip strong');
        if (label) label.textContent = `Init ${value}`;
      });
    });

    const list = document.querySelector('.turn-panel .initiative');
    if (!list) return;
    const entries = [...groups.values()]
      .map(group => ({ ...group, initiative: grouped.get(group.cardId) }))
      .filter(group => Number.isFinite(Number(group.initiative)))
      .sort((a, b) => Number(b.initiative) - Number(a.initiative));

    list.innerHTML = entries.length
      ? entries.map((group, index) => `<li><span><strong>${index + 1}.</strong> ${group.title}${group.count > 1 ? ` ×${group.count}` : ''}<small>Shared initiative</small></span><strong>${group.initiative}</strong></li>`).join('')
      : '<li>No card initiative rolled yet.</li>';
  }

  function scheduleRender() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(renderGroupedInitiative);
  }

  document.addEventListener('click', event => {
    const rollAll = event.target.closest('[data-roll-all-monsters]');
    if (rollAll) {
      pendingRollAll = true;
      return;
    }
    const initiative = event.target.closest('[data-card-roll="initiative"]');
    if (initiative) pendingCardId = initiative.closest('.tarot-card[data-card-id]')?.dataset.cardId || null;
  }, true);

  const app = document.querySelector('#app');
  if (app) new MutationObserver(scheduleRender).observe(app, { childList: true });
  window.addEventListener('DOMContentLoaded', scheduleRender);
})();
