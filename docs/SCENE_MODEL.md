# Canonical Adventure Place and Scene Model

Last updated: 2026-08-05

This document defines how The Living Table separates **where the party is** from **what is happening**. The distinction is required for intuitive play, reliable persistence, and exact save/resume.

## Core model

```text
Campaign / World
  └─ Location
      └─ Site
          └─ Area / Room
              └─ Current Scene
```

The first four levels describe increasingly specific context. A Scene is not another physical container; it is the active event, interaction, encounter, or phase occurring in the current Area.

## Campaign / World

The Campaign or World is the long-lived container for the entire game.

Examples:

- a named fantasy world;
- a homebrew campaign setting;
- The Wishing Cake one-shot campaign record;
- a continuing party's shared history.

It owns campaign membership, edition, character ownership, global time, long-term quests, factions, milestones, and world facts. It normally appears in the persistent application header rather than consuming a card slot on the live board.

## Location

A Location is the broad area currently containing the party.

Examples:

- a city or town;
- Blackpine Forest;
- the Red Waste;
- the Ashen Coast;
- a mountain range;
- an open-ocean region;
- a large cave region when the cave system itself is the broad travel environment.

A Location answers:

> What broad part of the world are we in?

A Location may contain many Sites. A city Location can contain an inn, blacksmith, chapel, manor, market, sewer entrance, and dozens of other destinations. A forest Location can contain a ruin, campsite, den, bridge, shrine, and cave entrance.

The Location card can establish atmosphere, weather, culture, travel conditions, factions, common creature ecology, and regional effects.

## Site

A Site is a named destination, structure, complex, or sub-place inside a Location.

Examples inside a city:

- The Wishing Cake Inn;
- Ironjaw Blacksmith;
- Saint Orra's Chapel;
- the governor's manor;
- South Market;
- the old sewer complex.

Examples inside a forest:

- the ruined watchtower;
- the bandit camp;
- the moon shrine;
- the owlbear den;
- Frostfang Caverns.

A Site answers:

> Which destination or complex are we currently inside, at, or exploring?

A Site may contain multiple Areas / Rooms. The Site remains active while the party moves between rooms in the inn, chambers in the dungeon, zones in the camp, or sections of the cave.

## Area / Room

An Area / Room is the party's immediate playable surroundings—the scale that would normally receive a battle map or focused theater-of-the-mind description.

Examples:

- Grand Celebration Hall;
- inn kitchen;
- blacksmith workshop;
- chapel nave;
- castle dining room;
- secret chamber;
- forest clearing;
- bridge crossing;
- beach landing;
- dune basin;
- cave pocket;
- street ambush zone.

An Area / Room answers:

> What immediate space are the characters standing in and interacting with right now?

It owns or references:

- area artwork or battle map;
- player-facing description;
- obvious features and exits;
- hidden features and secret doors;
- local terrain, light, weather, and environmental rules;
- NPCs, monsters, traps, clues, and treasure that can be present;
- persistent changes such as opened doors, disabled traps, damage, searched containers, claimed treasure, and defeated enemies.

The word **Room** remains valid for an enclosed chamber. The UI uses **Area / Room** so outdoor and open environments do not feel incorrectly modeled as architecture.

## Scene

A Scene is the active situation occurring in an Area / Room.

Examples in the same inn hall:

- Wendy's birthday introductions;
- The Stolen Wish;
- Animated Present combat;
- questioning Martha after the fight;
- searching for the cellar clue;
- resting and planning the pursuit.

Examples in the same boss chamber:

- negotiation with Sepulchral;
- Wish Circle combat;
- surrender and reconciliation;
- celebration and epilogue.

A Scene answers:

> What is happening here right now?

A Scene owns or references:

- current objective and dramatic question;
- setup and read-aloud beat;
- participants currently involved;
- checks, triggers, and conditional responses;
- combat or puzzle phase state;
- success, failure, delay, and partial-success consequences;
- transitions to another Scene or another Area;
- scene-specific event history.

Changing Scene does not necessarily move the party. A conversation can become combat in the same room; combat can become interrogation or aftermath without changing Location, Site, or Area.

## Wishing Cake example

```text
Campaign: The Wishing Cake
Location: Bramblewick
Site: The Wishing Cake Inn
Area / Room: Grand Celebration Hall
Scene: The Stolen Wish
```

After the party follows the clue below:

```text
Campaign: The Wishing Cake
Location: Bramblewick
Site: Old Celebration Halls
Area / Room: Holding Cells
Scene: Escape and Ceiling Ambush
```

Later, while still in the Cake Chamber:

```text
Location remains: Bramblewick
Site remains: Old Celebration Halls
Area / Room remains: Cake Chamber
Scene changes: Negotiation → Wish Circle Combat → Resolution
```

The source adventure does not name its city. `Bramblewick` is an original, isolated working label and may be renamed without changing the hierarchy.

## Card responsibilities

### Location card

- Broad visual identity and atmosphere
- Region or settlement facts
- Travel and regional effects
- Known Sites

### Site card

- Destination identity and purpose
- Known Areas / Rooms
- Site-wide rules, security, inhabitants, or recurring effects
- Connections to other Sites

### Area / Room card

- Immediate artwork or map
- Read-aloud description
- Visible features and exits
- DM-only secrets, DCs, triggers, and persistent area state

### Scene card

- What is happening now
- Current objective or question
- Participants and active threats
- Checks, triggers, consequences, and transitions
- Combat, puzzle, conversation, or aftermath phase state

## Loading contract

Loading a prepared Scene must automatically prepare:

- the current Location card;
- the current Site card;
- the current Area / Room card;
- the current Scene card;
- assigned NPCs and monsters;
- hazards, clues, objectives, and treasure;
- connected transitions;
- existing persistent state for every entity involved.

Loaded does not mean revealed. The DM receives all required material; each player receives only player-safe and revealed projections.

The DM must not rebuild a purchased Scene manually from the library during play.

## Movement and transition rules

- Travel to another region, town, biome, or major broad area changes Location.
- Entering another destination or complex inside the same Location changes Site.
- Moving to another immediate map-scale space changes Area / Room.
- A new conversation, discovery, puzzle, combat, rest, or aftermath can change Scene without changing physical place.
- A single player action may change multiple levels. Entering a secret door may keep Location and Site while changing Area and Scene.

## Persistence contract

The authoritative session must preserve the exact hierarchy and all meaningful state:

```js
{
  campaignId: "wishing-cake-campaign",
  currentLocationId: "bramblewick",
  currentSiteId: "old-celebration-halls",
  currentRoomId: "cake-chamber",
  currentSceneId: "wish-circle-combat",
  visitedRoomIds: ["grand-celebration-hall", "holding-cells", "cake-chamber"],
  discoveredExitIds: ["inn-cellar", "cult-north-door"],
  roomState: {
    "cake-chamber": {
      objectsDestroyed: ["east-chandelier"],
      secretsRevealed: ["erasable-wish-runes"],
      claimedTreasureIds: [],
      alterations: ["north-door-open"]
    }
  },
  sceneState: {
    "wish-circle-combat": {
      phase: "round-3",
      triggersFired: ["first-rune-advance"],
      objectiveState: "in-progress"
    }
  }
}
```

Area and Scene state must survive leaving, refreshing, reconnecting, and returning later.

## Non-negotiable distinctions

- **Campaign / World:** Which continuing game is this?
- **Location:** What broad part of the world are we in?
- **Site:** Which destination or complex are we at?
- **Area / Room:** What immediate space surrounds the characters?
- **Scene:** What is happening in that space right now?

These terms must not be collapsed or used interchangeably in manifests, state, UI labels, cards, tests, or documentation.
