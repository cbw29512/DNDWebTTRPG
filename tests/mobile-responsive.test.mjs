import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, css, hierarchyCss] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../mobile-responsive.css', import.meta.url), 'utf8'),
  readFile(new URL('../adventure-state-board.css', import.meta.url), 'utf8')
]);

assert.match(html, /viewport-fit=cover/, 'viewport should support phone safe areas');
assert.match(html, /mobile-responsive\.css\?v=board-first-live-1/, 'mobile override must remain loaded');
assert.match(html, /adventure-state-board\.css\?v=board-first-live-1/, 'board hierarchy override must remain loaded');
assert.match(html, /live-play-priority\.css\?v=board-first-live-3/, 'final live-play layout guard must remain loaded');
assert.ok(
  html.indexOf('live-play-priority.css') > html.indexOf('adventure-state-board.css'),
  'the live-play guard must load after the board hierarchy layer'
);
assert.match(html, /board-first-live-play-20260805/, 'current build marker should be present');
assert.match(css, /@media \(max-width: 760px\)/, 'phone breakpoint should exist');
assert.match(hierarchyCss, /@media \(max-width: 760px\)[\s\S]*flex-direction: column !important/, 'spatial and encounter slots must stack vertically on phones');
assert.match(css, /\.library-grid[\s\S]*grid-template-columns: minmax\(0, 1fr\) !important/, 'libraries must become one column');
assert.match(css, /\.player-station-grid[\s\S]*grid-template-columns: minmax\(0, 1fr\) !important/, 'player station must stack');
assert.match(css, /\.stack-drawer-layer[\s\S]*position: fixed !important/, 'expanded stacks should become a phone bottom sheet');
assert.match(css, /min-height: var\(--mobile-control-height\)/, 'interactive controls need touch-sized targets');

console.log('mobile fresh seven-slot board layout source checks passed');
