import assert from 'node:assert/strict';
import { normalizeSessionState } from '../src/session/session-schema.js';

const resumed=normalizeSessionState({
  sessionId:'resume-setup',
  combatState:{
    encounterId:'initiative-setup',
    edition:'dnd-2014',
    status:'setup',
    round:1,
    activeTurnId:null,
    turnOrder:['mimic','wendy'],
    combatants:[
      {id:'mimic',name:'Mimic',initiative:18,hp:{current:22,max:22}},
      {id:'wendy',name:'Wendy',initiative:14,hp:{current:28,max:28}}
    ]
  }
});

assert.equal(resumed.combatState.status,'setup');
assert.deepEqual(resumed.combatState.turnOrder,['mimic','wendy']);
assert.equal(resumed.combatState.activeTurnId,null,'Reloading initiative setup must not invent an active combat turn.');

const active=normalizeSessionState({
  sessionId:'resume-active',
  combatState:{
    encounterId:'active-round',
    edition:'dnd-2014',
    status:'active',
    round:3,
    activeTurnId:'wendy',
    turnOrder:['mimic','wendy'],
    combatants:[
      {id:'mimic',name:'Mimic',initiative:18,hp:{current:7,max:22}},
      {id:'wendy',name:'Wendy',initiative:14,hp:{current:10,max:28},conditions:[{id:'poisoned',name:'Poisoned'}],concentration:{effectId:'bless',name:'Bless'}}
    ]
  }
});

assert.equal(active.combatState.round,3);
assert.equal(active.combatState.activeTurnId,'wendy');
assert.equal(active.combatState.combatants.mimic.hp.current,7);
assert.equal(active.combatState.combatants.wendy.conditions[0].id,'poisoned');
assert.equal(active.combatState.combatants.wendy.concentration.name,'Bless');

console.log('Combat setup and active-round resume normalization passed.');
