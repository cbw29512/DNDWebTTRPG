# DNDWebTTRPG — The Living Table

A card-driven online tabletop where the DM reveals the world, players act directly from their character cards, and the entire group moves through scenes and combat together.

## Product promise

Bring the live table feeling online without turning the game into a spreadsheet or forcing the DM to manage five different applications.

The DM controls a battle board, flips room/NPC/monster/item/hazard cards into play, and chooses what each player can see. Players take turns from their own character cards while HP, actions, spell slots, item uses, conditions, concentration, initiative, and revealed information stay synchronized.

## MVP goal

Prove one complete D&D 5e combat loop:

1. DM opens an encounter.
2. Players join with character cards.
3. DM reveals a room and monsters.
4. Initiative begins.
5. The active player rolls dice and spends actions/resources.
6. The DM runs monster turns and can override anything.
7. HP, conditions, spell slots, item uses, and turn state update.
8. Combat ends and treasure is revealed.

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

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Project tracking

- `PROJECT_STATUS.md` — source of truth for completed, prototype, missing, and blocked work.
- `docs/PRODUCT_VISION.md` — full product concept.
- `docs/MVP_SPEC.md` — first playable milestone.
- `docs/ARCHITECTURE.md` — state, cards, visibility, turns, and synchronization model.
- `docs/DECISIONS.md` — approved product decisions.
- GitHub Issues — implementation backlog and acceptance criteria.

## Rules and branding boundary

This is an independent, unofficial virtual tabletop. The platform architecture and interface are original. Rules modules must use properly licensed or original material, remain edition-labeled, and must not reproduce protected publisher art, logos, trade dress, or non-licensed rulebook expression.
