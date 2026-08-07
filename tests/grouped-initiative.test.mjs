import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const controls = fs.readFileSync('workspace-controls.js', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const groups = fs.readFileSync('initiative-groups.js','utf8');
const shortcuts = fs.readFileSync('combat-shortcuts.js','utf8');

assert.match(html, /initiative-groups\.js\?v=rules-cards-1/);
assert.match(controls, /observe\(app, \{ childList: true \}\)/);
assert.doesNotMatch(controls, /subtree:\s*true/);
assert.match(app, /const groupedInitiative/);
assert.match(app, /entry\.count > 1/);
assert.match(shortcuts, /living-table:rules-initiative/);
assert.match(shortcuts, /rule\.initiativeModifier/);
assert.match(shortcuts, /data-roll-all-monsters/);
assert.match(shortcuts, /\.remove\(\)/,"The legacy roll-all control with fallback modifiers must be removed from the rendered UI");
assert.match(groups, /living-table:rules-initiative/);
assert.match(groups, /grouped\.set\(cardId, Number\(initiative\)\)/);
assert.match(groups, /Shared rules-accurate initiative/);
assert.match(groups, /living-table:scene-loaded/);
assert.match(groups, /grouped\.clear\(\)/,"Scene changes must not carry a stale initiative roll into a later encounter");
assert.match(groups, /observe\(app, \{ childList:true \}\)/);
assert.doesNotMatch(groups, /subtree:\s*true/);

console.log('Structured monster modifiers, shared initiative, scene reset, and observer protections are present.');
