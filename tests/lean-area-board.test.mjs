import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const playerHtml = fs.readFileSync('player.html', 'utf8');
const guard = fs.readFileSync('encounter-slot-guard.js', 'utf8');
const scaleCss = fs.readFileSync('encounter-scale.css', 'utf8');
const boardCss = fs.readFileSync('adventure-state-board.css', 'utf8');
const questTracker = fs.readFileSync('quest-tracker.js', 'utf8');

assert.match(html, /lean-area-board-20260805/);
assert.match(playerHtml, /lean-area-board-20260805/);

const visibleSet = guard.match(/VISIBLE_SLOT_IDS = new Set\(\[([\s\S]*?)\]\);/)?.[1] || '';
for (const slot of ['location', 'site', 'room', 'npc', 'monster', 'hazard', 'treasure']) {
  assert.match(visibleSet, new RegExp(`"${slot}"`));
}
assert.doesNotMatch(visibleSet, /"scene"/);
assert.doesNotMatch(visibleSet, /"objective"/);
assert.match(guard, /title\.textContent = "Area"/);
assert.match(guard, /Now: \$\{sceneTitle\}/);
assert.match(guard, /data-card-type="scene"/);
assert.match(guard, /data-card-type="objective"/);
assert.match(scaleCss, /data-slot="scene"/);
assert.match(scaleCss, /data-slot="objective"/);
assert.match(boardCss, /Immediate playable area/);
assert.match(questTracker, /isDungeonMaster/);
assert.match(questTracker, /Quest Tracker/);
assert.match(questTracker, /questState/);

console.log('The board exposes seven operational slots; Scene is Area context and quests remain in the Quest Tracker.');