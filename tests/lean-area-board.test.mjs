import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const playerHtml = fs.readFileSync('player.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const localSession = fs.readFileSync('local-session.js', 'utf8');
const scaleCss = fs.readFileSync('encounter-scale.css', 'utf8');
const boardCss = fs.readFileSync('adventure-state-board.css', 'utf8');
const questTracker = fs.readFileSync('quest-tracker.js', 'utf8');

assert.match(html, /source-board-model-20260805/);
assert.match(playerHtml, /source-board-model-20260805/);
assert.doesNotMatch(html, /encounter-slot-guard/);
assert.doesNotMatch(playerHtml, /encounter-slot-guard/);

for (const slot of ['location', 'site', 'room', 'npc', 'monster', 'hazard', 'treasure']) {
  assert.match(app, new RegExp(`id: "${slot}"`));
}
assert.doesNotMatch(app, /id: "scene", label:/);
assert.doesNotMatch(app, /id: "objective", label:/);
assert.doesNotMatch(app, /scene: \[makeInstance/);
assert.doesNotMatch(app, /objective: \[makeInstance/);
assert.match(app, /label: "Area"/);
assert.match(app, /Now: \$\{escapeHtml\(scene\.title\)\}/);
assert.match(app, /mergeActiveSceneIntoArea/);
assert.match(localSession, /LIVE_BOARD_SLOT_IDS/);
assert.doesNotMatch(localSession, /LIVE_BOARD_SLOT_IDS[^\n]*scene/);
assert.doesNotMatch(localSession, /LIVE_BOARD_SLOT_IDS[^\n]*objective/);
assert.doesNotMatch(scaleCss, /data-slot="scene"/);
assert.doesNotMatch(scaleCss, /data-slot="objective"/);
assert.match(boardCss, /Immediate playable area/);
assert.match(questTracker, /Quest Tracker/);
assert.match(questTracker, /questState/);

console.log('The source renderer and session model expose only seven operational slots; Scene rides on Area and quests remain in the tracker.');
