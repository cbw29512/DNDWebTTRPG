import { AUDIENCES, CARD_TYPES } from "./schema.js";

const everyone = (id, title, type, revealed, playerFace, dmFace, extra = {}) => ({
  id, title, type, audience: AUDIENCES.EVERYONE, revealed, playerFace, dmFace, ...extra
});

export const wishingCakeSpatialCards = [
  everyone("location", "Bramblewick", CARD_TYPES.LOCATION, true,
    {
      summary: "A cheerful market city known for bakeries, inns, lantern festivals, and old celebration traditions.",
      knownPlaces: ["The Wishing Cake Inn", "Market streets", "Festival quarter"]
    },
    {
      purpose: "The broad urban Location containing the adventure's opening Site.",
      scope: "City-scale. Shops, houses, chapels, streets, and inns belong beneath this Location as Sites.",
      continuity: "Keep Bramblewick active while the party moves between Sites inside the city."
    }),

  everyone("site-wishing-cake-inn", "The Wishing Cake Inn", CARD_TYPES.SITE, true,
    {
      readAloud: "Amber lanterns glow above curling ribbons while cinnamon, honey, and fresh bread perfume the crowded inn.",
      summary: "A warm inn built around magical birthday celebrations."
    },
    {
      purpose: "Opening adventure Site inside Bramblewick.",
      areas: ["Grand Celebration Hall", "Kitchen", "Guest rooms", "Cellar access"],
      hiddenConnection: "The cellar descends into the sealed Old Celebration Halls."
    }),

  everyone("site-celebration-halls", "Old Celebration Halls", CARD_TYPES.SITE, false,
    {
      summary: "Forgotten ceremonial chambers hidden beneath The Wishing Cake Inn."
    },
    {
      purpose: "Dungeon Site beneath the inn.",
      areas: ["Holding Cells", "Hall of Rejected Wishes", "Soul Cellar", "Piñata Pen", "Wrapping Room", "Birthday Cult Room", "Cake Chamber"],
      continuity: "Keep this Site active while its immediate Area / Room changes."
    }),

  everyone("room", "Grand Celebration Hall", CARD_TYPES.ROOM, true,
    {
      readAloud: "Every chair is occupied except the place reserved for the guest of honor. A many-tiered birthday cake waits beneath a glass dome while friends gather around the table.",
      summary: "The immediate room where Wendy's birthday celebration begins."
    },
    {
      purpose: "Opening social Area and first combat space.",
      visibleFeatures: ["Birthday table", "Glass cake dome", "Wrapped presents", "Cellar door"],
      exits: ["Inn foyer", "Kitchen", "Cellar stairs"],
      roomState: "Track damaged presents, surrendered constructs, discovered wrapping-paper clue, and whether Martha unlocked the cellar."
    }),

  everyone("scene-stolen-wish", "The Stolen Wish", CARD_TYPES.SCENE, true,
    {
      summary: "Sepulchral steals Wendy's cake and final birthday wish."
    },
    {
      phase: "Opening event and encounter",
      setup: "Ask each player what gift, food, memory, or wish the character brought for Wendy. Let Wendy keep the exact wish private.",
      trigger: "When Wendy prepares to blow out the candles, Sepulchral appears and takes the cake.",
      consequences: ["Animated Presents attack", "A marked wrapping-paper clue remains", "Martha can open the cellar route"],
      transition: "Following the clue changes the Site to the Old Celebration Halls and the Area to the Holding Cells."
    }),

  everyone("scene-holding-cells", "Escape and Ceiling Ambush", CARD_TYPES.SCENE, false,
    { summary: "Escape the cage and survive the Paper Plate Mimic ambush." },
    {
      phase: "Exploration into combat",
      objective: "Escape the locked cage and reach the western passage.",
      checks: ["DC 12 Dexterity with thieves' tools", "DC 15 with improvised picks", "DC 16 Athletics to wrench the lock"],
      trigger: "Forcing the lock alerts the mimics; crossing the threshold can trigger the second ambusher.",
      transition: "Western passage to the Hall of Rejected Wishes."
    }),

  everyone("scene-wish-hall", "Carry the Rejected Wishes", CARD_TYPES.SCENE, false,
    { summary: "Explore the floating wishes and learn that shared hope strengthens magic." },
    {
      phase: "Exploration and roleplay",
      objective: "Learn how wishes react to kindness, fear, and shared memories.",
      checks: ["DC 13 Arcana or Investigation for a safe wish", "DC 12 Wisdom save after mishandling a bitter wish"],
      transition: "North to the Soul Cellar or onward to the Piñata Pen."
    }),

  everyone("scene-soul-cellar", "Free the Stolen Souls", CARD_TYPES.SCENE, false,
    { summary: "Release trapped souls and learn what Sepulchral truly wants." },
    {
      phase: "Social interaction and discovery",
      objective: "Free at least three souls and hear their clues.",
      checks: ["DC 12 Strength", "Thieves' tools", "5 slashing damage to a barrel"],
      persistentResult: "Three freed souls can affect the finale and remain recorded after leaving the room."
    }),

  everyone("scene-pinata-pen", "The Piñata Stampede", CARD_TYPES.SCENE, false,
    { summary: "Survive a colorful battle among glowing strings and exploding piñatas." },
    {
      phase: "Combat",
      objective: "Defeat, calm, or bypass the Piñata Mimic.",
      battlefield: "Shredded paper, hanging strings, and visible explosive counterplay.",
      combatState: "Track initiative, mimic HP, glowing string, destroyed piñatas, conditions, and morale."
    }),

  everyone("scene-wrapping-room", "Cross the Endless Wrapping Machine", CARD_TYPES.SCENE, false,
    { summary: "Cross the moving conveyor while ribbons and shears reshape the battlefield." },
    {
      phase: "Structured hazard",
      objective: "Move the whole party across six squares.",
      roundState: "Track conveyor movement, disabled spindles, restrained characters, secured rope, and elapsed rounds.",
      transition: "The western exit reaches the Birthday Cult Room."
    }),

  everyone("scene-cult-room", "The Birthday Melody", CARD_TYPES.SCENE, false,
    { summary: "Solve the drum sequence and birthday riddle before entering the finale." },
    {
      phase: "Puzzle and preparation",
      objective: "Open the northern door.",
      answers: ["Drums: D, D, E, D, G, F", "Riddle: age or birthday"],
      consequences: "Wrong answers animate presents; resting gives Sepulchral more preparation time."
    }),

  everyone("scene-cake-chamber", "Claim of the Wish", CARD_TYPES.SCENE, false,
    { summary: "Recover Wendy's wish through empathy, clever play, combat, or a mixture." },
    {
      phase: "Negotiation, boss combat, and resolution",
      objective: "Stop the Wish Circle and return the choice to Wendy.",
      encounterState: "Track Sepulchral HP, Shield, spell slots, Wish Circle advances, erased runes, chandeliers, freed-soul leverage, and peaceful-resolution DC.",
      endings: ["Reconciliation", "Surrender", "Clever interruption", "Combat victory"]
    })
];
