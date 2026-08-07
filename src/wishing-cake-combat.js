const attack = (id, label, attackBonus, damage, extra = {}) => ({ id, label, kind:"attack", icon:"⚔", attackBonus, damage, ...extra });
const save = (id, label, ability, dc, damage = [], extra = {}) => ({ id, label, kind:"save", icon:"◆", save:{ ability, dc }, damage, ...extra });
const check = (id, label, ability, skill, dc, extra = {}) => ({ id, label, kind:"check", icon:"◇", check:{ ability, skill, dc }, ...extra });

export const wishingCakeCombatRules = Object.freeze({
  priest:Object.freeze({
    initiativeModifier:2,
    shortcuts:[
      attack("ribbon-lash","Ribbon Lash",4,[{ dice:"1d8+2", type:"slashing" }],{ reach:"10 ft.", rider:"Target cannot take reactions until the start of its next turn." }),
      save("surprise-inside","Surprise Inside","dexterity",12,[{ dice:"2d6", type:"chosen cold, fire, or thunder" }],{ area:"10-ft. cone", halfOnSave:true, usage:"1/Day" })
    ]
  }),
  skeleton:Object.freeze({
    initiativeModifier:1,
    shortcuts:[
      attack("bite","Bite",4,[{ dice:"1d8+3", type:"piercing" },{ dice:"1d4", type:"acid" }],{ reach:"5 ft.", rider:"Target is grappled (escape DC 12)." }),
      Object.freeze({ id:"ceiling-drop", label:"Ceiling Drop", kind:"note", icon:"↘", text:"First round only: move up to climb Speed without provoking, then make Bite; advantage if unnoticed." })
    ]
  }),
  "monster-pinata-mimic":Object.freeze({
    initiativeModifier:2,
    shortcuts:[
      attack("gore","Gore",5,[{ dice:"2d8+3", type:"piercing" }],{ reach:"5 ft." }),
      save("trampling-charge","Trampling Charge","strength",13,[{ dice:"2d6", type:"piercing" }],{ rider:"After a 20-ft. straight move and Gore hit; failed save knocks target prone." }),
      attack("stomp","Stomp",5,[{ dice:"1d10+3", type:"bludgeoning" }],{ reach:"5 ft.", target:"one prone target" }),
      save("candy-burst","Candy Burst","dexterity",13,[{ dice:"3d6", type:"bludgeoning" }],{ area:"15-ft. cone", halfOnSave:true, recharge:"5–6" })
    ]
  }),
  "monster-sepulchral":Object.freeze({
    initiativeModifier:2,
    spellSaveDc:13,
    spellAttackBonus:5,
    shortcuts:[
      attack("staff","Staff",4,[{ dice:"1d6+1", type:"bludgeoning" }],{ reach:"5 ft." }),
      attack("fire-bolt","Fire Bolt",5,[{ dice:"2d10", type:"fire" }],{ range:"120 ft.", attackType:"spell" }),
      Object.freeze({ id:"spell-save", label:"Spell Save", kind:"dc", icon:"✦", text:"Spell save DC 13 · spell attack +5" }),
      Object.freeze({ id:"shield", label:"Shield", kind:"note", icon:"⛨", text:"Reaction: AC becomes 21 against the triggering attack; consumes a 1st-level spell slot." })
    ],
    resources:{ spellSlots:{ 1:4, 2:3, 3:2 } }
  }),
  "hazard-exploding-pinata":Object.freeze({
    shortcuts:[
      save("explosion","Explosion","dexterity",13,[{ dice:"2d6", type:"chosen cold, fire, or thunder" }],{ area:"10-ft. radius", halfOnSave:true }),
      check("disarm","Safe String Removal","dexterity","sleightOfHand",12,{ action:"Action" })
    ]
  }),
  "hazard-wrapping-machine":Object.freeze({
    shortcuts:[
      attack("shear","Shear",5,[{ dice:"2d6", type:"slashing" }],{ rider:"A hit also records one skill-challenge failure." }),
      Object.freeze({ id:"challenge-dc", label:"Challenge DC", kind:"dc", icon:"◇", text:"DC 13 appropriate ability or tool check" })
    ]
  }),
  "hazard-wish-circle":Object.freeze({
    shortcuts:[
      check("erase-arcana","Erase Rune","intelligence","arcana",13,{ action:"Action" }),
      check("erase-sleight","Erase Rune","dexterity","sleightOfHand",13,{ action:"Action" })
    ]
  })
});
