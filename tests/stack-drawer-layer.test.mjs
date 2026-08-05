import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html,css,js]=await Promise.all([
  readFile('index.html','utf8'),
  readFile('stack-drawer-layer.css','utf8'),
  readFile('stack-drawer-layer.js','utf8')
]);

assert.match(html,/stack-drawer-layer\.css\?v=equal-board-slots-2/);
assert.match(html,/stack-drawer-layer\.js\?v=equal-board-slots-2/);
assert.match(css,/position:fixed!important/);
assert.match(css,/left:50%!important/);
assert.match(css,/transform:translateX\(-50%\)!important/);
assert.match(css,/max-width:calc\(100vw - 32px\)!important/);
assert.match(css,/--stack-drawer-max-height/);
assert.match(js,/getBoundingClientRect/);
assert.match(js,/naturalHeight/);
assert.match(js,/preferAbove/);
assert.match(js,/viewportHeight\*\.55/);
assert.match(js,/fitsBelow/);
assert.match(js,/fitsAbove/);
assert.match(js,/dismissExpandedStack/);
assert.match(js,/event\.target\.closest\('\.card-stack,\.stack-drawer/);
assert.match(js,/toggle\?\.click\(\)/);
assert.match(js,/window\.addEventListener\('resize'/);

console.log('Centered, viewport-contained stack drawer tests passed.');
