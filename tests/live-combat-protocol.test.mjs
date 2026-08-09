import assert from 'node:assert/strict';
import { combatantIdForCharacter, createInitiativeIntent, initiativeIntentMatchesPlayer, normalizeInitiativeIntent } from '../src/session/live-combat-protocol.js';

const intent=createInitiativeIntent('wendy-birthday-hero',17);
assert.deepEqual(intent,{type:'combat-initiative',characterId:'wendy-birthday-hero',initiative:17});
assert.equal(normalizeInitiativeIntent({type:'combat-initiative',characterId:'wendy-birthday-hero',initiative:'19'}).initiative,19);
assert.equal(normalizeInitiativeIntent({type:'combat-initiative',characterId:'',initiative:19}),null);
assert.equal(normalizeInitiativeIntent({type:'wrong',characterId:'wendy-birthday-hero',initiative:19}),null);
assert.equal(initiativeIntentMatchesPlayer(intent,{characterId:'wendy-birthday-hero'}),true);
assert.equal(initiativeIntentMatchesPlayer(intent,{characterId:'merrin-thief'}),false);
const combat={combatants:{p1:{id:'p1',kind:'player',cardId:'wendy-birthday-hero'},m1:{id:'m1',kind:'monster',cardId:'wendy-birthday-hero'}}};
assert.equal(combatantIdForCharacter(combat,'wendy-birthday-hero'),'p1');
assert.equal(combatantIdForCharacter(combat,'missing'),null);
console.log('Live combat initiative intents validate, preserve numeric results, enforce claimed-character identity, and resolve only player combatants.');
