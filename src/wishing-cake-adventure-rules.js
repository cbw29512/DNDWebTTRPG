const freeze = value => Object.freeze(value);

/*
 * Canonical overrides for Wishing Cake adventure-specific mechanics that are
 * not SRD equipment/stat blocks. These are deliberately labeled Homebrew so
 * the UI never presents an adventure invention as an official D&D rule.
 */
export const wishingCakeAdventureRuleOverrides = freeze({
  'scene-cake-chamber':freeze({
    dmFace:freeze({
      chandelier:'Adventure Homebrew. Chandelier AC 12, 8 HP. When dropped, creatures in a 10-foot-radius area make a DC 13 Dexterity save, taking 1d6 bludgeoning plus 1d6 fire damage on a failure, or half of each damage type on a success.'
    })
  }),
  'item-teddy-dagger':freeze({
    rulesClassification:'Adventure item containing standard dagger',
    playerFace:freeze({
      knownEffect:'A normal dagger is concealed inside the bear. Use the wielder’s normal dagger attack bonus and damage modifier; the dagger deals 1d4 piercing and has the Finesse, Light, and Thrown (20/60 ft.) properties.'
    }),
    dmFace:freeze({
      rulesClassification:'Adventure item; concealed weapon uses standard dagger statistics for the selected rules edition.',
      weapon:'Hidden dagger: 1d4 piercing; Finesse, Light, Thrown (20/60 ft.). Attack and damage modifiers come from the wielder, not from this item card.'
    })
  }),
  'item-rope':freeze({
    rulesClassification:'Adventure item using edition-specific Rope rules',
    playerFace:freeze({
      knownEffect:'A 60-foot gift rope. 2014: rope has 2 HP and requires DC 17 Strength to burst. 2024: bursting it requires a DC 20 Strength (Athletics) check; use the 2024 Rope Utilize/escape rules when binding a creature. In the Wrapping Room, a secured line grants the adventure’s listed advantage.'
    }),
    dmFace:freeze({
      rulesClassification:'Edition-aware equipment rule plus Wishing Cake adventure use.',
      statistics:'2014: 2 HP; DC 17 Strength to burst. 2024: DC 20 Strength (Athletics) to burst; a knot uses DC 10 Dexterity (Sleight of Hand), and a creature bound by the rope follows the 2024 Rope Utilize/escape rule.',
      specialUse:'Adventure Homebrew: a secured line grants advantage on Wrapping Room movement checks.'
    })
  }),
  'item-candy':freeze({
    rulesClassification:'Wishing Cake Adventure Homebrew',
    playerFace:freeze({
      knownEffect:'Adventure Homebrew: as a Bonus Action, eat one piece to regain 1d4 + 1 hit points. The card begins with three pieces.'
    }),
    dmFace:freeze({
      rulesClassification:'Wishing Cake Adventure Homebrew',
      rule:'As a Bonus Action, eat one piece to regain 1d4 + 1 hit points.',
      quantity:'Three pieces total on this card; each use consumes one piece.'
    })
  }),
  lantern:freeze({
    rulesClassification:'Wishing Cake Adventure Homebrew',
    playerFace:freeze({
      knownEffect:'Adventure Homebrew: after a hero fails an attack roll, ability check, or saving throw, Wendy may spend one Birthday Spark token to add 1d4, potentially changing the result. Only one token can affect a roll and only one can be spent in a scene.'
    }),
    dmFace:freeze({ rulesClassification:'Wishing Cake Adventure Homebrew' })
  }),
  'hazard-exploding-pinata':freeze({ dmFace:freeze({ rulesClassification:'Wishing Cake Adventure Homebrew hazard' }) }),
  'hazard-wrapping-machine':freeze({ dmFace:freeze({ rulesClassification:'Wishing Cake Adventure Homebrew hazard' }) }),
  'hazard-wish-circle':freeze({ dmFace:freeze({ rulesClassification:'Wishing Cake Adventure Homebrew hazard' }) })
});
