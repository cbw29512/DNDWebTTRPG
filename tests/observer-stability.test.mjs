import fs from 'node:fs';
import assert from 'node:assert/strict';

const quest = fs.readFileSync('quest-tracker.js', 'utf8');
const audit = fs.readFileSync('card-quality-audit.js', 'utf8');

assert.ok(!quest.includes('new MutationObserver(renderTracker)'), 'Quest tracker must not recursively render on every mutation');
assert.ok(quest.includes('data-quest-render-key'), 'Quest tracker must use an idempotent render key');
assert.ok(quest.includes('bootObserver.disconnect()'), 'Quest tracker boot observer must disconnect after mounting');
assert.ok(quest.includes('requestAnimationFrame'), 'Quest tracker rerenders must be scheduled and coalesced');
assert.ok(!audit.includes('observe(document.documentElement'), 'Card audit must not watch the entire document');

console.log('Observer stability source checks passed.');
