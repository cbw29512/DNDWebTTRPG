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
  assert.doesNotMatch(html,/(?:unpkg\.com|jsdelivr\.net|cdnjs\.cloudflare\.com).*peerjs/i,`${name} HTML must not eagerly download PeerJS during normal page load.`);
}

assert.match(live,/const PEER_SCRIPT_URLS = Object\.freeze\(\[/,'Live transport must own an ordered fallback list.');
assert.match(live,/cdn\.jsdelivr\.net\/npm\/peerjs@1\.5\.5\/dist\/peerjs\.min\.js/,'Primary PeerJS source must be pinned to 1.5.5.');
assert.match(live,/cdnjs\.cloudflare\.com\/ajax\/libs\/peerjs\/1\.5\.5\/peerjs\.min\.js/,'Secondary PeerJS source must be pinned to 1.5.5.');
assert.match(live,/unpkg\.com\/peerjs@1\.5\.5\/dist\/peerjs\.min\.js/,'Tertiary PeerJS source must be pinned to 1.5.5.');
assert.match(live,/function ensurePeerCtor\(\)/,'Live transport must own a lazy PeerJS loader.');
assert.match(live,/async function loadPeerWithFallbacks\(\)/,'Live transport must retry another provider after one source fails.');
assert.match(live,/PEER_SOURCE_TIMEOUT_MS = 4000/,'Each transport source must time out rather than hang forever.');
assert.match(live,/peerLibraryPromise=null/,'A failed provider chain must permit a later user retry.');
assert.match(live,/Your DM table still works locally/,'DM transport failure must explain that local play remains available.');
assert.match(live,/Your character sheet still works/,'Player transport failure must explain that the local character sheet remains available.');
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

console.log('Live transport contract passed: lazy three-provider fallback, retryable failures, restored reveals, and unambiguous connection state are enforced.');