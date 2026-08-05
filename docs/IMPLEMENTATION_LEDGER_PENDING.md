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
