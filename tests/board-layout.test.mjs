import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const boardCss = fs.readFileSync('board-layout.css', 'utf8');
const polishCss = fs.readFileSync('workspace-polish.css', 'utf8');
const controls = fs.readFileSync('workspace-controls.js', 'utf8');

assert.match(html, /tabletop-polish-1/);
assert.match(html, /workspace-polish\.css/);
assert.match(html, /workspace-controls\.js/);
assert.doesNotMatch(html, /ROW BUILD 6/);
assert.doesNotMatch(html, /encounter-strip-v4/);
assert.doesNotMatch(html, /tabletop-layout/);
assert.match(app, /class="fixed-board"/);
assert.match(app, /class="board-slot slot-\$\{slot\.id\}"/);
assert.match(app, /SLOTS\.map\(slot => renderSlot\(slot, projected, isDM\)\)\.join\(""\)/);
assert.doesNotMatch(app, /<button class="stack-toggle"/);
assert.match(app, /<div class="stack-toggle" role="button"/);
assert.match(boardCss, /display:flex/);
assert.match(boardCss, /flex-flow:row nowrap/);
assert.match(boardCss, /overflow-x:auto/);
assert.doesNotMatch(boardCss, /grid-template-columns:repeat\(4/);
assert.match(html, /#app \.fixed-board\s*\{[\s\S]*display:flex!important;[\s\S]*flex-wrap:nowrap!important;/);
assert.match(polishCss, /workspace-panel-toggle/);
assert.match(polishCss, /grid-template-columns:minmax\(170px,210px\)/);
assert.match(controls, /MutationObserver/);
assert.match(controls, /is-collapsed/);

const slotDefinitions = [...app.matchAll(/id: "(location|room|npc|monster|hazard|objective|treasure)"/g)].map(match => match[1]);
assert.deepEqual(slotDefinitions, ['location', 'room', 'npc', 'monster', 'hazard', 'objective', 'treasure']);

console.log('Encounter board is one polished, boxed, non-wrapping seven-slot row.');
