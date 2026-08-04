import { AUDIENCES, CARD_TYPES } from "./schema.js";

const everyone = (id, title, type, revealed, playerFace, dmFace, extra = {}) => ({
  id, title, type, audience: AUDIENCES.EVERYONE, revealed, playerFace, dmFace, ...extra
});

export const wishingCakeCards = [
  everyone("location", "The Wishing Cake Inn", CARD_TYPES.LOCATION, true,
    { readAloud: "Amber lanterns glow above curling ribbons while cinnamon, honey, and fresh bread perfume the crowded inn. A many-tiered birthday cake waits beneath a glass dome.", summary: "A warm birthday inn built around magical celebrations." },
    { readAloud: "Amber lanterns glow above curling ribbons while cinnamon, honey, and fresh bread perfume the crowded inn. A many-tiered birthday cake waits beneath a glass dome.", purpose: "Adventure hub and opening celebration.", exits: "The old celebration halls lie beneath the locked cellar.", theme: "Warm, whimsical, lightly spooky." }),

  everyone("room", "Opening: The Stolen Wish", CARD_TYPES.ROOM, true,
    { readAloud: "The candles brighten as Wendy draws breath. Smoke rises against the ceiling, folds into a green-robed halfling, and the words THE WISH BELONGS TO ME echo inside every mind. Sepulchral sweeps his staff toward the table. He and the cake vanish as the room twists into darkness.", summary: "Sepulchral steals Wendy's cake and final birthday wish." },
    { readAloud: "The candles brighten as Wendy draws breath. Smoke rises against the ceiling, folds into a green-robed halfling, and the words THE WISH BELONGS TO ME echo inside every mind. Sepulchral sweeps his staff toward the table. He and the cake vanish as the room twists into darkness.", setup: "Before the theft, ask every player what gift, food, memory, or wish they brought for Wendy. Ask Wendy what she was about to wish for, but allow her to keep the exact wish secret.", transition: "The party appears inside the Holding Cells. The theft cannot be stopped, but a quick action may leave a visible mark on Sepulchral.", spotlight: "The cake and final wish belong to Wendy, but every hero's memories and choices matter." }),

  everyone("room-holding-cells", "Room 1: Holding Cells", CARD_TYPES.ROOM, false,
    { readAloud: "Cold stone presses against your back. You stand inside a narrow iron cage while empty cells gape along the walls. Beyond the bars, a western passage disappears into darkness. Somewhere above comes a faint ceramic scrape.", summary: "Escape the cage and survive the ceiling ambush." },
    { readAloud: "Cold stone presses against your back. You stand inside a narrow iron cage while empty cells gape along the walls. Beyond the bars, a western passage disappears into darkness. Somewhere above comes a faint ceramic scrape.", purpose: "Escape, first ambush, and stolen-wish stakes.", escape: "DC 12 Dexterity with thieves' tools; improvised picks DC 15; DC 16 Athletics to wrench the lock, which alerts both mimics.", hiddenThreats: "Paper Plate Mimic over the cage door; a second over the western threshold for a six-character party.", clues: ["HE NEVER GOT A WISH scratched inside the cage", "Green cloth caught on the lock", "Wendy touching the door creates a spark pointing west"], exit: "Western passage to the Hall of Rejected Wishes." }),

  everyone("room-wish-hall", "Room 2: Hall of Rejected Wishes", CARD_TYPES.ROOM, false,
    { readAloud: "Glass-bright bubbles drift through a long gallery. Within each one, a half-heard birthday wish repeats: a pony that never arrived, a friend who never came, a year someone wanted to forget.", summary: "Explore floating wishes and learn how shared hope changes magic." },
    { readAloud: "Glass-bright bubbles drift through a long gallery. Within each one, a half-heard birthday wish repeats: a pony that never arrived, a friend who never came, a year someone wanted to forget.", purpose: "Exploration, roleplay, and clue delivery.", safeWish: "DC 13 Arcana or Investigation grants a small boon: 1d6 temporary hit points or advantage on the next saving throw.", bitterWish: "Mishandling a bubble calls for a DC 12 Wisdom save or frightened until the end of the next turn.", coreClue: "A wish becomes stronger when friends carry it.", routes: "North to the Soul Cellar; west/south toward the Piñata Pen." }),

  everyone("room-soul-cellar", "Room 3: Soul Cellar", CARD_TYPES.ROOM, false,
    { readAloud: "The cramped chamber is bitterly cold. Barrels bound in tarnished brass fill the shelves. Pale faces swim beneath the wood grain and whisper together: Please. Open us. He took our wishes.", summary: "Free trapped souls and learn the truth about Sepulchral." },
    { readAloud: "The cramped chamber is bitterly cold. Barrels bound in tarnished brass fill the shelves. Pale faces swim beneath the wood grain and whisper together: Please. Open us. He took our wishes.", purpose: "Social encounter, lore, and leverage for the finale.", freeingBarrel: "DC 12 Strength, thieves' tools, or 5 slashing damage. Reckless smashing causes a DC 12 Constitution save or 1d6 cold damage within 5 feet.", information: ["First soul: drum sequence D, D, E, D, G, F", "Second soul: Sepulchral never had a birthday celebration", "Third soul: the wish binds only if he blows out every candle"], reward: "Free three souls to force Sepulchral to reroll one successful saving throw in the finale.", exit: "Dead end; return through Room 2." }),

  everyone("room-pinata-pen", "Room 4: Piñata Pen", CARD_TYPES.ROOM, false,
    { readAloud: "Dozens of piñatas sway from golden cords: dragons, stars, donkeys, castles, and cakes. Candy rattles though the air is still. One pull-string glows like a fuse, and a magnificent unicorn turns one painted eye toward you.", summary: "A colorful combat arena filled with exploding piñatas." },
    { readAloud: "Dozens of piñatas sway from golden cords: dragons, stars, donkeys, castles, and cakes. Candy rattles though the air is still. One pull-string glows like a fuse, and a magnificent unicorn turns one painted eye toward you.", purpose: "Main mid-dungeon combat and candy recovery.", battlefield: "Shredded paper is difficult terrain for everyone except the Piñata Mimic.", strings: "AC 10, 5 HP. Cutting the glowing string prevents the next explosion; a new string glows at initiative 20.", tactics: "Piñata Mimic charges the back line, repositions, and uses explosions to block retreat.", exit: "Western doors to the Wrapping Room." }),

  everyone("room-wrapping", "Room 5: Wrapping Room", CARD_TYPES.ROOM, false,
    { readAloud: "A broad conveyor crawls toward the far doors while giant paper rolls turn on iron spindles. Ribbons lash through the air, and sword-long shears swing above the belt in alternating arcs.", summary: "Cross a moving conveyor while avoiding shears and ribbons." },
    { readAloud: "A broad conveyor crawls toward the far doors while giant paper rolls turn on iron spindles. Ribbons lash through the air, and sword-long shears swing above the belt in alternating arcs.", purpose: "Moving hazard, teamwork, and resource drain.", objective: "Cross six squares east to west in initiative order.", conveyor: "At initiative 20, every creature on the belt moves one square east. Falling into the paper bin deals 1d4 bludgeoning and returns the creature to the start.", safeMovement: "DC 13 Athletics or Acrobatics. Failure stops movement and triggers a +5 shear attack for 2d6 slashing.", smartSolutions: ["Secured rope grants advantage", "Mage Hand jams one spindle for a round", "Two DC 13 thieves' tools successes disable the conveyor"], escalation: "After round 3, DC 12 Dexterity save or restrained by ribbons.", reward: "Keeper of the Wish paper crown for Wendy." }),

  everyone("room-cult", "Room 6: Birthday Cult Room", CARD_TYPES.ROOM, false,
    { readAloud: "Seven drums painted E, F, G, A, B, C, and D line the western wall. A brass metronome ticks by itself. A weeping stone face in a party hat seals the northern door beneath the words: Play what was never sung. Name what always grows.", summary: "Solve the birthday melody and riddle before the finale." },
    { readAloud: "Seven drums painted E, F, G, A, B, C, and D line the western wall. A brass metronome ticks by itself. A weeping stone face in a party hat seals the northern door beneath the words: Play what was never sung. Name what always grows.", purpose: "Music puzzle, birthday riddle, and final preparation.", drumAnswer: "D, D, E, D, G, F.", riddle: "I am given once each year but cannot be bought. I only increase, yet I weigh less than thought. You greet me with a breath that kills a flame. What am I?", answer: "Your age, or a birthday.", wrongAnswer: "Animate one present per wrong answer, maximum three.", restCost: "A short rest lets Sepulchral complete the circle: 12 temporary HP and Claim the Wish available in round 1.", preparation: "DC 12 Investigation finds chalk and wax used to erase a finale rune.", exit: "The northern door opens to the Cake Chamber." }),

  everyone("room-cake-chamber", "Room 7: Cake Chamber", CARD_TYPES.ROOM, false,
    { readAloud: "Three chandeliers blaze above a chamber lined with stolen presents. The birthday cake stands at the center, every candle still burning inside a glowing chalk circle. Sepulchral grips his oversized staff. You had parties. You had friends. You had wishes to waste. I only need one.", summary: "Recover Wendy's wish through empathy, clever play, combat, or all three." },
    { readAloud: "Three chandeliers blaze above a chamber lined with stolen presents. The birthday cake stands at the center, every candle still burning inside a glowing chalk circle. Sepulchral grips his oversized staff. You had parties. You had friends. You had wishes to waste. I only need one.", purpose: "Boss battle or emotional resolution.", negotiation: "Before initiative, one exchange. DC 14 Persuasion; advantage after experiencing a bitter wish or freeing three souls. Each sincere party memory, compliment, or gift lowers Wendy's final DC by 1, minimum 10.", peacefulSuccess: "Sepulchral must return the cake, free the souls, apologize, and accept that the wish remains Wendy's.", combat: "Sepulchral protects the cake, uses Misty Step and Shield, and pleads once bloodied. Peace can be attempted again at DC 12.", cake: "AC 10, 20 HP; immune poison and psychic. Destroying it sends everyone home but grants no wish.", chandeliers: "AC 12, 8 HP; drop in a 10-foot radius, DC 13 Dexterity, 2d6 bludgeoning/fire, half on success.", victory: "Defeat, surrender, or reconciliation leaves the candles burning for Wendy's choice." }),

  everyone("caretaker", "Martha Bramblepot", CARD_TYPES.NPC, true,
    { openingDialogue: "No one celebrates alone under my roof.", summary: "A warm, direct halfling innkeeper who is always feeding someone." },
    { openingDialogue: "No one celebrates alone under my roof.", portrayal: "Warm, direct, always feeding someone.", role: "Halfling innkeeper.", knows: ["The cake disappeared once forty years ago", "She recognizes the Wish Circle symbol", "The sealed cellar leads below"], direction: "Do not follow because the cake is valuable. Follow because someone below has forgotten what a celebration is for." }),

  everyone("npc-boris", "Boris Ironladle", CARD_TYPES.NPC, true,
    { openingDialogue: "That cake was perfect. I only shouted at it twice!", summary: "A thunderous dwarf baker with a tender heart and flour everywhere." },
    { openingDialogue: "That cake was perfect. I only shouted at it twice!", portrayal: "Thunderous voice, tender heart, flour everywhere.", knows: "He forgot the old blessing and fears the disappearance is his fault.", prompt: "Ask Wendy to inspect the cake and declare her approval legally binding." }),

  everyone("npc-pip", "Pip Underbough", CARD_TYPES.NPC, true,
    { openingDialogue: "I was awake. Mostly awake. Awake-adjacent.", summary: "A fast-talking stable hand eager to make up for missing something important." },
    { openingDialogue: "I was awake. Mostly awake. Awake-adjacent.", portrayal: "Fast-talking, guilty, eager to help.", knows: "He saw violet candlelight moving toward the cellar." }),

  everyone("npc-lute", "Lute Merriweather", CARD_TYPES.NPC, true,
    { openingDialogue: "A ribbon, a rune, a vanished cake—there is absolutely a song in this.", summary: "A traveling bard who turns every clue into a half-finished rhyme." },
    { openingDialogue: "A ribbon, a rune, a vanished cake—there is absolutely a song in this.", portrayal: "Turns every clue into a half-finished rhyme.", knows: "His enchanted lute repeats the birthday melody heard from below." }),

  everyone("npc-merrit", "Merrit Vale", CARD_TYPES.NPC, false,
    { openingDialogue: "He cannot steal what is freely shared.", summary: "A patient trapped soul who wants freedom more than revenge." },
    { openingDialogue: "He cannot steal what is freely shared.", portrayal: "Patient, tired, and kind. Answers direct questions truthfully.", challenge: "DC 12 Persuasion or a sincere promise earns cooperation.", adviceToWendy: "He stole your moment because he never had one. At the cake, offer him a place beside you—but make him choose kindness first." }),

  everyone("npc-sepulchral", "Sepulchral", CARD_TYPES.NPC, false,
    { openingDialogue: "Every candle goes dark. I merely spare you the surprise.", summary: "A wounded halfling wizard who mistakes hopelessness for protection." },
    { openingDialogue: "Every candle goes dark. I merely spare you the surprise.", portrayal: "Controlled and wounded; never raises his voice until desperate.", wants: "For someone to be glad he was born.", whenAccused: "I borrowed one moment from people who have thousands.", whenAsked: "For someone to be glad I was born.", whenConfronted: "I needed their wishes. I told myself they were already empty.", whenInvited: "After what I did... you would still leave room for me?", requiredAmends: "Return the cake, free the souls, apologize to Wendy, and accept that the wish remains hers." }),

  everyone("priest", "Animated Present", CARD_TYPES.MONSTER, true,
    { summary: "A brightly wrapped gift hops forward as razor ribbon snaps from beneath its bow." },
    { ac: 14, hp: 18, initiative: 2, speed: "25 ft.", traits: ["False Appearance", "Ribbon Snare prevents reactions after a hit"], attacks: ["Ribbon Lash: +4, reach 10 ft., 1d8+2 slashing", "Surprise Inside 1/day: 10-foot cone, DC 12 Dexterity, 2d6 cold, fire, or thunder"], morale: "In the opening, survivors may surrender when shown genuine kindness. In the finale, they collapse when Sepulchral surrenders." }),

  everyone("skeleton", "Paper Plate Mimic", CARD_TYPES.MONSTER, false,
    { summary: "A spotless smiling paper plate peels from the ceiling, revealing wet adhesive and jagged teeth." },
    { ac: 13, hp: 40, initiative: 1, speed: "15 ft., climb 15 ft.", traits: ["False Appearance", "Adhesive grapples creatures it touches"], attacks: ["Ceiling Drop: first-round ambush from above", "Bite: use the supplied monster-card damage"], tactics: "One waits over the cage door and one over the western threshold. They do not pursue beyond the room.", morale: "Below 10 HP it flattens against the floor and tries to appear harmless." }),

  everyone("monster-pinata-mimic", "Piñata Mimic", CARD_TYPES.MONSTER, false,
    { summary: "A magnificent painted unicorn tears free from its cord, scattering candy as it lowers its horn." },
    { ac: 14, hp: 105, initiative: 2, speed: "40 ft.", traits: ["Ignores shredded-paper difficult terrain", "May trigger String Pull at initiative 20"], attacks: ["Trampling Charge into the back line", "Gore", "Stomp against prone targets", "Candy Burst may consume an Exploding Piñata"], tactics: "Use explosions behind the party to prevent easy retreat. Food or kindness can create a nonlethal ending once bloodied." }),

  everyone("monster-sepulchral", "Sepulchral — Boss", CARD_TYPES.MONSTER, false,
    { summary: "A small green-robed wizard stands inside the Wish Circle, clutching a staff far too large for him." },
    { ac: "15; 20 with Shield", hp: 80, initiative: 2, speed: "25 ft.", saves: "Int +3, Con +6", traits: ["Lucky", "Brave", "Halfling Nimbleness"], spells: ["Cantrips: fire bolt, mage hand, prestidigitation", "1st: detect magic, mage armor, magic missile, shield", "2nd: misty step, suggestion"], tactics: ["Open with Suggestion: Protect the cake from everyone", "Misty Step to keep the cake table between him and attackers", "Shield against a hit dealing 8 or more", "Magic Missile to break concentration"], bloodied: "At 35 HP or fewer he begins pleading; peaceful resolution can be attempted again at DC 12.", surrender: "At 0 HP his staff becomes a wooden party horn. He is defeated, not automatically killed." }),

  everyone("hazard-exploding-pinata", "Exploding Piñata", CARD_TYPES.HAZARD, false,
    { readAloud: "A piñata's pull-string glows brighter and brighter, spitting sparks like a burning fuse.", summary: "A visible magical hazard that can hurt heroes and monsters alike." },
    { readAloud: "A piñata's pull-string glows brighter and brighter, spitting sparks like a burning fuse.", trigger: "Activates when its glowing string is pulled or at the indicated initiative count.", counterplay: "Cut the support string: AC 10, 5 HP.", save: "Use the supplied hazard-card Dexterity save.", damage: "Apply the supplied card damage; the Piñata Mimic saves normally too." }),

  everyone("hazard-wrapping-machine", "Endless Wrapping Machine", CARD_TYPES.HAZARD, false,
    { readAloud: "The conveyor drags everything east while ribbons snap and immense shears cross above the belt.", summary: "A six-square moving hazard requiring teamwork." },
    { readAloud: "The conveyor drags everything east while ribbons snap and immense shears cross above the belt.", initiative20: "Move every creature one square east.", check: "DC 13 Athletics or Acrobatics to move safely.", failure: "+5 shear attack, 2d6 slashing.", escalation: "After round 3, DC 12 Dexterity or restrained by ribbons.", nonlethalFailSafe: "A creature reduced to 0 HP is wrapped in padding, stable, and delivered to the western exit." }),

  everyone("hazard-wish-circle", "Wish Circle Clock", CARD_TYPES.HAZARD, false,
    { readAloud: "Three unfinished runes brighten around the cake as the candles bend toward Sepulchral's breath.", summary: "Delay the ritual before the third advance." },
    { readAloud: "Three unfinished runes brighten around the cake as the candles bend toward Sepulchral's breath.", clock: "Place three tokens. Starting round 3 at initiative 20, advance one token.", counterplay: "A creature adjacent to the circle uses an action to erase a rune, preventing advancement until the next round.", completion: "At three advances, Sepulchral blows out the candles and wishes to become the most celebrated person in the world.", save: "DC 13 Wisdom. Success grants an immediate action to interrupt, attack, or appeal. Failure charms until damaged or confronted with the hollowness of forced affection." }),

  everyone("objective", "Recover Wendy's Birthday Wish", CARD_TYPES.OBJECTIVE, true,
    { summary: "Recover the stolen cake before Sepulchral claims its final wish." },
    { primaryGoal: "Recover the stolen cake before Sepulchral claims its wish.", requiredTruths: ["The candles are still burning", "Sepulchral is lonely but accountable", "A wish freely shared cannot truly be stolen", "Erasing a rune delays the ritual"], validVictories: ["Empathy and reconciliation", "Clever interruption", "Combat and surrender", "A mixture of all three"], birthdayHero: "Spotlight Wendy once per room, then immediately invite another player to help act on her choice." }),

  everyone("objective-free-souls", "Free the Stolen Souls", CARD_TYPES.OBJECTIVE, false,
    { summary: "Release at least three souls from Sepulchral's barrels." },
    { success: "Three freed souls can force Sepulchral to reroll one successful save in the finale.", moralWeight: "Abandoning souls after bargaining lets Sepulchral draw strength from their despair.", clue: "Merrit explains that a celebration is an invitation, not a prize." }),

  everyone("lantern", "Birthday Spark Candle Tokens", CARD_TYPES.ITEM, true,
    { summary: "Wendy begins with three candle tokens. After any player fails a check, spend one to add 1d4 to the roll.", knownEffect: "Once per room, one token may be spent after a failed check. Refill all three in the Cake Chamber." },
    { summary: "Wendy begins with three candle tokens. After any player fails a check, spend one to add 1d4 to the roll.", dmUse: "Warm narrative luck, never required for success. Spotlight Wendy without making her solve everything.", recharge: "Refill all three upon entering the Cake Chamber." },
    { uses: { max: 3, label: "candle tokens" } }),

  everyone("item-wish-crown", "Keeper of the Wish Crown", CARD_TYPES.ITEM, false,
    { summary: "A paper crown labeled KEEPER OF THE WISH. It marks Wendy as the person who decides how the final wish is shared.", knownEffect: "The crown is symbolic and harmless, but the Wish Circle recognizes its wearer as the birthday heart." },
    { summary: "A paper crown labeled KEEPER OF THE WISH. It marks Wendy as the person who decides how the final wish is shared.", secret: "No numerical bonus. It is a visible narrative reminder that Wendy decides who stands beside her." }),

  everyone("item-wooden-dog", "Wooden Dog", CARD_TYPES.ITEM, false,
    { summary: "A small carved dog from the present table.", knownEffect: "Break it to create an illusory dog or wolf for 1d4 minutes." },
    { summary: "A small carved dog from the present table.", effect: "Breaking it creates a harmless but convincing illusory dog or wolf for 1d4 minutes.", adjudication: "Useful for distraction, comfort, or creative problem solving." },
    { uses: { max: 1, label: "use" } }),

  everyone("item-story-book", "Ever-Changing Story Book", CARD_TYPES.ITEM, false,
    { summary: "A story book whose tale never stays the same.", knownEffect: "The magically stored story changes every 1d4 days." },
    { summary: "A story book whose tale never stays the same.", effect: "Its magically stored story changes every 1d4 days.", secret: "Stories tend to echo the emotional lesson most needed by the current reader." }),

  everyone("item-teddy-dagger", "Teddy Bear with Hidden Dagger", CARD_TYPES.ITEM, false,
    { summary: "A soft teddy bear with something firm hidden inside.", knownEffect: "A concealed dagger can be drawn from the bear: +4 to hit, 1d4+2 piercing." },
    { summary: "A soft teddy bear with something firm hidden inside.", weapon: "Hidden dagger: +4 to hit, 1d4+2 piercing.", secret: "The bear growls softly when Sepulchral is about to advance the Wish Clock." }),

  everyone("item-rope", "Sixty-Foot Gift Rope", CARD_TYPES.ITEM, false,
    { summary: "A neatly coiled sixty-foot rope wrapped like a present.", knownEffect: "It can secure the Wrapping Room crossing and grant advantage to creatures using it." },
    { summary: "A neatly coiled sixty-foot rope wrapped like a present.", statistics: "2 HP; bursts with a DC 17 Strength check.", specialUse: "A secured line grants advantage on Wrapping Room movement checks." }),

  everyone("item-candy", "Healing Candy", CARD_TYPES.ITEM, false,
    { summary: "A brightly wrapped piece of enchanted candy.", knownEffect: "Bonus action: regain 1d4 hit points. A creature can benefit from no more than three pieces." },
    { summary: "A brightly wrapped piece of enchanted candy.", healing: "Bonus action, regain 1d4 HP.", limit: "Maximum three pieces per creature." },
    { uses: { max: 3, label: "pieces" } }),

  everyone("treasure", "Stolen Present Table", CARD_TYPES.TREASURE, false,
    { summary: "Shelves of unopened presents line the Cake Chamber." },
    { contents: ["1: Dice set", "2: Wooden dog", "3: Ever-changing story book", "4: Teddy bear with hidden dagger", "5: Sixty-foot rope", "6: Healing candy"], interaction: "Opening a present uses an object interaction during the finale." })
];
