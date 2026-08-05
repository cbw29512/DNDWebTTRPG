# DM and Player End-to-End Playtest Audit

Date: 2026-08-04

## Scope

This audit traces the current static application as both a Dungeon Master and a player. It reviews the public adventure loader, DM and player libraries, live card board, card controls, quest tracker, pre-generated character loader, equipment system, role projection, persistence, and multiplayer expectations.

This is a code-path and interaction audit. A browser-level visual regression run and multi-device network playtest are still required.

## Executive finding

The project is a strong single-browser interactive prototype. It demonstrates the product idea clearly: adventure cards can be browsed, loaded, placed, revealed, flipped, grouped, and operated; a player can load a pre-generated character and manipulate equipment, HP, action economy, and item resources.

It is not yet a complete online play experience. The adventure manifest does not construct the live board, libraries do not own the live session, player and DM state do not synchronize across devices, most session state is not persisted, and there is no authentication or campaign backend.

## DM playtest

### Intended flow

1. Log in.
2. Open DM Workspace.
3. Choose a campaign or one-shot.
4. Load The Wishing Cake from the Adventure Master Card.
5. Review pregens and invite players.
6. Start a fresh version-pinned session.
7. Place the opening location, room, NPCs, quest, and treasure from the manifest.
8. Reveal only player-safe information.
9. Advance through rooms, add monsters and hazards, roll grouped initiative, track uses, and award treasure.
10. Save and resume the session later.

### Current experience

- The DM Library can display adventure packs, drafts, upload JSON metadata, browse the imported DungeonCards catalog, filter cards, preview them, and open the Wishing Cake loader.
- The loader validates only a few top-level manifest fields and records the selected system/version in localStorage.
- Loading the pack dispatches an event, but the board is already initialized from hard-coded JavaScript. The manifest's `startingBoard`, `startingQuests`, `cardModule`, and `sessionFactory` do not construct a fresh runtime session.
- The board supports card placement, type-safe slots, stacks, drag/drop, reveal/hide, flip, remove, grouped monster initiative, quick rolls, and item charge tracking.
- The board starts with card IDs that do not match the manifest's full starting board. The manifest lists four starting NPCs and Birthday Spark Tokens, while `src/app.js` initializes a smaller, different set.
- The source still declares an Objective slot and objective board state, while a separate runtime guard removes the slot from the rendered board. The quest tracker maintains its own independent state.
- The DM can manipulate cards in the current browser, but there is no campaign record, invitation delivery, player assignment, authoritative session save, undo persistence, or reconnect.

### DM verdict

The current board is usable as a local encounter demonstration. It is not yet possible for a DM to load an adventure package and run it from beginning to end with remote players without manually reconstructing state and keeping the browser open.

## Player playtest

### Intended flow

1. Log in or join with a campaign code.
2. Accept a campaign invitation.
3. Choose or scan a pre-generated character card.
4. Load the character into the active campaign.
5. See only revealed rooms, NPCs, monsters, quests, and treasure.
6. Use character attacks, saves, resources, equipment, items, HP, and action economy during the shared session.
7. Receive awarded item cards and keep them in the character library.
8. Leave and resume later from another device.

### Current experience

- The Player Library displays a pre-generated character, locally owned item names, static invitations, static active adventures, collected catalog cards, and the imported player-safe catalog categories.
- Loading the Wendy character selects a stable character ID and opens Player View.
- The enhanced player station provides HP controls, action/bonus/reaction toggles, equipment slots, drag/drop items, derived AC/attack/damage/saves, attunement, consumables, charges, and 2014/2024 potion action wording.
- Most player station state is module memory only. Refreshing resets HP, ready state, equipped items, action economy, charges, and selection state.
- The item system begins with a hard-coded inventory and equipment loadout rather than the player's library ownership or an assigned campaign character snapshot.
- The player can open item details that include the DM/rules back. That conflicts with the strict rule that DM-only data must not be sent to the player. Rules references can be player-safe, but true DM-only content must be projected out before delivery.
- Player View is a local role switch. It is not a separate authenticated player connection.
- Invitations and active adventures are sample local records, not shared campaign data.
- The player cannot receive a newly awarded treasure card from the DM's live board, target a creature, submit an attack for resolution, see authoritative initiative turns, or resume on another device.

### Player verdict

The player station is a useful interactive character/equipment prototype. It demonstrates the desired experience, but it is not yet connected to campaign ownership, the live board, or an authoritative multiplayer session.

## Working well

- Clear card-driven product identity.
- Stable adventure, card, character, and release IDs.
- Versioned Wishing Cake manifest and permanent adventure code.
- Imported DungeonCards catalog with source commit pinning.
- Front-picture/back-information card presentation.
- Category-aware shorthand card previews.
- Type-safe board slots and drag/drop placement.
- Card reveal/hide, flip, remove, stack expansion, outside-click dismissal, and grouped initiative.
- Role projection foundation for hiding unrevealed cards and DM data.
- Pregenerated character selection and player-view activation.
- Rules-driven equipment calculations, attunement, item uses, and edition labels.
- Automated source-level regression tests are present for many recent controls.

## Broken or misleading paths

1. **Load Adventure does not load the adventure into the board.** It stores metadata and removes the loader; the live session remains hard-coded.
2. **Manifest and board disagree.** The declared opening cards are not the exact cards initialized in `src/app.js`.
3. **Campaigns, login, invitations, and remote players are not implemented.** Current entries are local sample data.
4. **Session state is fragmented.** Board, quest tracker, player station, libraries, loader, and selected character each maintain separate state stores.
5. **Refresh loses critical play state.** Board and player combat state are not reliably persisted.
6. **Player item details include a DM/rules section.** True DM-only information must never be bundled into player payloads.
7. **Objective exists in source but is hidden by a DOM guard.** Source and runtime layout are inconsistent.
8. **Library collection is not ownership.** Adding a card locally does not create a campaign inventory item or playable runtime instance.
9. **Adventure upload is metadata-only.** JSON is not fully validated, sanitized, imported, linked, or converted to a fresh session.
10. **No authoritative combat resolution.** Rolls can be made, but attacks do not target AC, apply damage, track conditions, or advance a shared turn state.

## Priority order before visual polish

### P0 — Make one complete local adventure actually run

- Replace hard-coded board initialization with a runtime session created from the selected manifest and card module.
- Use `startingBoard`, `startingQuests`, selected rules edition, and pregen assignments.
- Create one canonical session store shared by board, quest tracker, player station, and libraries.
- Persist the complete session locally and support Start New, Save, Resume, and Reset.
- Remove the legacy Objective slot/state from source and make the quest tracker consume canonical session quests.
- Ensure player projections strip all DM-only backs and secrets.

### P1 — Complete the local combat loop

- Add players to initiative.
- Add active-turn advancement and round tracking.
- Connect character attacks/saves/items to the selected runtime actor.
- Add target selection, hit-versus-AC, save DC, damage/healing confirmation, conditions, concentration, death state, and DM override.
- Award treasure from a board instance into a character inventory.
- Persist resource use and event history.

### P2 — Add real accounts and campaigns

- Unified login with DM and Player workspaces.
- Shared campaign records with role membership.
- Invitations, campaign codes, character assignment, active sessions, and ownership.
- Server-authoritative session state and real-time synchronization.
- Reconnect and cross-device resume.

### P3 — Harden and polish

- Full schema validation and safe adventure-package import.
- Accessibility and keyboard playtest.
- Browser visual regression and deployment smoke tests.
- Real card artwork, tarot print specifications, typography, contrast, animation, and mobile polish.

## Release gate for the next phase

Do not call the core experience playable until a DM can:

1. Start a new Wishing Cake session from its Master Card.
2. Assign Wendy's pregen to a player.
3. Reveal the opening scene.
4. Run at least one complete combat with initiative, attacks, damage, resources, and turns.
5. Award an item to the player.
6. Save, close, reopen, and resume without losing state.
7. Confirm that Player View never receives DM-only data.

After that local end-to-end gate passes, backend multiplayer can replace the local persistence layer without changing the card and session concepts.
