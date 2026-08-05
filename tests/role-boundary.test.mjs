import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
const roleContext = await readFile(new URL('../src/role-context.js', import.meta.url), 'utf8');
const sceneRuntime = await readFile(new URL('../scene-runtime.js', import.meta.url), 'utf8');
const dmPage = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const playerPage = await readFile(new URL('../player.html', import.meta.url), 'utf8');
const boundary = await readFile(new URL('../strict-role-boundary.js', import.meta.url), 'utf8');

assert.match(dmPage, /name="living-table-role" content="dm"/);
assert.match(playerPage, /name="living-table-role" content="player"/);
assert.doesNotMatch(playerPage, /scene-runtime\.js/);
assert.doesNotMatch(playerPage, /card-quality-audit\.js/);
assert.doesNotMatch(playerPage, /local-session\.js/);

assert.match(roleContext, /requires an explicit DM or player entry point/);
assert.match(app, /const viewRole = resolveRuntimeRole\(\)/);
assert.doesNotMatch(app, /data-role="dm"/);
assert.doesNotMatch(app, /data-role="player"/);
assert.doesNotMatch(app, /Live preview:/);
assert.match(app, /if \(!isDM\) return "";/);
assert.match(app, /if \(viewRole !== ROLES\.DM\) return;/);
assert.match(app, /renderInitiative\(false\)/);

assert.match(sceneRuntime, /if \(!isDungeonMaster \|\| loading\) return false/);
assert.match(sceneRuntime, /Players receive only revealed player-safe cards/);
assert.match(boundary, /encounter-board \[data-card-roll\]/);
assert.match(boundary, /view-switch/);

console.log('role boundary source checks passed');
