import assert from 'node:assert/strict';
import fs from 'node:fs';
import { rollDie, rollD20 } from '../src/dice.js';

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

assert.match(html,/The Living Table/);
assert.match(app,/Dice roller/);
assert.match(app,/data-d20-mode="advantage"/);
assert.match(app,/data-d20-mode="disadvantage"/);
assert.match(app,/keep \$\{result\.total\}/);
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
console.log('The Living Table audited prototype checks passed.');
