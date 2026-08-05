# Canonical D&D Play Model for The Living Table

Last updated: 2026-08-05

This document translates the official fifth-edition rhythm of play into product requirements for The Living Table. It is the durable project reference for deciding what belongs on the Dungeon Master screen, what belongs on a player screen, and how cards should move the game forward.

## Rules sources and edition identity

The product must keep these rules families explicit and separate:

- **2014 fifth edition:** SRD 5.1, released under Creative Commons Attribution 4.0 and OGL 1.0a publishing paths.
- **Revised 2024 fifth edition / 5.5e labeling:** SRD 5.2.1, released under Creative Commons Attribution 4.0.

Rules wording, class features, spells, equipment, monsters, actions, conditions, and character construction must carry an edition identifier. Compatibility claims do not permit silently mixing mechanics.

Primary official references:

- D&D Beyond Basic Rules (2014)
- D&D Beyond Basic Rules / Playing the Game (revised rules)
- D&D Beyond System Reference Document page for SRD 5.1 and SRD 5.2.1

The project may summarize and implement properly licensed SRD material. It must not copy non-SRD books, protected settings, official art, trade dress, or other non-licensed expression.

## The table relationship

D&D is cooperative, but the roles are intentionally different.

### Dungeon Master

The DM:

- prepares or selects the adventure;
- presents the world, locations, rooms, creatures, hazards, and situations;
- portrays every NPC and monster;
- controls hidden information;
- listens to what the players attempt;
- decides whether an outcome is automatic, impossible, or uncertain;
- calls for appropriate checks, saves, or attacks when uncertainty matters;
- sets or applies DCs and other target numbers;
- adjudicates rules and exceptional interactions;
- narrates consequences;
- manages pacing, spotlight, initiative, encounter state, rewards, and scene transitions;
- retains override authority when the automation cannot represent the table ruling.

The DM is not a player operating an enemy character sheet. The DM runs the world and facilitates the group’s experience.

### Player

A player:

- controls one adventurer;
- decides what that character says, attempts, and prioritizes;
- collaborates with the party;
- manages the character’s actions, movement, features, spells, equipment, conditions, and resources;
- rolls when the rules or DM call for a roll;
- receives descriptions and consequences from the DM;
- learns the world through revealed information rather than hidden adventure data.

A player does not operate monsters, NPCs, hazards, room triggers, secret doors, scene progression, encounter construction, or DM rulings.

## Rhythm of play

Every major interaction should support this loop:

1. **The DM describes the scene.**
2. **Players describe what their characters do.**
3. **The DM determines and narrates the result.**
4. The result creates the next decision point and the loop repeats.

The interface must not force the group to stop roleplaying in order to operate a complicated dashboard. Cards should put the right information in front of the correct person at the moment it becomes useful.

## Three pillars

The product must support all three main pillars rather than treating D&D as only combat.

### Social interaction

DM needs:

- NPC identity, motivation, voice, knowledge, attitude, leverage, secrets, and likely responses;
- conversation prompts and conditional dialogue;
- relevant checks and consequences;
- relationship or faction state when used by the adventure.

Players need:

- the NPC’s revealed appearance, behavior, statements, and known relationship;
- their own social features, proficiencies, spells, items, and roll controls;
- a clear way to describe an action before choosing a roll.

### Exploration

DM needs:

- broad Location and immediate Room;
- read-aloud text;
- obvious features and exits;
- hidden features, traps, clues, secret doors, DCs, consequences, and connected rooms;
- room state such as searched, altered, cleared, trapped, unlocked, or revisited;
- travel, light, visibility, time, environmental effects, and encounter triggers when relevant.

Players need:

- the current revealed Location and Room cards;
- visible exits, objects, environmental effects, and discovered clues;
- their character’s senses, skills, tools, movement, light sources, and exploration resources;
- no undiscovered secret, hidden DC, or unrevealed destination.

### Combat

DM needs:

- all combatants and groups;
- monster/NPC stat cards, tactics, reactions, recharge abilities, conditions, HP, and resources;
- initiative and round control;
- terrain, hazards, lair or room effects, reinforcements, morale, surrender, and encounter-ending conditions;
- fast override and correction tools.

Players need:

- their own character actions, bonus actions, reactions, movement, attacks, spells, features, equipment, resources, conditions, concentration, death saves, and targets currently revealed;
- public initiative and combat state;
- player-safe creature and environment information;
- clear roll prompts and results;
- no monster HP, hidden ability, tactics, trigger, unrevealed reinforcement, or DM note unless deliberately revealed.

## Dungeon Master interface contract

The DM workspace should make the next useful action obvious.

### Persistent DM frame

- Current adventure and edition
- Current broad Location
- Current immediate Room
- Scene progress and connected exits
- Party roster and readiness
- Initiative/round/active turn when combat is running
- Dice and manual result entry
- Event history, undo, and override

### Current Room workspace

- Room card with player read-aloud and DM back
- Read Aloud action
- Reveal, hide, discover, and resolve controls
- Associated NPC, monster, hazard, clue, quest, and treasure cards
- Trigger checklist and conditional consequences
- Checks/DCs attached to the relevant feature instead of buried in prose
- Previous room, connected room, and next scene controls
- Persistent room-state summary on revisit

### DM card interaction

A DM card should answer:

- What do the players perceive?
- What is actually true?
- What can happen here?
- What check or rule applies?
- What happens on success, failure, delay, damage, conversation, inspection, rest, or combat?
- What card or scene should load next?

## Player interface contract

The player table should feel like a clean character station looking into the DM’s world.

### Persistent player frame

- Character identity and portrait
- HP, AC, speed, proficiency, conditions, concentration, and inspiration
- Action, bonus action, reaction, and movement state during combat
- Character features, attacks, spells, equipment, item uses, and resources
- Party/public initiative
- Current quest or objective information the DM has revealed
- Dice and roll history relevant to that player

### Revealed world frame

- Current Location card
- Current Room card
- NPC cards the character can perceive or remembers
- Monster cards the DM has revealed
- Visible hazards, clues, items, and rewards
- Read-aloud descriptions and public effects

The player screen must not contain controls for:

- scene selection or advancement;
- adventure deck construction;
- NPC or monster attacks;
- monster initiative rolling;
- hidden card inspection;
- reveal/hide state;
- trap or secret-door triggers;
- DM notes, hidden DCs, private tactics, or unrevealed rewards.

## Role and payload boundary

Role separation is not a cosmetic tab.

- The DM enters a DM route and receives a DM projection.
- A player enters a player route and receives only that participant’s player projection.
- The interface does not include an in-session role switch.
- Hidden DM content must be absent from player payloads, not merely hidden with CSS.
- Campaign membership and seat ownership must eventually be verified by the authoritative server.
- A player can control only the claimed character and owned items assigned to that seat.
- The DM can control world cards and can inspect party state required to run the game.

The current static routes are an interaction prototype. They are not secure authentication until a server binds account, campaign, role, and seat before returning data.

## Intuitive interaction rules

- Show the most likely next action before secondary actions.
- Put rules beside the card or feature that invokes them.
- Prefer one-click reveal, read aloud, roll, apply, advance, and undo operations.
- Preserve freeform play: players describe intent before the interface forces a specific skill button.
- Do not roll when an action has no meaningful uncertainty or consequence.
- Let the DM override automation without fighting the interface.
- Keep hidden information hidden until the DM or a defined trigger reveals it.
- Keep Location stable while Room changes within the same broad area.
- Save all meaningful Room changes so revisiting the area reflects prior play.
- Use plain language first and shorthand second.
- Never make the DM search another book for information that a purchased adventure card is expected to provide.
- Never make players navigate DM tools to find their own character actions.

## Product acceptance tests

### Role separation

1. Opening the DM entry point creates only a DM workspace.
2. Opening the player entry point creates only a player workspace.
3. Neither screen contains an in-session role switch.
4. Player source data and rendered DOM contain no DM back, hidden card, secret DC, tactics, or DM control.
5. A player cannot invoke world-card mutation commands.

### Table rhythm

1. DM loads a Room and reads the description.
2. Player sees only the revealed Room and describes an action.
3. DM selects the relevant feature/check or makes a ruling.
4. The system records the roll and consequence.
5. DM reveals the result or advances the Room.
6. Player receives the updated player-safe view without navigating away from the character station.

### Ease of use

A first-time DM should be able to load a prepared one-shot, understand the current Room, locate every associated card, reveal information, run a monster turn, adjudicate a common check, and advance to the next Room without opening a separate rulebook or configuration screen.
