import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const controls = fs.readFileSync('workspace-controls.js', 'utf8');
const initiative = fs.readFileSync('initiative-groups.js', 'utf8');

assert.match(html, /initiative-groups\.js\?v=grouped-init-1/);
assert.match(controls, /observe\(app, \{ childList: true \}\)/);
assert.doesNotMatch(controls, /subtree:\s*true/);
assert.match(initiative, /Shared initiative/);
assert.match(initiative, /group\.count > 1/);
assert.match(initiative, /data-card-roll="initiative"/);

console.log('Grouped initiative and observer freeze protections are present.');
