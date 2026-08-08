import assert from 'node:assert/strict';
import { SESSION_COMMANDS } from '../src/session/session-commands.js';
import { normalizeSessionState } from '../src/session/session-schema.js';
import { applySessionCommand } from '../src/session/session-reducer.js';

let session=normalizeSessionState({sessionId:'grouped-combat',eventHistory:[]});
session=applySessionCommand(session,{type:SESSION_COMMANDS.START_COMBAT,combatState:{
  encounterId:'present-fight',edition:'dnd-2014',combatants:[
    {id:'present-1',kind:'monster',name:'Animated Present A',cardId:'animated-present',speed:30,hp:{current:12,max:12}},
    {id:'present-2',kind:'monster',name:'Animated Present B',cardId:'animated-present',speed:30,hp:{current:12,max:12}},
    {id:'wendy',kind:'player',name:'Wendy',speed:30,hp:{current:28,max:28}}
  ],
  initiativeGroups:[{id:'group:animated-present',label:'Animated Presents',memberIds:['present-1','present-2']}]
}},{now:1000}).state;

assert.equal(session.combatState.combatants['present-1'].initiativeGroupId,'group:animated-present');
assert.equal(session.combatState.combatants['present-2'].initiativeGroupId,'group:animated-present');
assert.deepEqual(session.combatState.initiativeGroups['group:animated-present'].memberIds,['present-1','present-2']);

let result=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_GROUP_INITIATIVE,groupId:'group:animated-present',initiative:17},{now:2000});
session=result.state;
assert.equal(result.event.data.groupId,'group:animated-present');
assert.equal(session.combatState.initiativeGroups['group:animated-present'].initiative,17);
assert.deepEqual(session.combatState.turnOrder,['group:animated-present']);
assert.throws(()=>applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_INITIATIVE,combatantId:'present-1',initiative:19},{now:2500}),/uses grouped initiative/);

session=applySessionCommand(session,{type:SESSION_COMMANDS.SET_COMBAT_INITIATIVE,combatantId:'wendy',initiative:14},{now:3000}).state;
assert.deepEqual(session.combatState.turnOrder,['group:animated-present','wendy']);

session=applySessionCommand(session,{type:SESSION_COMMANDS.BEGIN_COMBAT_ROUNDS},{now:4000}).state;
assert.equal(session.combatState.activeTurnId,'group:animated-present');

session=applySessionCommand(session,{type:SESSION_COMMANDS.UPDATE_COMBAT_ACTION_ECONOMY,combatantId:'present-1',patch:{action:false,movementRemaining:5}},{now:5000}).state;
session=applySessionCommand(session,{type:SESSION_COMMANDS.UPDATE_COMBAT_ACTION_ECONOMY,combatantId:'present-2',patch:{bonusAction:false,movementRemaining:10}},{now:6000}).state;
session=applySessionCommand(session,{type:SESSION_COMMANDS.ADVANCE_COMBAT_TURN},{now:7000}).state;
assert.equal(session.combatState.activeTurnId,'wendy');
session=applySessionCommand(session,{type:SESSION_COMMANDS.ADVANCE_COMBAT_TURN},{now:8000}).state;
assert.equal(session.combatState.round,2);
assert.equal(session.combatState.activeTurnId,'group:animated-present');
assert.equal(session.combatState.combatants['present-1'].actionEconomy.action,true,'A grouped initiative turn resets each member action.');
assert.equal(session.combatState.combatants['present-2'].actionEconomy.bonusAction,true,'A grouped initiative turn resets each member bonus action.');
assert.equal(session.combatState.combatants['present-1'].actionEconomy.movementRemaining,30);
assert.equal(session.combatState.combatants['present-2'].actionEconomy.movementRemaining,30);

console.log('Grouped monster initiative persists as one turn entry while retaining individual monster combatant state.');
