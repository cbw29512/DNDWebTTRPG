import assert from 'node:assert/strict';
import fs from 'node:fs';

const dmHtml = fs.readFileSync('index.html', 'utf8');
const playerHtml = fs.readFileSync('player.html', 'utf8');
const css = fs.readFileSync('live-play-priority.css', 'utf8');

for (const html of [dmHtml, playerHtml]) {
  assert.match(html, /board-first-live-play-20260805/);
  assert.match(html, /live-play-priority\.css\?v=board-first-live-1/);
  assert.ok(
    html.indexOf('live-play-priority.css') > html.indexOf('adventure-state-board.css'),
    'The live-play priority layer must load after every other board layout.'
  );
  assert.match(html, /live-play-board-first/);
}

assert.match(dmHtml, /<body class="role-dm live-play-board-first">/);
assert.match(playerHtml, /<body class="role-player live-play-board-first">/);

assert.match(css, /body\.live-play-board-first > #app[\s\S]*order: 0/);
assert.match(css, /grid-template-areas:[\s\S]*"board board"[\s\S]*"topbar topbar"/);
assert.match(css, /\.dm-workspace,[\s\S]*\.player-layout[\s\S]*display: contents !important/);
assert.match(css, /\.encounter-board[\s\S]*grid-area: board/);
assert.match(css, /\.topbar[\s\S]*grid-area: topbar/);
assert.match(css, /\.adventure-deck[\s\S]*grid-area: deck/);
assert.match(css, /\.turn-panel[\s\S]*grid-area: initiative/);
assert.match(css, /\.player-station[\s\S]*grid-area: player/);
assert.match(css, /\.quest-tracker[\s\S]*grid-area: quest/);
assert.match(css, /> \.local-session-bar[\s\S]*order: 20/);
assert.match(css, /> \.scene-runtime[\s\S]*order: 21/);
assert.match(css, /> \.library-hub[\s\S]*order: 22/);
assert.match(css, /@media \(max-width: 1000px\)[\s\S]*"board"[\s\S]*"topbar"/);

console.log('The live card board is the first full-width surface for both DM and player routes.');
