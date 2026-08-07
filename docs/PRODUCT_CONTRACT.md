# The Living Table — Product Contract

This document defines non-negotiable product rules for all future implementation.

## 1. Rules accuracy is authoritative

The runtime must represent Dungeons & Dragons rules accurately for the selected rules edition. A feature is not complete because it looks plausible; its data, calculations, resource usage, action economy, and edition-specific behavior must be verifiably correct.

### Supported rules profiles

- 2014-compatible content is grounded in SRD 5.1 / compatible 2014 rules sources.
- 2024-compatible content is grounded in SRD 5.2.1 / compatible 2024 rules sources.
- 2014 and 2024 profiles are separate rule sets. Shared names or concepts must not imply shared mechanics.
- Homebrew must be labeled as homebrew and must never silently overwrite official/SRD mechanics.

### Applies to every rules-bearing object

This contract covers:

- pregenerated characters and character advancement;
- ability scores, modifiers, proficiency bonus, saving throws, skills, passive scores, AC, HP, speed, initiative, hit dice, and senses;
- classes, subclasses, species, backgrounds, feats, proficiencies, expertise, fighting styles, weapon mastery, and resources;
- weapons, armor, equipment, attunement, charges, ammunition, ranges, properties, damage dice, damage modifiers, damage types, and equipment legality;
- spell lists, preparation/known rules, cantrips, spell slots, pact slots, components, casting time, range, duration, concentration, ritual casting, attacks, saves, scaling, and source references;
- monsters, NPCs, hazards, traps, conditions, actions, bonus actions, reactions, legendary/recharge/limited-use mechanics when applicable;
- initiative, turns, rounds, concentration, rests, death/dying, conditions, advantage/disadvantage, cover, movement, and action economy;
- card combat shortcuts and dice controls.

### Calculation rules

- Never use a generic fallback die or modifier for a rules-bearing shortcut.
- A d20 is used for d20 Tests/attack rolls/saving throws/initiative/checks as defined by the selected edition; a d20 must never be substituted for damage.
- Weapon attack bonus and weapon damage must be derived independently. Proficiency applies to a proficient attack roll, not automatically to damage.
- Spell attack bonus, spell save DC, damage, healing, and scaling must come from structured spell/character data.
- Equipment must obey hand, armor, shield, ammunition, loading, attunement, proficiency, and other applicable restrictions.
- If structured data is insufficient to calculate a shortcut accurately, the shortcut is not rendered.

### Source/reference behavior

Compact cards may use shorthand, but shorthand must remain mechanically complete enough to run the common case. When a rule cannot be represented cleanly in the allotted card space, the card must show a source/book/page or an in-app full-detail reference instead of truncating away a material rule.

### Required test behavior

Rules regressions must fail CI for impossible or contradictory values, including but not limited to:

- d20 damage expressions;
- proficiency incorrectly added to damage;
- illegal equipment combinations;
- attack/damage modifiers that disagree with the character's ability/proficiency/equipment state;
- spell access that violates class/edition lists or preparation/known rules;
- wrong spell-slot progression;
- mismatched save DC / spell attack math;
- 2014 mechanics leaking into 2024 profiles or vice versa;
- cards whose displayed shorthand disagrees with the underlying rules object.

## 2. Cards are the shared game language

Official/SRD-compatible, adventure-specific, and homebrew cards all use the same card grammar and visual system.

Every card has:

- a stable card type;
- player-facing information;
- optional DM-only information;
- structured mechanics where mechanics exist;
- edition/provenance metadata;
- artwork metadata;
- board-slot compatibility;
- printable and digital presentation derived from the same data.

Card types currently include Location, Site, Area, NPC, Monster, Trap/Hazard, Treasure/Item, Character, Spell, Quest, and Boss/specialized encounter cards.

## 3. Homebrew is first-class

The long-term product must let a Dungeon Master build an adventure without editing source code.

The DM must be able to:

1. browse the reusable card library;
2. filter by type, edition, level/CR, environment, tag, source, and ownership;
3. drag existing cards into an adventure outline/Scene;
4. define Scene order and branching/optional paths;
5. set default card placements into the seven live-board slots;
6. clone an existing card as a starting point;
7. create a new card from a guided template;
8. preview the result using the canonical card theme;
9. validate rule-bearing fields before publishing/saving;
10. save cards to a personal library;
11. package those cards into reusable adventures;
12. play the resulting adventure on the same DM/Player board used by first-party adventures.

## 4. Homebrew must preserve theme automatically

Users should not need to design CSS or card layouts.

The builder chooses the canonical template based on card type and supplies only content and approved visual options. Typography, spacing, borders, icon placement, stat bands, front/back structure, print dimensions, accessibility behavior, and responsive behavior remain controlled by the product design system.

Allowed customization may include artwork, title, flavor accent, tags, rarity/threat indicators, and optional approved theme accents. It must not allow arbitrary styling that makes cards unreadable or visually incompatible with the system.

## 5. Homebrew rules model

Homebrew cards use the same structured mechanics schema as built-in cards wherever possible.

For rules-bearing homebrew, the builder should provide guided fields rather than a blank text box. Examples:

- attack: ability/attack bonus, reach/range, target count, damage dice, damage modifier, damage type;
- save: ability, DC, success/failure effects;
- recharge/uses: recharge range or use count/reset condition;
- spell: level, school, action, range, components, duration, concentration, attack/save, effect, scaling;
- monster: AC, HP, speed, abilities, saves, skills, senses, languages, CR/XP where applicable, actions, reactions, traits;
- item: type, rarity, attunement, equipment slot, modifiers, charges/uses, reset rule, granted actions/spells;
- hazard: trigger, detection, DC, effect, damage, reset/disarm/escape behavior.

The builder may also provide a clearly labeled freeform homebrew rules block for mechanics that cannot be represented by the structured schema, but structured fields remain the source for automated rolls and combat shortcuts.

## 6. Rules validation and homebrew freedom are different modes

Built-in/SRD-compatible content must pass strict rules validation.

Homebrew content may intentionally break baseline D&D assumptions, but the application must distinguish:

- **Rules-valid** — conforms to the selected supported rules profile;
- **Homebrew-valid** — schema is internally usable but intentionally custom;
- **Incomplete/invalid** — missing data required to run or render the mechanic.

Warnings should explain consequences without preventing intentional homebrew unless the object cannot function technically.

## 7. Definition of Done

A rules-bearing or card-building feature is complete only when:

- structured data is authoritative;
- displayed numbers agree with calculated numbers;
- edition boundaries are enforced;
- player/DM visibility is correct;
- card shorthand is accurate;
- automated regression coverage exists;
- rendered-browser behavior is tested;
- the feature works in both first-party and homebrew flows where applicable;
- documentation is current.
