# D&D Pain Points and Product Responses

Last updated: 2026-08-05

This document translates recurring Dungeon Master and player burdens into product requirements. The goal is not to automate D&D away; it is to remove the bookkeeping that interrupts the game.

## Research basis

The product model was checked against:

- the official fifth-edition rhythm of play in the 2014 and revised Basic Rules;
- official combat, initiative, rest, concentration, condition, magic-item, charge, attunement, and curse rules;
- research on digital DM assistance and game-state continuity;
- recurring workflows addressed by established campaign, encounter, initiative, and character-management tools.

The official play loop consistently separates three responsibilities: the DM presents the situation, players declare what their characters attempt, and the DM determines and narrates the result. Any interface that obscures that loop or turns the table into data entry is working against the game.

## Pain point 1: Preparation is scattered and repetitive

### Burden

A DM often assembles material from adventure text, maps, monster statistics, NPC notes, treasure, rules references, and personal reminders. During play, the DM may still need to search multiple pages or applications to reconstruct one encounter.

### Product response

A prepared Scene automatically loads its Location, Site, Area / Room, Scene card, NPCs, monsters, traps, clues, objectives, treasure, and transitions. Complete cards contain the information required to run them without another book.

### Acceptance test

A first-time DM loads a purchased one-shot and begins the opening Scene without manually building a board or searching for its monsters and notes.

## Pain point 2: Live DM cognitive load is high

### Burden

The DM simultaneously presents the world, portrays NPCs and monsters, listens to player intent, adjudicates rules, tracks hidden information, maintains continuity, manages pacing, and decides consequences. Important notes are easily forgotten when the DM must also operate a complicated interface.

### Product response

The DM screen emphasizes, in order:

1. where the party is;
2. what is happening now;
3. what players perceive;
4. what is secretly true;
5. likely checks and consequences;
6. active people, threats, hazards, and objectives;
7. the next useful transition.

Secondary controls remain behind progressive disclosure. Common actions should be one click and reversible.

## Pain point 3: Place and event continuity become confused

### Burden

A building is not a city, a room is not an event, and a combat can begin and end without anyone moving. Collapsing these concepts makes notes, transitions, maps, and save state difficult to understand.

### Product response

Use the canonical hierarchy:

```text
Campaign / World → Location → Site → Area / Room
                                     └─ Scene occurring there
```

The board visibly separates the four live context cards. Scene changes can occur without moving the party.

## Pain point 4: Initiative and combat state are difficult to maintain

### Burden

Combat requires turn order plus changing HP, temporary HP, actions, reactions, movement, conditions, concentration, death saves, monster recharge abilities, hazards, rounds, and ongoing effects. New DMs can lose the flow while calculating, searching rules, or updating several trackers.

### Product response

Combat becomes a saved state machine owned by the session:

- one initiative flow for players, NPCs, monsters, and environmental turns;
- optional grouped initiative for identical monsters;
- visible active turn and round;
- automatic resource and condition timing prompts;
- monster cards with attacks, saves, tactics, reactions, and recharge state;
- quick damage/healing/condition application;
- DM override and undo;
- exact mid-combat resume.

Automation suggests and tracks. The DM remains the final adjudicator.

## Pain point 5: Character resources are easy to forget

### Burden

Players and DMs must remember current HP, temporary HP, spell slots, class resources, hit dice, concentration, conditions, exhaustion, inspiration, death saves, rests, advancement, and which abilities recharge when.

### Product response

The character station keeps current values beside the cards that use them. Short rest, long rest, and level-up are explicit recorded events with edition-specific changes, a visible summary, and undo.

The system should never silently guess an edition-specific recovery rule.

## Pain point 6: Inventory loses meaning over time

### Burden

Weeks after finding treasure, a group may remember owning “a magic sword” or “a potion” but not its exact identity, effect, charges, attunement, owner, or whether it was consumed. Cursed and unidentified items also require separate DM knowledge and player knowledge.

### Product response

Every acquired item becomes a persistent item instance with:

- original definition and version;
- exact name and player-known name;
- known and hidden properties;
- owner and equipped/container location;
- charges, quantity, uses, and recharge timing;
- attunement and curse knowledge;
- acquisition history and transfers;
- consumed, lost, sold, or destroyed state.

The player sees the Potion of Growth in inventory two weeks later and can use it from the card. The DM retains any undiscovered curse or property separately.

## Pain point 7: NPC conversations and relationships are forgotten

### Burden

The DM may remember an NPC's concept but forget what the NPC promised, lied about, learned, or said several sessions earlier. Players may remember the encounter differently.

### Product response

NPC instances retain important dialogue, promises, lies, favors, attitude changes, last known location, knowledge, and unresolved business. The DM card surfaces the most relevant prior interaction when the NPC returns.

## Pain point 8: Rooms reset in the DM's memory

### Burden

After leaving an area, the group may forget which door was opened, trap disabled, container searched, monster spared, or treasure claimed. Returning to the original room description can contradict prior play.

### Product response

Area / Room state persists separately from immutable source content. Revisited cards show the current altered state and preserve the original description for reference.

## Pain point 9: Save files often preserve numbers but not context

### Burden

A character sheet or initiative list alone cannot answer: Why are we here? What were we doing? What did the NPC say? Which clue mattered? Whose turn is next? What changed in the room?

### Product response

Save the full context graph, current Scene, event history, quests, NPC memory, area changes, combat, characters, and item instances. On return, show a concise “Previously / Right now / Next decision” briefing appropriate to each role.

## Pain point 10: Tools can add more work than they remove

### Burden

Duplicate entry, excessive configuration, tiny controls, equal emphasis on every option, and fragmented modules can make a digital table slower than paper.

### Product response

Every feature must state which burden it removes. The same fact has one authoritative owner. Common actions are immediate; advanced controls are available when needed. Features that create more tracking than they eliminate are rejected or redesigned.

## Priority implementation order derived from the research

1. Exact place and Scene hierarchy
2. Stable save/resume and event history
3. Fast initiative and complete combat tracking
4. Persistent characters, rests, resources, and advancement
5. Persistent item instances and player/DM knowledge boundaries
6. NPC memory and relationship continuity
7. Area alteration and trigger persistence
8. Campaign recap, search, and “what happens next” assistance

This order directly supports the North Star: easier preparation, easier tracking, and more uninterrupted play.
