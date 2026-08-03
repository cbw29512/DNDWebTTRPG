import assert from 'node:assert/strict';
import fs from 'node:fs';
import { rollDie, rollD20 } from '../src/dice.js';
import { COMMANDS, applyCommand, createInitialState, eventText } from '../src/state.js';

const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const app=fs.readFileSync('src/app.js','utf8');
const vision=fs.readFileSync('docs/PRODUCT_VISION.md','utf8');
const mvp=fs.readFileSync('docs/MVP_SPEC.md','utf8');

const sequence = values => {
  let index = 0;
  return () => values[index++];
};

assert.equal(rollDie(20, () => 0), 1);
assert.equal(rollDie(20, () => 0.999999), 20);

const advantage = rollD20('advantage', sequence([0.2, 0.8]));
assert.deepEqual(advantage.rolls, [5, 17]);
assert.equal(advantage.total, 17, 'Advantage must keep the higher d20.');

const disadvantage = rollD20('disadvantage', sequence([0.2, 0.8]));
assert.deepEqual(disadvantage.rolls, [5, 17]);
assert.equal(disadvantage.total, 5, 'Disadvantage must keep the lower d20.');

const normal = rollD20('normal', () => 0.45);
assert.deepEqual(normal.rolls, [10]);
assert.equal(normal.total, 10);
assert.throws(() => rollD20('incorrect'), /Unknown d20 roll mode/);
assert.throws(() => rollDie(1), /at least 2/);

let state = createInitialState();
assert.equal(state.revision, 0);
assert.equal(state.round, 2);
assert.equal(state.active, 0);

let result = applyCommand(state, { type: COMMANDS.ROLL_D20, mode: 'advantage' }, { random: sequence([0.1, 0.9]) });
state = result.state;
assert.equal(state.total, 19);
assert.deepEqual(result.event.data.rolls, [3, 19]);
assert.equal(result.event.data.kept, 19);
assert.equal(state.revision, 1);
assert.equal(state.undoStack.length, 1);

result = applyCommand(state, { type: COMMANDS.TOGGLE_CARD, key: 'hazard' });
state = result.state;
assert.equal(state.revealed.hazard, true);
assert.equal(result.event.type, 'CARD_VISIBILITY_CHANGED');
assert.equal(state.revision, 2);

result = applyCommand(state, { type: COMMANDS.END_TURN });
state = result.state;
assert.equal(state.active, 1);
assert.equal(result.event.type, 'TURN_STARTED');
assert.match(eventText(state)[0], /Skeleton A/);

result = applyCommand(state, { type: COMMANDS.UNDO });
state = result.state;
assert.equal(state.active, 0, 'Undo must restore the previous active combatant.');
assert.equal(state.revision, 4, 'Undo is itself a new revision.');
assert.equal(result.event.type, 'COMMAND_UNDONE');

assert.throws(() => applyCommand(state, { type: 'NOT_REAL' }), /Unsupported command/);
assert.throws(() => applyCommand(state, { type: COMMANDS.TOGGLE_CARD, key: 'missing' }), /Unknown card/);

assert.match(html,/The Living Table/);
assert.match(app,/Dice roller/);
assert.match(app,/COMMANDS\.ROLL_D20/);
assert.match(app,/COMMANDS\.TOGGLE_CARD/);
assert.match(app,/COMMANDS\.END_TURN/);
assert.match(app,/COMMANDS\.UNDO/);
assert.match(app,/Revision \$\{state\.revision\}/);
assert.match(app,/visual placeholders/);
assert.match(app,/DM-controlled combatant/);
assert.match(app,/Encounter Deck/);
assert.match(app,/Initiative/);
assert.match(app,/End Turn/);
assert.match(app,/data-reveal/);
assert.match(app,/The Ruined Chapel/);
assert.match(css,/\.topbar/);
assert.match(css,/\.board/);
assert.match(css,/\.action:disabled/);
assert.match(vision,/server-side/i);
assert.match(mvp,/complete D&D-style combat encounter/i);
console.log('The Living Table state-engine prototype checks passed.');
