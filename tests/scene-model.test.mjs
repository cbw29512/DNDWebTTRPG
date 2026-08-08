import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { boardForScene, findScene, questStateForScene, sceneList, uniqueIds } from '../src/session/scene-model.js';

const manifest=JSON.parse(await readFile('packs/wishing-cake/1.0.0/manifest.json','utf8'));
const scenes=sceneList(manifest);
assert.ok(scenes.length>1,'Wishing Cake must expose an ordered Scene list.');

const entry=findScene(manifest.entrySceneId,manifest);
assert.ok(entry,'Entry Scene must resolve by ID.');
assert.equal(findScene('missing-scene',manifest),null);

const board=boardForScene(entry,manifest);
assert.deepEqual(Object.keys(board),['location','site','room','npc','monster','hazard','treasure']);
assert.ok(board.location.includes(entry.locationId));
assert.deepEqual(board.site,[entry.siteId].filter(Boolean));
assert.deepEqual(board.room,[entry.roomId].filter(Boolean));
for(const slot of Object.values(board))assert.equal(new Set(slot).size,slot.length,'Scene board composition must deduplicate definition IDs.');

const baseSession={
  quests:structuredClone(manifest.startingQuests||[]),
  questState:{active:[],revealed:structuredClone(manifest.startingQuests||[])}
};
const quests=questStateForScene(baseSession,entry,manifest);
for(const questId of entry.questIds||[]){
  if(questId!==manifest.startingQuests?.[0])assert.ok(quests.questState.active.includes(questId));
  assert.ok(quests.questState.revealed.includes(questId));
}
assert.equal(new Set(quests.quests).size,quests.quests.length,'Quest state must not duplicate IDs.');

assert.deepEqual(uniqueIds(['a','b','a',null,'b']),['a','b']);

console.log('Pure Scene board and quest-state model passed.');