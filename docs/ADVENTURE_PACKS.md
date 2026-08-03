# The Living Table — Adventure and Dungeon Packs

## Product promise

**Buy it. Load it. Invite friends. Play it.**

The Living Table is not only a virtual tabletop. It is a delivery platform for complete, ready-to-run tabletop adventures. A customer can acquire a one-shot or dungeon pack, import it into The Living Table, create a fresh session, assign or import characters, invite players, and begin playing with minimal preparation.

The pack is an executable game package, not merely a PDF.

## Customer workflow

1. Browse a pack listing.
2. Review system, edition, level, player count, duration, tone, accessibility notes, content warnings, and included assets.
3. Acquire or download the pack.
4. Select **Load Adventure Pack** in The Living Table.
5. The platform validates the package, license, version, and required rules module.
6. The DM creates a fresh runtime copy of the adventure.
7. The DM selects included pregens or assigns imported characters.
8. Players join by link or room code.
9. The DM opens the first scene and runs the adventure from the supplied cards and battle board.
10. Session state, choices, resources, reveals, and encounter results persist independently from the original pack.

## Pack categories

### One-shot pack

A complete adventure intended for one session, normally two to five hours.

### Dungeon pack

A reusable location containing rooms, encounters, NPCs, hazards, treasure, objectives, and optional story hooks. It may be inserted into an existing campaign.

### Encounter pack

A focused battle, social encounter, puzzle, chase, investigation, or set piece.

### Campaign chapter

A multi-session package with persistent decisions, branching scenes, milestones, and carry-forward state.

### Starter or teaching pack

A guided adventure with pregens, rules prompts, DM coaching, player instructions, and gradually introduced mechanics.

## Required package contents

Every published pack must include:

- stable pack ID and semantic version;
- title, description, creator, publisher, and support contact;
- exact game-system and edition identity;
- supported player count, character levels, and estimated duration;
- content warnings and safety-tool recommendations;
- licensing, attribution, and asset provenance;
- compatibility requirements and minimum platform version;
- adventure start state and entry scene;
- scene graph or ordered/branching adventure flow;
- room and location cards;
- NPC and monster cards;
- hazard, trap, puzzle, clue, objective, item, and treasure cards as applicable;
- player-safe and DM-only card faces;
- encounters and initiative groups;
- maps, zones, tokens, handouts, and audio references when included;
- triggers, requirements, consequences, and reveal rules;
- completion conditions and endings;
- pre-generated characters when advertised;
- DM overview, read-aloud text, guidance, and fallback paths;
- import fixtures and validation tests.

## Definition versus runtime

A purchased or downloaded pack is immutable source content.

Loading the pack creates a new independent runtime session containing:

- card instances;
- actor and monster instances;
- current HP and resources;
- revealed and hidden information;
- initiative and turn state;
- scene position;
- player decisions and consequences;
- acquired treasure and assigned items;
- event history, overrides, and undo records;
- save and reconnect state.

Playing a pack never modifies the purchased source package.

## Proposed package structure

```text
living-table-pack/
├── manifest.json
├── adventure.json
├── cards/
│   ├── rooms.json
│   ├── npcs.json
│   ├── monsters.json
│   ├── hazards.json
│   ├── clues.json
│   ├── items.json
│   └── objectives.json
├── actors/
│   └── pregens.json
├── encounters/
│   └── encounters.json
├── maps/
│   ├── map-index.json
│   └── assets...
├── handouts/
├── art/
├── audio/
├── licenses/
│   └── attribution.json
└── checksums.json
```

The actual distributed format may be a signed `.ltpack` archive containing these versioned records.

## Manifest essentials

```json
{
  "format": "living-table-adventure-pack",
  "formatVersion": 1,
  "packId": "living-table.ruined-chapel",
  "version": "1.0.0",
  "title": "The Ruined Chapel",
  "systems": ["dnd-2014", "dnd-2024"],
  "levels": { "minimum": 3, "maximum": 5 },
  "players": { "minimum": 3, "maximum": 5 },
  "durationMinutes": { "minimum": 180, "maximum": 240 },
  "entrySceneId": "scene-chapel-approach",
  "minimumPlatformVersion": "0.1.0",
  "licenseFile": "licenses/attribution.json"
}
```

## Import security

An imported pack must be treated as untrusted data.

The importer must:

- reject executable scripts and active HTML;
- reject path traversal and undeclared files;
- validate file sizes, types, IDs, references, and checksums;
- sanitize all displayed text and SVG content;
- prohibit remote code execution;
- require explicit permission before fetching remote assets;
- reject duplicate IDs and broken references;
- reject mixed or undeclared rules editions;
- preserve author, license, and attribution metadata;
- report incompatibilities before creating a session;
- support dry-run validation and rollback.

## Commercial boundary

The pack format must work for:

- free first-party packs;
- paid first-party packs;
- free community packs;
- eventually approved third-party creator packs;
- private homebrew imports that are never publicly distributed.

Marketplace payment, creator payouts, reviews, refunds, moderation, and DRM are not part of the first playable MVP. The initial milestone is a secure portable format and local import/export flow.

A customer who purchases a pack should retain a downloadable copy and should not lose access merely because a hosted service changes.

## First-party launch packs

### The Ruined Chapel

The technical reference pack. It must prove the full import, session creation, reveal, combat, treasure, save, and reconnect flow.

### The Wishing Cake

A polished birthday one-shot candidate using the existing card-driven adventure work, subject to a complete content, rules, artwork, and licensing review before public release.

### Teaching adventure

A later guided pack adapted from reviewed original teaching-adventure material, with progressive rules prompts and DM coaching.

## First pack milestone

The MVP succeeds when:

1. The Ruined Chapel exists as a valid versioned pack rather than hard-coded application data.
2. A DM imports it through the UI.
3. Validation reports its title, system, level range, player count, duration, contents, and licenses.
4. The DM creates a fresh session.
5. Included cards, actors, encounters, objectives, and maps populate the board.
6. Players join and receive only authorized projections.
7. The group completes the encounter and assigns treasure.
8. The session saves and reloads without changing the source pack.
9. A second session can be created from the same pack with clean state.
10. Corrupt, incompatible, malicious, mixed-edition, or unlicensed fixtures are rejected by automated tests.

## Product guardrail

The pack store is not the product center by itself. The product center remains the shared live table experience. Packs remove preparation friction and supply excellent ready-to-run content for that experience.
