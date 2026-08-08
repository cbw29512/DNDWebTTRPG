import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, orchestration, sessionState, sessionSchema, boardAdapter, commands, css, manifest] = await Promise.all([
  readFile('index.html','utf8'),
  readFile('local-session.js','utf8'),
  readFile('src/session/local-session-state.js','utf8'),
  readFile('src/session/session-schema.js','utf8'),
  readFile('src/session/board-dom-adapter.js','utf8'),
  readFile('src/session/session-commands.js','utf8'),
  readFile('local-session.css','utf8'),
  readFile('packs/wishing-cake/1.0.0/manifest.json','utf8')
]);

assert.match(html,/local-session\.js\?v=board-first-live-1/);
assert.match(html,/local-session\.css\?v=board-first-live-1/);
assert.doesNotMatch(html,/encounter-slot-guard/);
assert.match(sessionState,/living-table-local-session-v1/);
assert.match(sessionSchema,/SESSION_SCHEMA_VERSION = 3/);
assert.match(sessionState,/session-live-board-migrated/);
assert.match(sessionState,/removedBoardSlots:\['scene','objective'\]/);
assert.match(sessionSchema,/['"]location['"]/);
assert.match(sessionSchema,/['"]site['"]/);
assert.match(sessionSchema,/['"]room['"]/);
assert.match(sessionSchema,/['"]npc['"]/);
assert.match(sessionSchema,/['"]monster['"]/);
assert.match(sessionSchema,/['"]hazard['"]/);
assert.match(sessionSchema,/['"]treasure['"]/);
assert.doesNotMatch(sessionSchema,/LIVE_BOARD_SLOT_IDS[\s\S]{0,160}['"]scene['"]/);
assert.doesNotMatch(sessionSchema,/LIVE_BOARD_SLOT_IDS[\s\S]{0,160}['"]objective['"]/);
assert.match(sessionState,/currentLocationId/);
assert.match(sessionState,/currentSiteId/);
assert.match(sessionState,/currentRoomId/);
assert.match(sessionState,/currentSceneId/);
assert.match(sessionState,/currentSceneCardId/);
assert.match(sessionState,/questState/);
assert.match(sessionSchema,/worldState/);
assert.match(sessionSchema,/locationState/);
assert.match(sessionSchema,/siteState/);
assert.match(sessionSchema,/roomState/);
assert.match(sessionSchema,/sceneState/);
assert.match(sessionSchema,/combatState/);
assert.match(sessionSchema,/eventHistory/);
assert.match(sessionState,/openingBoard/);
assert.match(sessionState,/manifest\.startingBoard/);
assert.match(sessionState,/manifest\.startingQuests/);
assert.match(sessionState,/wendy-birthday-hero/);
assert.match(orchestration,/dnd:adventure-loaded/);
assert.match(boardAdapter,/reconcileBoard/);
assert.match(orchestration,/dispatchLocalSession/);
assert.match(orchestration,/SESSION_COMMANDS\.REPLACE_BOARD/);
assert.match(commands,/LOAD_SCENE/);
assert.match(orchestration,/data-session-save/);
assert.match(orchestration,/data-session-restore/);
assert.match(orchestration,/data-session-reset/);
assert.match(css,/local-session-bar/);

const pack = JSON.parse(manifest);
assert.equal(pack.schemaVersion,3);
assert.equal(pack.packId,'wishing-cake');
assert.deepEqual(Object.keys(pack.startingBoard), ['location','site','room','npc','monster','hazard','treasure']);
assert.equal('scene' in pack.startingBoard,false);
assert.equal('objective' in pack.startingBoard,false);
assert.ok(pack.startingQuests.length);
console.log('reducer-backed seven-slot session schema, legacy migration, and quest-state checks passed');