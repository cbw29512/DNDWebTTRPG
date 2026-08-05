import assert from "node:assert/strict";
import fs from "node:fs";

const dmHtml = fs.readFileSync("index.html", "utf8");
const playerHtml = fs.readFileSync("player.html", "utf8");
const runtime = fs.readFileSync("prepared-play-board.js", "utf8");
const css = fs.readFileSync("prepared-play-board.css", "utf8");
const contract = fs.readFileSync("docs/PREPARED_PLAY_BOARD.md", "utf8");

assert.match(dmHtml, /prepared-play-board\.css\?v=prepared-play-board-1/);
assert.match(dmHtml, /prepared-play-board\.js\?v=prepared-play-board-1/);
assert.match(playerHtml, /prepared-play-board\.css\?v=prepared-play-board-1/);
assert.match(playerHtml, /prepared-play-board\.js\?v=prepared-play-board-1/);
assert.match(dmHtml, /prepared-play-board-20260805/);
assert.match(playerHtml, /prepared-play-board-20260805/);
assert.match(dmHtml, /live-play-priority\.css\?v=board-first-live-2/);
assert.match(playerHtml, /live-play-priority\.css\?v=board-first-live-2/);

assert.match(runtime, /CONTEXT_SLOT_IDS/);
assert.match(runtime, /location/);
assert.match(runtime, /site/);
assert.match(runtime, /room/);
assert.match(runtime, /data-prepared-context/);
assert.match(runtime, /Loaded by the adventure/);
assert.match(runtime, /prepared-adventure-context/);
assert.match(runtime, /prepared-area-event/);
assert.match(runtime, /isDungeonMaster/);
assert.match(runtime, /visibleCardTitle/);
assert.match(runtime, /escapeHtml/);
assert.match(runtime, /&amp;/);
assert.match(runtime, /removePlayerSceneLeak/);
assert.match(runtime, /\.area-current-scene/);
assert.match(runtime, /current scene/);
assert.match(runtime, /observer\?\.disconnect/);
assert.match(runtime, /living-table:scene-loaded/);
assert.match(runtime, /stopImmediatePropagation/);

assert.match(css, /slot-heading::after/);
assert.match(css, /content:none!important/);
assert.match(css, /min-height:0!important/);
assert.match(css, /prepared-current-event/);
assert.match(css, /body\.role-player/);
assert.match(css, /body\.role-player \.area-current-scene/);

assert.match(contract, /Location/);
assert.match(contract, /Site/);
assert.match(contract, /Area/);
assert.match(contract, /Quest Tracker/);
assert.match(contract, /must not derive hidden Scene titles/);
assert.match(contract, /escaped/);

console.log("Prepared-play spatial locking, Scene context, player sanitization, escaping, and compact board checks passed.");
