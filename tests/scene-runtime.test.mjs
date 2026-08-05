import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../packs/wishing-cake/1.0.0/manifest.json', import.meta.url), 'utf8'));
const runtime = await readFile(new URL('../scene-runtime.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

assert.equal(manifest.entrySceneId, 'opening-inn');
assert.equal(manifest.scenes.length, 8);
assert.deepEqual(manifest.scenes.map(scene => scene.order), [1,2,3,4,5,6,7,8]);
assert.ok(manifest.scenes.every(scene => scene.locationId && scene.roomId));
assert.ok(manifest.scenes.every(scene => scene.board && Array.isArray(scene.board.npc) && Array.isArray(scene.board.monster)));
assert.equal(manifest.scenes[0].locationId, manifest.scenes[1].locationId, 'Room movement should preserve the broad location');
assert.notEqual(manifest.scenes[0].roomId, manifest.scenes[1].roomId, 'Room movement should replace the immediate area');
assert.ok(manifest.scenes.some(scene => scene.exits?.length > 1), 'Scene graph should support branching exits');
assert.match(runtime, /currentLocationId/);
assert.match(runtime, /currentRoomId/);
assert.match(runtime, /roomHistory/);
assert.match(runtime, /discoveredScenes/);
assert.match(runtime, /Hidden information remains DM-only until revealed/);
assert.match(html, /scene-runtime\.js/);
assert.match(html, /ordered-location-room-runtime-20260805/);

console.log('scene runtime source checks passed');
