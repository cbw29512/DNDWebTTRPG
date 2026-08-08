import assert from 'node:assert/strict';
import fs from 'node:fs';

const visual = fs.readFileSync('wishing-cake-visual.css', 'utf8');
const stability = fs.readFileSync('card-stability.css', 'utf8');

assert.doesNotMatch(
  visual,
  /\.tarot-back\s+\.card-copy\s*\{[^}]*overflow\s*:\s*(?:auto|scroll)/i,
  'Wishing Cake visual CSS must never reintroduce an internally scrollable tarot back.'
);
assert.match(
  visual,
  /\.tarot-back\s+\.card-copy\s*\{[^}]*overflow\s*:\s*visible/i,
  'Wishing Cake visual CSS should make tarot back copy non-scrollable at the source.'
);
assert.match(
  stability,
  /\.tarot-card\s+\.card-copy\s*\{[^}]*overflow\s*:\s*visible!important/i,
  'Final card stability CSS must retain the no-internal-scroll override.'
);

console.log('Card CSS authority passed: tarot copy is non-scrollable in both the visual source and final stability layer.');
