import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SESSION_COMMANDS } from '../src/session/session-commands.js';
import {
  LOCAL_SESSION_KEY, createLocalSession, loadLocalSession,
  saveLocalSession, dispatchLocalSession, migrateSpatialSession
} from '../src/session/local-session-state.js';

const manifest=JSON.parse(await readFile('packs/wishing-cake/1.0.0/manifest.json','utf8'));

class MemoryStorage{
  constructor(){this.values=new Map();this.setCount=0;}
  getItem(key){return this.values.has(key)?this.values.get(key):null;}
  setItem(key,value){this.setCount+=1;this.values.set(key,String(value));}
  removeItem(key){this.values.delete(key);}
}

const storage=new MemoryStorage();
const created=createLocalSession(manifest,'dnd-2014');
assert.equal(created.schemaVersion,3);
assert.equal(created.revision,0);
assert.equal(created.packId,'wishing-cake');
assert.deepEqual(Object.keys(created.board),['location','site','room','npc','monster','hazard','treasure']);

saveLocalSession(created,storage,manifest);
assert.ok(storage.getItem(LOCAL_SESSION_KEY));
assert.equal(loadLocalSession(storage,manifest).sessionId,created.sessionId);

const boardResult=dispatchLocalSession({
  type:SESSION_COMMANDS.REPLACE_BOARD,
  board:{...created.board,monster:['paper-plate-mimic','animated-present']}
},storage,manifest,{now:1000});
assert.equal(boardResult.state.revision,1);
assert.equal(boardResult.event.type,SESSION_COMMANDS.REPLACE_BOARD);
assert.deepEqual(loadLocalSession(storage,manifest).board.monster,['paper-plate-mimic','animated-present']);

const writesBeforeNoop=storage.setCount;
const noop=dispatchLocalSession({
  type:SESSION_COMMANDS.REPLACE_BOARD,
  board:structuredClone(boardResult.state.board)
},storage,manifest,{now:2000});
assert.equal(noop.event,null);
assert.equal(storage.setCount,writesBeforeNoop,'No-op dispatch must not rewrite storage.');

const sceneResult=dispatchLocalSession({
  type:SESSION_COMMANDS.LOAD_SCENE,
  sceneId:'integration-scene',locationId:'location',siteId:'site-wishing-cake-inn',roomId:'room',sceneCardId:'scene-opening',
  board:{...boardResult.state.board,monster:[]},quests:['main-quest'],questState:{active:[],revealed:['main-quest']},
  roomHistory:['previous-room'],discoveredScenes:['integration-scene'],status:'in-progress'
},storage,manifest,{now:3000});
assert.equal(sceneResult.state.currentSceneId,'integration-scene');
assert.equal(sceneResult.state.status,'in-progress');
assert.equal(sceneResult.state.revision,2);
assert.equal(sceneResult.state.eventHistory.at(-1).type,SESSION_COMMANDS.LOAD_SCENE);
assert.equal(loadLocalSession(storage,manifest).currentSceneId,'integration-scene','Schema-v3 reload must preserve reducer-owned Scene identity instead of replacing it from manifest fallback heuristics.');

const legacy=migrateSpatialSession({
  schemaVersion:2,board:{location:['location'],scene:['legacy-scene'],objective:['legacy-quest']},
  openingBoard:{location:['location']},quests:[],eventHistory:[]
},manifest);
assert.equal(legacy.schemaVersion,3);
assert.equal('scene' in legacy.board,false);
assert.equal('objective' in legacy.board,false);
assert.ok(legacy.eventHistory.some(event=>event.type==='session-live-board-migrated'));

console.log('Local session storage and reducer-dispatch integration passed.');