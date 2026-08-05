import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, js, css, manifest] = await Promise.all([
  readFile('index.html','utf8'),
  readFile('local-session.js','utf8'),
  readFile('local-session.css','utf8'),
  readFile('packs/wishing-cake/1.0.0/manifest.json','utf8')
]);

assert.match(html,/local-session\.js\?v=local-session-1/);
assert.match(html,/local-session\.css\?v=local-session-1/);
assert.match(js,/living-table-local-session-v1/);
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
assert.ok(pack.startingBoard);
assert.ok(pack.startingQuests.length);
console.log('canonical local session tests passed');
