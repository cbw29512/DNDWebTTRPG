import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, js, css, manifest] = await Promise.all([
  readFile('index.html','utf8'),
  readFile('local-session.js','utf8'),
  readFile('local-session.css','utf8'),
  readFile('packs/wishing-cake/1.0.0/manifest.json','utf8')
]);

assert.match(html,/local-session\.js\?v=board-first-live-1/);
assert.match(html,/local-session\.css\?v=board-first-live-1/);
assert.doesNotMatch(html,/encounter-slot-guard/);
assert.match(js,/living-table-local-session-v1/);
assert.match(js,/schemaVersion: 3/);
assert.match(js,/session-live-board-migrated/);
assert.match(js,/removedBoardSlots: \['scene','objective'\]/);
assert.match(js,/\['location','site','room','npc','monster','hazard','treasure'\]/);
assert.doesNotMatch(js,/LIVE_BOARD_SLOT_IDS[^\n]*scene/);
assert.doesNotMatch(js,/LIVE_BOARD_SLOT_IDS[^\n]*objective/);
assert.match(js,/currentLocationId/);
assert.match(js,/currentSiteId/);
assert.match(js,/currentRoomId/);
assert.match(js,/currentSceneId/);
assert.match(js,/currentSceneCardId/);
assert.match(js,/questState/);
assert.match(js,/worldState/);
assert.match(js,/locationState/);
assert.match(js,/siteState/);
assert.match(js,/roomState/);
assert.match(js,/sceneState/);
assert.match(js,/combatState/);
assert.match(js,/eventHistory/);
assert.match(js,/openingBoard/);
assert.match(js,/manifest\.startingBoard/);
assert.match(js,/manifest\.startingQuests/);
assert.match(js,/wendy-birthday-hero/);
assert.match(js,/dnd:adventure-loaded/);
assert.match(js,/reconcileBoard/);
assert.match(js,/data-session-save/);
assert.match(js,/data-session-restore/);
assert.match(js,/data-session-reset/);
assert.match(css,/local-session-bar/);

const pack = JSON.parse(manifest);
assert.equal(pack.schemaVersion,3);
assert.equal(pack.packId,'wishing-cake');
assert.deepEqual(Object.keys(pack.startingBoard), ['location','site','room','npc','monster','hazard','treasure']);
assert.equal('scene' in pack.startingBoard,false);
assert.equal('objective' in pack.startingBoard,false);
assert.ok(pack.startingQuests.length);
console.log('live seven-slot session schema, legacy migration, and quest-state checks passed');
