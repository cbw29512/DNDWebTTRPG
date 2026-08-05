# Canonical Adventure Place and Scene Model

Last updated: 2026-08-05

This document defines how The Living Table separates **where the party is** from **what is happening**. The distinction is required for intuitive play, reliable persistence, and exact save/resume.

## Core model

```text
Campaign / World
  └─ Location
      └─ Site
          └─ Area
              └─ Current Scene state
```

Location, Site, and Area are spatial. Scene is temporal: it is the active conversation, discovery, puzzle, combat, rest, aftermath, or other event occurring in the Area.

## Campaign / World

The Campaign or World is the long-lived container for the game. It owns campaign membership, edition, character ownership, global time, long-term quests, factions, milestones, and world facts. It belongs in the persistent application frame rather than consuming a live-board slot.

## Location

A Location is the broad part of the world containing play.

Examples:

- a city or town;
- a forest or desert;
- a coastline;
- a mountain range;
- an open-ocean region;
- a major underground region.

A Location answers:

> What broad part of the world are we in?

A city Location can contain an inn, blacksmith, chapel, manor, market, and sewers. A forest Location can contain a ruin, campsite, den, bridge, shrine, and cave entrance.

## Site

A Site is a named destination, structure, complex, or sub-place inside a Location.

Examples:

- The Wishing Cake Inn;
- a blacksmith shop;
- a chapel;
- a manor;
- a bandit camp;
- a ruined watchtower;
- a dungeon or cave complex.

A Site answers:

> Which destination or complex are we currently inside, at, or exploring?

A Site stays active while the party moves between Areas inside it.

## Area

An Area is the party's immediate playable surroundings: the scale that would normally receive a battle map or focused theater-of-the-mind description.

Examples:

- an inn taproom;
- a castle dining room;
- a cellar;
- a secret chamber;
- a forest clearing;
- a bridge crossing;
- a beach landing;
- a street ambush zone.

A physical room is one kind of Area. The interface uses **Area** so outdoor play is not modeled as architecture.

An Area owns or references:

- artwork or battle map;
- player-facing description;
- obvious features and exits;
- DM-only features, secrets, checks, and DCs;
- terrain, light, weather, and environmental rules;
- persistent changes such as opened doors, disabled traps, damage, searched containers, claimed treasure, and defeated enemies.

An Area answers:

> What immediate space are the characters standing in and interacting with right now?

## Scene

A Scene is the active situation occurring in an Area.

Examples in the same inn hall:

- birthday introductions;
- The Stolen Wish;
- Animated Present combat;
- questioning Martha after the fight;
- searching for the cellar clue;
- resting and planning the pursuit.

Changing Scene does not necessarily move the party. Conversation can become combat, and combat can become interrogation or aftermath, without changing Location, Site, or Area.

A Scene owns or references:

- the current dramatic question or phase;
- setup and read-aloud beat;
- participants involved;
- checks, triggers, and conditional responses;
- combat, conversation, puzzle, or rest state;
- success, failure, delay, and partial-success consequences;
- transitions to another Scene or Area;
- scene-specific event history.

A Scene answers:

> What is happening here right now?

## Live-board contract

The canonical live board contains exactly seven slots:

```text
Location | Site | Area | NPCs | Monsters | Traps/Hazards | Treasure/Rewards
```

Scene and Quest are not live-board slots.

- The active Scene is session progress.
- The Area card shows `Now: <Scene title>`.
- Scene player-safe information is composed into the player Area back.
- Scene DM information is composed into the DM Area back.
- Quest definitions and progress appear in the Quest Tracker.

Reusable Scene and Objective cards can remain source definitions for authoring, printing, auditing, and content reuse, but they do not become board instances.

## Wishing Cake example

```text
Campaign: The Wishing Cake
Location: Bramblewick
Site: The Wishing Cake Inn
Area: Grand Celebration Hall
Scene state: The Stolen Wish
```

After following the clue below:

```text
Campaign: The Wishing Cake
Location: Bramblewick
Site: Old Celebration Halls
Area: Holding Cells
Scene state: Escape and Ceiling Ambush
```

The source adventure does not name its city. `Bramblewick` is an original, isolated working label and can be renamed without altering the hierarchy.

## Loading contract

Loading a prepared Scene must automatically prepare:

- the current Location card;
- the current Site card;
- the current Area card;
- assigned NPCs and monsters;
- hazards and treasure;
- Scene identity and Scene-card reference in session state;
- quests activated through the Scene's `questIds`;
- connected transitions;
- existing persistent state for every entity involved.

Loaded does not mean revealed. The DM receives all required material; each player receives only player-safe and revealed projections.

The DM must not rebuild a purchased Scene manually from the library during play.

## Manifest ownership

A schema-version-3 adventure manifest separates state owners:

```js
{
  entrySceneId: "opening-inn",
  startingBoard: {
    location: ["location"],
    site: ["site-wishing-cake-inn"],
    room: ["room"],
    npc: ["caretaker"],
    monster: [],
    hazard: [],
    treasure: []
  },
  startingQuests: ["objective"],
  scenes: [{
    id: "opening-inn",
    sceneCardId: "scene-stolen-wish",
    locationId: "location",
    siteId: "site-wishing-cake-inn",
    roomId: "room",
    questIds: [],
    board: {
      npc: ["caretaker"],
      monster: [],
      hazard: [],
      treasure: []
    }
  }]
}
```

`scene` and `objective` are prohibited as board keys. Scene progress belongs to `currentSceneId` and `currentSceneCardId`; quest progress belongs to `quests` and `questState`.

## Movement and transition rules

- Traveling to another region, town, biome, or major broad area changes Location.
- Entering another destination or complex inside the same Location changes Site.
- Moving to another immediate map-scale space changes Area.
- A new conversation, discovery, puzzle, combat, rest, or aftermath can change Scene without changing physical place.
- A single action may change multiple levels. Entering a secret door may keep Location and Site while changing Area and Scene.

## Persistence contract

The authoritative session must preserve the exact hierarchy and all meaningful state:

```js
{
  currentLocationId: "bramblewick",
  currentSiteId: "old-celebration-halls",
  currentRoomId: "cake-chamber",
  currentSceneId: "wish-circle-combat",
  currentSceneCardId: "scene-cake-chamber",
  board: {
    location: ["bramblewick"],
    site: ["old-celebration-halls"],
    room: ["cake-chamber"],
    npc: ["npc-sepulchral"],
    monster: ["monster-sepulchral"],
    hazard: ["hazard-wish-circle"],
    treasure: []
  },
  quests: ["recover-wish"],
  questState: {
    active: [],
    revealed: ["recover-wish"]
  },
  roomState: {},
  sceneState: {},
  combatState: {},
  eventHistory: []
}
```

Area and Scene state must survive leaving, refreshing, reconnecting, and returning later.

Older browser saves can contain `scene` or `objective` board keys. Schema-version-3 migration must preserve their meaning in Scene and quest state and then remove the legacy board keys.

## Non-negotiable distinctions

- **Campaign / World:** Which continuing game is this?
- **Location:** What broad part of the world are we in?
- **Site:** Which destination or complex are we at?
- **Area:** What immediate space surrounds the characters?
- **Scene:** What is happening in that space right now?

These terms must not be collapsed or used interchangeably in manifests, state, UI labels, cards, tests, or documentation.
