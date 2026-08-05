import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../packs/wishing-cake/1.0.0/manifest.json', import.meta.url), 'utf8'));
const runtime = await readFile(new URL('../scene-runtime.js', import.meta.url), 'utf8');
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

assert.match(runtime, /site: \[scene\.siteId\]/);
assert.match(runtime, /room: \[scene\.roomId\]/);
assert.doesNotMatch(runtime, /\n\s*scene:\s*\[scene\.sceneCardId\]/);
assert.doesNotMatch(runtime, /\n\s*objective:/);
assert.match(runtime, /questStateForScene/);
assert.match(runtime, /activatedQuestIds/);
assert.match(runtime, /currentLocationId/);
assert.match(runtime, /currentSiteId/);
assert.match(runtime, /currentRoomId/);
assert.match(runtime, /currentSceneCardId/);
assert.match(runtime, /roomHistory/);
assert.match(runtime, /eventHistory/);
assert.match(runtime, /active Scene is carried by the Area card/);
assert.match(html, /scene-runtime\.js/);
assert.match(html, /source-board-model-20260805/);

console.log('scene progress, quest activation, and seven-slot board reconciliation checks passed');
