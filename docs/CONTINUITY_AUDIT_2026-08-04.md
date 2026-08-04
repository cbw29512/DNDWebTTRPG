# Living Table continuity audit — 2026-08-04

## Product purpose

The product is a card-first tabletop platform that connects DungeonCards definitions to a live web session. A DM can load or build a one-shot, players load character and item cards, and both roles use the current card board during play.

## Authoritative data flow

1. `DungeonCards` remains the authoritative source for reusable tarot-style card definitions and rules-reviewed content.
2. Adventure Master Cards resolve to versioned adventure manifests.
3. `DNDWebTTRPG` creates independent runtime copies for the current session.
4. DM Library owns adventure packs and drafts.
5. Player Library owns character cards, item cards, invitations, and active-adventure membership.
6. Current Card Board owns live encounter and reveal state.

Definitions, ownership, and runtime state must not be collapsed into one object.

## Card standards

- Front: picture, type, and title.
- Player back: all player-known information.
- DM back: player information plus DM-only mechanics and secrets.
- Character card: picture front; complete playable pregen information and load identity on the back.
- Item cards: draggable to valid equipment slots and modify only rules-supported derived statistics.
- Adventure Master Card: QR or digital link to a permanent pack identity, with a human-readable backup code.

## Completed working paths

- Six-slot encounter board plus separate Quest Tracker.
- DM and Player views.
- Full-card modal with role-safe information.
- Grouped same-name monster initiative.
- Rules-driven item equipment, attunement, charges, and consumables.
- Wishing Cake versioned adventure loader using `?pack=wishing-cake` and `WISH-CAKE-001`.
- DM Library and Player Library browser-local MVP.
- Pregen character card loading using `?character=wendy-birthday-hero` or the Player Library Load Character button.
- Pregen card appears in Player View with picture front and information back.

## Replication controls

- All implementation is committed to GitHub through reviewed pull requests.
- Cache-busted build identifiers are present in `index.html`.
- Adventure, library, item-system, and pregen-character regression tests are part of `npm test`.
- Stable IDs and explicit versions connect cards, packs, characters, and sessions.
- This audit file records the controlling architecture and polish boundary.

## Current limitations before production polish

- Libraries and current sessions are browser-local; separate computers do not synchronize yet.
- Invitations are presentation data, not authenticated server-backed invitations.
- Uploaded adventure JSON receives only basic parsing; production imports need schema validation, integrity checks, and migration handling.
- The first pregen portrait is a styled placeholder; final commercial cards need approved artwork from the DungeonCards asset pipeline.
- Player View currently has one complete pregen definition. Additional pregens must use the same versioned character-card schema.
- Some legacy source names and initial board IDs remain from the original demo and should be normalized during polish.
- Objective-card state still exists in legacy app definitions even though the visible encounter board removes it at runtime.
- Quest Tracker and some library state remain separate browser-local stores rather than one synchronized session store.
- No account ownership, purchasing entitlement, multiplayer room code, or real-time backend exists yet.

## Polish gate

Polish work may proceed without changing the architecture above. Visual refinements must preserve stable IDs, role-safe card backs, exact system identity, version pinning, character-card loading, rules-driven item derivation, and separation between definitions and runtime state.
