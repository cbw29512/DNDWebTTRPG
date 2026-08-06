import assert from 'node:assert/strict';
import fs from 'node:fs';
import { wishingCakePackCards } from '../src/wishing-cake-pack.js';

const manifest = JSON.parse(fs.readFileSync('packs/wishing-cake/1.0.0/manifest.json', 'utf8'));
const byId = new Map(wishingCakePackCards.map(card => [card.id, card]));
const scenes = manifest.scenes;

assert.equal(manifest.playtestStatus, 'content-audited');
assert.equal(scenes.length, 8);
assert.deepEqual(scenes.map(scene => scene.order), [1,2,3,4,5,6,7,8]);
assert.equal(new Set(scenes.map(scene => scene.id)).size, scenes.length);

for (const scene of scenes) {
  assert.ok(byId.has(scene.locationId), `${scene.id} missing Location card ${scene.locationId}`);
  assert.ok(byId.has(scene.siteId), `${scene.id} missing Site card ${scene.siteId}`);
  assert.ok(byId.has(scene.roomId), `${scene.id} missing Area card ${scene.roomId}`);
  assert.ok(byId.has(scene.sceneCardId), `${scene.id} missing Scene card ${scene.sceneCardId}`);
  for (const questId of scene.questIds) assert.ok(byId.has(questId), `${scene.id} missing quest ${questId}`);
  for (const [slot, ids] of Object.entries(scene.board)) {
    assert.ok(['npc','monster','hazard','treasure'].includes(slot));
    for (const id of ids) assert.ok(byId.has(id), `${scene.id} places missing ${slot} card ${id}`);
  }
}

const sceneById = new Map(scenes.map(scene => [scene.id, scene]));
const reachable = new Set();
const queue = [manifest.entrySceneId];
while (queue.length) {
  const id = queue.shift();
  if (reachable.has(id)) continue;
  reachable.add(id);
  for (const exit of sceneById.get(id)?.exits ?? []) queue.push(exit.sceneId);
}
assert.equal(reachable.size, scenes.length, 'Every scene must be reachable from the opening');
assert.ok(reachable.has('cake-chamber'));
assert.deepEqual(sceneById.get('soul-cellar').exits.map(exit => exit.sceneId), ['wish-hall']);

assert.deepEqual(sceneById.get('opening-inn').board.monster, ['priest','priest']);
assert.deepEqual(sceneById.get('cult-room').board.monster, []);
assert.deepEqual(sceneById.get('cake-chamber').board.npc, []);
assert.equal(sceneById.get('cake-chamber').board.monster[0], 'monster-sepulchral');
assert.ok(sceneById.get('pinata-pen').board.treasure.includes('item-candy'));

const auditedIds = [
  'scene-stolen-wish','scene-holding-cells','scene-wish-hall','scene-soul-cellar',
  'scene-pinata-pen','scene-wrapping-room','scene-cult-room','scene-cake-chamber',
  'priest','skeleton','monster-pinata-mimic','monster-sepulchral',
  'hazard-exploding-pinata','hazard-wrapping-machine','hazard-wish-circle','lantern','item-candy'
];
for (const id of auditedIds) {
  const card = byId.get(id);
  assert.ok(card, `Missing audited card ${id}`);
  assert.equal(card.artRequired, true, `${id} must require reviewed art`);
  assert.ok(card.artKey, `${id} missing art key`);
  assert.ok(card.artAlt?.length > 20, `${id} missing meaningful art alt text`);
  const rules = JSON.stringify(card.dmFace);
  assert.doesNotMatch(rules, /use the supplied|apply the supplied|TBD|TODO|placeholder/i, `${id} contains unresolved rules text`);
}

for (const id of ['priest','skeleton','monster-pinata-mimic','monster-sepulchral']) {
  const monster = byId.get(id).dmFace;
  assert.ok(monster.ac, `${id} missing AC`);
  assert.ok(monster.hp, `${id} missing HP`);
  assert.ok(monster.speed, `${id} missing speed`);
  assert.ok(monster.abilities, `${id} missing abilities`);
  assert.ok(monster.actions?.length, `${id} missing exact actions`);
}

assert.match(byId.get('hazard-exploding-pinata').dmFace.effect, /DC 13 Dexterity/);
assert.match(byId.get('hazard-wrapping-machine').dmFace.objective, /six progress before three failures/i);
assert.match(byId.get('hazard-wish-circle').dmFace.advance, /round 3/);
assert.match(byId.get('scene-cult-room').dmFace.drumAnswer, /D, D, E, D, G, F/);
assert.match(byId.get('scene-cake-chamber').dmFace.ending, /Wendy decides/);
assert.match(byId.get('lantern').dmFace.rule, /fails an attack roll, ability check, or saving throw/);

console.log('Wishing Cake flow, placements, exact mechanics, scaling, fail-forward rules, and art requirements passed.');
