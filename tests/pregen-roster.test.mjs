import assert from 'node:assert/strict';
import fs from 'node:fs';
import { characterCards, findCharacterByImportCode, getCharacterProfile } from '../src/player/character-cards.js';
import { proficiencyBonus, spellSaveDc, spellAttackBonus, weaponAttackBonus, weaponDamageModifier } from '../src/dnd/rules-engine.js';

assert.equal(characterCards.length,6,'Wishing Cake playtest roster must contain six pregens');
assert.equal(new Set(characterCards.map(c=>c.id)).size,6);
const classes=new Set(characterCards.map(c=>getCharacterProfile(c,'2014').className));
for(const name of ['Fighter','Rogue','Wizard','Cleric','Ranger','Bard']) assert.equal(classes.has(name),true,`${name} pregen missing`);

const codes=new Set();
for(const character of characterCards){
  assert.ok(fs.existsSync(`assets/characters/${character.id}.svg`),`${character.id} portrait is missing`);
  assert.ok(character.ownedItemIds.length>=2,`${character.id} needs owned gear`);
  for(const edition of ['dnd-2014','dnd-2024']){
    const profile=getCharacterProfile(character,edition);
    assert.equal(profile.level,3);
    assert.equal(proficiencyBonus(profile.level),2);
    assert.equal(profile.saveProficiencies.length,2);
    assert.equal(Array.isArray(profile.skillProficiencies),true);
    assert.equal(Array.isArray(profile.attacks),true);
    assert.equal(Array.isArray(profile.features),true);
    assert.equal(Array.isArray(profile.resources),true);
    assert.equal(typeof profile.maxHp,'number');
    assert.equal(typeof profile.initiative.modifier,'number');
    const code=character.back.importCodes[edition];
    assert.ok(code && !codes.has(code),`${character.id} needs a unique ${edition} code`); codes.add(code);
    const found=findCharacterByImportCode(code);assert.equal(found.character.id,character.id);assert.equal(found.edition,edition);
    assert.match(character.back.qrPaths[edition],new RegExp(`character=${character.id}`));
    for(const attack of profile.attacks){assert.doesNotMatch(attack.damageDice,/d20/i);assert.equal(Number.isFinite(weaponAttackBonus(profile,attack)),true);assert.equal(Number.isFinite(weaponDamageModifier(profile,attack)),true);}
    if(profile.spellcastingAbility){assert.equal(spellSaveDc(profile),13,`${character.id} expected level-3 primary casting DC 13`);assert.equal(spellAttackBonus(profile),5);assert.ok(Object.keys(profile.spellSlots).length>0);assert.ok(profile.spells.length>0);}
  }
}

const rogue=characterCards.find(c=>c.id==='merrin-thief');
assert.equal(weaponAttackBonus(getCharacterProfile(rogue,'2014'),getCharacterProfile(rogue,'2014').attacks[0]),5);
const ranger=characterCards.find(c=>c.id==='fern-hunter');
assert.equal(weaponAttackBonus(getCharacterProfile(ranger,'2014'),getCharacterProfile(ranger,'2014').attacks[0]),7,'Archery longbow must be +7');
const fighter=characterCards.find(c=>c.id==='wendy-birthday-hero');
assert.equal(weaponAttackBonus(getCharacterProfile(fighter,'2014'),getCharacterProfile(fighter,'2014').attacks[1]),7);

const playerReady=fs.readFileSync('player-ready.js','utf8');
assert.match(playerReady,/living-table:character-loaded/);
assert.match(playerReady,/resetForCharacter/);
assert.match(playerReady,/createInventory\(character\.ownedItemIds\)/);
assert.match(playerReady,/state\.equipped=\{\.\.\.character\.startingEquipment\}/);
console.log('Six-pregen dual-edition roster, import codes, portrait assets, spell math, attack math, and dynamic equipment doll passed.');
