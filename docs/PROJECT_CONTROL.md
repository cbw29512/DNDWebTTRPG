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

`DNDWebTTRPG` must not become a second handwritten card catalog. It consumes versioned definitions from `DNDCards` and stores only runtime instances, ownership, reveals, resources, and session state.

## Product promise

A DM selects a ready-to-run adventure, creates a campaign, invites players, and starts play with minimal setup. Players join, claim complete pregenerated characters, mark ready, and play from character and item cards while the DM controls scenes, encounters, reveals, and progression.

## Locked adventure behavior

Prepared adventures are ordered packages. The DM does not manually rebuild them during play.

- Loading an adventure exposes its ordered scene list.
- Loading a scene or room automatically loads its room card, NPCs, monsters, hazards, clues, quests, and treasure.
- All scene content is prepared for the DM, but visibility remains controlled by reveal rules.
- Hidden traps, secrets, rewards, and future triggers remain absent from player projections until revealed.
- Homebrew mode lets a DM create and order scenes manually.
- Once saved, a homebrew adventure behaves like a prepared adventure.

## Locked card standard

### Front

- Artwork
- Name
- Card type
- CR, rarity, level, role, or equivalent badge
- Minimal additional text

### Back

- Compact game shorthand sufficient to run the card
- `HP` for hit points
- Armor icon for AC
- Sword icon for melee
- Bow icon for ranged
- Magic-burst icon for spells
- Movement, DCs, saves, damage, effects, traits, charges, resources, triggers, and reactions as applicable

The goal is a compact, readable replacement for opening a rulebook during play.

## Locked user journey

### DM

1. Create or log into one account.
2. Enter DM Workspace.
3. Create a campaign or one-shot.
4. Select an adventure and rules edition.
5. Review ordered scenes and included pregens.
6. Generate a join code or invitation.
7. Watch players claim characters and mark ready.
8. Start the adventure.
9. Load scenes; associated cards load automatically.
10. Reveal cards, run encounters, award treasure, save, and resume.

### Player

1. Create an account, log in, or use permitted guest access.
2. Enter a campaign code or invitation link.
3. Review available unclaimed pregens.
4. Claim one complete edition-specific character.
5. Review actions, spells, features, equipment, and resources.
6. Mark ready.
7. Enter the shared session when the DM starts.
8. See only player-safe and revealed information.
9. Play, receive items, disconnect, and resume later without losing state.

## Canonical state model

One authoritative campaign/session record must own:

- campaign membership and roles;
- adventure ID, release version, and edition;
- scene order and current scene;
- board card instances and visibility;
- quests and triggers;
- pregen availability, reservations, claims, and ready state;
- character HP, resources, spells, equipment, items, and conditions;
- initiative, rounds, turns, reactions, concentration, and death saves;
- treasure ownership and transfers;
- event history, overrides, and reconnect state.

Separate visual modules may render this data, but they must not invent competing private state stores.

## Current milestone order

1. Stability cleanup: remove recursive or wasteful observer-driven rendering and add browser smoke coverage.
2. Ordered scene manifests and automatic room-content loading.
3. One complete local Wishing Cake run from manifest through save/resume.
4. Six complete legal level-three pregens with explicit 2014/2024 identity.
5. Campaign creation, join code, lobby, character claiming, and ready checks.
6. Shared authoritative multiplayer session and reconnect.
7. Complete combat loop and DM override/event history.
8. Full card-art completion, visual QA, commercial-rights review, and print output.

Visual polish may continue when it supports these milestones, but it may not displace the complete DM-to-player play path.

## Definition of Done

A feature is complete only when:

- implementation is merged;
- automated tests actually run and pass;
- permissions and DM/player visibility are verified;
- the deployed behavior is browser-tested;
- accessibility is reviewed;
- documentation and the implementation ledger are updated;
- known limitations are stated honestly;
- a DM/player playtest demonstrates that the feature reduces rather than increases tracking burden.

A merged prototype is not automatically a completed feature.

## Change-control checklist

Every meaningful PR must answer:

1. Which DM or player burden does this remove?
2. Which milestone does this advance?
3. Which canonical state owns the new data?
4. Does it duplicate anything from `DNDCards`?
5. Does it expose DM-only information to players?
6. Does it introduce a new observer, interval, listener, or render loop?
7. What automated and browser tests prove it works?
8. What documentation and ledger entries must change?
9. Does it conflict with any approved decision?
10. Does it make the game easier to track and play, or merely add another interface to manage?

## Anti-drift rules

- Do not create a second card source of truth.
- Do not call local role switching authentication.
- Do not call browser-local state multiplayer.
- Do not call one demonstration character a complete pregen roster.
- Do not hide DM-only data with CSS; omit it from player data.
- Do not claim tests passed unless they ran.
- Do not claim GitHub Pages is working until deployed behavior is checked.
- Do not add visual features that destabilize the central play path.
- Do not use full-document `MutationObserver` rendering without strict guards and a documented reason.
- Do not change the product flow without recording an approved decision.
- Do not add tracking that requires the DM or players to maintain the same fact in more than one place.
- Do not automate away player choices, roleplay, improvisation, or the DM’s final ruling authority.

## Required maintenance

After every major build:

- update `PROJECT_STATUS.md`;
- append `docs/IMPLEMENTATION_LEDGER.md`;
- update `docs/DECISIONS.md` when product behavior changes;
- record exact PR and merge SHA;
- preserve unresolved limitations;
- identify the next milestone and acceptance test;
- state which DM or player burden the change removed.
