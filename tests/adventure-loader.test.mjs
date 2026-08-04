import assert from "node:assert/strict";
import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("packs/wishing-cake/1.0.0/manifest.json", "utf8"));
const loader = fs.readFileSync("adventure-loader.js", "utf8");
const index = fs.readFileSync("index.html", "utf8");

assert.equal(manifest.schemaVersion, 1);
assert.equal(manifest.packId, "wishing-cake");
assert.equal(manifest.adventureCode, "WISH-CAKE-001");
assert.deepEqual(manifest.systems, ["dnd-2014", "dnd-2024"]);
assert.ok(manifest.releaseId.includes(manifest.version));
assert.ok(manifest.startingBoard.location.includes("location"));
assert.ok(manifest.startingBoard.room.includes(manifest.entrySceneId));
assert.ok(manifest.counts.rooms > 0 && manifest.counts.monsters > 0 && manifest.counts.items > 0);
assert.match(loader, /WISH-CAKE-001/i);
assert.match(loader, /localStorage\.setItem\(`dndweb:adventure:/);
assert.match(loader, /dnd:adventure-loaded/);
assert.match(loader, /await import\("\.\/src\/app\.js"\)/);
assert.match(index, /adventure-loader\.js/);
assert.doesNotMatch(index, /src\/app\.js/);
console.log("Adventure loader manifest and bootstrap checks passed.");
