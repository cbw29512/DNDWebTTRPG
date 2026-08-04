import assert from "node:assert/strict";
import { characterCard, itemCards, createInventory, canEquip, deriveStats, equipItem, unequipItem, useItem, attunementCount } from "../src/player/item-system.js";

const inventory = createInventory();
const state = { equipped:{ head:null,neck:null,shoulders:null,armor:null,hands:null,mainHand:null,offHand:null,ring1:null,ring2:null,feet:null,wondrous:null } };

assert.equal(characterCard.base.baseAc,13);
assert.equal(itemCards.every(item => item.source === "SRD" || item.source === "Wishing Cake"),true);
assert.equal(itemCards.every(item => item.playerText && item.dmText && item.image),true);

assert.equal(equipItem(state,inventory,"leather-armor","armor").ok,true);
assert.equal(deriveStats(state,inventory).ac,14);
assert.equal(equipItem(state,inventory,"shield","offHand").ok,true);
assert.equal(deriveStats(state,inventory).ac,16);
assert.equal(equipItem(state,inventory,"rapier-plus-1","mainHand").ok,true);
let stats=deriveStats(state,inventory);
assert.equal(stats.attack,6);
assert.equal(stats.damage,4);
assert.equal(stats.attackProfile.damageDice,"1d8");
assert.equal(canEquip(inventory.find(item=>item.id==="shield"),"head",state,inventory).ok,false);

assert.equal(equipItem(state,inventory,"cloak-protection","shoulders").ok,true);
assert.equal(equipItem(state,inventory,"ring-protection","ring1").ok,true);
stats=deriveStats(state,inventory);
assert.equal(stats.ac,18);
assert.equal(stats.saves.dexterity,7);
assert.equal(attunementCount(state,inventory),2);

assert.equal(equipItem(state,inventory,"boots-elvenkind","feet").ok,true);
stats=deriveStats(state,inventory);
assert.equal(stats.speed,30);
assert.equal(stats.traits.includes("Advantage: stealth"),true);

unequipItem(state,"shield");
assert.equal(deriveStats(state,inventory).ac,16);
unequipItem(state,"cloak-protection");
assert.equal(deriveStats(state,inventory).saves.dexterity,6);

const potion=inventory.find(item=>item.id==="potion-healing");
assert.equal(useItem(potion).ok,true);
assert.equal(potion.consumable.count,1);
const candle=inventory.find(item=>item.id==="birthday-spark");
assert.equal(useItem(candle).ok,true);
assert.equal(candle.uses.current,2);

const fakeAttuned=(id,slot)=>({id,name:id,source:"test",color:"srd-item",category:"ring",rarity:"rare",image:"x",validSlots:[slot],attunement:true,edition:"test",playerText:"x",dmText:"x",effects:[]});
inventory.push(fakeAttuned("attuned-a","ring2"),fakeAttuned("attuned-b","neck"));
assert.equal(equipItem(state,inventory,"attuned-a","ring2").ok,true);
assert.equal(equipItem(state,inventory,"attuned-b","neck").ok,true);
assert.equal(attunementCount(state,inventory),3);
inventory.push(fakeAttuned("attuned-c","head"));
assert.equal(equipItem(state,inventory,"attuned-c","head").ok,false);

console.log("Rules-driven item cards, legal slots, derived stats, attunement, traits, and uses passed.");
