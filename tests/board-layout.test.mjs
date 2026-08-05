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

assert.match(html, /source-board-model-1/);
assert.match(html, /workspace-polish\.css/);
assert.match(html, /quest-tracker\.css/);
assert.match(html, /quest-tracker\.js/);
assert.match(html, /workspace-controls\.js/);
assert.match(html, /adventure-state-board\.css/);
assert.doesNotMatch(html, /encounter-slot-guard/);
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
assert.doesNotMatch(hierarchyCss, /data-slot="scene"/);
assert.doesNotMatch(hierarchyCss, /data-slot="objective"/);
assert.match(hierarchyCss, /Immediate playable area/);
assert.match(polishCss, /workspace-panel-toggle/);
assert.match(controls, /observe\(app, \{ childList: true \}\)/);
assert.doesNotMatch(controls, /subtree:\s*true/);
assert.match(questCss, /single-card-holder > \.tarot-card/);
assert.match(questCss, /\.fixed-board > \.slot-objective\{display:none!important\}/);
assert.match(questCss, /\.quest-row/);
assert.match(questJs, /main-quest/);
assert.match(questJs, /side-quest/);
assert.match(questJs, /data-add-side-quest/);
assert.match(questJs, /questState/);
assert.match(questJs, /state\.revealed/);

const slotDefinitions = [...app.matchAll(/id: "(location|site|room|npc|monster|hazard|treasure)"/g)].map(match => match[1]);
assert.deepEqual(slotDefinitions, ['location', 'site', 'room', 'npc', 'monster', 'hazard', 'treasure']);

console.log('The source board renders seven readable operational slots while Scene and quests retain separate state owners.');
