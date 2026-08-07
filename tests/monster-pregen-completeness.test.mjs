import assert from 'node:assert/strict';
import fs from 'node:fs';
import { wishingCakePackCards } from '../src/wishing-cake-pack.js';
import { characterCards } from '../src/player/character-cards.js';

const monsters=wishingCakePackCards.filter(card=>card.type==='monster');
assert.ok(monsters.length>=4,'Wishing Cake must expose all encounter monster cards');

const requiredMonsterFields=['sizeType','ac','hp','speed','abilities','senses','challenge','traits','actions'];
for(const monster of monsters){
  assert.ok(monster.dmFace,`${monster.title}: missing DM stat block`);
  for(const field of requiredMonsterFields){
    const value=monster.dmFace[field];
    assert.ok(value!==undefined&&value!==null&&value!=='' ,`${monster.title}: missing ${field}`);
  }
  assert.match(String(monster.dmFace.abilities),/STR.+DEX.+CON.+INT.+WIS.+CHA/i,`${monster.title}: must list all six ability scores`);
  assert.ok(Array.isArray(monster.dmFace.traits),`${monster.title}: traits must be structured as a list`);
  assert.ok(Array.isArray(monster.dmFace.actions)&&monster.dmFace.actions.length,`${monster.title}: must list actions`);
  assert.ok(monster.combat,`${monster.title}: missing structured combat rules`);

  const printed=[...(monster.dmFace.traits||[]),...(monster.dmFace.actions||[]),monster.dmFace.spellcasting||'',monster.dmFace.reactions||''].join(' ');
  for(const shortcut of monster.combat.shortcuts||[]){
    if(shortcut.kind==='attack'){
      assert.equal(typeof shortcut.attackBonus,'number',`${monster.title} ${shortcut.label}: missing attack bonus`);
      assert.ok(shortcut.damage?.length,`${monster.title} ${shortcut.label}: missing damage dice`);
      assert.match(printed,new RegExp(`\\+${shortcut.attackBonus}\\s+to hit`,'i'),`${monster.title} ${shortcut.label}: printed attack bonus does not match shortcut +${shortcut.attackBonus}`);
      for(const part of shortcut.damage){
        assert.doesNotMatch(part.dice,/d20/i,`${monster.title} ${shortcut.label}: damage may not use d20`);
        assert.ok(printed.includes(part.dice),`${monster.title} ${shortcut.label}: printed stat block must include ${part.dice}`);
      }
    }
    if(shortcut.kind==='save'){
      assert.ok(shortcut.save?.ability&&Number.isInteger(shortcut.save?.dc),`${monster.title} ${shortcut.label}: incomplete save`);
      assert.match(printed,new RegExp(`DC\\s+${shortcut.save.dc}`,'i'),`${monster.title} ${shortcut.label}: printed save DC does not match shortcut DC ${shortcut.save.dc}`);
      for(const part of shortcut.damage||[])assert.ok(printed.includes(part.dice),`${monster.title} ${shortcut.label}: printed stat block must include ${part.dice}`);
    }
  }
}

const requiredProfileFields=['rulesId','level','className','subclass','species','background','size','speed','abilities','hitDie','maxHp','hitDice','saveProficiencies','skillProficiencies','expertise','armorTraining','weaponProficiencies','tools','languages','initiative','attacks','resources','features','spellSlots','spellDetails'];
for(const character of characterCards){
  assert.ok(character.id&&character.name&&character.classLine,`Pregen identity is incomplete`);
  assert.ok(character.back?.importCodes&&character.back?.qrPaths,`${character.name}: missing import/back data`);
  assert.ok(Array.isArray(character.ownedItemIds),`${character.name}: owned equipment list missing`);
  assert.ok(character.startingEquipment,`${character.name}: starting equipment missing`);
  for(const edition of ['dnd-2014','dnd-2024']){
    const profile=character.profiles?.[edition];
    assert.ok(profile,`${character.name}: missing ${edition}`);
    for(const field of requiredProfileFields)assert.notEqual(profile[field],undefined,`${character.name} ${edition}: missing ${field}`);
    assert.equal(Object.keys(profile.abilities).length,6,`${character.name} ${edition}: must have six abilities`);
    assert.equal(profile.hitDice.total,profile.level,`${character.name} ${edition}: hit-die total must match level`);
    assert.ok(Array.isArray(profile.features)&&profile.features.length,`${character.name} ${edition}: features missing`);
    assert.ok(Array.isArray(profile.attacks)&&profile.attacks.length,`${character.name} ${edition}: attacks missing`);
  }
}

const playerHtml=fs.readFileSync('player.html','utf8');
const sheetJs=fs.readFileSync('player-character-sheet.js','utf8');
const completenessJs=fs.readFileSync('player-sheet-completeness.js','utf8');
assert.match(playerHtml,/player-sheet-completeness\.js/,'Player route must load the complete-sheet tracker layer');
for(const label of ['Temporary Hit Points','Death Saves','Inspiration','Exhaustion','Conditions','Advancement','Currency','Personality','Ideal','Bond','Flaw']){
  assert.match(completenessJs,new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),`Complete player sheet must expose ${label}`);
}
assert.match(sheetJs,/Saving Throws/);
assert.match(sheetJs,/Skills/);
assert.match(sheetJs,/Proficiencies & Languages/);
assert.match(sheetJs,/Attacks & Combat Shortcuts/);
assert.match(sheetJs,/Features & Traits/);
assert.match(sheetJs,/Spellcasting/);
assert.match(sheetJs,/Equipment & Backpack/);

console.log('Monster stat-block/combat-math parity and full pregen player-sheet completeness gate passed.');
