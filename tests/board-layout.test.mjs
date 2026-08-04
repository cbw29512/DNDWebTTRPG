import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const boardCss = fs.readFileSync('board-layout.css', 'utf8');

assert.match(html, /row-build-6/);
assert.doesNotMatch(html, /encounter-strip-v4/);
assert.doesNotMatch(html, /tabletop-layout/);
assert.match(app, /class="fixed-board"/);
assert.match(app, /class="board-slot slot-\$\{slot\.id\}"/);
assert.match(app, /SLOTS\.map\(slot => renderSlot\(slot, projected, isDM\)\)\.join\(""\)/);
assert.match(boardCss, /display:flex/);
assert.match(boardCss, /flex-flow:row nowrap/);
assert.match(boardCss, /overflow-x:auto/);
assert.doesNotMatch(boardCss, /flex-direction:column/);
assert.doesNotMatch(boardCss, /grid-template-columns:repeat\(4/);
assert.match(html, /#app \.fixed-board\s*\{[\s\S]*display:flex!important;[\s\S]*flex-wrap:nowrap!important;/);

const slotDefinitions = [...app.matchAll(/id: "(location|room|npc|monster|hazard|objective|treasure)"/g)].map(match => match[1]);
assert.deepEqual(slotDefinitions, ['location', 'room', 'npc', 'monster', 'hazard', 'objective', 'treasure']);

console.log('Encounter board is one boxed, non-wrapping seven-slot row.');
