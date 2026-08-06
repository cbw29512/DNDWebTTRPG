import { AUDIENCES, CARD_TYPES } from "./schema.js";

const card = (id, title, type, playerFace, dmFace, extra = {}) => ({
  id,
  title,
  type,
  audience: AUDIENCES.EVERYONE,
  revealed: false,
  playerFace,
  dmFace,
  ...extra
});

const art = (artKey, artAlt) => ({ artKey, artAlt, artRequired: true });

export const wishingCakeAuditedRules = Object.freeze([
  card("scene-stolen-wish", "The Stolen Wish", CARD_TYPES.SCENE,
    { summary: "Sepulchral steals Wendy's cake; animated presents cover his escape." },
    {
      phase: "Opening roleplay, theft, then combat",
      setup: "Ask every player what their character brought for Wendy. Wendy may keep the exact wish private.",
      trigger: "When Wendy leans toward the candles, Sepulchral appears, marks the cake with violet magic, and vanishes with it.",
      encounter: "Two Animated Presents attack. For a four-character party, use one if the group is inexperienced or already depleted.",
      failForward: "The theft cannot be prevented, but a quick successful action leaves a clue: green thread, violet wax, or Sepulchral's sigil.",
      transition: "After the presents are defeated, surrendered, or bypassed, Martha opens the cellar. The marked wrapping paper activates a one-way passage that deposits the party inside the Holding Cells.",
      boardInstructions: "Location Bramblewick; Site Wishing Cake Inn; Area Grand Celebration Hall; four opening NPC cards; two Animated Present cards; Birthday Spark Candle Tokens in Treasure/Rewards. Do not place Sepulchral's boss card yet."
    },
    art("scene-stolen-wish", "A green-robed halfling wizard stealing a glowing birthday cake while ribbons and violet smoke spiral through a warm inn.")),

  card("scene-holding-cells", "Escape and Ceiling Ambush", CARD_TYPES.SCENE,
    { summary: "Escape the cage and survive a Paper Plate Mimic ambush." },
    {
      objective: "Open the cage and reach the western passage.",
      lock: "DC 12 Dexterity with thieves' tools; DC 15 with improvised picks; DC 16 Strength (Athletics) to wrench it open.",
      failForward: "Three failed lock attempts loosen a hinge. The next attempt succeeds, but the mimic gains surprise against characters who did not notice it.",
      perception: "DC 13 Wisdom (Perception) notices adhesive strands and prevents surprise.",
      scaling: "Four characters: one mimic. Five or six characters: add a second mimic over the western threshold.",
      transition: "The western passage opens into the Hall of Rejected Wishes.",
      boardInstructions: "Old Celebration Halls / Holding Cells / one Paper Plate Mimic. Add a second copy only for five or six characters."
    },
    art("scene-holding-cells", "An iron cage in a cold stone room while a smiling paper plate mimic clings to the ceiling above the door.")),

  card("scene-wish-hall", "Carry the Rejected Wishes", CARD_TYPES.SCENE,
    { summary: "Explore floating wishes and learn that shared hope strengthens magic." },
    {
      safeWish: "DC 13 Intelligence (Arcana or Investigation). Success grants either 1d6 temporary hit points or advantage on one saving throw before the next long rest.",
      bitterWish: "A careless touch requires a DC 12 Wisdom save. On a failure, the creature is frightened until the end of its next turn.",
      coreClue: "A wish freely carried by friends cannot be claimed by force.",
      routes: "North to the optional Soul Cellar, or west toward the Piñata Pen.",
      failForward: "The core clue is always learned. Checks determine only whether the party also gains a boon or brief complication.",
      boardInstructions: "Old Celebration Halls / Hall of Rejected Wishes. No creature or hazard cards are placed initially."
    },
    art("scene-wish-hall", "A long gallery filled with luminous glass bubbles, each containing a half-seen birthday memory or rejected wish.")),

  card("scene-soul-cellar", "Free the Stolen Souls", CARD_TYPES.SCENE,
    { summary: "Release trapped souls and gain leverage for the finale." },
    {
      barrel: "AC 12, 10 hit points, immune poison and psychic. A careful opening uses DC 12 Strength (Athletics) or thieves' tools.",
      recklessOpening: "Breaking a barrel violently releases cold: creatures within 5 feet make a DC 12 Constitution save, taking 1d6 cold damage on a failure.",
      clues: ["The drum sequence is D, D, E, D, G, F.", "Sepulchral never received a birthday celebration.", "The ritual succeeds only after every candle goes dark."],
      reward: "After three souls are freed, the party gains Soul Chorus: once in the finale, force Sepulchral to reroll a successful saving throw.",
      failForward: "Merrit provides the emotional clue even if the party cannot open three barrels; the mechanical reward requires three releases.",
      boardInstructions: "Old Celebration Halls / Soul Cellar / Merrit Vale in NPCs. Activate the Free the Stolen Souls side quest."
    },
    art("scene-soul-cellar", "A candlelit cellar of brass-bound barrels with pale, hopeful faces visible beneath the wood grain.")),

  card("scene-pinata-pen", "The Piñata Stampede", CARD_TYPES.SCENE,
    { summary: "Defeat, calm, or bypass a living unicorn piñata amid explosive decorations." },
    {
      terrain: "Shredded paper is difficult terrain for creatures other than the Piñata Mimic.",
      initiative20: "One visible piñata begins glowing. At the next initiative count 20 it explodes unless its string is cut (AC 10, 5 HP). Only one string glows at a time.",
      noncombat: "A character who spends an action offering food, a toy, or sincere kindness may attempt DC 13 Wisdom (Animal Handling) or Charisma (Persuasion). Two successes before two failures calm the mimic; damage gives the next check disadvantage.",
      scaling: "Use 55 HP for four characters and 70 HP for five or six. Remove Candy Burst for a very inexperienced group.",
      reward: "The party recovers three pieces of Healing Candy after resolving the encounter.",
      boardInstructions: "Old Celebration Halls / Piñata Pen / Piñata Mimic in Monsters / Exploding Piñata in Traps-Hazards."
    },
    art("scene-pinata-pen", "A painted unicorn piñata charging through a colorful room as candy and glowing pull strings scatter around it.")),

  card("scene-wrapping-room", "Cross the Endless Wrapping Machine", CARD_TYPES.SCENE,
    { summary: "Cross a moving conveyor by earning six progress before three failures." },
    {
      structure: "Run in initiative order. The party needs six total progress before three total failures. Each character chooses one approach per round.",
      standardCheck: "DC 13 Strength (Athletics), Dexterity (Acrobatics), Intelligence with thieves' tools, or another justified approach. A success earns one progress.",
      failure: "A failed check triggers a +5 shear attack for 2d6 slashing damage and adds one failure.",
      conveyor: "At initiative 20, unsecured creatures move 5 feet east. A secured rope grants advantage on movement checks.",
      escalation: "Beginning in round 3, each unsecured creature makes a DC 12 Dexterity save at initiative 20 or becomes restrained until it or an adjacent creature uses an action to free it.",
      failForward: "At three failures the machine wraps the party in protective padding and dumps them at the exit. Each character takes 1d6 bludgeoning damage, but the adventure continues.",
      reward: "The Keeper of the Wish Crown rests beside the disabled exit mechanism.",
      boardInstructions: "Old Celebration Halls / Wrapping Room / Endless Wrapping Machine in Traps-Hazards / Keeper of the Wish Crown in Treasure-Rewards."
    },
    art("scene-wrapping-room", "A huge magical gift-wrapping conveyor with snapping ribbons, spinning paper rolls, and swinging silver shears.")),

  card("scene-cult-room", "The Birthday Melody", CARD_TYPES.SCENE,
    { summary: "Play the first phrase of Happy Birthday and answer the age riddle." },
    {
      drumAnswer: "D, D, E, D, G, F.",
      clueAccess: "Lute demonstrates the melody in the opening. A freed soul repeats it in the Soul Cellar. A DC 12 Intelligence (Investigation) check reveals worn drumheads in the same order.",
      riddleAnswer: "Age or a birthday.",
      wrongAnswers: "Each wrong answer awakens one Animated Present, maximum two. On the third total wrong answer, the door opens automatically and Sepulchral gains 8 temporary hit points in the finale.",
      shortRest: "A short rest is allowed, but Sepulchral gains 8 temporary hit points and the Wish Circle begins advancing one round earlier.",
      preparation: "DC 12 Investigation finds chalk and candle wax. Carrying them grants advantage on the first attempt to erase a Wish Circle rune.",
      boardInstructions: "Old Celebration Halls / Birthday Cult Room. Begin with no monster cards. Add one Animated Present card for each wrong answer, maximum two."
    },
    art("scene-cult-room", "Seven painted drums beneath a stone face wearing a party hat, with a magical metronome ticking beside a sealed door.")),

  card("scene-cake-chamber", "Claim of the Wish", CARD_TYPES.SCENE,
    { summary: "Return Wendy's choice through negotiation, interruption, surrender, or combat." },
    {
      openingExchange: "Before initiative, allow one sincere exchange. DC 14 Charisma (Persuasion), with advantage if three souls were freed or the party meaningfully engaged with a rejected wish.",
      memories: "Each distinct sincere memory, gift, apology, or invitation offered during the scene lowers the next peaceful-resolution DC by 1, minimum 10. A character can contribute only once.",
      peacefulTerms: "Sepulchral returns the cake, releases every soul, apologizes to Wendy, and accepts that the wish remains hers.",
      combatScaling: "Four characters: Sepulchral and one Animated Present. Five or six characters: add a second Animated Present. If Sepulchral received 8 temporary HP, place it visibly on his card.",
      cake: "AC 10, 20 HP, immune poison and psychic. At 0 HP the ritual ends and everyone returns home, but no magical wish remains.",
      chandelier: "AC 12, 8 HP. When dropped, creatures in a 10-foot-radius area make a DC 13 Dexterity save, taking 2d6 bludgeoning and fire damage on a failure, half on success.",
      bloodiedParley: "At 29 HP or fewer, Sepulchral pleads. Peace may be attempted again at DC 12 before memory reductions.",
      ending: "After victory or reconciliation, Wendy decides whether to make, share, postpone, or keep the wish private.",
      boardInstructions: "Old Celebration Halls / Cake Chamber / Sepulchral Boss plus one Animated Present in Monsters / Wish Circle Clock in Traps-Hazards / Stolen Present Table and Birthday Spark Tokens in Treasure-Rewards. Do not also place the Sepulchral NPC card."
    },
    art("scene-cake-chamber", "A lonely green-robed halfling wizard guarding a glowing cake inside a chalk wish circle beneath blazing chandeliers.")),

  card("priest", "Animated Present", CARD_TYPES.MONSTER,
    { summary: "A brightly wrapped gift attacks with razor ribbon and a burst of elemental magic." },
    {
      sizeType: "Small construct, unaligned",
      ac: 14,
      hp: "18 (4d6 + 4)",
      speed: "25 ft.",
      abilities: "STR 10 (+0), DEX 14 (+2), CON 12 (+1), INT 3 (-4), WIS 10 (+0), CHA 6 (-2)",
      saves: "Dex +4",
      immunities: "poison; charmed, exhaustion, poisoned",
      senses: "darkvision 60 ft., passive Perception 10",
      challenge: "1/2 (100 XP)",
      traits: ["False Appearance. While motionless, it is indistinguishable from an ordinary wrapped present."],
      actions: ["Ribbon Lash. Melee Weapon Attack: +4 to hit, reach 10 ft., one target. Hit: 6 (1d8 + 2) slashing damage, and the target cannot take reactions until the start of its next turn.", "Surprise Inside (1/Day). Each creature in a 10-foot cone makes a DC 12 Dexterity save, taking 7 (2d6) cold, fire, or thunder damage on a failure, or half on a success."],
      morale: "Surrenders if shown genuine kindness after being reduced to 6 HP or fewer."
    },
    art("animated-present", "A brightly wrapped magical present hopping forward while razor-sharp ribbon lashes from beneath its bow.")),

  card("skeleton", "Paper Plate Mimic", CARD_TYPES.MONSTER,
    { summary: "A smiling paper plate mimic drops from the ceiling and glues prey in place." },
    {
      sizeType: "Medium monstrosity (shapechanger), unaligned",
      ac: 13,
      hp: "27 (5d8 + 5)",
      speed: "15 ft., climb 15 ft.",
      abilities: "STR 15 (+2), DEX 12 (+1), CON 13 (+1), INT 5 (-3), WIS 13 (+1), CHA 8 (-1)",
      skills: "Stealth +5",
      immunities: "acid",
      senses: "darkvision 60 ft., passive Perception 11",
      challenge: "1 (200 XP)",
      traits: ["False Appearance. While motionless, it is indistinguishable from a decorative paper plate.", "Adhesive. A creature hit by Bite is grappled (escape DC 12). Until the grapple ends, the mimic cannot bite another target."],
      actions: ["Bite. Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage plus 2 (1d4) acid damage.", "Ceiling Drop (First Round Only). The mimic moves up to its climb speed without provoking opportunity attacks and makes one Bite attack. It has advantage if the target did not notice it."],
      morale: "At 7 HP or fewer, it flattens itself and attempts to hide rather than pursue."
    },
    art("paper-plate-mimic", "A smiling paper plate peeling from a stone ceiling to reveal sticky tendrils and rows of jagged teeth.")),

  card("monster-pinata-mimic", "Piñata Mimic", CARD_TYPES.MONSTER,
    { summary: "A living unicorn piñata charges, stomps, and bursts with dangerous candy." },
    {
      sizeType: "Large monstrosity (shapechanger), unaligned",
      ac: 14,
      hp: "55 for four characters; 70 for five or six",
      speed: "40 ft.",
      abilities: "STR 17 (+3), DEX 14 (+2), CON 13 (+1), INT 5 (-3), WIS 12 (+1), CHA 10 (+0)",
      saves: "Dex +4",
      skills: "Perception +3",
      senses: "darkvision 60 ft., passive Perception 13",
      challenge: "Approximately CR 3; use scene scaling",
      traits: ["Paper Stride. Shredded-paper terrain does not cost it extra movement.", "Trampling Charge. If it moves at least 20 feet straight toward a creature and hits with Gore, the target takes an extra 7 (2d6) piercing damage and must succeed on a DC 13 Strength save or fall prone."],
      actions: ["Gore. Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 12 (2d8 + 3) piercing damage.", "Stomp. Melee Weapon Attack: +5 to hit, reach 5 ft., one prone target. Hit: 8 (1d10 + 3) bludgeoning damage.", "Candy Burst (Recharge 5-6). Creatures in a 15-foot cone make a DC 13 Dexterity save, taking 10 (3d6) bludgeoning damage on a failure, or half on a success."],
      morale: "At half hit points, it can be calmed using the scene's noncombat challenge."
    },
    art("pinata-mimic", "A large unicorn piñata with a fierce painted face charging through exploding candy and shredded paper.")),

  card("monster-sepulchral", "Sepulchral — Boss", CARD_TYPES.MONSTER,
    { summary: "A lonely halfling wizard uses control magic and the Wish Circle to claim Wendy's celebration." },
    {
      sizeType: "Small humanoid (halfling), neutral",
      ac: "13 (16 with mage armor; 21 with shield)",
      hp: "58 (13d6 + 13)",
      speed: "25 ft.",
      abilities: "STR 8 (-1), DEX 14 (+2), CON 12 (+1), INT 16 (+3), WIS 12 (+1), CHA 14 (+2)",
      saves: "Con +3, Int +5, Wis +3",
      skills: "Arcana +5, Deception +4, Insight +3",
      senses: "passive Perception 11",
      challenge: "Approximately CR 3 before allies and ritual pressure",
      spellcasting: "5th-level spellcaster; spell save DC 13, +5 to hit. Slots: 1st level 4, 2nd level 3, 3rd level 2.",
      spells: ["Cantrips (at will): fire bolt, mage hand, minor illusion, prestidigitation", "1st level: mage armor, magic missile, shield", "2nd level: misty step, suggestion", "3rd level: counterspell, hypnotic pattern"],
      traits: ["Brave. Advantage on saves against frightened.", "Halfling Nimbleness. Can move through the space of a creature larger than him.", "Lucky (1/Turn). When he rolls a 1 on a d20, reroll it."],
      actions: ["Staff. Melee Weapon Attack: +4 to hit, reach 5 ft. Hit: 4 (1d6 + 1) bludgeoning damage.", "Fire Bolt. Ranged Spell Attack: +5 to hit, range 120 ft. Hit: 11 (2d10) fire damage."],
      tactics: "Mage armor is already active. Use suggestion to create a clear, reasonable course such as 'carry the crown away from the circle.' Use hypnotic pattern only when it will not remove most of the party from play. Save shield for a meaningful hit and misty step to reposition.",
      bloodied: "At 29 HP or fewer, pause for parley before continuing combat.",
      defeat: "At 0 HP he falls unconscious and his staff becomes a wooden party horn; death is not required for victory."
    },
    art("sepulchral-boss", "A small green-robed halfling wizard gripping an oversized staff inside a glowing birthday wish circle.")),

  card("hazard-exploding-pinata", "Exploding Piñata", CARD_TYPES.HAZARD,
    { summary: "A visibly glowing pull string warns of an imminent magical blast." },
    {
      trigger: "At initiative 20, mark one intact piñata. At the next initiative 20 it explodes unless its support string is destroyed.",
      counterplay: "Support string AC 10, 5 HP, immune poison and psychic. A character adjacent to it may also use an action and succeed on DC 12 Dexterity (Sleight of Hand) to safely remove it.",
      effect: "Creatures within 10 feet make a DC 13 Dexterity save, taking 7 (2d6) cold, fire, or thunder damage on a failure, or half on a success. Roll or choose the damage type. The Piñata Mimic is affected normally.",
      limit: "Only one string glows at a time; use no more than three explosions in the encounter."
    },
    art("exploding-pinata", "A colorful hanging piñata with a pull string glowing like a fuse and magical sparks falling around it.")),

  card("hazard-wrapping-machine", "Endless Wrapping Machine", CARD_TYPES.HAZARD,
    { summary: "A structured six-progress skill challenge with visible damage and fail-forward rules." },
    {
      objective: "Earn six progress before three failures.",
      check: "DC 13 with an appropriate ability or tool. Repeating the identical method after it has already succeeded is made with disadvantage unless circumstances changed.",
      failure: "+5 shear attack; hit deals 7 (2d6) slashing damage and records one failure.",
      initiative20: "Move each unsecured creature 5 feet east; beginning round 3, DC 12 Dexterity save or restrained.",
      restraint: "A restrained creature or adjacent ally can use an action to end the condition.",
      failForward: "At three failures, each character takes 1d6 bludgeoning damage and is delivered safely to the exit."
    },
    art("wrapping-machine", "An enchanted gift-wrapping conveyor with snapping ribbon, huge paper rolls, and swinging metal shears.")),

  card("hazard-wish-circle", "Wish Circle Clock", CARD_TYPES.HAZARD,
    { summary: "A three-step ritual clock that begins late enough to permit meaningful counterplay." },
    {
      setup: "Place three visible clock tokens.",
      advance: "Starting at initiative 20 of round 3, advance one token. If the party rested in the Cult Room, begin at round 2 instead.",
      eraseRune: "A creature adjacent to the circle uses an action and succeeds on DC 13 Intelligence (Arcana) or Dexterity (Sleight of Hand) to erase a rune. Chalk and wax from the Cult Room grant advantage on the first attempt. A success removes one advance, minimum zero.",
      completion: "At three advances, Sepulchral attempts the wish. Every conscious hero makes a DC 13 Wisdom save. On a success, the hero immediately takes one action before the wish resolves. On a failure, the hero is charmed until damaged or until another creature uses an action to confront the false celebration.",
      interruption: "Reducing Sepulchral to 0 HP, convincing him to surrender, extinguishing or removing the cake, or erasing the final active rune ends the ritual."
    },
    art("wish-circle", "A glowing chalk circle around a birthday cake with three runes brightening as candle flames bend inward.")),

  card("lantern", "Birthday Spark Candle Tokens", CARD_TYPES.ITEM,
    { summary: "Wendy holds three tokens and may spend one after any hero fails a d20 test to add 1d4." },
    {
      rule: "After a creature fails an attack roll, ability check, or saving throw, Wendy may spend one token to add 1d4, potentially changing the result.",
      limits: "Only one Birthday Spark token may affect a roll, and no more than one token may be spent in a scene.",
      recharge: "Restore all three tokens on entering the Cake Chamber.",
      purpose: "Keeps Wendy central without making every solution depend on her player."
    },
    { ...art("birthday-spark-tokens", "Three warm candle-flame tokens glowing beside a small birthday cake."), uses: { max: 3, label: "candle tokens" } }),

  card("item-candy", "Healing Candy", CARD_TYPES.ITEM,
    { summary: "Three pieces of enchanted candy, each restoring 1d4 + 1 hit points as a bonus action." },
    {
      rule: "As a bonus action, eat one piece to regain 1d4 + 1 hit points.",
      quantity: "The card begins with three pieces. A creature may eat any number over the adventure, one per bonus action.",
      source: "Recovered after resolving the Piñata Pen."
    },
    { ...art("healing-candy", "Three brightly wrapped pieces of magical candy glowing with restorative light."), uses: { max: 3, label: "pieces" } })
]);
