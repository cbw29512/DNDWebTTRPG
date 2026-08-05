import assert from "node:assert/strict";
import fs from "node:fs";

const dmHtml = fs.readFileSync("index.html", "utf8");
const playerHtml = fs.readFileSync("player.html", "utf8");
const runtime = fs.readFileSync("prepared-play-board.js", "utf8");
const css = fs.readFileSync("prepared-play-board.css", "utf8");
const contract = fs.readFileSync("docs/PREPARED_PLAY_BOARD.md", "utf8");

assert.match(dmHtml, /prepared-play-board\.css\?v=equal-board-slots-2/);
assert.match(dmHtml, /prepared-play-board\.js\?v=prepared-play-board-1/);
assert.match(playerHtml, /prepared-play-board\.css\?v=equal-board-slots-2/);
assert.match(playerHtml, /prepared-play-board\.js\?v=prepared-play-board-1/);
assert.match(dmHtml, /prepared-play-board-20260805/);
assert.match(playerHtml, /prepared-play-board-20260805/);
assert.match(dmHtml, /live-play-priority\.css\?v=board-first-live-3/);
assert.match(playerHtml, /live-play-priority\.css\?v=board-first-live-3/);

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
assert.match(css, /--prepared-board-slot-height:\s*420px/);
assert.match(css, /--prepared-board-heading-height:\s*78px/);
assert.match(
  css,
  /grid-template-columns:repeat\(7,minmax\(var\(--prepared-board-slot-min-width\),1fr\)\)!important/,
  "The prepared board must render seven equal-width desktop tracks."
);
assert.match(css, /grid-auto-rows:var\(--prepared-board-slot-height\)!important/);
assert.match(
  css,
  /\.fixed-board > \.board-slot\[data-slot\] \{[\s\S]*height:var\(--prepared-board-slot-height\)!important[\s\S]*min-height:var\(--prepared-board-slot-height\)!important[\s\S]*max-height:var\(--prepared-board-slot-height\)!important/,
  "Every prepared board slot must share one exact desktop height."
);
assert.match(
  css,
  /\.board-slot\[data-slot\] > \.slot-heading \{[\s\S]*flex:0 0 var\(--prepared-board-heading-height\)!important/,
  "All cards must begin on the same visual baseline."
);
assert.match(css, /width:var\(--live-tarot-card-width,148px\)!important/);
assert.match(
  css,
  /@media\(max-width:760px\)[\s\S]*grid-template-columns:minmax\(0,1fr\)!important[\s\S]*height:auto!important/,
  "Phone layouts must stack without forcing a desktop fixed height."
);
assert.match(css, /prepared-current-event/);
assert.match(css, /body\.role-player/);
assert.match(css, /body\.role-player \.area-current-scene/);

assert.match(contract, /Location/);
assert.match(contract, /Site/);
assert.match(contract, /Area/);
assert.match(contract, /Quest Tracker/);
assert.match(contract, /must not derive hidden Scene titles/);
assert.match(contract, /escaped/);

console.log("Prepared-play spatial locking, equal seven-slot geometry, Scene context, player sanitization, and escaping passed.");
