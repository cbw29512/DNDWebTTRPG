import { wishingCakeCombatRules } from './src/wishing-cake-combat.js';
import { rollD20, rollDamageParts, rollDie } from './src/dnd/rules-engine.js';

const isDungeonMaster = document.querySelector('meta[name="living-table-role"]')?.content === 'dm';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const abilityLabel = ability => ({strength:'STR',dexterity:'DEX',constitution:'CON',intelligence:'INT',wisdom:'WIS',charisma:'CHA'}[ability] || String(ability || '').toUpperCase());
const fmt = value => value >= 0 ? `+${value}` : String(value);

function damageLabel(parts = []) {
  return parts.map(part => `${part.dice} ${part.type}`).join(' + ');
}

function shortcutMarkup(cardId, rule) {
  const controls = [];
  if (Number.isFinite(rule.initiativeModifier)) {
    controls.push(`<button type="button" class="combat-shortcut initiative-shortcut" data-rule-roll="initiative" data-card-rule="${esc(cardId)}"><span aria-hidden="true">⏱</span><b>INIT ${fmt(rule.initiativeModifier)}</b><small>d20</small></button>`);
  }
  for (const shortcut of rule.shortcuts || []) {
    if (shortcut.kind === 'attack') {
      controls.push(`<button type="button" class="combat-shortcut attack-shortcut" data-rule-roll="attack" data-card-rule="${esc(cardId)}" data-shortcut-id="${esc(shortcut.id)}"><span aria-hidden="true">${shortcut.icon}</span><b>${esc(shortcut.label)} ${fmt(shortcut.attackBonus)}</b><small>d20 attack</small></button>`);
      if (shortcut.damage?.length) controls.push(`<button type="button" class="combat-shortcut damage-shortcut" data-rule-roll="damage" data-card-rule="${esc(cardId)}" data-shortcut-id="${esc(shortcut.id)}"><span aria-hidden="true">💥</span><b>${esc(damageLabel(shortcut.damage))}</b><small>damage</small></button>`);
    } else if (shortcut.kind === 'save') {
      controls.push(`<button type="button" class="combat-shortcut save-shortcut" data-rule-show="save" data-card-rule="${esc(cardId)}" data-shortcut-id="${esc(shortcut.id)}"><span aria-hidden="true">🛡</span><b>${abilityLabel(shortcut.save.ability)} DC ${shortcut.save.dc}</b><small>${esc(shortcut.label)}</small></button>`);
      if (shortcut.damage?.length) controls.push(`<button type="button" class="combat-shortcut damage-shortcut" data-rule-roll="damage" data-card-rule="${esc(cardId)}" data-shortcut-id="${esc(shortcut.id)}"><span aria-hidden="true">💥</span><b>${esc(damageLabel(shortcut.damage))}</b><small>${shortcut.halfOnSave ? 'half on save' : 'damage'}</small></button>`);
      if (shortcut.recharge) controls.push(`<button type="button" class="combat-shortcut recharge-shortcut" data-rule-roll="recharge" data-card-rule="${esc(cardId)}" data-shortcut-id="${esc(shortcut.id)}"><span aria-hidden="true">↻</span><b>Recharge ${esc(shortcut.recharge)}</b><small>d6</small></button>`);
    } else if (shortcut.kind === 'check') {
      controls.push(`<button type="button" class="combat-shortcut check-shortcut" data-rule-show="check" data-card-rule="${esc(cardId)}" data-shortcut-id="${esc(shortcut.id)}"><span aria-hidden="true">◇</span><b>${abilityLabel(shortcut.check.ability)} DC ${shortcut.check.dc}</b><small>${esc(shortcut.label)}</small></button>`);
    } else {
      controls.push(`<button type="button" class="combat-shortcut info-shortcut" data-rule-show="info" data-card-rule="${esc(cardId)}" data-shortcut-id="${esc(shortcut.id)}"><span aria-hidden="true">${esc(shortcut.icon || '•')}</span><b>${esc(shortcut.label)}</b><small>${esc(shortcut.text || '')}</small></button>`);
    }
  }
  return `<section class="combat-shortcuts" aria-label="Rules-accurate combat shortcuts"><header><strong>COMBAT SHORTCUTS</strong><span>Attack/check = d20 · Damage = listed dice</span></header><div class="combat-shortcut-grid">${controls.join('')}</div><p class="combat-shortcut-result" aria-live="polite">Choose a shortcut.</p></section>`;
}

function findShortcut(cardId, id) {
  return wishingCakeCombatRules[cardId]?.shortcuts?.find(entry => entry.id === id) || null;
}

function describeSave(shortcut) {
  const damage = shortcut.damage?.length ? ` Failure: ${damageLabel(shortcut.damage)}${shortcut.halfOnSave ? '; success: half damage.' : '.'}` : '';
  return `${shortcut.label}: ${abilityLabel(shortcut.save.ability)} save DC ${shortcut.save.dc}.${damage}${shortcut.rider ? ` ${shortcut.rider}` : ''}`;
}

function describeCheck(shortcut) {
  const skill = shortcut.check.skill ? ` (${shortcut.check.skill.replace(/([A-Z])/g,' $1')})` : '';
  return `${shortcut.label}: ${abilityLabel(shortcut.check.ability)}${skill} check DC ${shortcut.check.dc}.${shortcut.action ? ` Uses ${shortcut.action}.` : ''}`;
}

function setResult(button, text) {
  const section = button.closest('.combat-shortcuts');
  const result = section?.querySelector('.combat-shortcut-result');
  if (result) result.textContent = text;
}

function handleRuleClick(event) {
  const button = event.target.closest('[data-rule-roll],[data-rule-show]');
  if (!button) return;
  const cardId = button.dataset.cardRule;
  const rule = wishingCakeCombatRules[cardId];
  if (!rule) return;
  const shortcut = findShortcut(cardId, button.dataset.shortcutId);

  if (button.dataset.ruleRoll === 'initiative') {
    const result = rollD20(rule.initiativeModifier);
    setResult(button, `Initiative: d20 ${fmt(rule.initiativeModifier)} → ${result.natural} ${fmt(rule.initiativeModifier)} = ${result.total}.`);
    return;
  }
  if (button.dataset.ruleRoll === 'attack' && shortcut) {
    const result = rollD20(shortcut.attackBonus);
    setResult(button, `${shortcut.label} attack: d20 ${fmt(shortcut.attackBonus)} → ${result.natural} ${fmt(shortcut.attackBonus)} = ${result.total}${result.natural === 20 ? ' (critical hit)' : ''}.`);
    return;
  }
  if (button.dataset.ruleRoll === 'damage' && shortcut) {
    const result = rollDamageParts(shortcut.damage);
    const detail = result.parts.map(part => `${part.dice} ${part.type} = ${part.total}`).join(' + ');
    setResult(button, `${shortcut.label} damage: ${detail}; total ${result.total}.`);
    return;
  }
  if (button.dataset.ruleRoll === 'recharge' && shortcut) {
    const value = rollDie(6);
    const numbers = String(shortcut.recharge).replace('–','-').split('-').map(Number);
    const recharged = numbers.length === 2 ? value >= numbers[0] && value <= numbers[1] : value === numbers[0];
    setResult(button, `${shortcut.label} recharge: d6 = ${value}. ${recharged ? 'Recharged.' : 'Not recharged.'}`);
    return;
  }
  if (button.dataset.ruleShow === 'save' && shortcut) {
    setResult(button, describeSave(shortcut));
    return;
  }
  if (button.dataset.ruleShow === 'check' && shortcut) {
    setResult(button, describeCheck(shortcut));
    return;
  }
  if (shortcut) setResult(button, shortcut.text || shortcut.label);
}

function hydrateCard(card) {
  const id = card.dataset.cardId;
  const rule = wishingCakeCombatRules[id];
  if (!rule || card.dataset.rulesShortcuts === 'true') return;
  card.dataset.rulesShortcuts = 'true';
  card.querySelectorAll('.inside-card-rolls').forEach(node => node.remove());
  card.querySelectorAll('.card-roll-note').forEach(node => node.remove());
  const back = card.querySelector('.tarot-back');
  if (back) back.insertAdjacentHTML('beforeend', shortcutMarkup(id, rule));
}

function hydrate() {
  if (!isDungeonMaster) return;
  document.querySelectorAll('.tarot-card[data-card-id]').forEach(hydrateCard);
}

if (isDungeonMaster) {
  document.addEventListener('click', handleRuleClick, true);
  const app = document.querySelector('#app');
  if (app) new MutationObserver(hydrate).observe(app, { childList:true, subtree:true });
  window.addEventListener('DOMContentLoaded', hydrate);
  hydrate();
}
