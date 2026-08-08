import assert from 'node:assert/strict';
import fs from 'node:fs';

const guide=fs.readFileSync('live-session-guide.js','utf8');

assert.match(guide,/const setText=\(node,text\)=>\{[\s\S]*node\.textContent!==text[\s\S]*node\.textContent=text/,'Guide text writes must be idempotent inside the body MutationObserver path.');
assert.match(guide,/guide\.dataset\.connected!==connectedValue/,'Connection-state attributes should only change when the value changes.');
assert.match(guide,/button\.disabled!==disabled/,'DM copy-link state should not be rewritten on every observed mutation.');
assert.doesNotMatch(guide,/guide\.querySelector\('strong'\)\.textContent=/,'Do not restore unconditional guide heading writes.');
assert.doesNotMatch(guide,/guide\.querySelector\('span'\)\.textContent=/,'Do not restore unconditional guide description writes.');
assert.match(guide,/new MutationObserver\(mount\)\.observe\(document\.body/,'The guide can continue observing dynamically mounted live-session UI.');

console.log('Live-session guide observer writes are idempotent and cannot self-feed through unconditional text replacement.');
