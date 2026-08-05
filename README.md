# DNDWebTTRPG — The Living Table

A card-driven online tabletop where the DM runs the world, players act from their character cards, and the system remembers the game.

## Product promise

**Buy it. Load it. Invite friends. Play it.**

The Living Table exists to make D&D easier to prepare, track, resume, run, and play without turning the session into a spreadsheet or forcing the DM to manage several disconnected applications.

The DM controls a focused seven-slot board:

```text
Location | Site | Area | NPCs | Monsters | Traps/Hazards | Treasure/Rewards
```

The active Scene is saved as session progress and appears on the Area card rather than occupying another board column. Quests remain in the dedicated Quest Tracker. Players receive only their character information and cards the DM reveals.

Prepared adventures contain ordered Scenes. Loading a Scene prepares its Location, Site, Area, NPCs, monsters, hazards, treasure, transitions, and quest activations while preserving DM reveal control. A saved homebrew adventure must behave the same way after the DM orders and links its Scenes.

## Canonical repositories

- Runtime, website, sessions, campaigns, and multiplayer: `cbw29512/DNDWebTTRPG`
- Reusable card definitions, artwork, and print assets: `cbw29512/DNDCards`
- Production branch: `main`
- Current public project URL: `https://github.com/cbw29512/DNDWebTTRPG`

The runtime consumes versioned card definitions from `DNDCards`; it must not become a duplicate handwritten card catalog.

## Current milestone

Prove one complete Wishing Cake run from manifest through Scene loading and exact save/resume.

The immediate acceptance test is:

1. Load The Wishing Cake schema-version-3 manifest.
2. Render exactly seven live board slots.
3. Show Bramblewick → The Wishing Cake Inn → Grand Celebration Hall.
4. Show `Now: The Stolen Wish` on the Area card without a Scene column.
5. Keep quests in the Quest Tracker without an Objective column.
6. Advance to the Holding Cells without rebuilding the board manually.
7. Preserve hidden content as DM-only.
8. Save and recover the exact Scene, quest, board, and character state.
9. Migrate an older browser save without losing Scene or quest progress.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Project tracking

Read these before making a meaningful product change:

- `docs/NORTH_STAR.md` — highest-level ease-first product filter.
- `docs/PROJECT_CONTROL.md` — canonical repositories, locked product flow, milestone order, Definition of Done, and anti-drift rules.
- `docs/SCENE_MODEL.md` — canonical Location, Site, Area, Scene, board, manifest, and persistence model.
- `docs/IMPLEMENTATION_LEDGER.md` — exact PRs, merge SHAs, delivered behavior, remaining boundaries, and next acceptance test.
- `PROJECT_STATUS.md` — current implemented, prototype, missing, and blocked work.
- `docs/DECISIONS.md` — approved product decisions.
- `docs/DND_PLAY_MODEL.md` — DM/player responsibilities and table rhythm.
- `docs/GAME_STATE_MEMORY_MODEL.md` — exact-resume and campaign-memory target.
- `docs/DND_PAIN_POINTS.md` — tracking and preparation burdens the product must remove.

Every major PR must update the status or ledger and must state what was actually tested. A merged prototype is not automatically a completed feature.

## Rules and branding boundary

This is an independent, unofficial virtual tabletop. The platform architecture and interface are original. Rules modules and adventure packs must use properly licensed or original material, remain edition-labeled, preserve required attribution, and must not reproduce protected publisher art, logos, trade dress, or non-licensed rulebook expression.
