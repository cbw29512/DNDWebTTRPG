# Playability & Rules Certification — 2026-08-07

This document is the release checklist for The Living Table playtest. A green build means the automated items below have been verified; it does **not** turn Wishing Cake homebrew into official D&D rules.

## Product journey

### Home
- Explains simultaneous DM/player play.
- Routes directly to DM Table and Player Table.
- Does not claim persistent remote multiplayer or features that are not shipped.

### DM Table
- Live multiplayer host controls are visible and explain Host → Share → Run the World.
- DM receives an 8-character game code and can copy a direct Player Table link.
- Dice bar is above the live card board and remains immediately accessible.
- Location, Site, and Area show active shared context.
- NPC / Monster / Hazard / Treasure stacks start visually closed.
- Repeated cards show their actual in-play quantity.
- DM-only details stay in the full-card view and are not projected to the player transport.

### Player Table
- Before joining, the local/demo encounter board is hidden so it cannot be mistaken for the DM's live game.
- The page explicitly explains Join → Confirm Character → Play.
- After live connection, the DM's revealed table becomes the adventure surface.
- Character, equipment, spells, tracking, and full sheet remain the player's tools beneath the adventure state.

## Card interaction contract
- Tarot objects remain 148 px wide with 2.75 / 4.75 geometry.
- A tarot thumbnail never owns an internal scroll container.
- Clicking/keyboard activation opens the large Full Card panel with the complete cached front/back information.
- Opening/closing a card must not shift its screen position.

## Monster certification
`src/wishing-cake-monster-stats.js` is the only numerical authority for Wishing Cake monsters.

For every monster, automated tests require:
- size/type/alignment
- proficiency bonus statement
- AC and HP
- Speed
- six abilities and modifiers
- saves and skills, including explanation of nonstandard proficiency/expertise math
- resistances/immunities/condition immunities
- senses and languages
- challenge/XP or explicit homebrew encounter designation
- traits and actions
- combat shortcuts identical to the canonical stat record
- no d20 damage

Known corrected reference values include Paper Plate Mimic Bite `+4`, `1d8+2 piercing + 1d4 acid`, and Sepulchral Mage Armor/Shield AC `15/20`, Staff `+1`, `1d6-1`.

All Wishing Cake monsters are labeled **Adventure Homebrew — 5e math checked**. Their internal math is certified; they are not represented as official SRD monster entries.

## Adventure item certification
- Teddy Bear with Hidden Dagger no longer invents a universal +4/+2 modifier. The concealed weapon uses the wielder's normal dagger math.
- Sixty-Foot Gift Rope is edition-aware: 2014 uses the legacy rope burst rule; 2024 uses the current Athletics-based Rope rule, with the separate Wrapping Room benefit identified as Adventure Homebrew.
- Healing Candy is explicitly Adventure Homebrew and uses one canonical `1d4+1` healing rule.
- Birthday Spark is explicitly Adventure Homebrew.
- Cake Chamber chandelier damage explicitly splits `1d6 bludgeoning + 1d6 fire` instead of an ambiguous mixed `2d6` statement.

## Pregen certification
Every Wishing Cake pregen has separate 2014 and 2024 profiles. Automated gates require:
- level, class/subclass, species, background, size, Speed
- six ability scores
- max HP / Hit Dice
- all save proficiencies
- skills and Expertise
- armor, weapon, tool, and language proficiencies/training
- Initiative and proficiency bonus
- attacks with derived attack and damage math
- edition-specific weapon properties/masteries
- class/subclass/species/background/origin features
- limited-use resources and recharge text
- structured spell sections, slots, casting ability, attack bonus and save DC when applicable
- owned equipment and legal starting loadout
- unique import code and QR-ready path
- complete Player Table character-sheet and tracking sections

The six playtest pregens are Fighter/Champion, Rogue/Thief, Wizard/Evoker, Cleric/Life, Ranger/Hunter, and Bard/Lore at level 3.

## Spell mini-deck certification
For every spellcasting pregen and declared rules edition:
- compact spell cards resolve from structured edition-specific spell data;
- source-specific casting abilities, attack bonuses, save DCs, spell-slot permissions, and free-use resources are displayed from structured rules data;
- spell-slot and free-cast pools persist per character and edition;
- only one concentration spell can be active at a time;
- starting a different concentration spell replaces the previous active concentration spell;
- active concentration persists across an ordinary browser reload;
- ending concentration clears the persisted state;
- a Long Rest restores spell uses and ends concentration;
- automated tests reject missing compact spell data and d20 damage/healing expressions.

## Rules baselines
- 2014-compatible official material: SRD 5.1 / 2014 fifth-edition rules.
- 2024-compatible official material: SRD 5.2.1 / 2024 fifth-edition rules.
- Adventure inventions are labeled Wishing Cake / Adventure Homebrew.
- The rules engine must never invent a modifier to make a control work.

## Remaining production-hardening work
These are not hidden by a green playtest build:
- Peer-to-peer rooms depend on the DM browser remaining open and are not a persistent account-backed multiplayer service.
- TURN infrastructure is not yet provided for every restrictive network.
- QR-ready character paths exist; camera QR scanning is not yet a shipped feature.
- Wishing Cake visual art is still being upgraded toward final commercial art quality.

A release is accepted only after the Node regression suite, rendered Chromium suite, and GitHub Pages deployment succeed on the exact merge SHA.
