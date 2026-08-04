import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { characterCards, defaultCharacterCard, getCharacterCard, resolveRequestedCharacter } from "../src/player/character-cards.js";
import { createInventory, deriveStats } from "../src/player/item-system.js";

assert.equal(characterCards.length > 0, true, "At least one pregen character card must exist");
assert.equal(defaultCharacterCard.id, "wendy-birthday-hero");
assert.equal(defaultCharacterCard.front.portrait.length > 0, true, "Character card needs picture-front content");
assert.equal(defaultCharacterCard.back.playNotes.length > 0, true, "Character card needs information-back content");
assert.equal(defaultCharacterCard.back.qrPath, "?character=wendy-birthday-hero");
assert.deepEqual(getCharacterCard("wendy-birthday-hero"), defaultCharacterCard);

const storage = { getItem:key => key.includes("active-character") ? "wendy-birthday-hero" : null };
assert.equal(resolveRequestedCharacter("", storage).id, "wendy-birthday-hero");
assert.equal(resolveRequestedCharacter("?character=wendy-birthday-hero", storage).id, "wendy-birthday-hero");

const inventory=createInventory(defaultCharacterCard.ownedItemIds);
const state={equipped:{...defaultCharacterCard.startingEquipment}};
const stats=deriveStats(state,inventory,defaultCharacterCard);
assert.equal(stats.ac,17,"Loaded character equipment should derive AC from character card plus legal items");
assert.equal(stats.maxHp,28);
assert.equal(stats.attackProfile.name,"Rapier");

const loader=await readFile(new URL("../pregen-character-loader.js",import.meta.url),"utf8");
const library=await readFile(new URL("../library-hub.js",import.meta.url),"utf8");
const index=await readFile(new URL("../index.html",import.meta.url),"utf8");
assert.match(loader,/living-table:character-loaded/);
assert.match(loader,/Show Information Back/);
assert.match(library,/data-load-character/);
assert.match(index,/pregen-character-loader\.js/);
console.log("pregen character loader tests passed");
