import fs from 'node:fs';
import assert from 'node:assert/strict';

const quest = fs.readFileSync('quest-tracker.js', 'utf8');
const audit = fs.readFileSync('card-quality-audit.js', 'utf8');
const guide = fs.readFileSync('live-session-guide.js', 'utf8');
const counts = fs.readFileSync('live-table-counts.js', 'utf8');

assert.ok(!quest.includes('new MutationObserver(renderTracker)'), 'Quest tracker must not recursively render on every mutation');
assert.ok(quest.includes('data-quest-render-key'), 'Quest tracker must use an idempotent render key');
assert.ok(quest.includes('bootObserver.disconnect()'), 'Quest tracker boot observer must disconnect after mounting');
assert.ok(quest.includes('requestAnimationFrame'), 'Quest tracker rerenders must be scheduled and coalesced');
assert.ok(!audit.includes('observe(document.documentElement'), 'Card audit must not watch the entire document');

assert.match(guide,/node\.textContent!==text/,'Live-session guide must guard text writes inside its body observer path.');
assert.match(guide,/button\.disabled!==disabled/,'Live-session guide must guard copy-link state writes.');
assert.doesNotMatch(guide,/guide\.querySelector\('strong'\)\.textContent=/,'Live-session guide must not restore unconditional observed text writes.');

assert.match(counts,/badge\.textContent!==text/,'Live stack quantity badges must guard text writes inside the app observer path.');
assert.match(counts,/badge\.getAttribute\('aria-label'\)!==label/,'Live stack quantity badges must guard label writes.');
assert.doesNotMatch(counts,/badge\.textContent=`×\$\{count\} in play`/,'Live stack count observer must not restore unconditional text replacement.');

console.log('Observer stability source checks passed, including live-session guide and stack-count feedback-loop guards.');
