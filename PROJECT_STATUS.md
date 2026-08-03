# The Living Table — Project Status

Last updated: 2026-08-03

This is the source of truth for scope, current state, and execution order.

## Product goal

Deliver a card-driven synchronized online tabletop where the DM reveals the world and players take complete turns from their character cards.

**Commercial/content promise:** buy or download a ready-to-run one-shot or dungeon pack, load it into The Living Table, invite friends, and play with minimal preparation.

## Implemented now

- Dedicated repository and product identity
- Product vision, MVP specification, architecture, decisions, command/event model, visibility model, D&D repository integration ledger, and adventure-pack product specification
- Static Ruined Chapel battle-board prototype
- Top-mounted dice roller with correct standard, advantage, and disadvantage behavior
- Revisioned command dispatcher for rolls, reveals, turns, and undo
- Typed structured events with monotonic IDs and human-readable logs
- In-memory DM undo with preserved event history
- Shared participant, actor, card, audience, and session schemas
- Canonical Ruined Chapel encounter data separated from UI rendering
- Role-filtered DM and player projections
- Player projection omits unrevealed cards, DM card faces, monster HP, monster AC, tactics, reactions, and DM notes
- DM View / Player View visual audit switch
- Authoritative source-repository registry with exactly one primary rules catalog source
- `DungeonCards` designated as the primary card/rules source authority
- `monstercardforge`, `DNDCards`, `CharacterForge`, `DungeonMaps`, campaign, teaching, language, and art repositories assigned explicit adapter or review boundaries
- Portable adventure-pack requirements, import-security boundary, runtime-copy model, and first-party launch candidates documented
- Deterministic tests for dice, state transitions, undo, schemas, authorization boundaries, hidden-data leakage, and source-registry drift
- Responsive single-column fallback and visible keyboard focus

## Prototype audit findings corrected

- Advantage/disadvantage previously rolled one d20.
- Monster turns previously displayed `Your Turn`.
- Placeholder action controls looked operational.
- DM and player information previously came from one unfiltered UI object.
- Cross-repository ownership was previously implicit, which risked duplicate catalogs and conflicting architecture.
- Adventure delivery was previously treated as encounter data rather than a first-class portable product.

## Adventure-pack decision

The pack is an executable game package, not merely a PDF. It may contain:

- rooms, scenes, maps, zones, and tokens;
- NPC, monster, hazard, clue, objective, item, treasure, spell, and feature cards;
- public/player-safe and DM-only card faces;
- encounters, initiative groups, triggers, requirements, consequences, and endings;
- pregenerated characters;
- read-aloud text, DM guidance, fallback paths, handouts, and optional media;
- exact system/edition, source, license, attribution, compatibility, and checksum metadata.

Loading a pack creates a fresh independent runtime session. Playing never mutates the acquired source package.

See `docs/ADVENTURE_PACKS.md`.

## Repository reuse decisions

- `DungeonCards`: canonical card-platform concepts, exact edition identity, versioned SRD exports, character/encounter adapters, and source metadata.
- `monstercardforge`: session-console, player-display, recovery, campaign handoff, encounter, NPC, loot, and magic-item workflow patterns.
- `DNDCards`: card-driven battle-board and reveal UX concepts; review and rebuild rather than wholesale copy.
- `CharacterForge`: character workflow and import candidate; older application architecture will not be embedded.
- `DungeonMaps`: future synchronized position/map service after the core card combat loop.
- `dnd-campaign-portal`: campaign, roster, handout, and player-access concepts.
- Teaching, language, instruction, and original-art repositories: post-MVP content candidates requiring licensing/provenance review.
- Empty or superseded repositories: no runtime dependency.

See `docs/DND_REPOSITORY_INTEGRATION.md` for the complete ledger and release gates.

## Prototype limitations

- Single browser only; the view switch is an inspection tool, not authentication
- No authoritative server, WebSocket synchronization, persistence, login, seat tokens, or reconnect
- Dice remain client-side and are not server-authoritative
- Undo remains in-memory rather than persisted compensating events
- Action resolution controls remain disabled placeholders
- No modifiers, formulas, targeting, attacks versus AC, saves, damage, healing, conditions, concentration, spell spending, or item consumption
- The event log is not yet audience-filtered
- Source adapters are registered but the first deterministic cross-repository data import is not yet implemented
- No `.ltpack` importer/exporter, manifest validator, archive sanitizer, checksum verification, pack library, or fresh-session creation flow yet
- No browser-level accessibility, visual regression, or deployment smoke tests yet

## MVP workstreams

1. Shared schemas and deterministic state engine — **foundation implemented; runtime packaging remains**
2. Portable adventure-pack schema, validation, import, and fresh-session creation — **new primary milestone**
3. Server-authoritative sessions and WebSocket sync
4. Role-filtered DM and player projections — **prototype implemented**
5. Card definitions, instances, zones, and reveals — **in progress; align with DungeonCards**
6. Initiative/turn state machine
7. Dice, commands, resolution confirmation, and event history
8. Character resources, spells, items, conditions, and effects — **CharacterForge/DungeonCards adapters planned**
9. Ruined Chapel end-to-end encounter — **convert into the first valid importable pack**
10. Accessibility, security, reconnect, and playtest hardening

## Non-negotiable gates

- Hidden DM data must be absent from player payloads
- DM override and undo
- Every mutation logged as an event
- D&D editions explicitly versioned
- Original or properly licensed content only
- Exactly one primary rules catalog source; no handwritten duplicate SRD catalogs
- Every import records source repository, source path/commit, schema version, edition, and licensing boundary
- Imported packs are untrusted data: no executable scripts, active HTML, path traversal, undeclared remote assets, or broken references
- Playing a pack never modifies its immutable source definition
- Customers retain an exportable/downloadable copy of acquired pack data
- Keyboard-capable encounter loop
- Deterministic tests before rule controls are called functional
- Placeholder controls visibly disabled or labeled
- Deployed behavior visually reviewed
- Status, integration ledger, and issues updated with every meaningful cross-repository change

## Definition of Done

A feature is complete only when implementation, automated tests, permission/visibility tests, accessibility review, documentation, issue status, and deployed visual verification are complete.
