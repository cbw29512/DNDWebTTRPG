import assert from 'node:assert/strict';
import { SESSION_COMMANDS } from '../src/session/session-commands.js';
import { normalizeCombatState } from '../src/session/combat-schema.js';
import { normalizeSessionState } from '../src/session/session-schema.js';
import { applySessionCommand } from '../src/session/session-reducer.js';

const normalized=normalizeCombatState({
  encounterId:'clamp-test',edition:'dnd-2024',combatants:[{
    id:'hero',name:'Hero',speed:30,hp:{current:99,max:20,temp:-4},deathSaves:{successes:9,failures:-1},
    resources:{feature:{current:5,max:2}},actionEconomy:{movementRemaining:99}
  }]
});
assert.equal(normalized.combatants.hero.hp.current,20);
assert.equal(normalized.combatants.hero.hp.temp,0);
assert.deepEqual(normalized.combatants.hero.deathSaves,{successes:3,failures:0});
assert.equal(normalized.combatants.hero.resources.feature.current,2);
assert.equal(normalized.combatants.hero.actionEconomy.movementRemaining,30);

let session=normalizeSessionState({sessionId:'combat-session',eventHistory:[]});
let result=applySessionCommand(session,{type:SESSION_COMMANDS.START_COMBAT,combatState:{
  encounterId:'cake-fight',edition:'dnd-2014',combatants:[
    {id:'wendy',kind:'player',name:'Wendy',seatId:'seat-1',speed:30,hp:{current:20,max:28,temp:3},resources:{'second-wind':{current:1,max:2,label:'Second Wind',recharge:'Short or Long Rest'}}},
    {id:'mimic-group',kind:'monster',name:'Paper Plate Mimic',cardId:'paper-plate-mimic',speed:15,hp:{current:22,max:22}}
  ]
}},{now:1000});
session=result.state;
assert.equal(session.combatState.status,'setup');
assert.equal(session.combatState.activeTurnId,null);
assert.equal(result.event.data.combatantCount,2);

session=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_INITIATIVE,combatantId:'wendy',initiative:14},{now:2000}).state;
session=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_INITIATIVE,combatantId:'mimic-group',initiative:18},{now:3000}).state;
assert.deepEqual(session.combatState.turnOrder,['mimic-group','wendy']);
assert.equal(session.combatState.activeTurnId,null,'Initiative setup must not claim an active turn before rounds begin.');

result=applySessionCommand(session,{type:SESSION_COMMANDS.BEGIN_COMBAT_ROUNDS},{now:4000});
session=result.state;
assert.equal(session.combatState.status,'active');
assert.equal(session.combatState.round,1);
assert.equal(session.combatState.activeTurnId,'mimic-group');
assert.deepEqual(result.event.data.turnOrder,['mimic-group','wendy']);

session=applySessionCommand(session,{type:SESSION_COMMANDS.UPDATE_COMBAT_ACTION_ECONOMY,combatantId:'mimic-group',patch:{action:false,movementRemaining:5,readiedAction:'Bite if Wendy approaches'}},{now:5000}).state;
assert.equal(session.combatState.combatants['mimic-group'].actionEconomy.action,false);
assert.equal(session.combatState.combatants['mimic-group'].actionEconomy.movementRemaining,5);

session=applySessionCommand(session,{type:SESSION_COMMANDS.ADVANCE_COMBAT_TURN},{now:6000}).state;
assert.equal(session.combatState.activeTurnId,'wendy');
assert.equal(session.combatState.combatants.wendy.actionEconomy.action,true);
assert.equal(session.combatState.combatants.wendy.actionEconomy.movementRemaining,30);

session=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBATANT_HP,combatantId:'wendy',current:10,temp:0},{now:7000}).state;
assert.deepEqual(session.combatState.combatants.wendy.hp,{current:10,max:28,temp:0});

session=applySessionCommand(session,{type:SESSION_COMMANDS.APPLY_COMBAT_CONDITION,combatantId:'wendy',condition:{id:'poisoned',name:'Poisoned',sourceId:'venom',duration:'1 minute',endTiming:'save end of turn'}},{now:8000}).state;
assert.equal(session.combatState.combatants.wendy.conditions[0].name,'Poisoned');

session=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_CONCENTRATION,combatantId:'wendy',concentration:{effectId:'bless',name:'Bless',sourceId:'spell-bless'}},{now:9000}).state;
assert.equal(session.combatState.combatants.wendy.concentration.name,'Bless');

session=applySessionCommand(session,{type:SESSION_COMMANDS.UPDATE_COMBAT_RESOURCE,combatantId:'wendy',resourceId:'second-wind',current:0},{now:10000}).state;
assert.equal(session.combatState.combatants.wendy.resources['second-wind'].current,0);

session=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_DEATH_SAVES,combatantId:'wendy',successes:1,failures:2},{now:11000}).state;
assert.deepEqual(session.combatState.combatants.wendy.deathSaves,{successes:1,failures:2});

session=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_ENVIRONMENT,hazards:[{id:'fire',name:'Burning floor'}],recurringTriggers:[{id:'clock-20',initiative:20,label:'Wish Circle advances'}]},{now:12000}).state;
assert.equal(session.combatState.hazards[0].id,'fire');
assert.equal(session.combatState.recurringTriggers[0].initiative,20);

session=applySessionCommand(session,{type:SESSION_COMMANDS.ADVANCE_COMBAT_TURN},{now:13000}).state;
assert.equal(session.combatState.round,2);
assert.equal(session.combatState.activeTurnId,'mimic-group');
assert.equal(session.combatState.combatants['mimic-group'].actionEconomy.action,true,'A new turn restores action economy.');
assert.equal(session.combatState.combatants['mimic-group'].actionEconomy.movementRemaining,15);
assert.equal(session.combatState.combatants['mimic-group'].actionEconomy.readiedAction,null);

const noop=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_CONCENTRATION,combatantId:'wendy',concentration:{effectId:'bless',name:'Bless',sourceId:'spell-bless'}},{now:14000});
assert.equal(noop.event,null,'Identical combat mutations must not create event-history noise.');

result=applySessionCommand(session,{type:SESSION_COMMANDS.END_COMBAT},{now:15000});
assert.equal(result.state.combatState,null);
assert.equal(result.event.type,SESSION_COMMANDS.END_COMBAT);

assert.throws(()=>applySessionCommand(normalizeSessionState({}),{type:SESSION_COMMANDS.ADVANCE_COMBAT_TURN},{now:16000}),/No active combat state/);

console.log('Persistent combat schema, initiative setup, exact resources, conditions, action economy, hazards, and round advancement passed.');