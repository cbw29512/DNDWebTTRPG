import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const dm=read('index.html');
const player=read('player.html');
const live=read('live-session.js');
const guide=read('live-session-guide.js');
const resilience=read('live-session-resilience.js');
const css=read('live-session.css');

for(const [name,html] of [['DM',dm],['Player',player]]){
  assert.doesNotMatch(html,/unpkg\.com\/peerjs/i,`${name} HTML must not eagerly download PeerJS during normal page load.`);
}

assert.match(live,/const PEER_SCRIPT_URL = 'https:\/\/unpkg\.com\/peerjs@1\.5\.5\/dist\/peerjs\.min\.js'/,'Live transport must pin the PeerJS version it lazy-loads.');
assert.match(live,/function ensurePeerCtor\(\)/,'Live transport must own a lazy PeerJS loader.');
assert.match(live,/PEER_LOAD_TIMEOUT_MS = 8000/,'Lazy transport loading must fail rather than hang forever.');
assert.match(live,/async function hostGame\(code\)/,'Hosting must await the lazy transport dependency.');
assert.match(live,/async function joinGame\(code,name\)/,'Joining must await the lazy transport dependency.');
assert.match(live,/function revealedInCurrentDOM\(cardId\)/,'Live snapshots must recover reveal state from the rendered DM table after reload.');
assert.match(live,/textContent\?\.trim\(\)==='Hide'/,'Rendered Hide state must count as revealed for the first player snapshot.');
assert.match(live,/markRemoteConnectionState\('disconnected','Disconnected'\)/,'Player transport must explicitly mark a stale remote table after disconnect.');

assert.doesNotMatch(guide,/Boolean\(remote\)/,'A stale remote table must never be treated as proof of a live connection.');
assert.match(guide,/\^Connected to game\\b/,'Player connected state must derive from the current transport status.');
assert.doesNotMatch(resilience,/live-remote-connected/,'Resilience layer must not invent a second connection-state class.');
assert.doesNotMatch(css,/live-remote-connected/,'CSS must use one canonical live-player-connected state.');
assert.match(css,/live-player-connected/,'CSS must style the canonical connected state.');
assert.match(css,/data-connection=disconnected/,'Stale remote snapshots must have an explicit disconnected visual state.');

console.log('Live transport contract passed: lazy dependency load, restored reveals, and unambiguous connection state are enforced.');
