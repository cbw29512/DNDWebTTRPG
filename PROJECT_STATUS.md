# The Living Table — Project Status

Last updated: 2026-08-04

This is the source of truth for current implementation state. Product-control rules and milestone order live in `docs/PROJECT_CONTROL.md`; exact PR history lives in `docs/IMPLEMENTATION_LEDGER.md`.

## Product goal

Deliver a card-driven synchronized online tabletop where a DM selects a ready-to-run adventure, invites players, loads ordered scenes, and runs the game while players act from complete character and item cards.

**Commercial promise:** buy or download a prepared adventure, load it, invite friends, claim pregens, and play with minimal preparation.

## Canonical repositories

- `cbw29512/DNDWebTTRPG`: website, runtime, sessions, campaigns, and multiplayer
- `cbw29512/DNDCards`: authoritative reusable card definitions, artwork, and print assets
- Production branch: `main`

## Implemented local prototype

- Card-driven DM board with DM/Player inspection views
- Card placement, reveal, hide, flip, remove, grouped stacks, and basic initiative
- Expanded card groups anchored below the selected stack with outside-click dismissal
- DM Library and Player Library
- Player Library search and section filters
- Version-pinned `DNDCards` catalog import
- Version-pinned relative artwork resolution from `DNDCards`
- Polished tarot-style front/back catalog previews
- Card-type shorthand renderers for monsters, characters, items, NPCs, rooms, hazards, rules, events, quests, and spells
- Automated card-quality audit for missing art, content, shorthand, IDs, and combat information
- RPG equipment doll with legal slots, equip/unequip, attunement, derived statistics, consumables, and charges
- Adventure Master Card loader
- Browser-local canonical adventure session
- Browser-local board persistence and opening-board restore/reset
- Quest state integrated into the local session
- Player HP, action economy, ready state, equipment, edition, and item-resource capture integrated into the local session
- Permanent DM/player playtest audit
- Recursive card-audit lockup fixed

## Current stability concerns

- Several older modules still use broad or render-triggering `MutationObserver` patterns.
- Browser smoke tests are not yet established for the complete deployed flow.
- Player equipment drag/drop needs regression testing after session integration.
- Visual card audits are still required for crop, overflow, font size, contrast, and mobile behavior.
- Dynamic catalog loading depends on a pinned CDN-hosted module and assets.

## Important prototype boundaries

- Single browser/device only
- DM/Player switching is not authentication
- No accounts, password reset, provider login, or persistent user identity
- No real campaign records, memberships, invitations, or join codes
- No lobby, character reservations, claiming, or server-backed ready checks
- No shared authoritative server or real-time multiplayer synchronization
- No reconnect or cross-device persistence
- No complete server-side player-safe projection
- No complete combat-resolution engine
- No complete six-character pregen roster
- The current Wendy character is not a full edition-specific D&D 5e character sheet
- Adventure loading does not yet execute an ordered scene manifest with automatic room-content loading
- Final commercial-art rights and 300-DPI print output are not certified

## Locked prepared-adventure behavior

Prepared adventures must include an ordered scene path. Loading a room or scene automatically prepares:

- room/location card;
- every NPC assigned to the scene;
- encounter monsters;
- hazards and traps;
- clues and checks;
- quests and objectives;
- treasure and rewards;
- triggers and next-scene links.

Prepared content loads for the DM, but hidden information remains unrevealed and absent from player projections until the DM or a trigger reveals it.

Homebrew mode is the only mode where a DM manually constructs and orders scenes. Once saved, that adventure follows the same automatic scene-loading behavior.

## Locked card standard

### Front

- Artwork
- Name
- Card type
- CR, rarity, level, role, or equivalent badge

### Back

- Compact game shorthand sufficient to run the card
- HP, armor, movement, melee, ranged, spells, DCs, saves, damage, traits, reactions, resources, and charges as applicable

## Current execution order

1. Remove or strictly guard risky observer-driven rendering and add browser smoke coverage.
2. Add ordered scene manifests and automatic room-content loading.
3. Complete one local Wishing Cake play path from manifest through scene advancement and save/resume.
4. Build six complete legal level-three pregens with explicit 2014/2024 identity.
5. Build campaign creation, join codes, lobby, character claiming, and ready checks.
6. Add authoritative multiplayer synchronization, reconnect, and player-safe projections.
7. Complete combat resolution, conditions, spell/resource spending, treasure transfer, DM override, and event history.
8. Finish artwork, commercial-rights review, visual QA, and 300-DPI print output.

## Next acceptance test

1. DM loads The Wishing Cake.
2. Runtime creates a fresh session from the selected manifest version and edition.
3. Runtime displays the ordered scene list.
4. DM loads the opening scene.
5. The exact assigned room, NPC, monster, hazard, clue, quest, and treasure cards are prepared automatically.
6. Players receive only player-safe and revealed cards.
7. DM advances to the next scene without manually rebuilding the board.
8. Browser closes and reopens with the same scene, board, quest, character, equipment, and resource state.

## Non-negotiable gates

- Hidden DM data is absent from player payloads.
- DM retains override and undo authority.
- Every meaningful mutation is logged as an event in the final authoritative architecture.
- D&D 2014 and 2024 remain explicitly versioned.
- Only original or properly licensed material is shipped.
- `DNDCards` remains the card-definition authority; the runtime does not duplicate the catalog.
- Imported packages are treated as untrusted data.
- Playing never mutates the immutable source adventure definition.
- Customers retain an exportable copy of acquired pack data.
- Keyboard-capable gameplay and accessible contrast are required.
- Tests are only reported as passed when actually executed.
- Deployed behavior is visually reviewed before a feature is called complete.
- Every meaningful PR updates the implementation ledger or status.
- New full-document observers or uncontrolled render loops are prohibited.

## Definition of Done

A feature is complete only when implementation, executed automated tests, permission/visibility tests, accessibility review, documentation, ledger/status updates, and deployed browser verification are complete.
