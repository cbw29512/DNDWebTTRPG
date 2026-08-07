# Rules Accuracy Contract

The Living Table must never invent a game modifier merely to make a button work.

## Rules baselines

Published 2014-compatible character and rules data must be traceable to the D&D 5e System Reference Document 5.1.
Published 2024-compatible character and rules data must be traceable to the D&D 5e System Reference Document 5.2.1.
Adventure-specific material must be labeled as Wishing Cake / adventure content rather than presented as an SRD rule.

Official SRD resources: https://www.dndbeyond.com/srd
Creative Commons license: https://creativecommons.org/licenses/by/4.0/

## Dice contract

- Attack rolls use a d20 plus the actual attack modifier.
- Ability checks use a d20 plus the actual ability / skill modifier.
- Saving throws use a d20 plus the creature's actual save modifier; a DM-facing hazard card normally presents the target ability and DC rather than rolling the player's save for them.
- Initiative uses a d20 plus the actual Initiative modifier and any explicit advantage/disadvantage rule.
- Damage uses the attack, spell, item, or hazard's listed damage dice and modifiers.
- Damage must never fall back to a d20.
- Recharge rolls use the listed die, normally a d6 for monster recharge entries.
- A card without structured rules data receives no automatic roll shortcut.

`src/dnd/rules-engine.js` is the math/dice authority. `validateDamageParts()` rejects d20 damage expressions.

## Combat-card shortcut contract

Structured shortcuts can expose:

- Initiative: `⏱`
- Attack roll: `⚔`
- Damage: `💥`
- Saving throw / save DC: `🛡`
- Ability or tool check: `◇`
- Recharge: `↻`
- Informational rule / resource: rule-specific icon

The shortcut label must show the real modifier, DC, damage dice, range, recharge, use limit, or condition needed to run the effect. The full DM face remains the rules reference; shortcuts reduce lookup time but do not replace rule text.

## Pregenerated-character contract

A printable pregen card is a portable identity/import card, not a compressed substitute for the character sheet.

### Front

- character artwork
- name
- species, class, level, and subclass when applicable
- AC
- max HP
- Initiative
- Proficiency Bonus
- one primary attack shortcut with real attack and damage math
- rules edition

### Back

- short play summary
- edition-specific character import code
- QR-ready path for the same build
- instruction that the code loads the complete Player Table character sheet

### Player Table after import

The Player Table keeps the DM-revealed adventure board at the top. The character area then contains:

1. pregen identity card
2. RPG equipment doll
3. owned backpack / item cards
4. complete character-sheet-equivalent data

The complete sheet must expose, as applicable:

- identity: name, species, class, subclass, level, background, edition
- AC, current/max HP, Speed, Initiative, Proficiency Bonus, Hit Dice, passive Perception
- all six ability scores and modifiers
- all six saving throws and proficiency state
- all skills and proficiency/expertise state
- armor, weapon, tool, and language proficiencies
- attacks, damage, range, weapon properties, and 2024 mastery properties
- class/subclass/species/background feats and features
- limited-use resources and recharge rules
- spellcasting ability, spell save DC, spell attack bonus, spell slots, and spells for spellcasters
- equipment and adventure items
- edition-specific rules notes needed to run the character correctly

## Edition separation

2014 and 2024 are not labels on one shared rules object. A character may share name, artwork, concept, and final ability scores, but edition-dependent class features, species traits, background rules, feats, weapon mastery, action wording, resources, and other mechanics live in separate profiles.

## Current reference pregen

`wendy-birthday-hero` is the first complete dual-edition reference implementation: Human Fighter 3 (Champion).

- 2014: SRD 5.1 Fighter/Champion profile, Archery, Second Wind, Action Surge, Improved Critical.
- 2024: SRD 5.2.1 Fighter/Champion profile with Weapon Mastery, Tactical Mind, two Second Wind uses at level 3, Improved Critical, Remarkable Athlete, and 2024 Human/Soldier origin features.
- Both profiles use legal level-3 math and a legal leather armor + shield + rapier starting combat setup.
- Rapier attack is +5 and damage is 1d8 + 3 piercing.
- Longbow attack is +7 with Archery and damage remains 1d8 + 3 piercing. Archery does not add to damage.

## Release gate

A card/character change cannot merge if the automated rules-accuracy suite finds:

- d20 damage
- missing damage type
- incorrect reference pregen proficiency or ability math
- incorrect reference attack/damage math
- missing 2014 or 2024 profile
- missing import codes
- missing full-sheet sections
- legacy generic card-roll controls exposed instead of structured rules shortcuts
