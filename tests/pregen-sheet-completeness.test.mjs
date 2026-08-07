import assert from 'node:assert/strict';
import fs from 'node:fs';
import { characterCards } from '../src/player/character-cards.js';
import { pregenSheetMetadata } from '../src/player/pregen-sheet-metadata.js';

assert.equal(characterCards.length,6,'Wishing Cake must keep six pregens');
for(const character of characterCards){
 const meta=pregenSheetMetadata[character.id];
 assert.ok(meta,`${character.name}: missing player-sheet metadata`);
 for(const field of ['alignment','personality','ideal','bond','flaw'])assert.ok(meta[field]?.trim(),`${character.name}: missing ${field}`);
 for(const [edition,profile] of Object.entries(character.profiles||{})){
  for(const field of ['rulesId','level','className','subclass','species','background','size','speed','hitDie','maxHp'])assert.notEqual(profile[field],undefined,`${character.name} ${edition}: missing ${field}`);
  assert.equal(Object.keys(profile.abilities||{}).length,6,`${character.name} ${edition}: needs six ability scores`);
  assert.ok(Array.isArray(profile.saveProficiencies));
  assert.ok(Array.isArray(profile.skillProficiencies));
  assert.ok(Array.isArray(profile.armorTraining));
  assert.ok(Array.isArray(profile.weaponProficiencies));
  assert.ok(Array.isArray(profile.tools));
  assert.ok(Array.isArray(profile.languages));
  assert.ok(Array.isArray(profile.attacks));
  assert.ok(Array.isArray(profile.resources));
  assert.ok(Array.isArray(profile.features));
  assert.ok(profile.hitDice?.die&&Number.isFinite(profile.hitDice?.total));
  assert.ok(profile.initiative&&Number.isFinite(profile.initiative.modifier));
  assert.ok(profile.spellDetails,`${character.name} ${edition}: spell details container is required even for noncasters`);
 }
}

const tracking=fs.readFileSync('player-sheet-tracking.js','utf8');
for(const label of ['Player Name','Alignment','Size','Species','Class / Level','Background','Hit Die','Senses','Experience Points','Temporary HP','Death Saves','Exhaustion','Conditions','Currency','Personality','Ideal','Bond','Flaw'])assert.match(tracking,new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),`Player sheet tracking must render ${label}`);
assert.match(tracking,/Heroic Inspiration/);
assert.match(tracking,/Inspiration/);
assert.match(tracking,/living-table-sheet-state-v1/,'Player sheet state must persist per character and edition');

const html=fs.readFileSync('player.html','utf8');
assert.match(html,/player-sheet-tracking\.css\?v=sheet-tracking-1/);
assert.match(html,/player-sheet-tracking\.js\?v=sheet-tracking-1/);

console.log('Every pregen has complete mechanical profile data plus visible player-sheet identity and tracking fields.');
