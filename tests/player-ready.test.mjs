import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const playerHtml = fs.readFileSync('player.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const player = fs.readFileSync('player-ready.js', 'utf8');
const characters = fs.readFileSync('src/player/character-cards.js', 'utf8');
const items = fs.readFileSync('src/player/item-system.js', 'utf8');
const modal = fs.readFileSync('card-modal.js', 'utf8');
const controls = fs.readFileSync('workspace-controls.js', 'utf8');
const quest = fs.readFileSync('quest-tracker.js', 'utf8');

assert.match(html, /player-ready\.css/);
assert.match(html, /player-ready\.js/);
assert.match(html, /<body class="role-dm live-play-board-first">/);
assert.match(playerHtml, /<body class="role-player live-play-board-first">/);
assert.match(app, /resolveRuntimeRole/);
assert.match(app, /viewRole === ROLES\.DM/);
assert.match(app, /isDM \? "Dungeon Master Card Board" : "Revealed Adventure Cards"/);
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
assert.match(player, /data-auto-equip/);
assert.match(player, /data-unequip-item/);
assert.match(player, /data-equipment-slot/);
assert.match(player, /data-drop-slot/);
assert.match(player, /data-use-item/);
assert.match(player, /RPG Equipment Doll/);
assert.match(player, /new MutationObserver\(enhance\)\.observe\(app,\{childList:true\}\)/);
assert.doesNotMatch(player, /subtree:\s*true/);

assert.match(characters, /Wendy’s Birthday Hero/);
assert.match(characters, /Birthday Spark/);
assert.match(items, /birthday-spark/);
assert.match(items, /potion-healing/);

console.log('Route-derived DM controls, player equipment wiring, character content, and item resources are protected.');
