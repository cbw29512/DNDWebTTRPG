import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const helper = await readFile(new URL('../src/session/session-state.js', import.meta.url), 'utf8');
const quests = await readFile(new URL('../quest-tracker.js', import.meta.url), 'utf8');
const player = await readFile(new URL('../player-session-bridge.js', import.meta.url), 'utf8');
const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');

assert.match(helper, /updateSession/);
assert.match(helper, /ensurePlayerState/);
assert.match(quests, /questState/);
assert.match(quests, /updateSession/);
assert.doesNotMatch(quests, /const activeSideQuests = new Set/);
assert.match(player, /playerState/);
assert.match(player, /data-hp-change/);
assert.match(player, /data-spend-action/);
assert.match(player, /data-player-ready/);
assert.match(player, /data-auto-equip/);
assert.match(index, /player-session-bridge\.js/);
console.log('canonical quest and player session checks passed');
