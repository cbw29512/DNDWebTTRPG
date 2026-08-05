import assert from 'node:assert/strict';
import fs from 'node:fs';

const dmHtml = fs.readFileSync('index.html', 'utf8');
const playerHtml = fs.readFileSync('player.html', 'utf8');
const css = fs.readFileSync('live-play-priority.css', 'utf8');

for (const html of [dmHtml, playerHtml]) {
  assert.match(html, /board-first-live-play-20260805/);
  assert.match(html, /live-play-priority\.css\?v=board-first-live-3/);
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

assert.match(
  css,
  /body\.role-dm\.live-play-board-first #app \.app \{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/,
  'Adventure Deck and Combat Initiative must occupy equal desktop columns.'
);
assert.match(css, /--live-secondary-panel-height:\s*clamp\(420px, 52vh, 520px\)/);
assert.match(
  css,
  /body\.role-dm\.live-play-board-first #app \.adventure-deck,[\s\S]*body\.role-dm\.live-play-board-first #app \.turn-panel \{[\s\S]*height:\s*var\(--live-secondary-panel-height\)[\s\S]*min-height:\s*var\(--live-secondary-panel-height\)[\s\S]*max-height:\s*var\(--live-secondary-panel-height\)/,
  'Adventure Deck and Combat Initiative must share one exact desktop height.'
);
assert.match(
  css,
  /\.adventure-deck \.deck-card-list \{[\s\S]*flex:\s*1 1 auto[\s\S]*min-height:\s*0[\s\S]*overflow:\s*auto/,
  'Adventure cards must scroll inside the matched panel instead of enlarging it.'
);
assert.match(
  css,
  /\.turn-panel \.initiative \{[\s\S]*flex:\s*1 1 auto[\s\S]*min-height:\s*0[\s\S]*overflow:\s*auto/,
  'Long initiative lists must scroll inside the matched panel.'
);
assert.match(
  css,
  /@media \(max-width: 1000px\)[\s\S]*\.adventure-deck,[\s\S]*\.turn-panel \{[\s\S]*height:\s*auto[\s\S]*max-height:\s*none/,
  'Stacked layouts must release the equal desktop height.'
);

assert.match(css, /--live-tarot-card-width:\s*148px/);
assert.match(
  css,
  /#app \.tarot-card \{[\s\S]*flex:\s*0 0 var\(--live-tarot-card-width\)[\s\S]*width:\s*var\(--live-tarot-card-width\)[\s\S]*min-width:\s*var\(--live-tarot-card-width\)[\s\S]*max-width:\s*var\(--live-tarot-card-width\)/,
  'Every in-app tarot card must retain one fixed physical-card width.'
);
assert.match(css, /#app \.tarot-inner \{[\s\S]*aspect-ratio:\s*2\.75 \/ 4\.75/);
assert.match(
  css,
  /\.adventure-deck \.deck-card-list \{[\s\S]*grid-template-columns:\s*repeat\(auto-fill, var\(--live-tarot-card-width\)\)[\s\S]*justify-items:\s*start/,
  'The Adventure Deck grid may add columns, but it must never stretch cards.'
);

console.log('The live board stays first; deck and initiative match; cards remain fixed tarot size.');
