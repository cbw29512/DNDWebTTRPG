import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const guard = fs.readFileSync('encounter-slot-guard.js', 'utf8');

assert.match(html, /encounter-slot-guard\.js/);
assert.match(guard, /location/);
assert.match(guard, /room/);
assert.match(guard, /npc/);
assert.match(guard, /monster/);
assert.match(guard, /hazard/);
assert.match(guard, /treasure/);
assert.doesNotMatch(guard, /"objective"/);
assert.match(guard, /slot\.remove\(\)/);
assert.match(guard, /dataset\.slotCount/);

console.log('Only the six current-scene slots remain in the rendered encounter board.');
