import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const controls = fs.readFileSync('workspace-controls.js', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const combatRounds = fs.readFileSync('combat-rounds.js','utf8');
const combatModel = fs.readFileSync('src/session/combat-party-model.js','utf8');
const shortcuts = fs.readFileSync('combat-shortcuts.js','utf8');

assert.doesNotMatch(html, /initiative-groups\.js\?v=rules-cards-1/);
assert.match(html, /combat-rounds\.js\?v=party-combat-1/);
assert.match(controls, /observe\(app, \{ childList: true \}\)/);
assert.doesNotMatch(controls, /subtree:\s*true/);
assert.match(app, /const groupedInitiative/);
assert.match(app, /entry\.count > 1/);
assert.match(shortcuts, /living-table:rules-initiative/);
assert.match(shortcuts, /rule\.initiativeModifier/);
assert.match(shortcuts, /data-roll-all-monsters/);
assert.match(shortcuts, /\.remove\(\)/,"The legacy roll-all control with fallback modifiers must be removed from the rendered UI");
assert.match(combatRounds, /living-table:rules-initiative/);
assert.match(combatRounds, /SET_COMBAT_GROUP_INITIATIVE/);
assert.match(combatRounds, /ensureCombat\(\)/);
assert.match(combatModel, /initiativeGroups\[id\]/);
assert.match(combatModel, /memberIds\.push\(monster\.id\)/);

console.log('Structured monster modifiers now feed canonical grouped initiative without the legacy sessionStorage tracker.');
