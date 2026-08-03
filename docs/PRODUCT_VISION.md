# Product Vision — The Living Table

## One-sentence concept

A card-driven online tabletop where the DM reveals the world, players act directly from their character cards, and the whole table progresses through scenes and combat together.

## The problem

Online tabletop play is often fragmented across video chat, character sheets, dice bots, map tools, music players, rule references, and private messages. The technology becomes the activity instead of supporting the activity.

The Living Table starts with the shared table—not the map editor.

## Core experience

### DM experience

The DM sees:

- every player character and current combat state;
- HP, AC, movement, initiative, conditions, concentration, spell slots, features, items, charges, and consumables;
- an encounter deck containing room, NPC, monster, hazard, clue, treasure, quest, and environmental cards;
- private card faces, tactics, triggers, hidden information, and notes;
- exact visibility controls for everyone, selected players, or the DM only;
- initiative, turn resources, held/readied actions, durations, objectives, and round counters;
- complete authority to undo, override, reveal, hide, pause, skip, or end combat.

### Player experience

A player sees:

- the cards the DM has revealed to them;
- their character portrait and core statistics;
- attacks, spells, items, features, movement, actions, bonus actions, reactions, and free interactions;
- remaining spell slots, charges, ammunition, consumables, inspiration, and limited-use abilities;
- current conditions, concentration, active effects, targets, and durations;
- initiative and whose turn it is;
- a clear End Turn flow with warnings for unresolved choices.

## Card-first world model

Cards are the primary interface and state container.

### World cards

- Room / scene
- NPC
- Monster
- Hazard / trap
- Environmental effect
- Objective
- Quest
- Clue / handout
- Treasure
- Magic item

### Character cards

- Main character
- Attack / weapon
- Spell
- Feature / ability
- Item / equipment
- Consumable
- Condition
- Active effect

### Card zones

- DM library
- Encounter deck
- Facedown board
- Public board
- Selected-player reveal
- Character inventory
- Equipped area
- Prepared/known abilities
- Active effects
- Loot area
- Resolved/discarded area

## Presentation principles

1. Human-readable before rules-dense.
2. Reveal information dramatically and progressively.
3. Make the current turn unmistakable.
4. Keep the dice roller permanently accessible at the top.
5. Allow physical dice and manual result entry.
6. Let the DM override automation at all times.
7. Never expose private or unrevealed information through the client.
8. Use strong contrast, keyboard support, reduced motion, scalable text, and screen-reader status updates.
9. Preserve table atmosphere with optional sound, music, scene art, and spotlight moments.
10. Keep system rules modular so the platform can support more than D&D.

## Modes

### Story mode

Scene art, room cards, NPCs, clues, handouts, private reveals, ambience, and roleplay spotlight.

### Combat mode

Battle board, tokens, initiative, actions, resources, conditions, targeting, durations, and turn progression.

### Downtime mode

Inventory, shopping, crafting, leveling, journals, campaign recap, scheduling, and party planning.

## System-module direction

The core engine is system-neutral. Rules modules supply terminology, resources, action economy, validation, and automation.

Initial target:

- D&D 5e 2014
- D&D 5e 2024 as a separate module

Future candidates:

- Pathfinder 2e
- Call of Cthulhu 7e
- Daggerheart
- Vampire: The Masquerade V5

## Product boundary

The Living Table is not:

- a rules encyclopedia;
- a marketplace in the MVP;
- a full 3D game engine;
- a replacement for the DM;
- dependent on copied publisher assets or closed rulebook text;
- a public player-matching service in the MVP.

## Long-term differentiator

Other tools provide a digital map. The Living Table provides a digital table: cards, reveals, people, turns, atmosphere, shared state, and the feeling that something is happening together right now.
