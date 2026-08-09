import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('local-session.js','utf8');
const marker="window.addEventListener('dnd:adventure-loaded'";
const start=source.indexOf(marker);
assert.notEqual(start,-1,'Local session must listen for Adventure Master Card loads.');
const end=source.indexOf("const app=document.querySelector('#app')",start);
const handler=source.slice(start,end);
assert.match(handler,/createLocalSession\(manifest,manifest\.selectedSystem\)/);
assert.match(handler,/saveLocalSession\(session\)/);
assert.match(handler,/syncBoardCommand\(readBoardFromDom\(\)\)/,'Fresh load should persist the already-rendered seven-slot board.');
assert.match(handler,/SET_STATUS,status:'ready'/);
assert.doesNotMatch(handler,/applySessionBoard\(/,'Fresh load must not run the restore reconciler against an already-rendered board.');
assert.doesNotMatch(handler,/setTimeout\(/,'Fresh session creation should be synchronous and deterministic.');
console.log('Fresh adventure loading persists canonical session state without redundant DOM reconciliation.');
