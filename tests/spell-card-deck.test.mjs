import assert from 'node:assert/strict';
import { characterCards, getCharacterCard, getCharacterProfile } from '../src/player/character-cards.js';
import { activeSpellEntries, getSpellCard, createSpellSlotState, eligibleSlotLevels, consumeSpellSlot, restoreSpellSlots, spellCombatSummary } from '../src/player/spell-cards.js';

for(const character of characterCards){
 for(const [edition,profile] of Object.entries(character.profiles||{})){
  const entries=activeSpellEntries(profile);
  for(const entry of entries){
   assert.ok(entry.card,`${character.name} ${edition}: missing compact rules data for ${entry.name}`);
   assert.equal(entry.card.name,entry.name,`${character.name} ${edition}: spell name mismatch`);
   assert.match(entry.card.source,/PHB (2014|2024) p\.\d+/,`${entry.name}: missing book/page reference`);
   assert.ok(entry.card.effect.length<=120,`${entry.name}: effect shorthand is too wordy`);
   assert.ok(entry.card.mechanics.length<=180,`${entry.name}: mechanics shorthand is too wordy`);
   assert.ok(!/d20/i.test(entry.card.damage||''),`${entry.name}: a d20 cannot be used as spell damage`);
   assert.ok(!/d20/i.test(entry.card.healing||''),`${entry.name}: a d20 cannot be used as spell healing`);
   if(entry.card.level===0)assert.deepEqual(eligibleSlotLevels(profile,entry.card.level),Object.keys(profile.spellSlots||{}).map(Number).sort((a,b)=>a-b),'Cantrip slot eligibility helper should not be used to consume a slot');
  }
 }
}

const elara=getCharacterCard('elara-evoker');
const elara14=getCharacterProfile(elara,'dnd-2014');
const elara24=getCharacterProfile(elara,'dnd-2024');
assert.equal(spellCombatSummary(getSpellCard('Fire Bolt','dnd-2014'),elara14),'Spell attack +5');
assert.equal(spellCombatSummary(getSpellCard('Web','dnd-2014'),elara14),'DEX save DC 13');
assert.equal(spellCombatSummary(getSpellCard('Fire Bolt','dnd-2024'),elara24),'Spell attack +5');

const slots=createSpellSlotState(elara14);
assert.deepEqual(slots,{1:{max:4,current:4},2:{max:2,current:2}},'Wizard 3 spell slots must be 4 first-level and 2 second-level slots');
assert.equal(consumeSpellSlot(slots,1),true);
assert.equal(slots[1].current,3);
assert.equal(consumeSpellSlot(slots,2),true);
assert.equal(slots[2].current,1);
restoreSpellSlots(slots);
assert.deepEqual(slots,{1:{max:4,current:4},2:{max:2,current:2}});

assert.equal(getSpellCard('Cure Wounds','dnd-2014').healing,'1d8 + mod');
assert.equal(getSpellCard('Cure Wounds','dnd-2024').healing,'2d8 + mod');
assert.equal(getSpellCard('Healing Word','dnd-2014').healing,'1d4 + mod');
assert.equal(getSpellCard('Healing Word','dnd-2024').healing,'2d4 + mod');
assert.equal(getSpellCard('Vicious Mockery','dnd-2014').damage,'1d4 psychic');
assert.equal(getSpellCard('Vicious Mockery','dnd-2024').damage,'1d6 psychic');

// Compact metadata must preserve rules-critical edition differences instead of relying on generic defaults.
const hunter14=getSpellCard('Hunter’s Mark','dnd-2014');
const hunter24=getSpellCard('Hunter’s Mark','dnd-2024');
assert.equal(hunter14.components,'V','2014 Hunter’s Mark is verbal-only');
assert.equal(hunter24.components,'V','2024 Hunter’s Mark is verbal-only');
const goodberry14=getSpellCard('Goodberry','dnd-2014');
assert.match(goodberry14.duration,/Instant/i,'2014 Goodberry spell duration is instantaneous');
assert.match(goodberry14.duration,/24 hours/i,'2014 Goodberry berries remain potent for 24 hours');
const sanctuary14=getSpellCard('Sanctuary','dnd-2014');
assert.match(sanctuary14.mechanics,/casts a spell affecting an enemy/i,'2014 Sanctuary must state its actual spell-ending trigger');
const sanctuary24=getSpellCard('Sanctuary','dnd-2024');
assert.equal(sanctuary24.components,'V,S,M','2024 Sanctuary uses V,S,M');
const command24=getSpellCard('Command','dnd-2024');
assert.equal(command24.components,'V','2024 Command is verbal-only');
const ensnaring24=getSpellCard('Ensnaring Strike','dnd-2024');
assert.match(ensnaring24.mechanics,/Large\+ has Advantage/i,'2024 Ensnaring Strike must preserve the Large-or-larger save advantage');

const lute=getCharacterCard('lute-lore-bard');
const lute14=getCharacterProfile(lute,'dnd-2014');
const lute24=getCharacterProfile(lute,'dnd-2024');
assert.ok(lute14.spellDetails.known.includes('Charm Person'),'2014 Lore Bard should use an SRD 5.1 spell in this slot');
assert.ok(!lute14.spellDetails.known.includes('Dissonant Whispers'),'Dissonant Whispers is not part of the SRD 5.1 publishing baseline');
assert.ok(lute24.spellDetails.prepared.includes('Dissonant Whispers'),'2024 Lore Bard can use Dissonant Whispers from SRD 5.2.1');

const fern24=getCharacterProfile(getCharacterCard('fern-hunter'),'dnd-2024');
const hunter=activeSpellEntries(fern24).find(entry=>entry.name==='Hunter’s Mark');
assert.ok(hunter,'2024 Ranger must expose Hunter’s Mark card');
assert.ok(hunter.sources.includes('Always Prepared'));
const favoredEnemy=fern24.resources.find(resource=>resource.id==='favored-enemy');
assert.ok(favoredEnemy,'2024 Ranger must carry the Favored Enemy resource used by the spell deck');
assert.equal(favoredEnemy.max,2,'Level 3 2024 Ranger has two free Hunter’s Mark casts per Long Rest');
assert.match(favoredEnemy.recharge,/Long Rest/i);

console.log('Rules-aware pregen spell-card audit passed.');
