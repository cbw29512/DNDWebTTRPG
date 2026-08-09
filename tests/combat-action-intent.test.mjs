import assert from 'node:assert/strict';
import { COMBAT_ACTION_INTENT, createActionEconomyIntent, normalizeActionEconomyIntent, validatePlayerActionEconomyIntent } from '../src/session/combat-action-intent.js';

const combat={status:'active',activeTurnId:'player:seat-1',combatants:{
  'player:seat-1':{id:'player:seat-1',kind:'player',actionEconomy:{action:true,bonusAction:true,reaction:true,objectInteraction:true,movementMax:30,movementRemaining:30,readiedAction:null}},
  'player:seat-2':{id:'player:seat-2',kind:'player',actionEconomy:{action:true,bonusAction:true,reaction:true,objectInteraction:true,movementMax:30,movementRemaining:30,readiedAction:null}}
}};

const spend=createActionEconomyIntent('wendy-birthday-hero',{action:false,movementRemaining:20});
assert.deepEqual(spend,{type:COMBAT_ACTION_INTENT,characterId:'wendy-birthday-hero',patch:{action:false,movementRemaining:20}});
assert.equal(validatePlayerActionEconomyIntent(spend,combat,'player:seat-1').patch.movementRemaining,20);
assert.throws(()=>createActionEconomyIntent('wendy-birthday-hero',{action:true}),/only spend action/);
assert.throws(()=>createActionEconomyIntent('wendy-birthday-hero',{movementMax:60}),/Unsupported action economy field/);
assert.throws(()=>validatePlayerActionEconomyIntent(createActionEconomyIntent('other',{action:false}),combat,'player:seat-2'),/only be spent on your turn/);
assert.throws(()=>validatePlayerActionEconomyIntent(createActionEconomyIntent('wendy-birthday-hero',{movementRemaining:35}),combat,'player:seat-1'),/cannot restore movement/);

const ready=createActionEconomyIntent('wendy-birthday-hero',{action:false,readiedAction:{trigger:'The cultist opens the door',response:'I loose an arrow'}});
const validatedReady=validatePlayerActionEconomyIntent(ready,combat,'player:seat-1');
assert.equal(validatedReady.patch.action,false);
assert.deepEqual(validatedReady.patch.readiedAction,{kind:'action',trigger:'The cultist opens the door',response:'I loose an arrow'});
assert.throws(()=>validatePlayerActionEconomyIntent(createActionEconomyIntent('wendy-birthday-hero',{readiedAction:{trigger:'Door opens',response:'Attack'}}),combat,'player:seat-1'),/must spend the Action/);
assert.equal(validatePlayerActionEconomyIntent(createActionEconomyIntent('other',{reaction:false}),combat,'player:seat-2').patch.reaction,false,'A Reaction may be spent outside the player’s own turn.');
assert.equal(normalizeActionEconomyIntent({type:COMBAT_ACTION_INTENT,characterId:'',patch:{action:false}}),null);

const spent=structuredClone(combat);spent.combatants['player:seat-1'].actionEconomy.action=false;
assert.throws(()=>validatePlayerActionEconomyIntent(createActionEconomyIntent('wendy-birthday-hero',{action:false}),spent,'player:seat-1'),/already spent/);
console.log('Player action economy intents are consume-only, turn-aware, Ready-aware, and reject movement/resource restoration.');
