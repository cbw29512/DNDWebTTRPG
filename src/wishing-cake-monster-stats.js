// Canonical, rules-math-checked monster data for The Wishing Cake.
// These creatures are adventure homebrew. "Correct" means the displayed stat block,
// ability math, proficiency bonus, saves/skills, attack bonuses, damage modifiers,
// DCs, and combat shortcuts all agree with one authoritative record.

const freeze = value => Object.freeze(value);
const attack = (id,label,attackBonus,damage,extra={}) => freeze({id,label,kind:'attack',icon:'⚔',attackBonus,damage,...extra});
const save = (id,label,ability,dc,damage=[],extra={}) => freeze({id,label,kind:'save',icon:'◆',save:{ability,dc},damage,...extra});

export const wishingCakeMonsterStats = freeze({
  priest: freeze({
    dmFace: freeze({
      sizeType:'Small construct, unaligned',
      proficiencyBonus:'+2',
      ac:14,
      hp:'18 (4d6 + 4)',
      speed:'25 ft.',
      abilities:'STR 10 (+0), DEX 14 (+2), CON 12 (+1), INT 3 (-4), WIS 10 (+0), CHA 6 (-2)',
      saves:'Dex +4',
      skills:'—',
      damageResistances:'—',
      damageImmunities:'Poison',
      conditionImmunities:'Charmed, Exhaustion, Poisoned',
      senses:'darkvision 60 ft., passive Perception 10',
      languages:'—',
      challenge:'1/2 (100 XP; PB +2)',
      traits:['False Appearance. While motionless, it is indistinguishable from an ordinary wrapped present.'],
      actions:[
        'Ribbon Lash. Melee Weapon Attack: +4 to hit, reach 10 ft., one target. Hit: 6 (1d8 + 2) slashing damage, and the target cannot take reactions until the start of its next turn.',
        'Surprise Inside (1/Day). Each creature in a 10-foot cone makes a DC 12 Dexterity save, taking 7 (2d6) cold, fire, or thunder damage on a failure, or half as much on a success.'
      ],
      morale:'Surrenders if shown genuine kindness after being reduced to 6 HP or fewer.'
    }),
    combat: freeze({
      initiativeModifier:2,
      shortcuts: freeze([
        attack('ribbon-lash','Ribbon Lash',4,[{dice:'1d8+2',type:'slashing'}],{reach:'10 ft.',rider:'Target cannot take reactions until the start of its next turn.'}),
        save('surprise-inside','Surprise Inside','dexterity',12,[{dice:'2d6',type:'chosen cold, fire, or thunder'}],{area:'10-ft. cone',halfOnSave:true,usage:'1/Day'})
      ])
    })
  }),

  skeleton: freeze({
    dmFace: freeze({
      sizeType:'Medium monstrosity (shapechanger), unaligned',
      proficiencyBonus:'+2',
      ac:13,
      hp:'27 (5d8 + 5)',
      speed:'15 ft., climb 15 ft.',
      abilities:'STR 15 (+2), DEX 12 (+1), CON 13 (+1), INT 5 (-3), WIS 13 (+1), CHA 8 (-1)',
      saves:'—',
      skills:'Stealth +5 (expertise)',
      damageResistances:'—',
      damageImmunities:'Acid',
      conditionImmunities:'—',
      senses:'darkvision 60 ft., passive Perception 11',
      languages:'—',
      challenge:'1 (200 XP; PB +2)',
      traits:[
        'False Appearance. While motionless, it is indistinguishable from a decorative paper plate.',
        'Adhesive. A creature hit by Bite is grappled (escape DC 12). Until the grapple ends, the mimic cannot bite another target.'
      ],
      actions:[
        'Bite. Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage plus 2 (1d4) acid damage.',
        'Ceiling Drop (First Round Only). The mimic moves up to its climb speed without provoking opportunity attacks and makes one Bite attack. It has advantage if the target did not notice it.'
      ],
      morale:'At 7 HP or fewer, it flattens itself and attempts to hide rather than pursue.'
    }),
    combat: freeze({
      initiativeModifier:1,
      shortcuts: freeze([
        attack('bite','Bite',4,[{dice:'1d8+2',type:'piercing'},{dice:'1d4',type:'acid'}],{reach:'5 ft.',rider:'Target is grappled (escape DC 12).'}),
        freeze({id:'ceiling-drop',label:'Ceiling Drop',kind:'note',icon:'↘',text:'First round only: move up to climb Speed without provoking, then make Bite; advantage if unnoticed.'})
      ])
    })
  }),

  'monster-pinata-mimic': freeze({
    dmFace: freeze({
      sizeType:'Large monstrosity (shapechanger), unaligned',
      proficiencyBonus:'+2',
      ac:14,
      hp:'55 for four characters; 70 for five or six',
      speed:'40 ft.',
      abilities:'STR 17 (+3), DEX 14 (+2), CON 13 (+1), INT 5 (-3), WIS 12 (+1), CHA 10 (+0)',
      saves:'Dex +4',
      skills:'Perception +3',
      damageResistances:'—',
      damageImmunities:'—',
      conditionImmunities:'—',
      senses:'darkvision 60 ft., passive Perception 13',
      languages:'—',
      challenge:'Adventure homebrew, approximately CR 3 (PB +2); use scene HP scaling',
      traits:[
        'Paper Stride. Shredded-paper terrain does not cost it extra movement.',
        'Trampling Charge. If it moves at least 20 feet straight toward a creature and hits with Gore, the target takes an extra 7 (2d6) piercing damage and must succeed on a DC 13 Strength save or fall prone.'
      ],
      actions:[
        'Gore. Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 12 (2d8 + 3) piercing damage.',
        'Stomp. Melee Weapon Attack: +5 to hit, reach 5 ft., one prone target. Hit: 8 (1d10 + 3) bludgeoning damage.',
        'Candy Burst (Recharge 5–6). Creatures in a 15-foot cone make a DC 13 Dexterity save, taking 10 (3d6) bludgeoning damage on a failure, or half as much on a success.'
      ],
      morale:'At half hit points, it can be calmed using the scene’s noncombat challenge.'
    }),
    combat: freeze({
      initiativeModifier:2,
      shortcuts: freeze([
        attack('gore','Gore',5,[{dice:'2d8+3',type:'piercing'}],{reach:'5 ft.'}),
        save('trampling-charge','Trampling Charge','strength',13,[{dice:'2d6',type:'piercing'}],{rider:'After a 20-ft. straight move and Gore hit; failed save knocks target prone.'}),
        attack('stomp','Stomp',5,[{dice:'1d10+3',type:'bludgeoning'}],{reach:'5 ft.',target:'one prone target'}),
        save('candy-burst','Candy Burst','dexterity',13,[{dice:'3d6',type:'bludgeoning'}],{area:'15-ft. cone',halfOnSave:true,recharge:'5–6'})
      ])
    })
  }),

  'monster-sepulchral': freeze({
    dmFace: freeze({
      sizeType:'Small humanoid (halfling), neutral',
      proficiencyBonus:'+2',
      ac:'13 (16 with Mage Armor; 21 against the triggering attack with Shield)',
      hp:'58 (13d6 + 13)',
      speed:'25 ft.',
      abilities:'STR 8 (-1), DEX 14 (+2), CON 12 (+1), INT 16 (+3), WIS 12 (+1), CHA 14 (+2)',
      saves:'Con +3, Int +5, Wis +3',
      skills:'Arcana +5, Deception +4, Insight +3',
      damageResistances:'—',
      damageImmunities:'—',
      conditionImmunities:'—',
      senses:'passive Perception 11',
      languages:'Common, Halfling',
      challenge:'Adventure homebrew, approximately CR 3 (PB +2) before allies and ritual pressure',
      spellcasting:'5th-level spellcaster; Intelligence is the spellcasting ability (spell save DC 13, +5 to hit). Slots: 1st level 4, 2nd level 3, 3rd level 2.',
      spells:[
        'Cantrips (at will): fire bolt, mage hand, minor illusion, prestidigitation',
        '1st level: mage armor, magic missile, shield',
        '2nd level: misty step, suggestion',
        '3rd level: counterspell, hypnotic pattern'
      ],
      traits:[
        'Brave. Advantage on saving throws against being frightened.',
        'Halfling Nimbleness. Can move through the space of a creature larger than him.',
        'Lucky. When Sepulchral rolls a 1 on a d20 for an attack roll, ability check, or saving throw, he rerolls the die and uses the new roll.'
      ],
      actions:[
        'Staff. Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 2 (1d6 − 1) bludgeoning damage.',
        'Fire Bolt. Ranged Spell Attack: +5 to hit, range 120 ft., one target. Hit: 11 (2d10) fire damage.'
      ],
      tactics:'Mage armor is already active. Use suggestion to create a clear, reasonable course such as “carry the crown away from the circle.” Use hypnotic pattern only when it will not remove most of the party from play. Save shield for a meaningful hit and misty step to reposition.',
      bloodied:'At 29 HP or fewer, pause for parley before continuing combat.',
      defeat:'At 0 HP he falls unconscious and his staff becomes a wooden party horn; death is not required for victory.'
    }),
    combat: freeze({
      initiativeModifier:2,
      spellSaveDc:13,
      spellAttackBonus:5,
      shortcuts: freeze([
        attack('staff','Staff',1,[{dice:'1d6-1',type:'bludgeoning'}],{reach:'5 ft.'}),
        attack('fire-bolt','Fire Bolt',5,[{dice:'2d10',type:'fire'}],{range:'120 ft.',attackType:'spell'}),
        freeze({id:'spell-save',label:'Spell Save',kind:'dc',icon:'✦',text:'Spell save DC 13 · spell attack +5'}),
        freeze({id:'shield',label:'Shield',kind:'note',icon:'⛨',text:'Reaction: +5 AC until start of next turn, including against triggering attack; consumes a 1st-level spell slot.'})
      ]),
      resources:freeze({spellSlots:freeze({1:4,2:3,3:2})})
    })
  })
});

export const wishingCakeMonsterIds = freeze(Object.keys(wishingCakeMonsterStats));
