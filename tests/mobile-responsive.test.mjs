import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, css] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../mobile-responsive.css', import.meta.url), 'utf8')
]);

assert.match(html, /viewport-fit=cover/, 'viewport should support phone safe areas');
assert.match(html, /mobile-responsive\.css\?v=mobile-layout-1/, 'mobile override must load after feature styles');
assert.match(html, /mobile-responsive-layout-20260805/, 'mobile build marker should be present');
assert.match(css, /@media \(max-width: 760px\)/, 'phone breakpoint should exist');
assert.match(css, /#app \.fixed-board[\s\S]*flex-direction: column !important/, 'board must stack vertically on phones');
assert.match(css, /\.library-grid[\s\S]*grid-template-columns: minmax\(0, 1fr\) !important/, 'libraries must become one column');
assert.match(css, /\.player-station-grid[\s\S]*grid-template-columns: minmax\(0, 1fr\) !important/, 'player station must stack');
assert.match(css, /\.stack-drawer-layer[\s\S]*position: fixed !important/, 'expanded stacks should become a phone bottom sheet');
assert.match(css, /min-height: var\(--mobile-control-height\)/, 'interactive controls need touch-sized targets');

console.log('mobile responsive source checks passed');
