import { defaultCharacterCard } from "./character-cards.js";

export const characterCard = defaultCharacterCard;

const srd = item => Object.freeze({ source:"SRD", color:"srd-item", ...item });
const custom = item => Object.freeze({ source:"Wishing Cake", color:"custom-item", ...item });

export const itemCards = Object.freeze([
  srd({ id:"leather-armor", name:"Leather Armor", category:"armor", rarity:"standard", image:"🥋", validSlots:["armor"], attunement:false, edition:"2014/2024", front:"Supple leather armor", playerText:"Armor Class equals 11 + Dexterity modifier.", dmText:"This armor sets AC to 11 + Dexterity modifier; it does not stack with another armor formula.", effects:[{kind:"armorFormula",base:11,dexCap:null}] }),
  srd({ id:"shield", name:"Shield", category:"shield", rarity:"standard", image:"🛡️", validSlots:["offHand"], attunement:false, edition:"2014/2024", front:"A sturdy defensive shield", playerText:"While wielding this shield, you gain +2 AC.", dmText:"Apply +2 AC while equipped. A character cannot benefit from more than one shield at a time.", effects:[{kind:"add",target:"ac",value:2}] }),
  srd({ id:"rapier", name:"Rapier", category:"weapon", rarity:"standard", image:"🗡️", validSlots:["mainHand"], attunement:false, edition:"2014/2024", front:"A narrow finesse blade", playerText:"Martial melee weapon; 1d8 piercing; finesse. 2024 mastery: Vex if the character has Rapier mastery.", dmText:"Use Strength or Dexterity for both attack and damage because the rapier has Finesse. Wendy uses Dexterity.", attack:{kind:"melee",attackAbility:"dexterity",damageDice:"1d8",damageType:"piercing",range:"5 ft.",properties:["finesse"],mastery2024:"Vex"}, effects:[] }),
  srd({ id:"longbow", name:"Longbow", category:"weapon", rarity:"standard", image:"🏹", validSlots:["mainHand"], attunement:false, edition:"2014/2024", front:"A full-sized martial bow", playerText:"Martial ranged weapon; 1d8 piercing; range 150/600 feet; ammunition, heavy, two-handed. 2024 mastery: Slow.", dmText:"Use Dexterity for attack and damage. Archery Fighting Style adds +2 to the attack roll, not damage.", attack:{kind:"ranged",attackAbility:"dexterity",damageDice:"1d8",damageType:"piercing",range:"150/600 ft.",properties:["ammunition","heavy","two-handed"],mastery2024:"Slow"}, effects:[] }),
  srd({ id:"rapier-plus-1", name:"Rapier +1", category:"weapon", rarity:"uncommon", image:"⚔️", validSlots:["mainHand"], attunement:false, edition:"2014/2024", front:"A silver-edged enchanted rapier", playerText:"You gain +1 to attack and damage rolls made with this magic weapon.", dmText:"Apply +1 attack and +1 damage only while this weapon is the active main-hand weapon.", attack:{kind:"melee",attackAbility:"dexterity",damageDice:"1d8",damageType:"piercing",range:"5 ft.",properties:["finesse"],mastery2024:"Vex"}, effects:[{kind:"add",target:"attack",value:1},{kind:"add",target:"damage",value:1}] }),
  srd({ id:"shortbow", name:"Shortbow", category:"weapon", rarity:"standard", image:"🏹", validSlots:["mainHand"], attunement:false, edition:"2014/2024", front:"A compact hunting bow", playerText:"Ranged weapon; 1d6 piercing; range 80/320 feet.", dmText:"Uses Dexterity for attack and damage. Requires ammunition and two hands to fire.", attack:{kind:"ranged",attackAbility:"dexterity",damageDice:"1d6",damageType:"piercing",range:"80/320 ft.",properties:["ammunition","two-handed"],mastery2024:"Vex"}, effects:[] }),
  srd({ id:"cloak-protection", name:"Cloak of Protection", category:"wondrous", rarity:"uncommon", image:"🧥", validSlots:["shoulders"], attunement:true, edition:"2014/2024", front:"A deep blue warding cloak", playerText:"While wearing this cloak, you gain +1 AC and +1 to all saving throws.", dmText:"Requires attunement. Apply +1 AC and +1 to every saving throw while equipped and attuned.", effects:[{kind:"add",target:"ac",value:1},{kind:"allSaves",value:1}] }),
  srd({ id:"ring-protection", name:"Ring of Protection", category:"ring", rarity:"rare", image:"💍", validSlots:["ring1","ring2"], attunement:true, edition:"2014/2024", front:"A polished silver warding ring", playerText:"While wearing this ring, you gain +1 AC and +1 to all saving throws.", dmText:"Requires attunement. Apply +1 AC and +1 to every saving throw while equipped and attuned.", effects:[{kind:"add",target:"ac",value:1},{kind:"allSaves",value:1}] }),
  srd({ id:"boots-elvenkind", name:"Boots of Elvenkind", category:"wondrous", rarity:"uncommon", image:"🥾", validSlots:["feet"], attunement:false, edition:"2014/2024", front:"Soft green boots with leaf stitching", playerText:"Your steps make no sound, and you have advantage on Dexterity (Stealth) checks.", dmText:"These boots do not increase Speed. Track the silent-steps trait and Stealth advantage as conditional effects.", effects:[{kind:"trait",label:"Silent steps"},{kind:"advantage",target:"stealth"}] }),
  srd({ id:"potion-healing", name:"Potion of Healing", category:"potion", rarity:"common", image:"🧪", validSlots:[], attunement:false, edition:"2014/2024", front:"A red healing draught", playerText:"Regain 2d4 + 2 hit points when consumed. Action in 2014 rules; Bonus Action in 2024 rules.", dmText:"Consumable. Roll 2d4 + 2 healing. The action economy depends on the selected edition.", consumable:{count:2,healing:"2d4+2"}, effects:[] }),
  custom({ id:"birthday-spark", name:"Birthday Spark Candle", category:"wondrous", rarity:"story", image:"🕯️", validSlots:["wondrous"], attunement:false, edition:"Adventure", front:"A warm candle-flame token", playerText:"After a failed check, spend one charge to add 1d4 to the roll.", dmText:"Adventure-specific story item. Three charges; refresh all charges in the Cake Chamber.", uses:{max:3,current:3,recharge:"Cake Chamber"}, effects:[] }),
  custom({ id:"keeper-crown", name:"Keeper of the Wish Crown", category:"wondrous", rarity:"story", image:"👑", validSlots:["head"], attunement:false, edition:"Adventure", front:"A paper crown marked KEEPER OF THE WISH", playerText:"The crown identifies Wendy as the birthday heart. It grants no numerical bonus.", dmText:"Narrative-only item. Do not modify ability scores, saves, AC, attacks, or damage.", effects:[{kind:"trait",label:"Birthday heart"}] })
]);

export const slotLabels = Object.freeze({ head:"Head", neck:"Neck", shoulders:"Shoulders", armor:"Armor", hands:"Hands", mainHand:"Main Hand", offHand:"Off Hand", ring1:"Ring 1", ring2:"Ring 2", feet:"Feet", wondrous:"Wondrous" });
export function createInventory(ownedIds = null) { const allowed=ownedIds?new Set(ownedIds):null; return itemCards.filter(item=>!allowed||allowed.has(item.id)).map(item=>({ ...item, effects:item.effects.map(effect=>({...effect})), attack:item.attack?{...item.attack,properties:[...(item.attack.properties||[])]}:null, uses:item.uses?{...item.uses}:null, consumable:item.consumable?{...item.consumable}:null })); }
export function validSlots(item) { return item?.validSlots ?? []; }
export function equippedItems(state, inventory) { return Object.values(state.equipped).filter(Boolean).map(id=>inventory.find(item=>item.id===id)).filter(Boolean); }
export function attunementCount(state, inventory) { return equippedItems(state,inventory).filter(item=>item.attunement).length; }
export function canEquip(item,slot,state,inventory) { if(!item||!validSlots(item).includes(slot))return{ok:false,reason:"That card does not fit this equipment slot."}; const already=Object.values(state.equipped).includes(item.id); const replacing=state.equipped[slot]?inventory.find(entry=>entry.id===state.equipped[slot]):null; const next=attunementCount(state,inventory)-(replacing?.attunement?1:0)+(item.attunement&&!already?1:0); return next>3?{ok:false,reason:"You cannot attune to more than three magic items."}:{ok:true}; }
export function deriveStats(state, inventory, activeCharacter = characterCard) {
  const base=activeCharacter.base;
  const items=equippedItems(state,inventory);
  const stats={...base,ac:base.baseAc,abilities:{...base.abilities},saves:{...base.saves},traits:[],attackProfile:null};

  for(const item of items){
    for(const effect of item.effects){
      if(effect.kind!=="armorFormula")continue;
      const dexterityModifier=Math.floor((stats.abilities.dexterity-10)/2);
      const appliedDexterity=effect.dexCap==null?dexterityModifier:Math.min(dexterityModifier,effect.dexCap);
      stats.ac=Math.max(stats.ac,effect.base+appliedDexterity);
    }
  }

  for(const item of items){
    for(const effect of item.effects){
      if(effect.kind==="armorFormula")continue;
      if(effect.kind==="add")stats[effect.target]=(stats[effect.target]??0)+effect.value;
      if(effect.kind==="allSaves")Object.keys(stats.saves).forEach(key=>stats.saves[key]+=effect.value);
      if(effect.kind==="trait")stats.traits.push(effect.label);
      if(effect.kind==="advantage")stats.traits.push(`Advantage: ${effect.target}`);
    }
    if(item.attack)stats.attackProfile={...item.attack,name:item.name};
  }

  return stats;
}
export function equipItem(state,inventory,itemId,slot){const item=inventory.find(entry=>entry.id===itemId);const check=canEquip(item,slot,state,inventory);if(!check.ok)return check;Object.keys(state.equipped).forEach(key=>{if(state.equipped[key]===itemId)state.equipped[key]=null;});state.equipped[slot]=itemId;return{ok:true};}
export function unequipItem(state,itemId){Object.keys(state.equipped).forEach(slot=>{if(state.equipped[slot]===itemId)state.equipped[slot]=null;});}
export function useItem(item){if(item.uses){if(item.uses.current<1)return{ok:false,reason:"No charges remain."};item.uses.current-=1;return{ok:true,text:`${item.uses.current}/${item.uses.max} charges remain.`};}if(item.consumable){if(item.consumable.count<1)return{ok:false,reason:"None remain."};item.consumable.count-=1;return{ok:true,text:`${item.consumable.count} remain.`};}return{ok:false,reason:"This item has no tracked use."};}
