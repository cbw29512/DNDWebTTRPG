import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => fs.readFileSync(file,'utf8');
const dm = read('index.html');
const player = read('player.html');
const shell = read('site-shell.js');
const css = read('site-shell.css');
const prepared = read('prepared-play-board.js');
const sceneRuntime = read('scene-runtime.js');

for (const html of [dm,player]) {
  assert.match(html,/site-shell\.css\?v=site-shell-1/);
  assert.match(html,/site-shell\.js\?v=site-shell-1/);
  assert.match(html,/prepared-play-board\.js\?v=prepared-play-board-2/);
}

assert.match(shell,/showHome = role === 'dm' && !explicitDm/,'Bare GitHub Pages root must become the public hero experience.');
assert.match(shell,/href="\.\/"/,'Every role must expose a Home route.');
assert.match(shell,/href="\.\/\?dm=1"/,'The shell must expose a direct DM workspace route.');
assert.match(shell,/href="\.\/player\.html"/,'The Player Table must be directly discoverable.');
assert.match(shell,/Run The Wishing Cake/);
assert.match(shell,/HOW IT WORKS/);
assert.match(shell,/same game at the same time/,'Hero copy must state that DM and players play simultaneously.');
assert.match(shell,/The DM Plays the World/,'The DM must be described as an active participant running the world, not a software operator.');
assert.match(shell,/Players Act on the Same Table/,'Player copy must describe participation in the same live table.');
assert.match(shell,/Cards replace page hunting, not roleplaying/,'Landing copy must preserve the core tabletop promise.');
assert.match(shell,/shared language of play/,'Landing copy must explain cards as the common gameplay layer.');
assert.match(shell,/Remote-device synchronization is not part of this prototype yet/,'Landing copy must state the current synchronization boundary.');
assert.match(shell,/site-home-active/);
assert.match(shell,/living-table-local-session-v1/);

assert.match(css,/\.site-shell-nav\{order:-30/,'Global navigation must remain above runtime content.');
assert.match(css,/body\.role-dm\.live-play-board-first>\.local-session-bar\{order:-20/,'Local session controls must be reachable before the board.');
assert.match(css,/body\.role-dm\.live-play-board-first>\.scene-runtime\{order:-10/,'Scene controls must be visible before the board instead of below the entire workspace.');
assert.match(css,/\.site-home-active>#app/,'Home mode must hide the DM application rather than looking like an overlay on a dev workspace.');

assert.match(sceneRuntime,/data-scene-select/);
assert.match(sceneRuntime,/data-scene-load/);
assert.match(sceneRuntime,/data-scene-previous/);
assert.match(sceneRuntime,/data-scene-next/);
assert.match(sceneRuntime,/data-load-scene/);
assert.match(prepared,/event\.isTrusted/,'Scene-engine synthetic clicks must bypass the trusted-user mutation lock.');
assert.doesNotMatch(prepared,/removeAttribute\("data-open-picker"\)/);

console.log('Shared-table product messaging, Home/DM/Player navigation, visible scene controls, and scene-engine lock separation passed.');
