import assert from 'node:assert/strict';
import fs from 'node:fs';

const live = fs.readFileSync('live-session.js','utf8');
const css = fs.readFileSync('live-session.css','utf8');
const dm = fs.readFileSync('index.html','utf8');
const player = fs.readFileSync('player.html','utf8');

assert.match(dm,/peerjs@1\.5\.5/,'DM page must load the pinned PeerJS client.');
assert.match(player,/peerjs@1\.5\.5/,'Player page must load the pinned PeerJS client.');
assert.match(dm,/live-session\.js\?v=live-multiplayer-1/);
assert.match(player,/live-session\.js\?v=live-multiplayer-1/);
assert.match(dm,/live-session\.css\?v=live-multiplayer-1/);
assert.match(player,/live-session\.css\?v=live-multiplayer-1/);

assert.match(live,/CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'/);
assert.match(live,/Array\.from\(\{length:8\}/,'Game codes must use eight random characters.');
assert.match(live,/function safeSessionProjection\(\)/);
for (const privateField of ['worldState','locationState','siteState','roomState','sceneState','eventHistory','openingBoard']) {
  const projection = live.slice(live.indexOf('function safeSessionProjection'), live.indexOf('function sanitizedFront'));
  assert.doesNotMatch(projection,new RegExp(`\\b${privateField}\\b`),`Player network projection must not include DM-private ${privateField}.`);
}
assert.match(live,/\['location','site','room'\]\.includes\(type\)/,'Spatial context should be visible during live play.');
assert.match(live,/revealSet\.has\(card\.dataset\.cardId\)/,'Non-context cards must require an explicit DM reveal before streaming.');
assert.match(live,/sanitizedFront/);
assert.match(live,/\.inside-card-rolls/,'DM controls must be stripped from the streamed card face.');
assert.match(live,/type:'player-state'/,'Player state must travel back to the DM host.');
assert.match(live,/type:'table-snapshot'/,'The DM must broadcast table snapshots to connected players.');
assert.match(live,/Host This Table/);
assert.match(live,/Join the DM's Table/);
assert.match(css,/\.remote-live-table/);
assert.match(css,/grid-template-columns:repeat\(7/,'The remote table must preserve the seven-slot board contract.');

console.log('Live multiplayer host/join, reveal boundary, player status, and seven-slot remote table contracts passed.');
