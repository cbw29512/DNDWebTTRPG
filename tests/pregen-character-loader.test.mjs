import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  characterCards,
  defaultCharacterCard,
  getCharacterCard,
  getCharacterProfile,
  findCharacterByImportCode,
  resolveRequestedCharacter
} from "../src/player/character-cards.js";
import { createInventory, deriveStats } from "../src/player/item-system.js";

assert.equal(characterCards.length > 0, true, "At least one pregen character card must exist");
assert.equal(defaultCharacterCard.id, "wendy-birthday-hero");
assert.equal(defaultCharacterCard.front.artAlt.length > 0, true, "Character card needs picture-front alt text");
assert.equal(defaultCharacterCard.back.playNotes.length > 0, true, "Character card needs information-back content");
assert.equal(defaultCharacterCard.back.importCodes["dnd-2014"], "WC-WENDY-F3-14");
assert.equal(defaultCharacterCard.back.importCodes["dnd-2024"], "WC-WENDY-F3-24");
assert.equal(defaultCharacterCard.back.qrPaths["dnd-2014"], "player.html?character=wendy-birthday-hero&edition=2014");
assert.equal(defaultCharacterCard.back.qrPaths["dnd-2024"], "player.html?character=wendy-birthday-hero&edition=2024");
assert.equal(findCharacterByImportCode("WC-WENDY-F3-24").edition,"dnd-2024");
assert.deepEqual(getCharacterCard("wendy-birthday-hero"), defaultCharacterCard);
assert.equal(getCharacterProfile(defaultCharacterCard,"2014").level,3);
assert.equal(getCharacterProfile(defaultCharacterCard,"2024").level,3);

const storage = { getItem:key => key.includes("active-character") ? "wendy-birthday-hero" : null };
assert.equal(resolveRequestedCharacter("", storage).id, "wendy-birthday-hero");
assert.equal(resolveRequestedCharacter("?character=wendy-birthday-hero", storage).id, "wendy-birthday-hero");

const inventory=createInventory(defaultCharacterCard.ownedItemIds);
const state={edition:"2014",equipped:{...defaultCharacterCard.startingEquipment}};
const stats=deriveStats(state,inventory,defaultCharacterCard);
assert.equal(stats.ac,16,"Loaded character starts with leather armor + Dex + shield");
assert.equal(stats.maxHp,28);
assert.equal(stats.attack,5);
assert.equal(stats.damage,3);
assert.equal(stats.attackProfile.name,"Rapier");
assert.equal(inventory.some(item=>item.id==="longbow"),true);
assert.equal(inventory.some(item=>item.id==="cloak-protection"),false,"Unowned magic gear must not be in the pregen backpack");

const loader=await readFile(new URL("../pregen-character-loader.js",import.meta.url),"utf8");
const library=await readFile(new URL("../library-hub.js",import.meta.url),"utf8");
const playerHtml=await readFile(new URL("../player.html",import.meta.url),"utf8");
const portrait=await readFile(new URL("../assets/characters/wendy-birthday-hero.svg",import.meta.url),"utf8");
assert.match(loader,/living-table:character-loaded/);
assert.match(loader,/Show Import Back/);
assert.match(loader,/CHARACTER IMPORT CODE/);
assert.match(loader,/assets\/characters/);
assert.match(loader,/Basic combat statistics/);
assert.match(library,/data-load-character/);
assert.match(playerHtml,/pregen-character-loader\.js/);
assert.match(playerHtml,/player-character-sheet\.js\?v=character-sheet-1/);
assert.match(portrait,/Wendy’s Birthday Hero/);
console.log("picture-front, combat-summary, dual-edition import-card, and complete-sheet pregen tests passed");
