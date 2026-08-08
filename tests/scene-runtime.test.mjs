import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { boardForScene, questStateForScene } from '../src/session/scene-model.js';

const manifest = JSON.parse(await readFile(new URL('../packs/wishing-cake/1.0.0/manifest.json', import.meta.url), 'utf8'));
const runtime = await readFile(new URL('../scene-runtime.js', import.meta.url), 'utf8');
const commands = await readFile(new URL('../src/session/session-commands.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

assert.equal(manifest.entrySceneId, 'opening-inn');
assert.equal(manifest.scenes.length, 8);
assert.deepEqual(manifest.scenes.map(scene => scene.order), [1,2,3,4,5,6,7,8]);
assert.ok(manifest.scenes.every(scene => scene.locationId && scene.siteId && scene.roomId && scene.sceneCardId));
assert.ok(manifest.scenes.every(scene => scene.board && Array.isArray(scene.board.npc) && Array.isArray(scene.board.monster) && Array.isArray(scene.questIds)));
assert.ok(manifest.scenes.every(scene => !('scene' in scene.board) && !('objective' in scene.board)));
assert.equal(manifest.scenes[0].locationId, manifest.scenes[1].locationId, 'Adventure movement should preserve the broad city location');
assert.notEqual(manifest.scenes[0].siteId, manifest.scenes[1].siteId, 'Descending below the inn should change the immediate site');
assert.notEqual(manifest.scenes[0].roomId, manifest.scenes[1].roomId, 'Moving should replace the immediate area');
assert.notEqual(manifest.scenes[0].sceneCardId, manifest.scenes[1].sceneCardId, 'Scene progress remains separately identified');
assert.ok(manifest.scenes.some(scene => scene.exits?.length > 1), 'Scene graph should support branching exits');
assert.ok(manifest.scenes.some(scene => scene.questIds.includes('objective-free-souls')), 'Scene loading should be able to activate a side quest');

const entry=manifest.scenes[0];
const board=boardForScene(entry,manifest);
assert.deepEqual(board.site,[entry.siteId]);
assert.deepEqual(board.room,[entry.roomId]);
assert.equal('scene' in board,false,'Scene identity must remain outside the seven-slot live board.');
assert.equal('objective' in board,false,'Quest state must remain outside the seven-slot live board.');
const questState=questStateForScene({quests:manifest.startingQuests,questState:{active:[],revealed:manifest.startingQuests}},entry,manifest);
for(const questId of entry.questIds||[])assert.ok(questState.questState.revealed.includes(questId));

assert.match(runtime, /from '\.\/src\/session\/scene-model\.js'/,'Scene composition must live in the pure Scene model, not the UI runtime.');
assert.match(runtime, /api\.reconcileSessionBoard\(/,'Scene Runtime must use the guarded reconciliation transaction.');
assert.match(runtime, /type:SESSION_COMMANDS\.LOAD_SCENE/,'Scene Runtime must commit one atomic LOAD_SCENE command.');
assert.match(runtime, /activatedQuestIds/);
assert.match(runtime, /sceneId:scene\.id/);
assert.match(runtime, /locationId:scene\.locationId/);
assert.match(runtime, /siteId:scene\.siteId/);
assert.match(runtime, /roomId:scene\.roomId/);
assert.match(runtime, /sceneCardId:scene\.sceneCardId/);
assert.match(runtime, /roomHistory:history/);
assert.doesNotMatch(runtime, /eventHistory\s*:/,'Scene Runtime must not hand-build event history outside the reducer.');
assert.match(runtime, /active Scene is carried by the Area card/);
assert.match(commands, /LOAD_SCENE/);
assert.match(html, /scene-runtime\.js\?v=board-first-live-1/);
assert.match(html, /board-first-live-play-20260805/);

console.log('scene progress, pure Scene composition, atomic quest activation, and seven-slot board reconciliation checks passed');