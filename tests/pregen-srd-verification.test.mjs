import assert from 'node:assert/strict';
import { characterCards, getCharacterProfile } from '../src/player/character-cards.js';

const elara=characterCards.find(character=>character.id==='elara-evoker');
const elara2024=getCharacterProfile(elara,'dnd-2024');
const wizardCantrips=new Set(['Acid Splash','Chill Touch','Dancing Lights','Elementalism','Fire Bolt','Light','Mage Hand','Mending','Message','Minor Illusion','Poison Spray','Prestidigitation','Ray of Frost','Shocking Grasp','True Strike']);
const featCantrips=elara2024.spellDetails.origin.filter(entry=>entry.includes('Magic Initiate (Wizard)')&&!entry.includes('free 1/Long Rest')).map(entry=>entry.split(' — ')[0]);
assert.equal(featCantrips.length,2,'Sage Magic Initiate (Wizard) must supply two Wizard cantrips');
for(const cantrip of featCantrips)assert.equal(wizardCantrips.has(cantrip),true,`${cantrip} is not a Wizard cantrip in SRD 5.2.1`);
assert.equal(featCantrips.includes('Guidance'),false,'Guidance cannot be selected by Magic Initiate (Wizard)');
assert.equal(elara2024.spellDetails.origin.some(entry=>entry.startsWith('Shield —')),true,'Sage Magic Initiate must include its selected level-1 Wizard spell');

const merrin=characterCards.find(character=>character.id==='merrin-thief');
const fastHands=getCharacterProfile(merrin,'dnd-2024').features.find(feature=>feature.name==='Fast Hands');
assert.ok(fastHands,'2024 Thief must include Fast Hands');
assert.match(fastHands.summary,/Utilize action/i);
assert.match(fastHands.summary,/Magic action/i);
assert.match(fastHands.summary,/magic item/i);

console.log('SRD 5.2.1 pregen verification passed: Sage Magic Initiate uses Wizard spells and Thief Fast Hands includes its magic-item option.');
