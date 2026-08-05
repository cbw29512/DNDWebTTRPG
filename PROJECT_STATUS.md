# The Living Table — Project Status

Last updated: 2026-08-05

This is the source of truth for scope, current state, and execution order. Read it with `docs/PROJECT_CONTROL.md`, `docs/DECISIONS.md`, `docs/SCENE_MODEL.md`, `docs/DND_PLAY_MODEL.md`, and `docs/IMPLEMENTATION_LEDGER.md`.

## Product goal

Deliver a card-driven synchronized online tabletop where the DM loads and runs a ready-to-run adventure, players control complete characters, and the group moves through ordered Locations and Rooms without manually rebuilding the board.

The experience intentionally has two different roles:

- The DM runs the world, NPCs, monsters, hazards, hidden information, rulings, reveals, consequences, and progression.
- A player controls one claimed character and experiences the DM's game through revealed cards, character resources, choices, and rolls.

## Canonical repository roles

- `cbw29512/DNDWebTTRPG`: runtime, website, sessions, campaigns, and multiplayer
- `cbw29512/DNDCards`: authoritative reusable card definitions, artwork, and print assets

## Implemented local prototype

- Card-driven DM board
- Dedicated DM runtime entry at the root / `dm.html`
- Dedicated player runtime entry at `player.html`
- Immutable role selected from the entry point rather than an in-session view switch
- Player-safe session projection used from the player's first render
- Player world cards no longer expose monster, NPC, hazard, reveal, removal, deck-building, or monster-initiative controls
- Scene loading and Room progression restricted to the DM runtime
- Role-specific guidance based on the D&D describe → declare actions → adjudicate/result rhythm
- Card placement, reveal, flip, remove, grouping, and basic initiative for the DM
- DM and Player libraries with role-specific tab visibility
- Pinned `DNDCards` catalog and artwork resolution
- Polished tarot-style card previews and automated card-quality reporting
- Player equipment doll and local item interactions
- Browser-local adventure, quest, board, and player-state persistence
- Runtime lockup hotfix and observer-stability cleanup
- Canonical Location versus Room hierarchy
- Ordered Wishing Cake scene manifest
- Room navigation controls with previous, next, selector, and connected exits
- Automatic board reconciliation when a Room loads
- Session fields for current Location, current Room, room history, and discovered scenes
- Canonical D&D play/interface reference in `docs/DND_PLAY_MODEL.md`

## Current ordered scene behavior

- Location is the broad environment and remains active while the party moves within it.
- Room is the immediate battle-map-scale area and changes as the party moves.
- Loading a Room prepares its associated NPC, monster, hazard, and treasure slots.
- Existing reveal state remains separate from loaded state.
- Scene order and connected exits come from the adventure manifest.
- Scene progress is saved in the browser-local DM session.
- Players do not receive scene-selection or Room-loading controls.

## Role-boundary truth

The current separate routes establish the intended interaction model, but they are not secure authentication.

Secure multiplayer still requires the server to verify:

- account identity;
- campaign membership;
- DM or player role;
- claimed seat and character ownership;
- every command's authorization;
- the player-safe payload before data leaves the server.

Hidden DM information must ultimately be absent from player network payloads, not merely absent from rendered controls.

## Known limitations

- Single browser/static deployment; no real authentication, campaigns, join codes, multiplayer, or reconnect
- Static route separation is not a security boundary against a user manipulating local JavaScript
- Player Library still shares a browser-loaded module with DM Library; server-backed role-specific data loading remains required
- Scene loading uses the existing DOM card-picker bridge rather than a direct canonical board reducer
- Some Wishing Cake rooms still lack dedicated hazard, clue, and treasure cards
- Only one partial pregen is present; a six-character legal roster is still required
- Full browser interaction and deployment smoke testing has not been verified for the strict-role routes
- Automated role-boundary tests were added but could not be executed because the connector environment cannot resolve GitHub for a local clone
- Complete D&D combat resolution is not implemented
- Artwork commercial-rights certification and 300-DPI print output remain unfinished

## Current priority

1. Browser-playtest the DM and player routes side by side.
2. Verify that no DM back, hidden card, hidden DC, monster control, or scene control enters the player DOM or payload.
3. Harden ordered Room loading and save/reload.
4. Complete missing Wishing Cake room-associated cards and triggers.
5. Build six complete level-three pregens.
6. Add campaign creation, join code, claiming, and ready lobby.
7. Move local state to an authoritative shared multiplayer session with server-enforced projections.

## Next acceptance test

1. Open the root DM route and `player.html` in separate browser contexts.
2. Confirm neither route offers an in-session role switch.
3. DM loads The Wishing Cake and the Holding Cells.
4. DM sees the full Room back, secret information, Paper Plate Mimic controls, scene controls, and reveal tools.
5. Player sees only the revealed Location, Room, creatures, public initiative, character station, and player-safe card backs.
6. Confirm the player cannot roll for monsters, operate NPCs/hazards, reveal cards, remove cards, load a Room, or inspect DM information.
7. DM reveals a card and both routes update through the eventual shared-session implementation.
8. Save and refresh, then confirm role, Location, Room, board, quest, character, equipment, and resource state return correctly.

## Definition of Done

A feature is complete only when implementation is merged, tests actually run and pass, DM/player visibility is verified at the payload level, deployed behavior is browser-tested, accessibility is reviewed, documentation is updated, and remaining limitations are stated honestly.
