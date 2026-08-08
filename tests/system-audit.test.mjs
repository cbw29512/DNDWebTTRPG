import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const dm = read('index.html');
const player = read('player.html');
const redirect = read('dm.html');
const packageJson = JSON.parse(read('package.json'));
const runner = read('tests/run-all.mjs');

function localAssets(html) {
  return [...html.matchAll(/(?:href|src)="([^"#?]+)(?:\?[^"#]*)?"/g)]
    .map(match => match[1])
    .filter(asset => !/^(?:https?:|data:|mailto:|tel:)/.test(asset));
}

function versionedAssets(html) {
  return new Map(
    [...html.matchAll(/(?:href|src)="([^"?#]+)\?v=([^"#]+)"/g)]
      .map(match => [match[1], match[2]])
  );
}

for (const [route, html] of [['DM', dm], ['Player', player]]) {
  assert.match(html, /^<!doctype html>/i, `${route} route must use an HTML5 doctype.`);
  assert.match(html, /<html lang="en">/, `${route} route must declare its document language.`);
  assert.match(html, /name="viewport"[^>]*viewport-fit=cover/, `${route} route must support mobile safe areas.`);
  assert.match(html, /<a class="skip" href="#board">/, `${route} route must retain keyboard skip navigation.`);
  assert.equal((html.match(/id="app"/g) ?? []).length, 1, `${route} route must expose one application root.`);
  assert.doesNotMatch(html, /\son(?:click|change|input|submit|keydown|keyup)=/i, `${route} route must not introduce inline event handlers.`);

  for (const asset of localAssets(html)) {
    assert.ok(fs.existsSync(path.join(root, asset)), `${route} route references missing local asset: ${asset}`);
  }
}

assert.match(dm, /<body class="role-dm live-play-board-first(?:\s[^"]*)?">/);
assert.match(player, /<body class="role-player live-play-board-first(?:\s[^"]*)?">/);
assert.match(player, /\blive-player-awaiting\b/, 'Player route must start in an explicit awaiting-live state until a DM connection is established.');
assert.match(redirect, /params\.set\('dm', '1'\)/, 'Legacy dm.html must route into the DM table instead of the public home state.');
assert.match(redirect, /location\.replace\('\.\/\?' \+ params\.toString\(\) \+ location\.hash\)/);
assert.match(redirect, /<noscript><a href="\.\/\?dm=1">/);

const dmVersions = versionedAssets(dm);
const playerVersions = versionedAssets(player);
const sharedAssets = [...dmVersions.keys()].filter(asset => playerVersions.has(asset));
for (const asset of sharedAssets) {
  assert.equal(
    dmVersions.get(asset),
    playerVersions.get(asset),
    `DM and Player routes must load the same shared asset version: ${asset}`
  );
}

for (const html of [dm, player]) {
  assert.ok(
    html.indexOf('mobile-responsive.css') < html.indexOf('prepared-play-board.css'),
    'The prepared board layer must load after the mobile baseline.'
  );
  assert.ok(
    html.indexOf('adventure-state-board.css') < html.indexOf('live-play-priority.css'),
    'The live-play priority layer must load after the base board hierarchy.'
  );
  assert.ok(
    html.indexOf('live-play-priority.css') < html.indexOf('prepared-play-board.css'),
    'Prepared-adventure geometry must remain the final board layout authority.'
  );
  assert.ok(
    html.indexOf('wishing-cake-visual.css') < html.indexOf('site-shell.css'),
    'Global navigation must load after the adventure visual layer so route controls stay visible.'
  );
}

assert.equal(packageJson.scripts?.test, 'node tests/run-all.mjs');
assert.match(runner, /file\.endsWith\('\.test\.mjs'\)/, 'The runner must discover every regression file.');
assert.match(runner, /\.sort\(/, 'The runner must execute tests in a deterministic order.');
assert.match(runner, /spawnSync\(process\.execPath/, 'The runner must execute each test with the current Node runtime.');
assert.match(runner, /result\.status !== 0/, 'The runner must stop the suite when any test fails.');

const status = read('PROJECT_STATUS.md');
assert.doesNotMatch(status, /complete test suite could not be executed/i, 'Project status must not claim CI cannot run after CI is active.');
assert.match(status, /Automated regression coverage/, 'Project status should record active automated regression coverage.');

const testFiles = fs.readdirSync(path.join(root, 'tests')).filter(file => file.endsWith('.test.mjs'));
console.log(`System audit passed: ${localAssets(dm).length + localAssets(player).length} route asset references and ${testFiles.length} automatically discovered regression files checked.`);
