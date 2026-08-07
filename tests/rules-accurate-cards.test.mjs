import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  abilityModifier,
  proficiencyBonus,
  savingThrowModifier,
  skillModifier,
  passivePerception,
  weaponAttackBonus,
  weaponDamageModifier,
  parseDiceExpression,
  rollDiceExpression,
  validateDamageParts
} from '../src/dnd/rules-engine.js';
import { wishingCakeCombatRules } from '../src/wishing-cake-combat.js';
import { wishingCakePackCards } from '../src/wishing-cake-pack.js';
import {
  defaultCharacterCard,
  getCharacterProfile,
  findCharacterByImportCode
} from '../src/player/character-cards.js';
import { createInventory, deriveStats } from '../src/player/item-system.js';

assert.equal(abilityModifier(16), 3);
assert.equal(abilityModifier(14), 2);
assert.equal(abilityModifier(10), 0);
assert.equal(proficiencyBonus(3), 2);
assert.equal(proficiencyBonus(5), 3);
assert.throws(() => validateDamageParts([{ dice:'1d20+4', type:'slashing' }]), /cannot use a d20/i);
assert.equal(rollDiceExpression('1d8+2', () => 0).total, 3);
assert.deepEqual(parseDiceExpression('2d6+3').map(term => [term.count,term.sides,term.flat]), [[2,6,0],[0,0,3]]);

for (const [cardId, rule] of Object.entries(wishingCakeCombatRules)) {
  for (const shortcut of rule.shortcuts || []) {
    if (!shortcut.damage?.length) continue;
    assert.doesNotThrow(() => validateDamageParts(shortcut.damage, `${cardId}:${shortcut.id}`));
    for (const part of shortcut.damage) {
      assert.equal(parseDiceExpression(part.dice).some(term => term.sides === 20), false, `${cardId}:${shortcut.id} must never use d20 damage`);
    }
  }
}

const animated = wishingCakeCombatRules.priest;
assert.equal(animated.initiativeModifier, 2);
assert.equal(animated.shortcuts.find(entry => entry.id === 'ribbon-lash').attackBonus, 4);
assert.deepEqual(animated.shortcuts.find(entry => entry.id === 'ribbon-lash').damage, [{ dice:'1d8+2', type:'slashing' }]);
assert.equal(animated.shortcuts.find(entry => entry.id === 'surprise-inside').save.dc, 12);
assert.equal(animated.shortcuts.find(entry => entry.id === 'surprise-inside').damage[0].dice, '2d6');

const plate = wishingCakeCombatRules.skeleton.shortcuts.find(entry => entry.id === 'bite');
assert.deepEqual(plate.damage.map(part => part.dice), ['1d8+3','1d4']);
const pinata = wishingCakeCombatRules['monster-pinata-mimic'];
assert.equal(pinata.shortcuts.find(entry => entry.id === 'gore').attackBonus, 5);
assert.equal(pinata.shortcuts.find(entry => entry.id === 'candy-burst').recharge, '5–6');
assert.equal(pinata.shortcuts.find(entry => entry.id === 'candy-burst').save.dc, 13);
const sepulchral = wishingCakeCombatRules['monster-sepulchral'];
assert.equal(sepulchral.spellSaveDc, 13);
assert.equal(sepulchral.spellAttackBonus, 5);
assert.equal(sepulchral.shortcuts.find(entry => entry.id === 'fire-bolt').damage[0].dice, '2d10');
assert.equal(wishingCakeCombatRules['hazard-exploding-pinata'].shortcuts.find(entry => entry.id === 'explosion').save.dc, 13);
assert.equal(wishingCakeCombatRules['hazard-wrapping-machine'].shortcuts.find(entry => entry.id === 'shear').damage[0].dice, '2d6');

for (const id of Object.keys(wishingCakeCombatRules)) {
  const card = wishingCakePackCards.find(entry => entry.id === id);
  assert.ok(card?.combat, `${id} must expose structured combat rules through the runtime card pack`);
}

const character = defaultCharacterCard;
const profile2014 = getCharacterProfile(character, 'dnd-2014');
const profile2024 = getCharacterProfile(character, 'dnd-2024');
for (const profile of [profile2014, profile2024]) {
  assert.equal(profile.className, 'Fighter');
  assert.equal(profile.subclass, 'Champion');
  assert.equal(profile.level, 3);
  assert.equal(profile.maxHp, 28);
  assert.equal(proficiencyBonus(profile.level), 2);
  assert.equal(profile.abilities.dexterity, 16);
  assert.equal(profile.abilities.constitution, 14);
  assert.equal(savingThrowModifier(profile, 'strength'), 2);
  assert.equal(savingThrowModifier(profile, 'constitution'), 4);
  assert.equal(savingThrowModifier(profile, 'dexterity'), 3);
  assert.equal(skillModifier(profile, 'perception'), 3);
  assert.equal(passivePerception(profile), 13);
  const rapier = profile.attacks.find(entry => entry.id === 'rapier');
  const longbow = profile.attacks.find(entry => entry.id === 'longbow');
  assert.equal(weaponAttackBonus(profile, rapier), 5);
  assert.equal(weaponDamageModifier(profile, rapier), 3);
  assert.equal(rapier.damageDice, '1d8');
  assert.equal(weaponAttackBonus(profile, longbow), 7, 'Archery must improve the ranged attack roll by +2');
  assert.equal(weaponDamageModifier(profile, longbow), 3, 'Archery must not increase weapon damage');
  assert.equal(longbow.damageDice, '1d8');
}

assert.equal(profile2014.initiative.advantage, false);
assert.equal(profile2014.resources.find(entry => entry.id === 'second-wind').max, 1);
assert.equal(profile2014.features.some(entry => entry.name === 'Improved Critical'), true);
assert.equal(profile2024.initiative.advantage, true);
assert.equal(profile2024.resources.find(entry => entry.id === 'second-wind').max, 2);
assert.equal(profile2024.features.some(entry => entry.name === 'Tactical Mind'), true);
assert.equal(profile2024.features.some(entry => entry.name === 'Remarkable Athlete'), true);
assert.equal(profile2024.features.some(entry => entry.name === 'Savage Attacker'), true);
assert.equal(profile2024.features.some(entry => entry.name === 'Skilled'), true);
assert.equal(profile2024.attacks.find(entry => entry.id === 'rapier').mastery, 'Vex');
assert.equal(profile2024.attacks.find(entry => entry.id === 'longbow').mastery, 'Slow');
assert.equal(profile2024.weaponMasteries.length, 3);

assert.equal(findCharacterByImportCode('WC-WENDY-F3-14').edition, 'dnd-2014');
assert.equal(findCharacterByImportCode('wc-wendy-f3-24').edition, 'dnd-2024');
assert.equal(character.back.qrPaths['dnd-2014'].includes('edition=2014'), true);
assert.equal(character.back.qrPaths['dnd-2024'].includes('edition=2024'), true);
assert.deepEqual(character.startingEquipment, {
  head:null,neck:null,shoulders:null,armor:'leather-armor',hands:null,
  mainHand:'rapier',offHand:'shield',ring1:null,ring2:null,feet:null,wondrous:'birthday-spark'
});
assert.equal(character.ownedItemIds.includes('longbow'), true);
assert.equal(character.ownedItemIds.includes('cloak-protection'), false);
assert.equal(character.ownedItemIds.includes('boots-elvenkind'), false);

const inventory = createInventory(character.ownedItemIds);
const stats2014 = deriveStats({ equipped:{...character.startingEquipment}, edition:'2014' }, inventory, character);
assert.equal(stats2014.ac, 16);
assert.equal(stats2014.attack, 5);
assert.equal(stats2014.damage, 3);
assert.equal(stats2014.attackProfile.name, 'Rapier');
const longbowState = { equipped:{...character.startingEquipment,mainHand:'longbow',offHand:null}, edition:'2024' };
const stats2024Bow = deriveStats(longbowState, inventory, character);
assert.equal(stats2024Bow.attack, 7);
assert.equal(stats2024Bow.damage, 3);
assert.equal(stats2024Bow.attackProfile.damageDice, '1d8');

const dmHtml = fs.readFileSync('index.html','utf8');
const playerHtml = fs.readFileSync('player.html','utf8');
const shortcuts = fs.readFileSync('combat-shortcuts.js','utf8');
const sheet = fs.readFileSync('player-character-sheet.js','utf8');
const pregen = fs.readFileSync('pregen-character-loader.js','utf8');
assert.match(dmHtml,/combat-shortcuts\.js\?v=rules-cards-1/);
assert.match(playerHtml,/combat-shortcuts\.js\?v=rules-cards-1/);
assert.match(playerHtml,/player-character-sheet\.js\?v=character-sheet-1/);
assert.match(shortcuts,/rollDamageParts/);
assert.match(shortcuts,/data-rule-roll="damage"/);
assert.doesNotMatch(shortcuts,/ruleRoll === ['"]damage['"][\s\S]{0,220}rollD20/);
assert.match(shortcuts,/Attack\/check = d20 · Damage = listed dice/);
assert.match(shortcuts,/removeLegacyRolls/);
assert.match(shortcuts,/data-roll-all-monsters/);
assert.match(sheet,/FULL PLAYER CHARACTER SHEET/);
assert.match(sheet,/Saving Throws/);
assert.match(sheet,/Skills/);
assert.match(sheet,/Proficiencies & Languages/);
assert.match(sheet,/Attacks & Combat Shortcuts/);
assert.match(sheet,/Features & Traits/);
assert.match(sheet,/Spellcasting/);
assert.match(sheet,/Equipment & Backpack/);
assert.match(sheet,/CHARACTER IMPORT CODE/);
assert.match(pregen,/assets\/characters\/\$\{esc\(character\.id\)\}\.svg/);
assert.match(pregen,/CHARACTER IMPORT CODE/);
assert.match(pregen,/entry\.id === "rapier"/);

console.log('Rules-accuracy gate passed: real attack/save/check math, no d20 damage, and complete 2014/2024 Fighter 3 Champion pregen profiles.');
