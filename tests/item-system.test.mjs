import assert from "node:assert/strict";
import { characterCard, itemCards, slotLabels, createInventory, canEquip, deriveStats, equipItem, unequipItem, useItem, attunementCount, resolveWeaponAbility } from "../src/player/item-system.js";

const inventory = createInventory();
const state = { edition:"2014", equipped:{ head:null,neck:null,shoulders:null,armor:null,hands:null,mainHand:null,offHand:null,ring1:null,ring2:null,feet:null,wondrous:null } };

assert.equal(characterCard.base.baseAc,13);
assert.equal(itemCards.every(item => item.source === "SRD" || item.source === "Wishing Cake"),true);
assert.equal(itemCards.every(item => item.playerText && item.dmText && item.image),true);
assert.equal(slotLabels.hands,"Gloves / Gauntlets","Generic hands slot must describe worn hand gear, not a two-handed weapon slot");
assert.equal(slotLabels.mainHand,"Hand 1");
assert.equal(slotLabels.offHand,"Hand 2");

const rapier=inventory.find(item=>item.id==="rapier");
const shield=inventory.find(item=>item.id==="shield");
const shortbow=inventory.find(item=>item.id==="shortbow");
assert.deepEqual(rapier.validSlots,["mainHand","offHand"],"One-handed weapons must work in either hand");
assert.deepEqual(shield.validSlots,["mainHand","offHand"],"A shield must not be hard-coded to a fake off-hand-only rule");
assert.ok(shortbow.attack.properties.includes("ammunition"),"Shortbow must carry its Ammunition property");
assert.equal(resolveWeaponAbility(rapier,{strength:18,dexterity:12}),"strength","Finesse must allow Strength when Strength is better");
assert.equal(resolveWeaponAbility(rapier,{strength:10,dexterity:16}),"dexterity","Finesse must allow Dexterity when Dexterity is better");

assert.equal(equipItem(state,inventory,"leather-armor","armor").ok,true);
assert.equal(deriveStats(state,inventory).ac,14);
assert.equal(equipItem(state,inventory,"shield","offHand").ok,true);
assert.equal(deriveStats(state,inventory).ac,16);
assert.equal(equipItem(state,inventory,"rapier-plus-1","mainHand").ok,true);
let stats=deriveStats(state,inventory);
assert.equal(stats.attack,6);
assert.equal(stats.damage,4);
assert.equal(stats.attackProfile.damageDice,"1d8");
assert.equal(stats.attackProfile.attackAbility,"dexterity");
assert.equal(canEquip(inventory.find(item=>item.id==="shield"),"head",state,inventory).ok,false);

assert.equal(equipItem(state,inventory,"cloak-protection","shoulders").ok,true);
assert.equal(equipItem(state,inventory,"ring-protection","ring1").ok,true);
stats=deriveStats(state,inventory);
assert.equal(stats.ac,18);
assert.equal(stats.saves.dexterity,5,"Dexterity save is +3 base plus +1 cloak plus +1 ring");
assert.equal(attunementCount(state,inventory),2);

assert.equal(equipItem(state,inventory,"boots-elvenkind","feet").ok,true);
stats=deriveStats(state,inventory);
assert.equal(stats.speed,30);
assert.equal(stats.traits.includes("Advantage: stealth"),true);

unequipItem(state,"shield");
assert.equal(deriveStats(state,inventory).ac,16);
unequipItem(state,"cloak-protection");
assert.equal(deriveStats(state,inventory).saves.dexterity,4,"Ring of Protection alone raises the legal +3 Dex save to +4");

unequipItem(state,"rapier-plus-1");
assert.equal(equipItem(state,inventory,"longbow","mainHand").ok,true);
stats=deriveStats(state,inventory);
assert.equal(stats.attack,7,"Archery adds +2 to a ranged weapon attack roll");
assert.equal(stats.damage,3,"Archery must not add to damage");
assert.equal(stats.attackProfile.damageDice,"1d8");
assert.equal(state.equipped.mainHand,"longbow");
assert.equal(state.equipped.offHand,"longbow","An active Two-Handed weapon must reserve both hand positions in the doll");

const twoHandedState={edition:"2024",equipped:{head:null,neck:null,shoulders:null,armor:"leather-armor",hands:null,mainHand:"rapier",offHand:"shield",ring1:null,ring2:null,feet:null,wondrous:null}};
const bowEquip=equipItem(twoHandedState,inventory,"longbow","mainHand");
assert.equal(bowEquip.ok,true);
assert.ok(bowEquip.stowed.includes("rapier"));
assert.ok(bowEquip.stowed.includes("shield"));
assert.equal(twoHandedState.equipped.mainHand,"longbow");
assert.equal(twoHandedState.equipped.offHand,"longbow");
assert.equal(deriveStats(twoHandedState,inventory).ac,14,"Shield AC must disappear while the longbow is in an active two-handed grip");
const shieldEquip=equipItem(twoHandedState,inventory,"shield","offHand");
assert.equal(shieldEquip.ok,true);
assert.deepEqual(shieldEquip.stowed,["longbow"]);
assert.equal(twoHandedState.equipped.mainHand,null,"Equipping a one-handed item must release the two-handed grip from both hands");
assert.equal(twoHandedState.equipped.offHand,"shield");

const eitherHandState={edition:"2014",equipped:{head:null,neck:null,shoulders:null,armor:null,hands:null,mainHand:null,offHand:null,ring1:null,ring2:null,feet:null,wondrous:null}};
assert.equal(equipItem(eitherHandState,inventory,"rapier","offHand").ok,true);
assert.equal(eitherHandState.equipped.offHand,"rapier");
assert.equal(deriveStats(eitherHandState,inventory).attackProfile.name,"Rapier");
assert.equal(equipItem(eitherHandState,inventory,"shield","mainHand").ok,true);
assert.equal(eitherHandState.equipped.mainHand,"shield");
assert.equal(eitherHandState.equipped.offHand,"rapier");

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

console.log("Rules-driven item cards, hand occupancy, Finesse choice, ammunition, corrected saves, Archery math, two-handed equipment, attunement, traits, and uses passed.");
