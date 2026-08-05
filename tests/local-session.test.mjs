import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, js, css, manifest] = await Promise.all([
  readFile('index.html','utf8'),
  readFile('local-session.js','utf8'),
  readFile('local-session.css','utf8'),
  readFile('packs/wishing-cake/1.0.0/manifest.json','utf8')
]);

assert.match(html,/local-session\.js\?v=spatial-state-1/);
assert.match(html,/local-session\.css\?v=spatial-state-1/);
assert.match(js,/living-table-local-session-v1/);
assert.match(js,/schemaVersion: 2/);
assert.match(js,/migrateSpatialSession/);
assert.match(js,/activeManifestScene/);
assert.match(js,/session-spatial-migrated/);
assert.match(js,/\['location','site','room','scene','npc','monster','hazard','objective','treasure'\]/);
assert.match(js,/currentLocationId/);
assert.match(js,/currentSiteId/);
assert.match(js,/currentRoomId/);
assert.match(js,/currentSceneCardId/);
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
assert.equal(pack.packId,'wishing-cake');
assert.ok(pack.startingBoard.site.length);
assert.ok(pack.startingBoard.scene.length);
assert.ok(pack.startingBoard.objective.length);
assert.ok(pack.startingQuests.length);
console.log('canonical complete adventure-state session and legacy migration source checks passed');
