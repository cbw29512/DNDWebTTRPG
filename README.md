# DNDWebTTRPG — The Living Table

A card-driven online tabletop where the DM reveals the world, players act directly from their character cards, and the entire group moves through scenes and combat together.

## Product promise

**Buy it. Load it. Invite friends. Play it.**

The Living Table brings the live table feeling online without turning the game into a spreadsheet or forcing the DM to manage five different applications.

The DM controls a battle board, flips room/NPC/monster/item/hazard cards into play, and chooses what each player can see. Players take turns from their own character cards while HP, actions, spell slots, item uses, conditions, concentration, initiative, and revealed information stay synchronized.

Complete one-shots and dungeon packs can be loaded as executable adventure packages. A pack can include its rooms, maps, encounters, monsters, NPCs, hazards, clues, treasures, pregens, branching flow, DM guidance, visibility rules, and licensing metadata. Loading a pack creates a fresh independent session that can be played as supplied or adapted by the DM.

## MVP goal

Prove one complete D&D 5e combat loop loaded from a versioned adventure pack:

1. DM imports The Ruined Chapel pack.
2. The platform validates its system, contents, references, and license metadata.
3. DM creates a fresh encounter session.
4. Players join with included or imported character cards.
5. DM reveals a room and monsters.
6. Initiative begins.
7. The active player rolls dice and spends actions/resources.
8. The DM runs monster turns and can override anything.
9. HP, conditions, spell slots, item uses, and turn state update.
10. Combat ends and treasure is revealed and assigned.
11. The session saves independently from the original pack.

## Current repository state

The first static prototype establishes:

- top-mounted dice roller;
- DM encounter deck;
- shared battle board;
- revealed and unrevealed cards;
- initiative order;
- active-player turn controls;
- character/resource panels;
- player-facing visibility model;
- deterministic demo state for testing.

## Adventure packs

See `docs/ADVENTURE_PACKS.md` for the portable pack format, import security rules, commercial boundary, and first-party launch candidates.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Project tracking

- `PROJECT_STATUS.md` — source of truth for completed, prototype, missing, and blocked work.
- `docs/PRODUCT_VISION.md` — full product concept.
- `docs/MVP_SPEC.md` — first playable milestone.
- `docs/ADVENTURE_PACKS.md` — ready-to-run adventure and dungeon-pack specification.
- `docs/ARCHITECTURE.md` — state, cards, visibility, turns, and synchronization model.
- `docs/DECISIONS.md` — approved product decisions.
- GitHub Issues — implementation backlog and acceptance criteria.

## Rules and branding boundary

This is an independent, unofficial virtual tabletop. The platform architecture and interface are original. Rules modules and adventure packs must use properly licensed or original material, remain edition-labeled, preserve required attribution, and must not reproduce protected publisher art, logos, trade dress, or non-licensed rulebook expression.
