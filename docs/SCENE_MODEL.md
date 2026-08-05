# Canonical Location and Room Model

Last updated: 2026-08-05

This document defines how The Living Table represents the physical world during play.

## Core hierarchy

The runtime uses a two-level spatial hierarchy:

1. **Location** — the broad region, settlement, structure, biome, or large environment containing the current play area.
2. **Room** — the players' immediate surroundings and the specific area that would normally be represented by a battle map.

A room always belongs to a location. Changing rooms does not necessarily change location.

## Location

A Location card represents the broad environment containing one or more playable rooms or encounter areas.

Examples:

- Florence
- Neverwinter
- The Ashen Coast
- Blackpine Forest
- The Red Waste
- Frostfang Caverns
- Castle Veyra
- The Sunken Temple
- Open ocean

The Location card establishes the large-scale context:

- overall appearance and atmosphere;
- climate, terrain, light, weather, and ambient hazards;
- local culture or controlling faction;
- broad travel conditions;
- common creature ecology;
- regional rules or recurring effects;
- exits to other locations;
- which rooms or encounter areas belong to it.

The Location normally remains loaded while players move between rooms inside it.

## Room

A Room card represents the players' immediate surroundings: the specific chamber, building interior, street section, clearing, shoreline segment, cave pocket, or encounter area where moment-to-moment play occurs.

Examples inside a city location:

- The Silver Tankard Inn
- Market Square
- East Gate Alley
- Dock Warehouse 3

Examples inside a castle location:

- Great Hall
- Dining Room
- Cellar
- West Tower Landing
- Secret Room 1

Examples inside a forest location:

- Mossy Clearing
- Fallen Bridge
- Owlbear Den
- Burned Campsite

Examples inside a coastline location:

- Tide-Pool Shelf
- Wrecked Smuggler Camp
- Cliffside Battle Area

The Room card is the battle-map scale. It owns or references:

- the room image or map;
- player read-aloud description;
- DM-only description and context;
- NPCs currently present;
- monsters assigned to the area;
- traps and hazards;
- clues and interactable features;
- treasure and rewards;
- checks and DCs;
- triggers and consequences;
- exits and connected rooms;
- secret doors and conditional routes;
- encounter start and completion behavior.

## Card faces

### Room front

The Room card front is picture-first and shows:

- room or encounter-area artwork;
- room name;
- card type;
- location name or location badge;
- minimal additional text.

### Player back

The player-facing room back contains information the DM may reveal or read aloud:

- boxed/read-aloud description;
- obvious features;
- visible exits;
- public environmental rules;
- player-known changes after events occur.

### DM back

The DM-facing room back includes the player information plus:

- hidden features;
- specific checks and DCs;
- triggers;
- conditional outcomes;
- secret doors;
- monster tactics or arrival rules;
- trap behavior;
- treasure conditions;
- links to related cards and events.

Example:

> DC 15 Perception or Investigation notices that the eastern torch bracket can rotate. Turning it clockwise opens the concealed door to `secret-room-1`.

## Movement behavior

When players move within the same broad environment:

- the **Location card remains active**;
- the current **Room card changes**;
- cards associated with the old room leave the active scene unless marked persistent;
- cards associated with the new room are prepared automatically;
- loaded content remains separate from revealed content.

Example:

```text
Location: Castle Veyra
Current Room: Great Hall

Player rotates hidden torch bracket.
Secret door opens.
Players enter.

Location remains: Castle Veyra
Current Room becomes: Secret Room 1
```

When players leave the broad environment entirely, both Location and Room change.

Example:

```text
Location: Castle Veyra
Room: Courtyard

Players travel into Blackpine Forest.

Location becomes: Blackpine Forest
Room becomes: Old Hunter's Trail
```

## Scene loading contract

Loading a room must automatically prepare all cards declared by that room manifest:

- the Room card;
- present NPCs;
- present monsters;
- traps and hazards;
- visible and hidden interactables;
- clues;
- treasure;
- quests or objective updates;
- triggers;
- connected-room choices.

The DM should not manually search the library and reconstruct a published room during play.

## Open-area rule

A room does not have to be an enclosed architectural chamber. In an open environment, the room is the immediate playable area surrounding the party.

Therefore:

- forest is usually a Location;
- a forest clearing, den, campsite, bridge, or ambush zone is a Room;
- desert is usually a Location;
- a dune basin, ruined caravan, oasis edge, or battle area is a Room;
- coastline is usually a Location;
- a beach landing, cliff shelf, cave mouth, or wreck site is a Room.

## Runtime state

The authoritative session should store at minimum:

```js
{
  currentLocationId: "castle-veyra",
  currentRoomId: "great-hall",
  visitedRoomIds: ["courtyard", "great-hall"],
  discoveredExitIds: ["great-hall-secret-door"],
  roomState: {
    "great-hall": {
      triggersFired: ["torch-bracket-turned"],
      secretsRevealed: ["secret-door"],
      defeatedMonsterIds: [],
      claimedTreasureIds: []
    }
  }
}
```

Room-specific state must persist when the party leaves and returns.

## Non-negotiable distinction

- **Location answers:** "What broad place are we in?"
- **Room answers:** "What immediate area are the players standing in and interacting with right now?"

These terms must not be treated as interchangeable in manifests, UI labels, card definitions, tests, or documentation.
