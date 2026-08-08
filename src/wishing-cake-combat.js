import { wishingCakeMonsterStats } from './wishing-cake-monster-stats.js';

const attack = (id, label, attackBonus, damage, extra = {}) => ({ id, label, kind:"attack", icon:"⚔", attackBonus, damage, ...extra });
const save = (id, label, ability, dc, damage = [], extra = {}) => ({ id, label, kind:"save", icon:"◆", save:{ ability, dc }, damage, ...extra });
const check = (id, label, ability, skill, dc, extra = {}) => ({ id, label, kind:"check", icon:"◇", check:{ ability, skill, dc }, ...extra });

/*
 * Monster combat data has exactly one authority: wishing-cake-monster-stats.js.
 * Do not duplicate monster attack bonuses, damage dice, AC, spell DCs, or
 * resource values here. This module only adds non-monster adventure hazards.
 */
export const wishingCakeCombatRules = Object.freeze({
  priest:wishingCakeMonsterStats.priest.combat,
  skeleton:wishingCakeMonsterStats.skeleton.combat,
  "monster-pinata-mimic":wishingCakeMonsterStats["monster-pinata-mimic"].combat,
  "monster-sepulchral":wishingCakeMonsterStats["monster-sepulchral"].combat,
  "hazard-exploding-pinata":Object.freeze({
    shortcuts:Object.freeze([
      save("explosion","Explosion","dexterity",13,[{ dice:"2d6", type:"chosen cold, fire, or thunder" }],{ area:"10-ft. radius", halfOnSave:true }),
      check("disarm","Safe String Removal","dexterity","sleightOfHand",12,{ action:"Action" })
    ])
  }),
  "hazard-wrapping-machine":Object.freeze({
    shortcuts:Object.freeze([
      attack("shear","Shear",5,[{ dice:"2d6", type:"slashing" }],{ rider:"A hit also records one skill-challenge failure." }),
      Object.freeze({ id:"challenge-dc", label:"Challenge DC", kind:"dc", icon:"◇", text:"DC 13 appropriate ability or tool check" })
    ])
  }),
  "hazard-wish-circle":Object.freeze({
    shortcuts:Object.freeze([
      check("erase-arcana","Erase Rune","intelligence","arcana",13,{ action:"Action" }),
      check("erase-sleight","Erase Rune","dexterity","sleightOfHand",13,{ action:"Action" })
    ])
  })
});
