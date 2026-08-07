(() => {
  const STORAGE_KEY = 'living-table-rules-initiative-v2';
  const safeParse = value => { try { return JSON.parse(value); } catch { return {}; } };
  const grouped = new Map(Object.entries(safeParse(sessionStorage.getItem(STORAGE_KEY) || '{}')));
  let scheduled = false;

  const save = () => sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(grouped)));

  function collectMonsterGroups() {
    const groups = new Map();
    document.querySelectorAll('.slot-monster .tarot-card[data-card-id]').forEach(card => {
      const cardId = card.dataset.cardId;
      const title = card.querySelector('h3')?.textContent?.trim() || cardId;
      const record = groups.get(cardId) || { cardId, title, count:0, cards:[] };
      record.count += 1;
      record.cards.push(card);
      groups.set(cardId, record);
    });
    return groups;
  }

  function renderGroupedInitiative() {
    scheduled = false;
    const groups = collectMonsterGroups();
    groups.forEach(group => {
      const value = Number(grouped.get(group.cardId));
      if (!Number.isFinite(value)) return;
      group.cards.forEach(card => {
        const label = card.querySelector('.instance-strip strong');
        if (label) label.textContent = `Init ${value}`;
      });
    });

    const list = document.querySelector('.turn-panel .initiative');
    if (!list) return;
    const entries = [...groups.values()]
      .map(group => ({ ...group, initiative:Number(grouped.get(group.cardId)) }))
      .filter(group => Number.isFinite(group.initiative))
      .sort((a,b) => b.initiative - a.initiative);

    list.innerHTML = entries.length
      ? entries.map((group,index) => `<li><span><strong>${index + 1}.</strong> ${group.title}${group.count > 1 ? ` ×${group.count}` : ''}<small>Shared rules-accurate initiative</small></span><strong>${group.initiative}</strong></li>`).join('')
      : '<li>Roll ⏱ INIT from a monster card.</li>';
  }

  function scheduleRender() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(renderGroupedInitiative);
  }

  window.addEventListener('living-table:rules-initiative', event => {
    const { cardId, initiative } = event.detail || {};
    if (!cardId || !Number.isFinite(Number(initiative))) return;
    grouped.set(cardId, Number(initiative));
    save();
    scheduleRender();
  });

  window.addEventListener('living-table:scene-loaded', () => {
    grouped.clear();
    save();
    scheduleRender();
  });

  window.addEventListener('living-table:session-cleared', () => {
    grouped.clear();
    sessionStorage.removeItem(STORAGE_KEY);
    scheduleRender();
  });

  const app = document.querySelector('#app');
  if (app) new MutationObserver(scheduleRender).observe(app, { childList:true });
  window.addEventListener('DOMContentLoaded', scheduleRender);
  scheduleRender();
})();
