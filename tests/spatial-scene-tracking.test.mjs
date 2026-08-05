import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [schema, app, localSession, sceneRuntime, spatialCards, memoryDoc, painDoc] = await Promise.all([
  readFile('src/schema.js', 'utf8'),
  readFile('src/app.js', 'utf8'),
  readFile('local-session.js', 'utf8'),
  readFile('scene-runtime.js', 'utf8'),
  readFile('src/wishing-cake-spatial-cards.js', 'utf8'),
  readFile('docs/GAME_STATE_MEMORY_MODEL.md', 'utf8'),
  readFile('docs/DND_PAIN_POINTS.md', 'utf8')
]);

assert.match(schema, /SITE:"site"/);
assert.match(schema, /SCENE:"scene"/);
assert.match(app, /label: "Location"/);
assert.match(app, /label: "Site"/);
assert.match(app, /label: "Area"/);
assert.doesNotMatch(app, /label: "Current Scene"/);
assert.doesNotMatch(app, /label: "Objective \/ Quest"/);
assert.match(app, /mergeActiveSceneIntoArea/);
assert.match(app, /currentScene: scene\.title/);
assert.match(app, /DECK_ONLY_TYPES = new Set\(\["scene", "objective"\]\)/);
assert.match(localSession, /schemaVersion: 3/);
assert.match(localSession, /LIVE_BOARD_SLOT_IDS/);
assert.match(localSession, /currentSiteId/);
assert.match(localSession, /currentSceneCardId/);
assert.match(localSession, /combatState/);
assert.match(localSession, /eventHistory/);
assert.match(sceneRuntime, /active Scene is carried by the Area card/);
assert.match(spatialCards, /Bramblewick/);
assert.match(spatialCards, /The Wishing Cake Inn/);
assert.match(spatialCards, /Grand Celebration Hall/);
assert.match(spatialCards, /The Stolen Wish/);
assert.match(memoryDoc, /middle of combat/i);
assert.match(memoryDoc, /NPC memory/);
assert.match(memoryDoc, /Item and treasure memory/);
assert.match(memoryDoc, /curse presence/);
assert.match(painDoc, /Initiative and combat state/);
assert.match(painDoc, /Inventory loses meaning/);
assert.match(painDoc, /Save files often preserve numbers but not context/);

console.log('spatial hierarchy, Area-carried Scene context, and exact-resume foundation passed source checks');
