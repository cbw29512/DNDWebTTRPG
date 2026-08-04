import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const player = fs.readFileSync('player-ready.js', 'utf8');
const modal = fs.readFileSync('card-modal.js', 'utf8');
const controls = fs.readFileSync('workspace-controls.js', 'utf8');
const quest = fs.readFileSync('quest-tracker.js', 'utf8');

assert.match(html, /player-ready\.css/);
assert.match(html, /player-ready\.js/);
assert.match(app, /data-role="dm"/);
assert.match(app, /data-role="player"/);
assert.match(app, /data-die/);
assert.match(app, /data-open-picker/);
assert.match(app, /data-place-card/);
assert.match(app, /data-toggle-stack/);
assert.match(app, /data-card-roll/);
assert.match(app, /data-roll-all-monsters/);
assert.match(modal, /Open full card/);
assert.match(controls, /workspace-panel-toggle/);
assert.match(quest, /data-add-side-quest/);
assert.match(quest, /data-remove-side-quest/);

assert.match(player, /data-player-ready/);
assert.match(player, /data-spend-action/);
assert.match(player, /data-reset-turn/);
assert.match(player, /data-hp-change/);
assert.match(player, /data-player-roll/);
assert.match(player, /data-equip-item/);
assert.match(player, /data-use-item/);
assert.match(player, /data-cycle-slot/);
assert.match(player, /Wendy’s Birthday Hero/);
assert.match(player, /Birthday Spark/);
assert.match(player, /character equipment paper doll/);
assert.match(player, /Healing Candy/);
assert.match(player, /observe\(app, \{ childList: true \}\)/);
assert.doesNotMatch(player, /subtree:\s*true/);

console.log('DM controls and the interactive player-ready station are wired and protected.');
