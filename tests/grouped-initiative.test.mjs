import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const controls = fs.readFileSync('workspace-controls.js', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');

assert.doesNotMatch(html, /initiative-groups\.js/);
assert.match(controls, /observe\(app, \{ childList: true \}\)/);
assert.doesNotMatch(controls, /subtree:\s*true/);
assert.match(app, /const groupedInitiative/);
assert.match(app, /entry\.count > 1/);
assert.match(app, /Identical monsters share one initiative value/);
assert.match(app, /filter\(item => item\.cardId === instance\.cardId\)/);

console.log('Grouped initiative and observer freeze protections are present.');
