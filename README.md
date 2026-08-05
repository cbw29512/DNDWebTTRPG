# DNDWebTTRPG — The Living Table

A card-driven online tabletop where the DM reveals the world, players act directly from their character cards, and the entire group moves through scenes and combat together.

## Product promise

**Buy it. Load it. Invite friends. Play it.**

The Living Table brings the live table feeling online without turning the game into a spreadsheet or forcing the DM to manage five different applications.

The DM controls a battle board, flips room/NPC/monster/item/hazard cards into play, and chooses what each player can see. Players take turns from their own character cards while HP, actions, spell slots, item uses, conditions, concentration, initiative, and revealed information stay synchronized.

Complete one-shots and dungeon packs can be loaded as executable adventure packages. Prepared adventures contain an ordered scene path. Loading a scene prepares its room, NPCs, monsters, hazards, clues, quests, and treasure automatically while the DM retains reveal control. A saved homebrew adventure must behave the same way after the DM orders and links its scenes.

## Canonical repositories

- Runtime, website, sessions, campaigns, and multiplayer: `cbw29512/DNDWebTTRPG`
- Reusable card definitions, artwork, and print assets: `cbw29512/DNDCards`
- Production branch: `main`
- Current public project URL: `https://github.com/cbw29512/DNDWebTTRPG`

The runtime consumes versioned card definitions from `DNDCards`; it must not become a duplicate handwritten card catalog.

## Current milestone

Stabilize the browser runtime, then make one ordered Wishing Cake adventure run from manifest through scene loading and save/resume.

The immediate acceptance test is:

1. Load The Wishing Cake manifest.
2. Receive an ordered scene list.
3. Load the opening scene.
4. Automatically prepare every card assigned to that scene.
5. Keep hidden content DM-only.
6. Advance without rebuilding the board manually.
7. Save and recover the exact scene, quest, board, and character state.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Project tracking

Read these before making a meaningful product change:

- `docs/PROJECT_CONTROL.md` — canonical repositories, locked product flow, milestone order, Definition of Done, and anti-drift rules.
- `docs/IMPLEMENTATION_LEDGER.md` — exact PRs, merge SHAs, delivered behavior, remaining boundaries, and next acceptance test.
- `PROJECT_STATUS.md` — current implemented, prototype, missing, and blocked work.
- `docs/DECISIONS.md` — approved product decisions.
- `docs/PRODUCT_VISION.md` — full product concept.
- `docs/MVP_SPEC.md` — first playable milestone.
- `docs/ADVENTURE_PACKS.md` — ready-to-run adventure and dungeon-pack specification.
- `docs/ARCHITECTURE.md` — state, cards, visibility, turns, and synchronization model.
- GitHub Issues — implementation backlog and acceptance criteria.

Every major PR must update the status or ledger and must state what was actually tested. A merged prototype is not automatically a completed feature.

## Rules and branding boundary

This is an independent, unofficial virtual tabletop. The platform architecture and interface are original. Rules modules and adventure packs must use properly licensed or original material, remain edition-labeled, preserve required attribution, and must not reproduce protected publisher art, logos, trade dress, or non-licensed rulebook expression.
