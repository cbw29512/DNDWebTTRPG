import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const js=await readFile('combat-card-library.js','utf8');
for(const kind of ['monster','character','item','treasure','npc','room','location','hazard','trap','rule','event','quest','objective','spell']) assert.match(js,new RegExp(`case'${kind}'`));
for(const token of ['HP','🛡','⚔','➶','✦','⬡','Trigger','Disarm / Avoid','Read Aloud','Dialogue','Rarity / Value','Casting','Completion']) assert.ok(js.includes(token),`missing shorthand token ${token}`);
assert.match(js,/categoryRows/);
assert.match(js,/cardPurpose/);
console.log('all card type shorthand tests passed');
