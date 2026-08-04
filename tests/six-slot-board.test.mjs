import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('encounter-scale.css', 'utf8');
const quest = fs.readFileSync('quest-tracker.js', 'utf8');

assert.match(html, /encounter-scale\.css/);
assert.match(css, /data-slot="objective"/);
assert.match(css, /display:none!important/);
assert.match(css, /min-width:208px!important/);
assert.match(css, /width:184px!important/);
assert.match(css, /min-height:420px!important/);
assert.match(quest, /Quest Tracker/);
assert.match(quest, /main-quest/);
assert.match(quest, /side-quest/);

console.log('Current encounter shows six large card slots while quests remain in the separate tracker.');
