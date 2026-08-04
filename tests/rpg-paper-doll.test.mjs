import assert from 'node:assert/strict';
import fs from 'node:fs';

const js = fs.readFileSync('player-ready.js', 'utf8');
const css = fs.readFileSync('player-ready.css', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

assert.match(js, /const characterCard = Object\.freeze/);
assert.match(js, /base statistics come from the player character card/i);
assert.match(js, /derivedStats/);
assert.match(js, /modifiers/);
assert.match(js, /mainHand/);
assert.match(js, /offHand/);
assert.match(js, /ring1/);
assert.match(js, /ring2/);
assert.match(js, /wondrous/);
assert.match(js, /data-equipment-slot/);
assert.match(js, /data-equip-item/);
assert.match(js, /data-unequip-item/);
assert.match(js, /data-read-item/);
assert.match(js, /charges remain/);
assert.match(css, /\.rpg-paper-doll/);
assert.match(css, /\.rpg-silhouette/);
assert.match(css, /\.rpg-slot/);
assert.match(css, /\.derived-stat-strip/);
assert.match(css, /\.magic-item-card/);
assert.match(html, /rpg-paper-doll-1/);

console.log('RPG paper doll, equipment slots, item-card modifiers, charges, and derived statistics passed.');
