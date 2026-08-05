# Pending implementation-ledger entries

These entries must be moved into `docs/IMPLEMENTATION_LEDGER.md` with their final merge SHAs during the next ledger consolidation.

## PR #67 — Ordered Location and Room runtime

Actually delivered:

- Eight ordered Wishing Cake scenes.
- Broad Location persists while the immediate Room changes.
- Previous, next, direct-select, and connected-exit navigation.
- Automatic board reconciliation for room, NPC, monster, hazard, and treasure slots.
- Browser-local session fields for current scene, location, room, room history, and discovered scenes.

Known boundary:

- Superseded and refined by PR #71's Location → Site → Area / Room → Scene model.
- Tests were added but not executed in the connector environment.
- Browser and deployed behavior remain unverified.

## PR #69 — Strict Dungeon Master and player experiences

Head SHA before merge: `42e3ac3553b5ba2d62d00854ec0710e5202e0032`

Milestone advanced:

- Role-safe DM-to-player play path and D&D interaction model.

Actually delivered:

- Root and `dm.html` enter the Dungeon Master experience.
- `player.html` enters the player experience.
- Runtime role is immutable and selected before the first session projection.
- The in-session DM/Player preview switch is removed.
- Player world cards cannot operate monsters, NPCs, hazards, scene progression, reveals, removal, deck construction, or monster initiative.
- Scene progression is DM-only.
- Added `docs/DND_PLAY_MODEL.md` as the canonical role, rhythm-of-play, three-pillar, interface, and ease-of-use reference.
- Recorded SRD 5.1 versus SRD 5.2.1 edition and licensing boundaries.
- Added source-level role-boundary regression checks.

Tests actually run:

- Test files were added to `npm test`.
- The test suite was not executed because the environment could not resolve `github.com` for a local clone.

Browser/deployment verification:

- Not yet performed.

Known limitations:

- Static routes are not secure authentication.
- Player Library still comes from a shared browser module.
- Server-verified account, campaign role, claimed seat, command authorization, and player-safe network payloads remain required.

Next acceptance test:

- Open the DM and player routes in separate browser contexts, load the same Scene, and verify that the DM receives all controls/private information while the player receives only the claimed character and revealed player-safe cards.

## PR #71 — Separate place hierarchy from active Scenes and lock game memory model

Head SHA before merge: `b1bad51a90ece266f15a190adf61a51ba21903c8`

Burden removed:

- Prevents the DM from confusing a city, building, immediate room, and event.
- Creates one visible answer for where the party is and what is happening.
- Establishes the state needed to stop reconstructing campaigns, inventory, NPC conversations, rooms, and combat from memory.

Actually delivered:

- Added Site and Scene card types.
- Replaced the two-level model with Campaign / World → Location → Site → Area / Room, with Scene as the active event.
- Corrected the Wishing Cake opening to Bramblewick → The Wishing Cake Inn → Grand Celebration Hall → The Stolen Wish.
- Added two Site cards and eight Scene cards.
- Updated the adventure manifest to spatial model v2.
- Updated Scene loading to reconcile Location, Site, Area / Room, Scene, NPC, monster, hazard, objective, and treasure state.
- Added a readable two-tier board layout rather than squeezing every card into one horizontal row.
- Fixed the legacy six-slot guard that would have deleted Site and Scene after render.
- Bumped the browser-local session to schema v2 with current Site/Scene fields, state containers, combat state, and event history.
- Added canonical Scene, exact-resume/game-memory, and D&D pain-point documents.
- Updated project control, approved decisions, status, and regression-source checks.

Tests actually run:

- Existing source tests were updated and a new spatial/tracking regression was added to `npm test`.
- The suite was not executed because the available environment could not resolve `github.com` for a local clone.

Browser/deployment verification:

- Not yet performed.

Known limitations:

- `Bramblewick` is a working original city name, not a name supplied by the source adventure.
- The new memory fields are a foundation; complete combat persistence, item instances, NPC memory, Area changes, rests, advancement, and authoritative multiplayer remain to be implemented.
- Scene loading still uses DOM reconciliation rather than a direct authoritative reducer.

Next acceptance test:

- Verify side-by-side DM/player routes show the correct four-card context, transition from the inn into the Old Celebration Halls without changing the city Location, preserve player-safe boundaries, and restore the same context after refresh.

## PR #72 — Remove redundant Scene and Objective board slots

Burden removed:

- Reduces the live encounter board from duplicated context and quest columns to the seven things the DM actively needs to see and operate.
- Prevents the same quest information from being tracked in both a board slot and the Quest Tracker.
- Keeps Scene progress available without requiring another full-size card column.

Actually delivered:

- Live board now exposes Location, Site, Area, NPCs, Monsters, Traps/Hazards, and Treasure/Rewards.
- Current Scene appears as concise `Now:` context on the Area and remains available in DM adventure controls.
- Scene and Objective cards are removed from the rendered board and pruned from the Adventure Deck.
- Room card labels are presented as Area labels without changing the source card-type schema yet.
- Quest Tracker is the sole quest presentation and management surface.
- Quest Tracker now detects the immutable runtime role, restoring DM-only side-quest controls after the old role switch was removed.
- Added cache-busted DM/player builds, responsive seven-slot styling, updated decisions/status, and a lean-board regression test.

Tests actually run:

- `tests/lean-area-board.test.mjs` was added to `npm test`.
- The test suite was not executed in the connector environment.

Browser/deployment verification:

- Not yet performed.

Known limitations:

- The older source renderer, manifest, and browser-local board schema still define legacy Scene and Objective entries.
- This PR removes those entries from the live interface through guarded post-render pruning; the deeper reducer/schema migration remains future work.

Next acceptance test:

- Load the DM and player routes, verify exactly seven encounter columns, confirm the Area displays the active Scene context, confirm the Quest Tracker retains main/side quests and DM controls, and verify save/refresh preserves Scene and quest state.

## PR #73 — Remove legacy Scene and Objective board state

Head SHA before final ledger update: `c8ce626bc81903c7b603ffc06959d3f419bc983e`

Burden removed:

- Eliminates duplicate board state and the post-render guard that repeatedly removed it.
- Gives Scene, quests, and the live board one clear state owner each.
- Prevents old saves from losing Scene or quest progress during the migration.

Actually delivered:

- Source renderer defines exactly seven live slots: Location, Site, Area, NPCs, Monsters, Traps/Hazards, and Treasure/Rewards.
- Active Scene player-safe and DM details are composed into the current Area card.
- Scene and Objective definitions are excluded from the live Adventure Deck.
- Deleted `encounter-slot-guard.js` and removed it from DM/player entry points.
- Wishing Cake manifest moved to schema version 3 with seven-slot board payloads, `startingQuests`, and per-Scene `questIds`.
- Scene loading now reconciles only seven board slots and activates quests through quest state.
- Browser-local schema version 3 migrates old Scene and Objective board entries into Scene and quest state before removing the legacy keys.
- Adventure loader validates schema version 3 and rejects legacy Scene/Objective board keys.
- Updated canonical decisions, Scene model, project status, responsive styling, and regression tests.

Tests actually run:

- JavaScript syntax checks, manifest JSON validation, and focused static assertions passed against the composed changed files.
- The connector container could not clone the repository because it could not resolve `github.com`.
- The repository's existing GitHub Actions workflow runs `npm test` for this pull request; its result must be checked before merge.

Browser/deployment verification:

- Not yet performed.

Known limitations:

- Board reconciliation still operates through DOM controls rather than a direct authoritative reducer.
- Secure multiplayer, full combat persistence, item memory, NPC memory, rests, advancement, and complete browser smoke testing remain unfinished.

Next acceptance test:

- Verify schema-version-3 CI passes, then run DM/player browser tests for exactly seven source slots, Area-carried Scene details, Quest Tracker persistence, Scene transitions, refresh recovery, and migration from a schema-version-2 browser save.
