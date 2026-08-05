# The Living Table — Project Status

Last updated: 2026-08-05

This is the source of truth for scope, current state, and execution order. Read it with `docs/NORTH_STAR.md`, `docs/PROJECT_CONTROL.md`, `docs/DECISIONS.md`, `docs/SCENE_MODEL.md`, `docs/DND_PLAY_MODEL.md`, `docs/GAME_STATE_MEMORY_MODEL.md`, `docs/DND_PAIN_POINTS.md`, and `docs/IMPLEMENTATION_LEDGER.md`.

## Product goal

Deliver a card-driven synchronized tabletop that makes D&D easier to prepare, track, resume, run, and play.

The system remembers the game so the people at the table can play:

- The DM runs the world, NPCs, monsters, hazards, hidden information, rulings, reveals, consequences, and progression.
- A player controls one claimed character and experiences the DM's game through revealed cards, character resources, choices, and rolls.
- A campaign can resume with exact meaningful context, including in the middle of combat.

## Canonical repository roles

- `cbw29512/DNDWebTTRPG`: runtime, website, sessions, campaigns, state instances, and multiplayer
- `cbw29512/DNDCards`: authoritative reusable card definitions, artwork, and print assets

## Implemented local prototype

### Role experience

- Dedicated DM entry at the root / `dm.html`
- Dedicated player entry at `player.html`
- Immutable role selected from the entry point rather than an in-session switch
- Player-safe session projection from the player's first render
- Player world cards do not expose monster, NPC, hazard, reveal, removal, deck-building, or monster-initiative controls
- Scene loading restricted to the DM runtime

### Card and adventure experience

- Card-driven DM board
- Card placement, reveal, flip, remove, grouping, and basic grouped initiative
- DM and Player libraries with role-specific tab visibility
- Pinned `DNDCards` catalog and artwork resolution
- Polished tarot-style card previews and automated card-quality reporting
- Player equipment doll and local item interactions
- Ordered Wishing Cake manifest and connected transitions
- Automatic board reconciliation when a prepared Scene loads

### Correct adventure hierarchy

The board and manifest now distinguish:

```text
Campaign / World → Location → Site → Area / Room
                                     └─ Current Scene
```

For the opening:

- Location: Bramblewick, an original working city label
- Site: The Wishing Cake Inn
- Area / Room: Grand Celebration Hall
- Scene: The Stolen Wish

The first context row now answers where the party is and what is happening. NPC, monster, hazard, objective, and treasure cards answer who and what is involved.

### Browser-local state foundation

The local session schema now includes:

- current Location, Site, Area / Room, Scene, and Scene card;
- complete board slots including objectives;
- visited room history and discovered Scenes;
- world, Location, Site, Area, and Scene state containers;
- combat-state container;
- event-history container;
- migration/default handling for older browser saves.

This is the state foundation, not yet the complete exact-resume implementation.

### Project control and research

- North Star and anti-drift charter
- Canonical D&D role/play model
- Canonical place and Scene model
- Canonical exact-resume and game-memory model
- Researched D&D pain-point priorities
- Runtime lockup fixes and observer-stability work

## Current Scene behavior

- Location is the broad city, settlement, region, or biome.
- Site is the named destination or complex inside the Location.
- Area / Room is the immediate battle-map-scale space.
- Scene is the active conversation, discovery, puzzle, combat, rest, aftermath, or other event.
- Loading a Scene prepares all four context cards plus its assigned NPCs, monsters, hazards, objectives, and treasure.
- Existing reveal state remains separate from loaded state.
- Connected paths come from the adventure manifest.
- The local session records each Scene load as an event.
- Players do not receive Scene-selection controls.

## Role-boundary truth

The separate routes establish the intended interaction model, but they are not secure authentication.

Secure multiplayer still requires the server to verify account identity, campaign membership, role, claimed seat, command authorization, and player-safe payloads before data leaves the server.

## Known limitations

- Single browser/static deployment; no real authentication, campaigns, join codes, multiplayer, or reconnect
- Static route separation is not a security boundary against local JavaScript manipulation
- Scene loading still uses the DOM card-picker bridge rather than a direct authoritative reducer
- The new state containers do not yet implement full NPC memory, item instances, rests, advancement, or combat persistence
- The city name `Bramblewick` is a working original label because the source adventure does not provide one
- Some Wishing Cake Areas still need dedicated clue, trigger, and treasure cards
- Only one partial pregen is present; a six-character legal roster is still required
- Full browser interaction and deployment smoke testing has not been verified for the new hierarchy
- Automated tests were updated but have not been executed in the connector environment
- Complete D&D combat resolution is not implemented
- Artwork commercial-rights certification and 300-DPI print output remain unfinished

## Current priority

1. Browser-playtest the corrected Location → Site → Area → Scene board on DM and player routes.
2. Replace DOM reconciliation with a direct authoritative board/session reducer.
3. Implement saved combat: round, active turn, initiative, HP, conditions, concentration, resources, hazards, and exact resume.
4. Implement persistent item instances with identity, known/hidden properties, charges, attunement, curse knowledge, ownership, and history.
5. Implement NPC conversation and relationship memory.
6. Implement persistent Area alterations, traps, secrets, clues, and claimed treasure.
7. Complete missing Wishing Cake cards and six legal level-three pregens.
8. Add campaign creation, join code, claiming, ready lobby, and authoritative multiplayer synchronization.

## Next acceptance test

1. DM loads The Wishing Cake.
2. The board shows Bramblewick → The Wishing Cake Inn → Grand Celebration Hall → The Stolen Wish.
3. DM advances below the inn.
4. Location remains Bramblewick; Site changes to Old Celebration Halls; Area changes to Holding Cells; Scene changes to Escape and Ceiling Ambush.
5. Associated cards replace the prior Scene automatically.
6. Player route contains only revealed player-safe versions of the four context cards and associated cards.
7. Save and refresh.
8. Confirm the exact Location, Site, Area, Scene, board, quests, character, equipment, and event history return.
9. Confirm the legacy six-slot guard does not delete Site or Scene.

## Exact-resume target

A later acceptance test must save during round 3, close every browser, reopen later, and restore the exact next turn, combatants, initiative, HP, temporary HP, conditions, concentration, resources, room changes, NPC context, quests, and inventory state without manual reconstruction.

## Definition of Done

A feature is complete only when implementation is merged, tests actually run and pass, DM/player visibility is verified at the payload level, deployed behavior is browser-tested, accessibility is reviewed, documentation is updated, and remaining limitations are stated honestly.
