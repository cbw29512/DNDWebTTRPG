import assert from 'node:assert/strict';
import fs from 'node:fs';
import { wishingCakePackCards } from '../src/wishing-cake-pack.js';
import { COMMANDS, applyCommand, createInitialState } from '../src/state.js';

const explicitRevealTypes=new Set(['npc','monster','hazard','treasure','item']);
const gated=wishingCakePackCards.filter(card=>explicitRevealTypes.has(card.type));
assert.ok(gated.length>0,'Wishing Cake must include explicit-reveal encounter cards.');
for(const card of gated)assert.equal(card.revealed,false,`${card.id} (${card.type}) must start unrevealed for player-safe projection.`);

const martha=wishingCakePackCards.find(card=>card.id==='caretaker');
assert.ok(martha,'Martha card must exist.');
assert.equal(martha.revealed,false,'Martha must require an explicit DM Reveal action.');

const initial=createInitialState(wishingCakePackCards);
assert.equal(initial.revealed.caretaker,false,'Loaded card visibility should seed reducer state.');
assert.equal(initial.cardLabels.caretaker,'Martha Bramblepot');
const toggled=applyCommand(initial,{type:COMMANDS.TOGGLE_CARD,key:'caretaker'}).state;
assert.equal(toggled.revealed.caretaker,true,'DM Reveal must become authoritative reducer state.');
assert.match(toggled.events[0].text,/reveals Martha Bramblepot/);

const modal=fs.readFileSync('card-modal.js','utf8');
assert.match(modal,/priorLabel === "Reveal" \? "Hide" : "Reveal"/,'Full-card Reveal must expose its post-action state to the live transport bridge.');
assert.match(modal,/setTimeout\(closeModal, 25\)/,'Reveal modal must remain mounted through the live transport deferred capture.');

console.log('Explicit reveal authority and full-card live bridge passed.');
