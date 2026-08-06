# The Living Table — Project Status

Last updated: 2026-08-05

This document is the source of truth for the runtime’s implemented state, limitations, and execution order. Read it with `docs/NORTH_STAR.md`, `docs/PROJECT_CONTROL.md`, `docs/DECISIONS.md`, `docs/SCENE_MODEL.md`, `docs/DND_PLAY_MODEL.md`, and `docs/GAME_STATE_MEMORY_MODEL.md`.

## Product goal

Deliver a card-driven synchronized tabletop that makes D&D easier to prepare, track, resume, run, and play.

## Canonical repository roles

- `cbw29512/DNDWebTTRPG`: runtime, website, sessions, campaigns, state instances, and multiplayer
- `cbw29512/DNDCards`: authoritative reusable card definitions, artwork, and print assets

## Implemented prototype

### Role experience

- Dedicated Dungeon Master route at the repository root and redirect route at `dm.html`
- Dedicated player route at `player.html`
- Immutable role selected by entry route
- Player-safe session projection from the first player render
- DM-only Scene loading, encounter editing, monster initiative, reveal, and removal controls

### Live board

- Seven operational slots: Location, Site, Area, NPCs, Monsters, Traps/Hazards, and Treasure/Rewards
- Equal desktop slot width, height, heading track, card baseline, and tarot footprint
- Scene context carried by Area instead of creating a duplicate Scene slot
- Quests and objectives owned by the dedicated Quest Tracker
- Expanded card stacks contained within the browser viewport
- Responsive stacked layout on phone-sized screens

### Cards and adventure loading

- Card placement, reveal, flip, remove, grouping, and grouped monster initiative
- DM and Player libraries with role-specific visibility
- Pinned `DNDCards` catalog and artwork resolution
- Tarot-style card previews and automated card-quality reporting
- Ordered Wishing Cake manifest and connected Scene transitions
- Automatic board reconciliation when a prepared Scene loads

### Browser-local state

Schema version 3 records:

- current Location, Site, Area, Scene, and Scene-card reference;
- exactly seven live board slots;
- quest and side-quest state outside the board;
- visited Area history and discovered Scenes;
- world, Location, Site, Area, Scene, combat, and event-history containers;
- migration from older saves containing Scene and Objective board entries.

## Automated regression coverage

GitHub Actions runs the complete Node regression suite on every pull request and push to `main`. The suite covers:

- board hierarchy and prepared-adventure geometry;
- DM/player role boundaries and player-safe projections;
- card behavior, grouped initiative, items, quests, Scene loading, and local-session migration;
- mobile layout rules, stack-drawer viewport containment, and observer stability;
- route asset existence, shared DM/player cache-version parity, stylesheet authority order, and test-suite completeness.

Passing static and state tests do not replace a real browser playtest. Rendered desktop, tablet, and phone behavior must still be visually inspected before a UI feature is considered complete.

## Role-boundary truth

The separate routes establish the intended interaction model, but they are not secure authentication. Secure multiplayer requires a server to verify identity, campaign membership, role, claimed seat, command authorization, and player-safe payloads before data leaves the server.

## Known limitations

- Static single-browser deployment; no authentication, campaigns, join codes, multiplayer synchronization, or reconnect
- Route separation is not a security boundary against local JavaScript manipulation
- Scene loading still reconciles through DOM controls instead of one authoritative reducer
- Combat state is not yet fully persistent across refresh and reconnect
- NPC memory, relationship history, complete item instances, rests, advancement, and Area alterations remain incomplete
- Some Wishing Cake Areas still need dedicated clue, trigger, and treasure cards
- Only one partial pregen exists; a complete legal roster is still required
- Complete D&D combat resolution is not implemented
- Commercial artwork-rights certification and 300-DPI print output remain unfinished
- Automated browser screenshots, keyboard traversal, screen-reader checks, and cross-browser smoke tests are not yet part of CI

## Current priority

1. Add real browser smoke tests for DM and player routes at desktop, tablet, and phone widths.
2. Replace DOM reconciliation with an authoritative board/session reducer.
3. Implement exact saved combat: round, turn, initiative, HP, conditions, concentration, resources, hazards, and resume.
4. Implement persistent item identity, ownership, charges, attunement, hidden properties, and history.
5. Implement persistent NPC and Area memory.
6. Complete the Wishing Cake card set and legal pregen roster.
7. Add campaign creation, join codes, character claiming, ready lobby, and authoritative multiplayer synchronization.

## Next browser acceptance test

1. Load The Wishing Cake on the DM route.
2. Verify all seven board slots have identical outer dimensions and aligned card tops.
3. Open the rightmost Treasure stack and verify the drawer remains completely inside the viewport.
4. Verify Location is Bramblewick, Site is The Wishing Cake Inn, Area is Grand Celebration Hall, and the current event is The Stolen Wish.
5. Advance to the Holding Cells and verify Location remains stable while Site, Area, Scene context, and encounter cards update correctly.
6. Save and refresh; verify Scene, quests, board, character, equipment, and event history return.
7. Repeat on the player route and confirm only player-safe content and controls are rendered.
8. Repeat at desktop, tablet, and phone widths using keyboard-only navigation.

## Definition of Done

A feature is complete only when implementation is merged, automated tests pass, DM/player visibility is verified at the payload level, deployed behavior is browser-tested, accessibility is reviewed, documentation is current, and remaining limitations are stated honestly.
