import { defaultCharacterCard } from './src/player/character-cards.js';
import { ensurePlayerState, loadSession, updateSession } from './src/session/session-state.js';

let applying = false;
let initializedSessionId = null;
let saveTimer;

const station = () => document.querySelector('#app .player-station');
const parseHp = root => {
  const text = root?.querySelector('.hp-controls strong')?.textContent || '';
  const match = text.match(/HP\s+(\d+)\/(\d+)/i);
  return match ? Number(match[1]) : null;
};
const actionState = root => Object.fromEntries(['action','bonus','reaction'].map(key => {
  const button = root?.querySelector(`[data-spend-action="${key}"]`);
  return [key, Boolean(button?.classList.contains('available'))];
}));
const equippedState = root => {
  const result = {};
  root?.querySelectorAll('[data-equipment-slot]').forEach(slot => {
    const name = slot.dataset.equipmentSlot;
    const itemName = slot.querySelector('strong')?.textContent?.trim();
    result[name] = itemName && itemName !== 'Empty' ? [...root.querySelectorAll('[data-item-id]')].find(card => card.querySelector('h4')?.textContent?.trim() === itemName)?.dataset.itemId || null : null;
  });
  return result;
};
const itemResources = root => Object.fromEntries([...root?.querySelectorAll('[data-item-id]') || []].map(card => [card.dataset.itemId, card.querySelector('.item-resource')?.textContent?.trim() || '']));

function capture() {
  if (applying) return;
  const root = station();
  const session = loadSession();
  if (!root || !session) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const hp = parseHp(root);
    updateSession(current => {
      const previous = ensurePlayerState(current, defaultCharacterCard);
      return { ...current, playerState:{
        ...previous,
        hp:hp ?? previous.hp,
        ready:Boolean(root.querySelector('[data-player-ready]')?.classList.contains('is-ready')),
        actions:actionState(root),
        equipped:equippedState(root),
        edition:root.querySelector('[data-edition-toggle]')?.textContent?.includes('2014') ? '2024' : '2014',
        itemResources:itemResources(root)
      }};
    });
  }, 180);
}

const click = element => { if (element) element.click(); };
async function applySavedState() {
  const root = station();
  const session = loadSession();
  if (!root || !session || initializedSessionId === session.sessionId) return;
  const saved = ensurePlayerState(session, defaultCharacterCard);
  applying = true;

  let currentHp = parseHp(root);
  const delta = saved.hp - (currentHp ?? saved.hp);
  const hpButton = root.querySelector(`[data-hp-change="${delta >= 0 ? '1' : '-1'}"]`);
  for (let index=0; index<Math.abs(delta); index += 1) click(hpButton);

  for (const [key, ready] of Object.entries(saved.actions)) {
    const button = station()?.querySelector(`[data-spend-action="${key}"]`);
    if (button && button.classList.contains('available') !== ready) click(button);
  }
  const readyButton = station()?.querySelector('[data-player-ready]');
  if (readyButton && readyButton.classList.contains('is-ready') !== saved.ready) click(readyButton);

  const editionButton = station()?.querySelector('[data-edition-toggle]');
  const currentEdition = editionButton?.textContent?.includes('2014') ? '2024' : '2014';
  if (editionButton && currentEdition !== saved.edition) click(editionButton);

  const live = station();
  for (const card of live?.querySelectorAll('[data-item-id].is-equipped') || []) {
    const id = card.dataset.itemId;
    if (!Object.values(saved.equipped).includes(id)) click(live.querySelector(`[data-unequip-item="${CSS.escape(id)}"]`));
  }
  for (const id of Object.values(saved.equipped).filter(Boolean)) {
    const current = station()?.querySelector(`[data-item-id="${CSS.escape(id)}"]`);
    if (current && !current.classList.contains('is-equipped')) click(station().querySelector(`[data-auto-equip="${CSS.escape(id)}"]`));
  }

  initializedSessionId = session.sessionId;
  applying = false;
  capture();
}

const app = document.querySelector('#app');
if (app) new MutationObserver(() => {
  capture();
  setTimeout(applySavedState, 30);
}).observe(app, { childList:true, subtree:true });

document.addEventListener('click', event => {
  if (event.target.closest('.player-station')) setTimeout(capture, 40);
}, true);
window.addEventListener('living-table:session-updated', () => setTimeout(applySavedState, 30));
window.addEventListener('DOMContentLoaded', () => setTimeout(applySavedState, 120));
setTimeout(applySavedState, 200);
