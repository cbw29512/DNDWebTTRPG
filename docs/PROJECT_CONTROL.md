# Project Control and Anti-Drift Charter

Last updated: 2026-08-05

This document is the operational source of truth for keeping The Living Table aligned while implementation continues.

## North Star

The whole reason The Living Table exists is to make D&D easier to track and easier to play from both the Dungeon Master and player perspectives.

The system should remove setup, lookup, calculation, repeated entry, scattered notes, and bookkeeping so the group can spend more time describing, deciding, roleplaying, rolling, and reacting. Automation supports the DM and players; it does not replace player intent, imagination, roleplay, or DM adjudication.

Every proposed feature must identify the burden it removes. A feature that creates more tracking than it eliminates must be redesigned or rejected. `docs/NORTH_STAR.md` is the highest-level product filter.

## Canonical repositories

- Runtime, website, sessions, campaigns, and multiplayer: `cbw29512/DNDWebTTRPG`
- Card definitions, card artwork, rules-reviewed reusable content, and print assets: `cbw29512/DNDCards`
- Production branch: `main`
- Current public project URL: `https://github.com/cbw29512/DNDWebTTRPG`
- Current deployment: GitHub Pages from `DNDWebTTRPG/main`
- Future domain: not assigned

`DNDWebTTRPG` consumes immutable versioned definitions from `DNDCards` and owns mutable campaign instances, ownership, reveals, resources, memories, and session state. It must not become a second handwritten card catalog.

## Product promise

A DM selects a ready-to-run adventure, creates a campaign, invites players, and starts with minimal setup. Players claim complete characters and play from character and item cards while the DM runs the world from prepared Scene cards.

The campaign can be closed and resumed later—including during combat—without people reconstructing the game from memory.

## Locked adventure context

The canonical model is:

```text
Campaign / World → Location → Site → Area / Room
                                     └─ Current Scene
```

- Location is the broad city, region, settlement, coast, biome, or comparable part of the world.
- Site is the named destination or complex inside the Location.
- Area / Room is the immediate battle-map-scale space.
- Scene is what is happening there now and may change without physical movement.

`docs/SCENE_MODEL.md` is authoritative. The terms may not be collapsed in cards, manifests, state, UI labels, tests, or documentation.

## Locked prepared-adventure behavior

Prepared adventures are ordered executable packages. The DM does not rebuild them manually during play.

Loading a Scene automatically prepares:

- Location, Site, Area / Room, and Scene cards;
- NPCs and monsters;
- hazards, traps, clues, objectives, and treasure;
- triggers, consequences, and connected transitions;
- saved mutable state for every involved instance.

All required material is prepared for the DM, but loaded content is not automatically player-visible. Hidden traps, secrets, unknown item properties, curses, rewards, and future triggers remain absent from player projections until legitimately revealed.

Homebrew mode permits manual construction. Once saved, a homebrew adventure follows the same executable Scene behavior.

## Locked card standard

### Front

- Artwork
- Name
- Card type
- CR, rarity, level, role, or equivalent badge
- Minimal additional text

### Back

- Compact game shorthand sufficient to use the card
- HP, AC, movement, melee, ranged, spells, DCs, saves, damage, effects, traits, charges, resources, triggers, reactions, and state as applicable
- Player-facing information separated from DM-only truth

The goal is a compact, readable replacement for opening another rulebook or note system during play.

## Locked user journey

### DM

1. Create or log into one account.
2. Enter DM Workspace.
3. Create a campaign or one-shot.
4. Select an adventure and rules edition.
5. Review ordered Scenes and included pregens.
6. Generate a join code or invitation.
7. Watch players claim characters and mark ready.
8. Start the adventure.
9. Load Scenes; all associated context and cards load automatically.
10. Describe, adjudicate, reveal, run encounters, award treasure, and record changes.
11. Save, close, and resume at the exact next decision or turn.

### Player

1. Create an account, log in, or use permitted guest access.
2. Enter a campaign code or invitation link.
3. Claim an available complete edition-specific character.
4. Review actions, spells, features, equipment, items, and resources.
5. Mark ready and enter when the DM starts.
6. See only player-safe character information and revealed world cards.
7. Describe intent, make choices and rolls, use items, track resources, and receive consequences.
8. Disconnect and resume without losing character or inventory state.

## Canonical state model

One authoritative campaign/session record owns:

- campaign identity, membership, roles, edition, source pack, and release version;
- current Location, Site, Area / Room, Scene, and transitions;
- board instances and reveal/audience state;
- persistent Area changes, traps, secrets, exits, clues, and treasure;
- quests, objectives, clocks, and triggers;
- NPC dialogue, knowledge, promises, attitudes, relationships, and last known place;
- pregen availability, reservations, claims, and ready state;
- character levels, HP, resources, spells, equipment, conditions, rests, and advancement;
- persistent item instances, known/hidden properties, charges, attunement, curses, ownership, and transfers;
- initiative, rounds, turns, actions, reactions, concentration, death saves, hazards, and combat resume;
- event history, overrides, undo, exports, and reconnect state.

`docs/GAME_STATE_MEMORY_MODEL.md` is authoritative for tracking scope. Separate visual modules may render the state but may not create competing private stores.

## Current milestone order

1. Browser-verify and stabilize the corrected Location → Site → Area → Scene flow.
2. Replace DOM reconciliation with a direct authoritative session reducer.
3. Implement exact saved combat and mid-combat resume.
4. Implement persistent item instances and player/DM knowledge boundaries.
5. Implement NPC memory and persistent Area alterations.
6. Complete one local Wishing Cake run through save/resume.
7. Complete six legal level-three pregens with explicit 2014/2024 identity.
8. Add campaign creation, join code, lobby, claiming, and ready checks.
9. Add shared authoritative multiplayer synchronization and reconnect.
10. Finish card art, visual QA, commercial-rights review, and print output.

Visual polish may continue when it reduces burden, but it may not displace the complete DM-to-player play path.

## Definition of Done

A feature is complete only when:

- implementation is merged;
- automated tests actually run and pass;
- permissions and DM/player visibility are verified;
- save/resume behavior is verified where relevant;
- deployed behavior is browser-tested;
- accessibility is reviewed;
- documentation and implementation ledger are updated;
- known limitations are stated honestly;
- a DM/player playtest demonstrates reduced tracking burden.

A merged prototype is not automatically complete.

## Change-control checklist

Every meaningful PR must answer:

1. Which DM or player burden does this remove?
2. Which milestone does this advance?
3. Which canonical state owns the new data?
4. Is the data a definition or a mutable campaign instance?
5. Does it duplicate anything from `DNDCards` or another state store?
6. Does it expose DM-only information to players?
7. Does it introduce an observer, interval, listener, or render loop?
8. What automated, browser, role-boundary, and save/resume tests prove it works?
9. What documentation and ledger entries must change?
10. Does it make the game easier to track and play, or merely add another interface to manage?

## Anti-drift rules

- Do not create a second card source of truth.
- Do not collapse Location, Site, Area / Room, and Scene.
- Do not call local role separation authentication.
- Do not call browser-local state multiplayer.
- Do not call one demonstration character a complete pregen roster.
- Do not hide DM-only data with CSS; omit it from player data.
- Do not mutate immutable source definitions during play.
- Do not make a generic item definition stand in for a specific acquired item instance.
- Do not save numbers while discarding the context needed to resume.
- Do not claim tests passed unless they ran.
- Do not claim GitHub Pages is working until deployed behavior is checked.
- Do not add visual features that destabilize the central play path.
- Do not use full-document `MutationObserver` rendering without strict guards and a documented reason.
- Do not change product flow without recording an approved decision.
- Do not require the same fact to be maintained in more than one place.
- Do not automate away player choices, roleplay, improvisation, or the DM's final authority.

## Required maintenance

After every major build:

- update `PROJECT_STATUS.md`;
- append `docs/IMPLEMENTATION_LEDGER.md`;
- update `docs/DECISIONS.md` when product behavior changes;
- update the Scene or memory models when state meaning changes;
- record exact PR and merge SHA;
- preserve unresolved limitations;
- identify the next milestone and acceptance test;
- state which DM or player burden the change removed.
