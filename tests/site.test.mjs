import assert from 'node:assert/strict';
import fs from 'node:fs';
import { rollDie, rollD20 } from '../src/dice.js';
import { COMMANDS, applyCommand, createInitialState, eventText } from '../src/state.js';
import { createRuinedChapelSession } from '../src/encounter.js';
import { projectSessionFor } from '../src/projection.js';
import { ROLES, validateCard, validateSession } from '../src/schema.js';

const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const app=fs.readFileSync('src/app.js','utf8');
const vision=fs.readFileSync('docs/PRODUCT_VISION.md','utf8');
const mvp=fs.readFileSync('docs/MVP_SPEC.md','utf8');
const sequence=values=>{let index=0;return()=>values[index++];};

assert.equal(rollDie(20,()=>0),1); assert.equal(rollDie(20,()=>0.999999),20);
const advantage=rollD20('advantage',sequence([0.2,0.8])); assert.deepEqual(advantage.rolls,[5,17]); assert.equal(advantage.total,17);
const disadvantage=rollD20('disadvantage',sequence([0.2,0.8])); assert.equal(disadvantage.total,5);
assert.throws(()=>rollD20('incorrect'),/Unknown d20 roll mode/);

let state=createInitialState();
let result=applyCommand(state,{type:COMMANDS.ROLL_D20,mode:'advantage'},{random:sequence([0.1,0.9])}); state=result.state;
assert.equal(state.total,19); assert.equal(state.revision,1);
result=applyCommand(state,{type:COMMANDS.TOGGLE_CARD,key:'hazard'}); state=result.state; assert.equal(state.revealed.hazard,true);
result=applyCommand(state,{type:COMMANDS.END_TURN}); state=result.state; assert.equal(state.active,1); assert.match(eventText(state)[0],/Skeleton A/);
result=applyCommand(state,{type:COMMANDS.UNDO}); state=result.state; assert.equal(state.active,0); assert.equal(result.event.type,'COMMAND_UNDONE');

const session=createRuinedChapelSession(); validateSession(session);
const dm=session.participants.find(p=>p.role===ROLES.DM);
const player=session.participants.find(p=>p.role===ROLES.PLAYER);
const dmView=projectSessionFor(session,dm);
const playerView=projectSessionFor(session,player);
assert.equal(dmView.cards.length,5,'DM receives all cards, including unrevealed cards.');
assert.equal(playerView.cards.length,3,'Player receives only revealed cards.');
assert.ok(dmView.cards.find(card=>card.id==='priest').dmFace.hp===32);
assert.equal(playerView.cards.find(card=>card.id==='priest').dmFace,undefined,'Player must not receive DM card face.');
assert.equal(playerView.cards.some(card=>card.id==='hazard'),false,'Unrevealed hazard must not reach player payload.');
assert.equal(playerView.cards.some(card=>card.id==='treasure'),false,'Unrevealed treasure must not reach player payload.');
const playerPriest=playerView.actors.find(actor=>actor.id==='cult-priest');
assert.equal(playerPriest.hp,undefined,'Monster HP must not reach player projection.');
assert.equal(playerPriest.ac,undefined,'Monster AC must not reach player projection.');
assert.equal(playerPriest.private,undefined,'Monster tactics must not reach player projection.');
const playerLyria=playerView.actors.find(actor=>actor.id==='lyria');
assert.equal(playerLyria.hp.current,32,'Controller receives full own-character state.');
assert.throws(()=>projectSessionFor(session,{id:'intruder',name:'Intruder',role:'player'}),/not seated/);
assert.throws(()=>validateCard({id:'bad'}),/title/);

assert.match(html,/The Living Table/); assert.match(app,/DM View/); assert.match(app,/Player View/); assert.match(app,/projectSessionFor/);
assert.match(app,/Filtered player projection/); assert.match(app,/COMMANDS\.UNDO/); assert.match(app,/Encounter Deck/);
assert.match(css,/\.view-switch/); assert.match(css,/\.safe-note/); assert.match(vision,/server-side/i); assert.match(mvp,/complete D&D-style combat encounter/i);
console.log('The Living Table schemas, state engine, dice, and role projections passed.');
