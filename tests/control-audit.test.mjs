import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, modal, player, library] = await Promise.all([
  readFile("src/app.js", "utf8"),
  readFile("card-modal.js", "utf8"),
  readFile("player-ready.js", "utf8"),
  readFile("library-hub.js", "utf8")
]);

for (const control of ["data-remove-instance", "data-reveal", "data-flip-card", "data-card-roll", "data-open-picker", "data-place-card"]) {
  assert.match(app, new RegExp(control), `Board must render and bind ${control}`);
}

assert.match(modal, /controlMap/);
assert.match(modal, /modalControlKey/);
assert.match(modal, /removeInstance/);
assert.match(modal, /reveal/);
assert.match(modal, /flipCard/);
assert.match(modal, /cardRoll/);
assert.match(modal, /original\.click\(\)/, "Modal controls must invoke the original bound board control");

assert.match(player, /data-unequip-item/);
assert.match(player, /unequipItem\(state,item\.id\)/);
assert.match(player, /Bonuses removed/);

for (const control of ["data-new-one-shot", "data-cancel-builder", "data-upload-adventure", "data-open-pack", "data-load-character"]) {
  assert.match(library, new RegExp(control), `Library must render and bind ${control}`);
}

console.log("control interaction audit passed");
