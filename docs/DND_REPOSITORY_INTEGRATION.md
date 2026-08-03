# The Living Table — D&D Repository Integration Ledger

Last updated: 2026-08-03

## Purpose

This ledger controls what `DNDWebTTRPG` reuses from the owner's other tabletop repositories. The goal is to bring proven ideas, schemas, original content, licensed data, and tested workflows into The Living Table without copying obsolete architecture, duplicating source catalogs, leaking private data, or silently mixing D&D editions.

## Product boundary

The Living Table is the synchronized card-driven play surface:

- the DM reveals room, NPC, monster, hazard, clue, item, and objective cards;
- players take turns from character, action, spell, feature, and item cards;
- the authoritative session tracks initiative, resources, conditions, effects, visibility, events, undo, and reconnect;
- each participant receives a role-filtered projection.

It is not the public rules compendium, printable-product storefront, campaign-management homepage, art-generation pipeline, or learning website. Those projects may remain companions or source authorities.

## Repository decisions

| Repository | Classification for The Living Table | Reuse now | Reuse later / boundary |
|---|---|---|---|
| `DNDWebTTRPG` | Primary runtime | Synchronized board, role projections, command/event engine | Server sessions, persistence, full encounter loop |
| `DungeonCards` | **Primary card/rules source authority** | Card definition/runtime separation, exact system IDs, visibility and deck concepts, action/resource models, validation patterns | Import versioned adapters and deterministic SRD exports; never create a handwritten duplicate catalog |
| `DNDCards` | UX and battle-board concept source | Board zones, card reveal workflow, DM/player interaction concepts, initiative/action resource ideas | Review individual UI components before porting; do not copy the old app wholesale |
| `monstercardforge` | DM workflow and safety-pattern source | Player-safe display principles, session console concepts, encounter handoff, recovery points, private/public field separation | Reuse adapters and workflow ideas; keep campaign hub, print forge, NPC/loot/item authoring as companions unless a narrow runtime need exists |
| `CharacterForge` | Character-import source / rebuild | Character creation and character-card workflow concepts | Build a versioned character import adapter; do not embed the older Flask application |
| `DungeonMaps` | Future map-service source | Join-code and WebSocket campaign concepts after review | Map canvas, tokens, fog, measured movement, and authoritative positions require a new tested module |
| `dnd-campaign-portal` | Campaign context concept source | Campaign landing, handout, roster, and player-access ideas | Supersede old implementation with Living Table session/campaign schemas |
| `tabletop-scribe` | Future recap/session-log companion | Session event stream is designed to support summaries | No AI or transcription dependency in the MVP; add only after privacy and consent review |
| `monstercardforge` / `Monster Card Forge` | Monster presentation source | Player-front versus DM-back card separation, long-stat continuation, boss phases | Import only after source/license metadata and runtime-instance mapping are preserved |
| `DNDLanguageTranslator` | Optional scene-card tool | Language-known/unknown reveal concept | Later private clue and translated handout cards; not MVP-critical |
| `DNDTeachingAdventureDemonsWrath` | Original/teaching content candidate | Encounter pacing and onboarding ideas after content review | Potential second playable encounter; licensing and originality review required first |
| `DND_DM_Player_Instruction` | Learn-to-play content source | Turn prompts, table guidance, onboarding copy after review | Keep rules teaching separate from authoritative rules execution |
| `MonsterColoringBook` | Art/content pipeline only | Original visual pipeline patterns and reviewed original assets | Never make the local generation pipeline a runtime dependency; every asset needs provenance/license metadata |
| `DungeonGate` | Future voice/transcription concept | None in MVP | Hold until consent, privacy, latency, moderation, and accessibility design exist |
| `dnd_ai_dungeon_master` | Hold/archive candidate | None | Empty; no AI-DM claims or dependency |
| `lootforge` | Archive candidate | None | Empty and superseded by stronger loot/item work elsewhere |
| `L2PTTRPG` | Separate learning/community product | Accessibility, source, and rules-separation lessons only | Do not merge its learning-site navigation or multi-system marketing into the game board |
| `monstercardforge`, `DungeonCards`, `DNDWebTTRPG` | Coordinated products | Deep links and deterministic adapters | Remain independently deployable and testable |

## Immediate imports

### 1. Card platform contract from `DungeonCards`

Adopt these concepts as the canonical direction:

- immutable card definitions versus independently tracked runtime card instances;
- exact ruleset identity such as `dnd-2014` and `dnd-2024`;
- public, player-safe, DM-only, controlled-actor, and private audiences;
- card families for room, scene, monster, NPC, hazard, clue, handout, objective, item, spell, feature, action, condition, and active effect;
- explicit card zones and deck/workspace identity;
- tracked uses, charges, quantities, durations, targets, refresh rules, and action costs;
- source, edition, license, review status, and attribution metadata;
- deterministic validation and import/export versioning.

The Living Table will implement an adapter against these contracts rather than importing the entire React application.

### 2. Player-display safety from `monstercardforge`

Adopt these guarantees:

- player projections never include enemy HP, enemy AC, Dexterity, tactics, private logs, prep, or DM notes unless explicitly revealed;
- reconnect and read-only player-display behavior are first-class requirements;
- shared campaign/session summaries exclude private source records;
- recovery and safety-copy design must preserve the current state before restoring an older state.

### 3. Character integration from `CharacterForge` and `DungeonCards`

The Living Table character importer must eventually support:

- edition and level identity;
- core stats, saves, skills, senses, HP/temp HP, AC, speed, initiative;
- actions, attacks, spells, features, items, ammunition, charges, attunement, conditions, and active effects;
- prepared/known state, spell slots, concentration, duration, targets, and recovery;
- import provenance and schema version;
- a player-controlled runtime copy separate from the source character definition.

### 4. Encounter and map handoff

Use `monstercardforge` and `DungeonCards` as sources for encounter definitions and monster records. Use `DungeonMaps` only as a future map-position service after its architecture is reviewed. The first networked MVP may use a simple grid and tokens owned by The Living Table.

## Prohibited shortcuts

- Do not copy all source files from another repository into this project.
- Do not maintain a second handwritten SRD spell or monster catalog.
- Do not expose hidden data and rely on CSS to conceal it.
- Do not silently mix 2014 and 2024 rules or persistence.
- Do not import official paid content, publisher artwork, logos, fonts, trade dress, or proprietary text.
- Do not make local AI, paid APIs, authentication vendors, analytics, or hosted databases mandatory without a documented architecture decision.
- Do not advertise imported modules as complete until the full user workflow and deployed behavior are tested.

## Ordered integration plan

1. Add a source-repository registry and adapter boundaries.
2. Align the Living Table card schema with the proven `DungeonCards` definition/runtime split.
3. Add deterministic import validation for one room, one monster, one character, one spell, and one item.
4. Import Ruined Chapel records through the adapter rather than hard-coded UI objects.
5. Add a Character Vault/CharacterForge character adapter for the four MVP pregens.
6. Add an encounter adapter for sourced monsters and runtime monster instances.
7. Add player-display reconnect and recovery patterns from `monstercardforge`.
8. Review DungeonMaps for synchronized position/fog requirements after the card combat loop works.
9. Review teaching adventures, language tools, and original art/content for post-MVP packs.
10. Keep this ledger and GitHub issues updated whenever another repository contributes code, data, content, or architecture.

## Release gate for every import

An imported capability is not complete until it has:

- a named source repository and exact source path/commit;
- schema and version mapping;
- edition and licensing metadata;
- private/public field review;
- automated validation and permission tests;
- migration and rollback notes;
- keyboard/mobile/accessibility review;
- deployed visual and behavior verification.
