import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizeCatalog, filterCatalog, catalogCounts, DND_CARDS_SOURCE } from "../src/library/dndcards-catalog.js";

const sample=normalizeCatalog([
  {id:"pc-test",kind:"character",title:"Test Hero",playerText:"Player text",dmText:"DM text",quickStats:["AC 15"]},
  {id:"item-test",kind:"equipment",title:"Test Blade",playerText:"Blade text"},
  {id:"item-test",kind:"equipment",title:"Duplicate Blade"}
]);
assert.equal(sample.length,2,"duplicate source IDs must collapse to one definition");
assert.equal(sample.find(card=>card.id==="item-test").kind,"item");
assert.equal(filterCatalog(sample,{kind:"character"}).length,1);
assert.equal(filterCatalog(sample,{search:"blade"}).length,1);
assert.equal(catalogCounts(sample).total,2);
assert.match(DND_CARDS_SOURCE.moduleUrl,/5395c9eb70ec8011df53f0ecdb5125485a6c8092/);

const hub=await readFile(new URL("../library-hub.js",import.meta.url),"utf8");
assert.match(hub,/DungeonCards Premade Card Catalog/);
assert.match(hub,/data-preview-catalog-card/);
assert.match(hub,/data-collect-card/);
assert.match(hub,/loadDungeonCardsCatalog/);
console.log("DungeonCards catalog tests passed");
