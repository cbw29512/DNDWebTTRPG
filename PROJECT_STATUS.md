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

- Lean seven-column encounter board: Location, Site, Area, NPCs, Monsters, Traps/Hazards, and Treasure/Rewards
- Scene progress shown as concise context on the Area and in DM adventure controls rather than consuming another board card
- Objectives and side quests shown in the dedicated Quest Tracker rather than duplicated on the board
- Card placement, reveal, flip, remove, grouping, and basic grouped initiative
- DM and Player libraries with role-specific tab visibility
- Pinned `DNDCards` catalog and artwork resolution
- Polished tarot-style card previews and automated card-quality reporting
- Player equipment doll and local item interactions
- Ordered Wishing Cake manifest and connected transitions
- Automatic board reconciliation when a prepared Scene loads

### Correct adventure hierarchy

The adventure model distinguishes:

```text
Campaign / World → Location → Site → Area
                                     └─ Current Scene state
```

For the opening:

- Location: Bramblewick, an original working city label
- Site: The Wishing Cake Inn
- Area: Grand Celebration Hall
- Current Scene: The Stolen Wish

The live board answers where the party is and what is physically present. The Area card carries the immediate read-aloud text, checks, triggers, secrets, and encounter context. Current Scene remains tracked without requiring a separate column.

### Browser-local state foundation

The local session schema still records:

- current Location, Site, Area / Room, and Scene;
- board state and reveal state;
- quest and side-quest state;
- visited Area history and discovered Scenes;
- world, Location, Site, Area, and Scene state containers;
- combat-state container;
- event-history container;
- migration/default handling for older browser saves.

The old Scene and Objective board entries may remain in legacy source/session data during migration, but the live interface removes those redundant columns. Quest state remains authoritative in the Quest Tracker, and Scene remains authoritative in session progress.

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
- Loading a Scene prepares the active Location, Site, Area, associated NPCs, monsters, hazards, treasure, transitions, and saved state.
- Objectives remain in the Quest Tracker rather than a board slot.
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
- The lean board is currently enforced after rendering while the older source renderer still defines legacy Scene and Objective slots; a future reducer cleanup should remove those legacy definitions at the source
- The state containers do not yet implement full NPC memory, item instances, rests, advancement, or combat persistence
- The city name `Bramblewick` is a working original label because the source adventure does not provide one
- Some Wishing Cake Areas still need dedicated clue, trigger, and treasure cards
- Only one partial pregen is present; a six-character legal roster is still required
- Full browser interaction and deployment smoke testing has not been verified for the lean board
- Automated tests were updated but have not been executed in the connector environment
- Complete D&D combat resolution is not implemented
- Artwork commercial-rights certification and 300-DPI print output remain unfinished

## Current priority

1. Browser-playtest the lean Location → Site → Area board on DM and player routes.
2. Remove the legacy Scene and Objective slots from the source renderer and direct board reducer rather than relying on post-render pruning.
3. Replace DOM reconciliation with a direct authoritative board/session reducer.
4. Implement saved combat: round, active turn, initiative, HP, conditions, concentration, resources, hazards, and exact resume.
5. Implement persistent item instances with identity, known/hidden properties, charges, attunement, curse knowledge, ownership, and history.
6. Implement NPC conversation and relationship memory.
7. Implement persistent Area alterations, traps, secrets, clues, and claimed treasure.
8. Complete missing Wishing Cake cards and six legal level-three pregens.
9. Add campaign creation, join code, claiming, ready lobby, and authoritative multiplayer synchronization.

## Next acceptance test

1. DM loads The Wishing Cake.
2. The board shows Location: Bramblewick, Site: The Wishing Cake Inn, and Area: Grand Celebration Hall.
3. The Area heading shows the current event, The Stolen Wish, without a separate Scene column.
4. The board contains no Objective / Quest column; the main and side quests remain in the Quest Tracker.
5. DM advances below the inn.
6. Location remains Bramblewick; Site changes to Old Celebration Halls; Area changes to Holding Cells; current Scene changes to Escape and Ceiling Ambush.
7. Associated NPC, monster, hazard, and treasure cards replace the prior Scene automatically.
8. Player route contains only revealed player-safe versions of the same lean board.
9. Save and refresh; confirm Location, Site, Area, Scene progress, board, quests, character, equipment, and event history return.

## Exact-resume target

A later acceptance test must save during round 3, close every browser, reopen later, and restore the exact next turn, combatants, initiative, HP, temporary HP, conditions, concentration, resources, Area changes, NPC context, quests, and inventory state without manual reconstruction.

## Definition of Done

A feature is complete only when implementation is merged, tests actually run and pass, DM/player visibility is verified at the payload level, deployed behavior is browser-tested, accessibility is reviewed, documentation is updated, and remaining limitations are stated honestly.
