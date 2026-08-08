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
import { wishingCakeMonsterStats } from '../src/wishing-cake-monster-stats.js';
import { wishingCakePackCards } from '../src/wishing-cake-pack.js';
import { defaultCharacterCard,getCharacterProfile,findCharacterByImportCode } from '../src/player/character-cards.js';
import { createInventory,deriveStats } from '../src/player/item-system.js';

assert.equal(abilityModifier(16),3);assert.equal(abilityModifier(14),2);assert.equal(abilityModifier(10),0);assert.equal(proficiencyBonus(3),2);assert.equal(proficiencyBonus(5),3);
assert.throws(()=>validateDamageParts([{dice:'1d20+4',type:'slashing'}]),/cannot use a d20/i);
assert.equal(rollDiceExpression('1d8+2',()=>0).total,3);
assert.deepEqual(parseDiceExpression('2d6+3').map(term=>[term.count,term.sides,term.flat]),[[2,6,0],[0,0,3]]);

for(const [cardId,rule] of Object.entries(wishingCakeCombatRules)){for(const shortcut of rule.shortcuts||[]){if(!shortcut.damage?.length)continue;assert.doesNotThrow(()=>validateDamageParts(shortcut.damage,`${cardId}:${shortcut.id}`));for(const part of shortcut.damage)assert.equal(parseDiceExpression(part.dice).some(term=>term.sides===20),false,`${cardId}:${shortcut.id} must never use d20 damage`);}}

// Monster shortcuts are aliases of the canonical monster records; never test or maintain a second set of numbers.
for(const [id,monster] of Object.entries(wishingCakeMonsterStats))assert.equal(wishingCakeCombatRules[id],monster.combat,`${id} must have one combat authority`);
const animated=wishingCakeMonsterStats.priest.combat;assert.equal(animated.initiativeModifier,2);assert.equal(animated.shortcuts.find(entry=>entry.id==='ribbon-lash').attackBonus,4);assert.deepEqual(animated.shortcuts.find(entry=>entry.id==='ribbon-lash').damage,[{dice:'1d8+2',type:'slashing'}]);assert.equal(animated.shortcuts.find(entry=>entry.id==='surprise-inside').save.dc,12);assert.equal(animated.shortcuts.find(entry=>entry.id==='surprise-inside').damage[0].dice,'2d6');
const plate=wishingCakeMonsterStats.skeleton.combat.shortcuts.find(entry=>entry.id==='bite');assert.deepEqual(plate.damage.map(part=>part.dice),['1d8+2','1d4']);
const pinata=wishingCakeMonsterStats['monster-pinata-mimic'].combat;assert.equal(pinata.shortcuts.find(entry=>entry.id==='gore').attackBonus,5);assert.equal(pinata.shortcuts.find(entry=>entry.id==='candy-burst').recharge,'5–6');assert.equal(pinata.shortcuts.find(entry=>entry.id==='candy-burst').save.dc,13);
const sepulchral=wishingCakeMonsterStats['monster-sepulchral'].combat;assert.equal(sepulchral.spellSaveDc,13);assert.equal(sepulchral.spellAttackBonus,5);assert.equal(sepulchral.shortcuts.find(entry=>entry.id==='staff').attackBonus,1);assert.equal(sepulchral.shortcuts.find(entry=>entry.id==='staff').damage[0].dice,'1d6-1');assert.match(sepulchral.shortcuts.find(entry=>entry.id==='shield').text,/AC becomes 20/);assert.equal(sepulchral.shortcuts.find(entry=>entry.id==='fire-bolt').damage[0].dice,'2d10');
assert.equal(wishingCakeCombatRules['hazard-exploding-pinata'].shortcuts.find(entry=>entry.id==='explosion').save.dc,13);assert.equal(wishingCakeCombatRules['hazard-wrapping-machine'].shortcuts.find(entry=>entry.id==='shear').damage[0].dice,'2d6');
for(const id of Object.keys(wishingCakeCombatRules)){const card=wishingCakePackCards.find(entry=>entry.id===id);assert.ok(card?.combat,`${id} must expose structured combat rules through the runtime card pack`);}

// Adventure item mechanics must identify homebrew vs edition-specific standard equipment.
const teddy=wishingCakePackCards.find(card=>card.id==='item-teddy-dagger');assert.match(teddy.playerFace.knownEffect,/normal dagger/i);assert.match(teddy.playerFace.knownEffect,/wielder/i);assert.doesNotMatch(teddy.playerFace.knownEffect,/\+4 to hit/i,'Hidden dagger cannot impose one universal attack bonus');
const rope=wishingCakePackCards.find(card=>card.id==='item-rope');assert.match(rope.dmFace.statistics,/2014:[\s\S]*DC 17 Strength/i);assert.match(rope.dmFace.statistics,/2024:[\s\S]*DC 20 Strength \(Athletics\)/i);
const candy=wishingCakePackCards.find(card=>card.id==='item-candy');assert.match(candy.playerFace.knownEffect,/1d4 \+ 1/i);assert.match(candy.rulesClassification,/Adventure Homebrew/i);
const finale=wishingCakePackCards.find(card=>card.id==='scene-cake-chamber');assert.match(finale.dmFace.chandelier,/1d6 bludgeoning plus 1d6 fire/i,'Mixed chandelier damage must state the split explicitly');

const character=defaultCharacterCard;const profile2014=getCharacterProfile(character,'dnd-2014');const profile2024=getCharacterProfile(character,'dnd-2024');
for(const profile of [profile2014,profile2024]){
 assert.equal(profile.className,'Fighter');assert.equal(profile.subclass,'Champion');assert.equal(profile.level,3);assert.equal(profile.maxHp,28);assert.equal(proficiencyBonus(profile.level),2);assert.equal(profile.abilities.dexterity,16);assert.equal(profile.abilities.constitution,14);assert.equal(savingThrowModifier(profile,'strength'),2);assert.equal(savingThrowModifier(profile,'constitution'),4);assert.equal(savingThrowModifier(profile,'dexterity'),3);assert.equal(skillModifier(profile,'perception'),3);assert.equal(passivePerception(profile),13);
 const rapier=profile.attacks.find(entry=>entry.id==='rapier');const longbow=profile.attacks.find(entry=>entry.id==='longbow');assert.equal(weaponAttackBonus(profile,rapier),5);assert.equal(weaponDamageModifier(profile,rapier),3);assert.equal(rapier.damageDice,'1d8');assert.equal(weaponAttackBonus(profile,longbow),7,'Archery must improve the ranged attack roll by +2');assert.equal(weaponDamageModifier(profile,longbow),3,'Archery must not increase weapon damage');assert.equal(longbow.damageDice,'1d8');
}
assert.equal(profile2014.initiative.advantage,false);assert.equal(profile2014.resources.find(entry=>entry.id==='second-wind').max,1);assert.equal(profile2014.features.some(entry=>entry.name==='Improved Critical'),true);assert.equal(profile2024.initiative.advantage,true);assert.equal(profile2024.resources.find(entry=>entry.id==='second-wind').max,2);assert.equal(profile2024.features.some(entry=>entry.name==='Tactical Mind'),true);assert.equal(profile2024.features.some(entry=>entry.name==='Remarkable Athlete'),true);assert.equal(profile2024.features.some(entry=>entry.name==='Savage Attacker'),true);assert.equal(profile2024.features.some(entry=>entry.name==='Skilled'),true);assert.equal(profile2024.attacks.find(entry=>entry.id==='rapier').mastery,'Vex');assert.equal(profile2024.attacks.find(entry=>entry.id==='longbow').mastery,'Slow');assert.equal(profile2024.weaponMasteries.length,3);
assert.equal(findCharacterByImportCode('WC-WENDY-F3-14').edition,'dnd-2014');assert.equal(findCharacterByImportCode('wc-wendy-f3-24').edition,'dnd-2024');assert.equal(character.back.qrPaths['dnd-2014'].includes('edition=2014'),true);assert.equal(character.back.qrPaths['dnd-2024'].includes('edition=2024'),true);
assert.deepEqual(character.startingEquipment,{head:null,neck:null,shoulders:null,armor:'leather-armor',hands:null,mainHand:'rapier',offHand:'shield',ring1:null,ring2:null,feet:null,wondrous:'birthday-spark'});assert.equal(character.ownedItemIds.includes('longbow'),true);assert.equal(character.ownedItemIds.includes('cloak-protection'),false);assert.equal(character.ownedItemIds.includes('boots-elvenkind'),false);
const inventory=createInventory(character.ownedItemIds);const stats2014=deriveStats({equipped:{...character.startingEquipment},edition:'2014'},inventory,character);assert.equal(stats2014.ac,16);assert.equal(stats2014.attack,5);assert.equal(stats2014.damage,3);assert.equal(stats2014.attackProfile.name,'Rapier');const longbowState={equipped:{...character.startingEquipment,mainHand:'longbow',offHand:null},edition:'2024'};const stats2024Bow=deriveStats(longbowState,inventory,character);assert.equal(stats2024Bow.attack,7);assert.equal(stats2024Bow.damage,3);assert.equal(stats2024Bow.attackProfile.damageDice,'1d8');

const dmHtml=fs.readFileSync('index.html','utf8');const playerHtml=fs.readFileSync('player.html','utf8');const shortcuts=fs.readFileSync('combat-shortcuts.js','utf8');const sheet=fs.readFileSync('player-character-sheet.js','utf8');const pregen=fs.readFileSync('pregen-character-loader.js','utf8');
assert.match(dmHtml,/combat-shortcuts\.js\?v=rules-cards-1/);assert.match(playerHtml,/combat-shortcuts\.js\?v=rules-cards-1/);assert.match(playerHtml,/player-character-sheet\.js\?v=character-sheet-1/);assert.match(shortcuts,/rollDamageParts/);assert.match(shortcuts,/data-rule-roll="damage"/);assert.doesNotMatch(shortcuts,/ruleRoll === ['"]damage['"][\s\S]{0,220}rollD20/);assert.match(shortcuts,/Attack\/check = d20 · Damage = listed dice/);assert.match(shortcuts,/removeLegacyRolls/);assert.match(shortcuts,/data-roll-all-monsters/);
for(const section of ['FULL PLAYER CHARACTER SHEET','Saving Throws','Skills','Proficiencies & Languages','Attacks & Combat Shortcuts','Features & Traits','Spellcasting','Equipment & Backpack','CHARACTER IMPORT CODE'])assert.match(sheet,new RegExp(section));
assert.match(pregen,/assets\/characters\/\$\{esc\(character\.id\)\}\.svg/);assert.match(pregen,/CHARACTER IMPORT CODE/);assert.match(pregen,/startingStats/);assert.match(pregen,/createInventory\(character\.ownedItemIds\)/);assert.match(pregen,/deriveStats\(\{edition:profile\.rulesId,equipped:\{\.\.\.character\.startingEquipment\}\},inventory,character\)/);assert.doesNotMatch(pregen,/entry\.id === ['"]rapier['"]/);
console.log('Rules-accuracy gate passed: one monster authority, edition-aware adventure items, real attack/save/check math, no d20 damage, and complete dual-edition pregen rules.');
