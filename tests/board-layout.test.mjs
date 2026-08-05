import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const boardCss = fs.readFileSync('board-layout.css', 'utf8');
const hierarchyCss = fs.readFileSync('adventure-state-board.css', 'utf8');
const polishCss = fs.readFileSync('workspace-polish.css', 'utf8');
const questCss = fs.readFileSync('quest-tracker.css', 'utf8');
const questJs = fs.readFileSync('quest-tracker.js', 'utf8');
const controls = fs.readFileSync('workspace-controls.js', 'utf8');

assert.match(html, /spatial-state-1/);
assert.match(html, /workspace-polish\.css/);
assert.match(html, /quest-tracker\.css/);
assert.match(html, /quest-tracker\.js/);
assert.match(html, /workspace-controls\.js/);
assert.match(html, /adventure-state-board\.css/);
assert.doesNotMatch(html, /initiative-groups\.js/);
assert.doesNotMatch(html, /ROW BUILD 6/);
assert.match(app, /class="fixed-board"/);
assert.match(app, /class="board-slot slot-\$\{slot\.id\}"/);
assert.doesNotMatch(app, /<button class="stack-toggle"/);
assert.match(app, /<div class="stack-toggle" role="button"/);
assert.match(boardCss, /display:flex/);
assert.match(hierarchyCss, /flex-wrap: wrap !important/);
assert.match(hierarchyCss, /data-slot="location"/);
assert.match(hierarchyCss, /data-slot="site"/);
assert.match(hierarchyCss, /data-slot="room"/);
assert.match(hierarchyCss, /data-slot="scene"/);
assert.match(hierarchyCss, /What is happening now/);
assert.match(polishCss, /workspace-panel-toggle/);
assert.match(controls, /observe\(app, \{ childList: true \}\)/);
assert.doesNotMatch(controls, /subtree:\s*true/);
assert.match(questCss, /single-card-holder > \.tarot-card/);
assert.match(questCss, /\.fixed-board > \.slot-objective\{display:none!important\}/);
assert.match(questCss, /\.quest-row/);
assert.match(questJs, /Main Quest/);
assert.match(questJs, /Side Quest/);
assert.match(questJs, /data-add-side-quest/);
assert.match(questJs, /revealedQuests/);

const slotDefinitions = [...app.matchAll(/id: "(location|site|room|scene|npc|monster|hazard|objective|treasure)"/g)].map(match => match[1]);
assert.deepEqual(slotDefinitions, ['location', 'site', 'room', 'scene', 'npc', 'monster', 'hazard', 'objective', 'treasure']);

console.log('Adventure context wraps into a readable hierarchy while encounter cards and quests remain organized.');
