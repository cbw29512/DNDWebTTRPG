import assert from 'node:assert/strict';
import { wishingCakePackCards } from '../src/wishing-cake-pack.js';
import { wishingCakeMonsterStats, wishingCakeMonsterIds } from '../src/wishing-cake-monster-stats.js';
import { wishingCakeCombatRules } from '../src/wishing-cake-combat.js';
import { CARD_TYPES } from '../src/schema.js';
import { validateDamageParts } from '../src/dnd/rules-engine.js';

const monsterCards=wishingCakePackCards.filter(card=>card.type===CARD_TYPES.MONSTER);
assert.deepEqual(monsterCards.map(card=>card.id).sort(),[...wishingCakeMonsterIds].sort(),'Every Wishing Cake monster card must have one canonical stat block');

const required=['sizeType','proficiencyBonus','ac','hp','speed','abilities','saves','skills','damageResistances','damageImmunities','conditionImmunities','senses','languages','challenge','traits','actions'];
for(const card of monsterCards){
 const canonical=wishingCakeMonsterStats[card.id];
 assert.ok(canonical,`${card.title}: canonical monster data missing`);
 assert.equal(card.dmFace,canonical.dmFace,`${card.title}: runtime DM face must be the canonical stat object, not a merged legacy copy`);
 assert.equal(card.combat,canonical.combat,`${card.title}: live combat shortcuts must come from the same canonical record as the stat block`);
 assert.equal(wishingCakeCombatRules[card.id],canonical.combat,`${card.title}: combat module must delegate to canonical monster data`);
 assert.match(card.rulesClassification,/Adventure Homebrew/i,`${card.title}: homebrew monster must be classified as adventure content`);
 for(const field of required)assert.notEqual(card.dmFace[field],undefined,`${card.title}: missing ${field}`);
 for(const shortcut of card.combat?.shortcuts||[]){
  for(const part of shortcut.damage||[]){assert.doesNotMatch(part.dice,/d20/i,`${card.title} ${shortcut.label}: d20 cannot be damage`);}
  if(shortcut.damage?.length)assert.doesNotThrow(()=>validateDamageParts(shortcut.damage));
 }
}

const present=monsterCards.find(card=>card.id==='priest');
assert.match(present.dmFace.challenge,/PB \+2/);
assert.match(present.dmFace.actions.join(' '),/Ribbon Lash[\s\S]*\+4[\s\S]*1d8 \+ 2/);
assert.equal(present.combat.shortcuts.find(x=>x.id==='ribbon-lash').attackBonus,4);

const plate=monsterCards.find(card=>card.id==='skeleton');
assert.match(plate.dmFace.abilities,/STR 15 \(\+2\)/);
assert.match(plate.dmFace.actions.join(' '),/Bite[\s\S]*\+4[\s\S]*1d8 \+ 2/,'Paper Plate Mimic damage must agree with STR +2');
assert.equal(plate.combat.shortcuts.find(x=>x.id==='bite').damage[0].dice,'1d8+2');
assert.match(plate.dmFace.skills,/Stealth \+5 \(expertise\)/,'Nonstandard skill math must be explicitly explained');

const pinata=monsterCards.find(card=>card.id==='monster-pinata-mimic');
assert.match(pinata.dmFace.abilities,/STR 17 \(\+3\)/);
assert.match(pinata.dmFace.actions.join(' '),/Gore[\s\S]*\+5[\s\S]*2d8 \+ 3/);
assert.equal(pinata.combat.shortcuts.find(x=>x.id==='trampling-charge').save.dc,13);
assert.equal(pinata.combat.shortcuts.find(x=>x.id==='candy-burst').recharge,'5–6');

const boss=monsterCards.find(card=>card.id==='monster-sepulchral');
assert.match(boss.dmFace.abilities,/STR 8 \(-1\)/);
assert.match(boss.dmFace.abilities,/DEX 14 \(\+2\)/);
assert.match(boss.dmFace.challenge,/PB \+2/);
assert.equal(boss.dmFace.ac,'13 (15 with Mage Armor; 20 against the triggering attack with Shield)','Mage Armor must be 13 + DEX (+2), then Shield adds +5');
assert.match(boss.dmFace.actions.join(' '),/Staff[\s\S]*\+1[\s\S]*1d6 − 1/,'Sepulchral staff must agree with STR -1 and PB +2');
assert.equal(boss.combat.shortcuts.find(x=>x.id==='staff').attackBonus,1);
assert.equal(boss.combat.shortcuts.find(x=>x.id==='staff').damage[0].dice,'1d6-1');
assert.equal(boss.combat.spellSaveDc,13);
assert.equal(boss.combat.spellAttackBonus,5);
assert.match(boss.combat.shortcuts.find(x=>x.id==='shield').text,/AC becomes 20/);
assert.doesNotMatch(boss.dmFace.traits.join(' '),/1\/Turn/,'Halfling Lucky must not be given a fake once-per-turn limit');

console.log('All Wishing Cake monster cards use one complete canonical stat/combat source with no runtime legacy merge.');
