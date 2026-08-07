import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderWishingCakeArt } from '../src/wishing-cake-art.js';

const read = file => fs.readFileSync(file,'utf8');
const dm = read('index.html');
const player = read('player.html');
const visual = read('wishing-cake-visual.js');
const css = read('wishing-cake-visual.css');

for (const html of [dm,player]) {
  assert.match(html,/wishing-cake-visual\.css\?v=visual-overhaul-1/);
  assert.match(html,/wishing-cake-visual\.js\?v=visual-overhaul-1/);
  assert.ok(html.indexOf('prepared-play-board.css') < html.indexOf('wishing-cake-visual.css'),'Visual polish must load after geometry without redefining the geometry contract.');
}

const requiredIllustratedCards = [
  'location','site-wishing-cake-inn','site-celebration-halls','room',
  'room-holding-cells','room-wish-hall','room-soul-cellar','room-pinata-pen','room-wrapping','room-cult','room-cake-chamber',
  'caretaker','npc-boris','npc-pip','npc-lute','npc-merrit','npc-sepulchral',
  'priest','skeleton','monster-pinata-mimic','monster-sepulchral',
  'hazard-exploding-pinata','hazard-wrapping-machine','hazard-wish-circle',
  'lantern','item-wish-crown','item-wooden-dog','item-story-book','item-teddy-dagger','item-rope','item-candy','treasure'
];
for (const id of requiredIllustratedCards) assert.ok(visual.includes(id),`Missing dedicated playtest art mapping for ${id}`);

const sample = renderWishingCakeArt({id:'monster-sepulchral',title:'Sepulchral',artKey:'sepulchral',artAlt:'Sepulchral boss illustration'});
assert.match(sample,/card-art-illustrated/);
assert.match(sample,/<svg viewBox="0 0 240 150"/);
assert.match(sample,/aria-label="Sepulchral boss illustration"/);
assert.doesNotMatch(sample,/>☠</);

assert.match(visual,/MutationObserver/,'Art hydration must survive application rerenders.');
assert.match(visual,/card-art:not\(\[data-wc-art\]\)/,'Already-hydrated card art must not be replaced repeatedly.');
assert.match(visual,/card-art-illustrated/,'The hydration layer must install illustrated card-art markup.');
assert.match(css,/\.card-art\{/,'The visual layer must style the illustrated art stage.');
assert.match(css,/\.card-art svg/,'The visual layer must style the inline artwork itself.');
assert.match(css,/\.type-monster/);
assert.match(css,/\.board-slot\[data-slot="treasure"\]/);
assert.match(css,/\.initiative li/);
assert.match(css,/prefers-reduced-motion/);
assert.doesNotMatch(css,/--live-tarot-card-width\s*:/,'The visual layer must not redefine canonical tarot width.');
assert.doesNotMatch(css,/--prepared-board-slot-height\s*:/,'The visual layer must not redefine canonical board height.');

console.log(`Wishing Cake visual overhaul passed: ${requiredIllustratedCards.length} adventure cards have dedicated illustrated playtest coverage.`);
