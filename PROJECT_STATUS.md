# The Living Table — Project Status

Last updated: 2026-08-05

This is the source of truth for scope, current state, and execution order. Read it with `docs/PROJECT_CONTROL.md`, `docs/DECISIONS.md`, `docs/SCENE_MODEL.md`, and `docs/IMPLEMENTATION_LEDGER.md`.

## Product goal

Deliver a card-driven synchronized online tabletop where the DM loads a ready-to-run adventure, players claim complete characters, and the group moves through ordered Locations and Rooms without manually rebuilding the board.

## Canonical repository roles

- `cbw29512/DNDWebTTRPG`: runtime, website, sessions, campaigns, and multiplayer
- `cbw29512/DNDCards`: authoritative reusable card definitions, artwork, and print assets

## Implemented local prototype

- Card-driven DM board and role inspection views
- Card placement, reveal, flip, remove, grouping, and basic initiative
- DM and Player libraries with filters
- Pinned `DNDCards` catalog and artwork resolution
- Polished tarot-style card previews and automated card-quality reporting
- Player equipment doll and local item interactions
- Browser-local adventure, quest, board, and player-state persistence
- Runtime lockup hotfix and first observer-stability cleanup
- Canonical Location versus Room hierarchy
- Ordered Wishing Cake scene manifest
- Room navigation controls with previous, next, selector, and connected exits
- Automatic board reconciliation when a Room loads
- Session fields for current Location, current Room, room history, and discovered scenes

## Current ordered scene behavior

- Location is the broad environment and remains active while the party moves within it.
- Room is the immediate battle-map-scale area and changes as the party moves.
- Loading a Room prepares its associated NPC, monster, hazard, and treasure slots.
- Existing reveal state remains separate from loaded state.
- Scene order and connected exits come from the adventure manifest.
- Scene progress is saved in the browser-local session.

## Known limitations

- Single browser only; no real authentication, campaigns, join codes, multiplayer, or reconnect
- Scene loading uses the existing DOM card-picker bridge rather than a direct canonical board reducer
- Some Wishing Cake rooms still lack dedicated hazard, clue, and treasure cards
- Only one partial pregen is present; a six-character legal roster is still required
- Full browser interaction and deployment smoke testing has not been verified for the new scene runtime
- Tests were added but not executed in the connector environment
- Player-safe payload filtering is not server-authoritative
- Complete D&D combat resolution is not implemented
- Artwork commercial-rights certification and 300-DPI print output remain unfinished

## Current priority

1. Browser-playtest and harden ordered Room loading.
2. Complete missing Wishing Cake room-associated cards and triggers.
3. Prove save/reload returns to the exact active Location and Room.
4. Build six complete level-three pregens.
5. Add campaign creation, join code, claiming, and ready lobby.
6. Move local state to an authoritative shared multiplayer session.

## Next acceptance test

1. Load The Wishing Cake.
2. Confirm the broad Location card remains active.
3. Load the Holding Cells.
4. Confirm the opening Room and opening-only cards leave the board.
5. Confirm the Holding Cells card and Paper Plate Mimic load automatically.
6. Move to the Hall of Rejected Wishes using the connected exit.
7. Save and refresh.
8. Confirm the exact Location, Room, board cards, quests, player state, and room history return.

## Definition of Done

A feature is complete only when implementation is merged, tests actually run and pass, DM/player visibility is verified, deployed behavior is browser-tested, accessibility is reviewed, documentation is updated, and remaining limitations are stated honestly.
