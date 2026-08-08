# The Living Table — Project Status

Last updated: 2026-08-08

This document is the source of truth for the runtime’s implemented state, limitations, and execution order. Read it with `docs/PRODUCT_CONTRACT.md`, `docs/HOMEBREW_BUILDER_PLAN.md`, `docs/NORTH_STAR.md`, `docs/PROJECT_CONTROL.md`, `docs/DECISIONS.md`, `docs/SCENE_MODEL.md`, `docs/DND_PLAY_MODEL.md`, `docs/GAME_STATE_MEMORY_MODEL.md`, and `docs/PLAYABILITY_RULES_CERTIFICATION_2026-08-07.md`.

## Product goal

Deliver a card-driven synchronized tabletop that makes D&D easier to prepare, track, resume, run, author, and play.

Two project-level requirements are non-negotiable:

1. Rules-bearing content must be accurate for its declared 2014 or 2024 rules profile. Displayed shorthand and automated rolls must derive from structured rules data rather than generic fallbacks.
2. Homebrew must become first-class. A DM must eventually be able to build adventures from existing cards, clone/create cards in the canonical theme, validate them, and run the authored adventure without editing source code.

See `docs/PRODUCT_CONTRACT.md` for the permanent rules and authoring contract.

## Canonical repository roles

- `cbw29512/DNDWebTTRPG`: runtime, website, sessions, campaigns, state instances, authoring UI, and multiplayer
- `cbw29512/DNDCards`: authoritative reusable card definitions, artwork, and print assets

## Implemented prototype

### Role experience

- Public Home/landing route
- Dedicated Dungeon Master route and compatibility redirect at `dm.html`
- Dedicated player route at `player.html`
- Immutable role selected by entry route
- Player-safe session projection from the first player render
- DM-only Scene loading, encounter editing, monster initiative, reveal, and removal controls
- Explicit DM Host → Share → Run the World and Player Join → Confirm Character → Play guidance

### Live multiplayer

- Real cross-computer DM/player play for the static GitHub Pages prototype
- DM starts an authoritative peer-to-peer room and receives an 8-character game code plus shareable Player Table link
- Player joins with name and game code from a separate browser/computer
- DM revealed cards, seven-slot spatial context, and initiative stream to connected players
- NPC/Monster/Hazard/Treasure content is reveal-gated before transport
- Streamed player card faces strip DM roll/control elements
- Player character, HP, and ready status can return to the DM roster
- DM-private world/session fields are excluded from the player network projection
- Current transport uses pinned PeerJS/WebRTC and a public signaling service; the DM browser remains the authoritative host

### Live board

- Seven operational slots: Location, Site, Area, NPCs, Monsters, Traps/Hazards, and Treasure/Rewards
- Equal desktop slot width, height, heading track, card baseline, and tarot footprint
- Scene context carried by Area instead of creating a duplicate Scene slot
- Quests and objectives owned by the dedicated Quest Tracker
- Expanded card stacks contained within the browser viewport
- Responsive stacked layout on phone-sized screens
- Encounter stacks start visually closed and repeated cards expose exact in-play quantity

### Cards and adventure loading

- Card placement, reveal, flip, remove, grouping, and structured monster initiative
- DM and Player libraries with role-specific visibility
- Pinned `DNDCards` catalog and artwork resolution
- Tarot-style card previews and automated card-quality reporting
- Tarot thumbnails do not own internal scroll containers; complete rules live in the Full Card view
- Ordered Wishing Cake manifest and connected Scene transitions
- Automatic board reconciliation when a prepared Scene loads
- Wishing Cake monster combat values derive from one canonical structured monster-stat authority
- Rules-aware combat shortcuts are structured-data-only; generic fallback damage is prohibited

### Characters and spell play

- Six Wishing Cake pregens with separate 2014 and 2024 rules profiles
- Character import codes / QR-ready import URLs
- Player equipment doll, backpack, equipment legality, derived AC/attack/damage, and full character-sheet sections
- Structured spellcasting sections for known/prepared/always-prepared/spellbook/species/background sources
- Compact edition-specific spell mini-decks for all spellcasting pregens
- Source-specific spellcasting ability, attack/save math, spell-slot permission, and free-use resources
- Per-character/per-edition spell slot and free-cast persistence
- One-at-a-time concentration tracking with reload persistence, explicit ending, replacement by a new concentration spell, and Long Rest reset

### Browser-local state

Schema version 3 records:

- current Location, Site, Area, Scene, and Scene-card reference;
- exactly seven live board slots;
- quest and side-quest state outside the board;
- visited Area history and discovered Scenes;
- world, Location, Site, Area, Scene, combat, and event-history containers;
- migration from older saves containing Scene and Objective board entries.

Spell-deck usage is currently persisted separately per character/edition and has not yet been folded into one authoritative session reducer.

## Automated regression coverage

GitHub Actions runs the complete Node regression suite and rendered Chromium smoke suite on pull requests and pushes to `main`.

Coverage includes:

- board hierarchy and prepared-adventure geometry;
- DM/player role boundaries and player-safe projections;
- peer-to-peer room contracts, reveal-only transport, game-code shape, and bidirectional player status;
- card behavior, initiative, items, quests, Scene loading, and local-session migration;
- mobile layout rules, stack-drawer viewport containment, and observer stability;
- route asset existence, cache-version parity, stylesheet authority order, and test-suite completeness;
- all six pregens in both editions;
- player character-sheet rendering, equipment doll/backpack, and import flow;
- compact spell-card completeness, edition baselines, spell-slot/free-cast rules, and concentration behavior;
- DM Wishing Cake launch and Scene advancement;
- browser console/runtime failures;
- rules guards including no d20-as-damage and selected edition-specific character math.

Rendered Chromium coverage is a major gate but does not replace tabletop playtesting, screen-reader review, full cross-browser certification, or hostile-network multiplayer testing.

## Rules accuracy contract

All rules-bearing work must follow `docs/PRODUCT_CONTRACT.md`.

Core requirements:

- 2014 and 2024 are separate rules profiles.
- Built-in/SRD-compatible content is strictly validated.
- Homebrew is explicitly labeled and may intentionally override baseline assumptions.
- Automated combat shortcuts come only from structured mechanics.
- Attack and damage math are calculated independently.
- If data is insufficient for an accurate shortcut, the shortcut is not rendered.
- Long/edge-case spell or feature text should use compact shorthand plus a source/in-app detail reference rather than silently dropping rules.

## Homebrew direction

The planned authoring model is documented in `docs/HOMEBREW_BUILDER_PLAN.md`.

The intended DM flow is:

1. create an adventure;
2. create/reorder Scenes;
3. browse/filter reusable cards;
4. drag existing cards into the seven canonical board slots;
5. clone an existing card or create a new card from a type-specific guided template;
6. see a live canonical card preview;
7. receive rules/schema validation;
8. save the authored content to a personal library;
9. launch the custom adventure on the same DM/Player runtime used by first-party adventures.

The product, not the user, controls card dimensions, typography, icon vocabulary, front/back hierarchy, accessibility contrast, and print-safe layout so homebrew remains visually compatible with first-party cards.

## Role-boundary truth

The runtime already performs player-safe payload projection before peer-to-peer transport, but separate routes and browser JavaScript are not secure authentication. The current DM-hosted peer room is suitable for playtesting, not a hostile-client commercial security boundary. A future persistent hosted service would need server-verified identity, campaign membership, role, claimed seat, command authorization, and player-safe payload enforcement.

## Known limitations

- No authentication, account-backed libraries, or persistent hosted campaign rooms
- DM-hosted peer room ends when the DM browser closes; room persistence is not provided
- TURN infrastructure is not provided for every restrictive network, so some peer connections can fail
- Route separation/local JavaScript is not a hostile-client security boundary
- Scene loading still reconciles through DOM controls instead of one authoritative reducer
- Combat state is not yet fully persistent across refresh/reconnect; spell concentration currently lives in the player spell-deck state rather than the global combat state
- NPC memory, relationship history, complete item instances, rests beyond the spell-deck reset, advancement, and Area alterations remain incomplete
- Compact spell mini-decks are implemented, but the complete long-form in-app rules-reference workflow remains incomplete
- Complete D&D combat resolution is not implemented
- Broader full rules audit beyond the certified Wishing Cake playtest surface remains ongoing
- Homebrew Adventure Builder and Card Builder are planned but not implemented
- Commercial artwork-rights certification and 300-DPI print output remain unfinished
- Camera QR scanning is not shipped; QR-ready character URLs/import paths exist
- Screen-reader checks and full cross-browser smoke tests are not yet complete

## Current priority

1. Complete remaining rules audit and full-detail rules references for Wishing Cake pregens, spells, weapons, monsters, hazards, and combat shortcuts across 2014/2024.
2. Replace DOM reconciliation and split local feature state with an authoritative board/session reducer.
3. Implement exact saved combat: round, turn, initiative, HP, conditions, concentration, resources, hazards, and resume.
4. Implement persistent item identity, ownership, charges, attunement, hidden properties, and history.
5. Implement persistent NPC and Area memory.
6. Build Homebrew Phase 1: reusable card Library + Adventure/Scene Composer using the seven board slots.
7. Build Homebrew Phase 2: guided canonical Card Builder with cloning, live preview, structured rules fields, and validation.
8. Harden live multiplayer with stronger reconnect behavior and TURN options while preserving a free/local-first path.
9. Add any future persistent account-backed campaign layer only if it can preserve the product’s player-safe authority model and free/local-first baseline.

## Next rules acceptance test

For every pregen in both editions:

1. Recalculate ability modifiers, PB, saves, skills, AC, HP, Initiative, speed, passive scores, and hit dice.
2. Recalculate every weapon attack bonus and damage expression independently.
3. Verify damage type, range, weapon properties, hand/shield legality, ammunition/loading rules, fighting-style bonuses, and 2024 mastery where applicable.
4. Verify class/subclass/species/background/feat resources and reset conditions.
5. Verify spellcasting ability, save DC, spell attack, cantrips, known/prepared counts, always-prepared sources, spellbook, and spell-slot progression.
6. Verify compact card shorthand agrees with the structured source object.
7. Verify the rendered browser sheet/card matches the calculated values.

## Definition of Done

A feature is complete only when implementation is merged, automated tests pass, rules-bearing values are validated for the declared edition, DM/player visibility is verified at the payload level, deployed behavior is browser-tested, accessibility is reviewed, documentation is current, and remaining limitations are stated honestly.
