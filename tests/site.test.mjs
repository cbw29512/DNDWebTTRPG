import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const app=fs.readFileSync('src/app.js','utf8');
const vision=fs.readFileSync('docs/PRODUCT_VISION.md','utf8');
const mvp=fs.readFileSync('docs/MVP_SPEC.md','utf8');

assert.match(html,/The Living Table/);
assert.match(app,/Dice roller/);
assert.match(app,/Encounter Deck/);
assert.match(app,/Initiative/);
assert.match(app,/End Turn/);
assert.match(app,/data-reveal/);
assert.match(app,/The Ruined Chapel/);
assert.match(css,/\.topbar/);
assert.match(css,/\.board/);
assert.match(vision,/server-side/i);
assert.match(mvp,/complete D&D-style combat encounter/i);
console.log('The Living Table prototype checks passed.');
