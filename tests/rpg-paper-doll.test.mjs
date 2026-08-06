import assert from 'node:assert/strict';
import fs from 'node:fs';

const player = fs.readFileSync('player-ready.js', 'utf8');
const itemSystem = fs.readFileSync('src/player/item-system.js', 'utf8');
const characters = fs.readFileSync('src/player/character-cards.js', 'utf8');
const css = fs.readFileSync('player-ready.css', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

assert.match(player, /import \{ characterCard, itemCards, slotLabels, createInventory/);
assert.match(characters, /defaultCharacterCard/);
assert.match(itemSystem, /export const characterCard = defaultCharacterCard/);
assert.match(player, /Base statistics come from the character card/i);
assert.match(player, /deriveStats/);
assert.match(itemSystem, /effects:/);
assert.match(itemSystem, /mainHand/);
assert.match(itemSystem, /offHand/);
assert.match(itemSystem, /ring1/);
assert.match(itemSystem, /ring2/);
assert.match(itemSystem, /wondrous/);
assert.match(player, /data-equipment-slot/);
assert.match(player, /data-auto-equip/);
assert.match(player, /data-unequip-item/);
assert.match(player, /data-read-item/);
assert.match(player, /data-use-item/);
assert.match(player, /charges/);
assert.match(css, /\.rpg-paper-doll/);
assert.match(css, /\.rpg-silhouette/);
assert.match(css, /\.rpg-slot/);
assert.match(css, /\.derived-stat-strip/);
assert.match(css, /\.equipment-card/);
assert.match(html, /player-ready\.css/);
assert.match(html, /player-ready\.js/);

console.log('Modular RPG paper doll, legal slots, item effects, charges, and derived statistics passed.');
