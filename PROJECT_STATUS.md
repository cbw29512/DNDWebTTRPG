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

- Source-rendered seven-column encounter board: Location, Site, Area, NPCs, Monsters, Traps/Hazards, and Treasure/Rewards
- Scene progress shown on the Area card and in DM adventure controls
- Scene player and DM details composed into the matching Area back
- Objectives and side quests owned by the dedicated Quest Tracker
- Scene and Objective definitions excluded from the live Adventure Deck
- Card placement, reveal, flip, remove, grouping, and basic grouped initiative
- DM and Player libraries with role-specific tab visibility
- Pinned `DNDCards` catalog and artwork resolution
- Polished tarot-style card previews and automated card-quality reporting
- Player equipment doll and local item interactions
- Ordered Wishing Cake manifest and connected transitions
- Automatic board reconciliation when a prepared Scene loads

### Correct adventure hierarchy

```text
Campaign / World → Location → Site → Area
                                     └─ Current Scene state
```

For the opening:

- Location: Bramblewick, an original working city label
- Site: The Wishing Cake Inn
- Area: Grand Celebration Hall
- Current Scene: The Stolen Wish

The live board answers where the party is and what is physically present. The Area card supplies the current event context without creating a duplicate Scene column.

### Browser-local state foundation

Browser-local schema version 3 records:

- current Location, Site, Area, Scene, and Scene-card reference;
- exactly seven live board slots;
- quest and side-quest state outside the board;
- visited Area history and discovered Scenes;
- world, Location, Site, Area, and Scene state containers;
- combat-state and event-history containers;
- migration for older saves containing Scene and Objective board entries.

During migration, legacy Scene and Objective board data is converted into Scene and quest state before those board keys are discarded.

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
- Area is the immediate battle-map-scale space.
- Scene is the active conversation, discovery, puzzle, combat, rest, aftermath, or other event.
- Loading a Scene prepares Location, Site, Area, NPCs, monsters, hazards, treasure, transitions, and saved state.
- Per-Scene `questIds` activate side quests in the Quest Tracker.
- Scene progress remains separate from the seven-slot board.
- Existing reveal state remains separate from loaded state.
- Connected paths come from the adventure manifest.
- Every Scene load is recorded in event history.
- Players do not receive Scene-selection controls.

## Role-boundary truth

The separate routes establish the intended interaction model, but they are not secure authentication.

Secure multiplayer still requires the server to verify account identity, campaign membership, role, claimed seat, command authorization, and player-safe payloads before data leaves the server.

## Known limitations

- Single browser/static deployment; no real authentication, campaigns, join codes, multiplayer, or reconnect
- Static route separation is not a security boundary against local JavaScript manipulation
- Scene loading still reconciles through DOM controls rather than a direct authoritative reducer
- State containers do not yet implement full NPC memory, item instances, rests, advancement, or combat persistence
- `Bramblewick` remains a working original city label because the source adventure does not provide one
- Some Wishing Cake Areas still need dedicated clue, trigger, and treasure cards
- Only one partial pregen is present; a six-character legal roster is still required
- Full browser interaction and deployed smoke testing remain unverified
- The complete test suite could not be executed in the connector environment because it cannot resolve `github.com`; repository CI is being added to run it on GitHub
- Complete D&D combat resolution is not implemented
- Artwork commercial-rights certification and 300-DPI print output remain unfinished

## Current priority

1. Run repository CI and browser-playtest the source seven-slot board on DM and player routes.
2. Replace DOM reconciliation with a direct authoritative board/session reducer.
3. Implement saved combat: round, active turn, initiative, HP, conditions, concentration, resources, hazards, and exact resume.
4. Implement persistent item instances with identity, known/hidden properties, charges, attunement, curse knowledge, ownership, and history.
5. Implement NPC conversation and relationship memory.
6. Implement persistent Area alterations, traps, secrets, clues, and claimed treasure.
7. Complete missing Wishing Cake cards and six legal level-three pregens.
8. Add campaign creation, join code, claiming, ready lobby, and authoritative multiplayer synchronization.

## Next acceptance test

1. Load The Wishing Cake in the DM route.
2. Confirm exactly seven board slots exist in the source DOM.
3. Confirm Location is Bramblewick, Site is The Wishing Cake Inn, and Area is Grand Celebration Hall.
4. Confirm Area displays `Now: The Stolen Wish` and its back includes the appropriate Scene information.
5. Confirm no Scene or Objective board instance exists.
6. Confirm the main quest and side quests remain operable in the Quest Tracker.
7. Advance to the Holding Cells and verify Location remains Bramblewick while Site, Area, Scene context, and encounter cards change correctly.
8. Save and refresh; verify Scene, quest, board, character, equipment, and event history return.
9. Load an older schema-version-2 save and verify its legacy Scene and Objective board entries migrate without losing Scene or quest progress.
10. Repeat the flow in the player route and confirm only player-safe content is rendered.

## Exact-resume target

A later acceptance test must save during round 3, close every browser, reopen later, and restore the exact next turn, combatants, initiative, HP, temporary HP, conditions, concentration, resources, Area changes, NPC context, quests, and inventory state without manual reconstruction.

## Definition of Done

A feature is complete only when implementation is merged, tests actually run and pass, DM/player visibility is verified at the payload level, deployed behavior is browser-tested, accessibility is reviewed, documentation is updated, and remaining limitations are stated honestly.
