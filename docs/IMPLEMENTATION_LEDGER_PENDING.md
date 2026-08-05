# Pending implementation-ledger entries

These entries must be moved into `docs/IMPLEMENTATION_LEDGER.md` with their final merge SHAs during the next ledger consolidation.

## PR #67 — Ordered Location and Room runtime

Actually delivered:

- Eight ordered Wishing Cake scenes.
- Broad Location persists while the immediate Room changes.
- Previous, next, direct-select, and connected-exit navigation.
- Automatic board reconciliation for room, NPC, monster, hazard, and treasure slots.
- Browser-local session fields for current scene, location, room, room history, and discovered scenes.

Known boundary:

- Tests were added but not executed in the connector environment.
- Browser and deployed behavior remain unverified.

## PR #69 — Strict Dungeon Master and player experiences

Head SHA before merge: `42e3ac3553b5ba2d62d00854ec0710e5202e0032`

Milestone advanced:

- Role-safe DM-to-player play path and D&D interaction model.

Actually delivered:

- Root and `dm.html` enter the Dungeon Master experience.
- `player.html` enters the player experience.
- Runtime role is immutable and selected before the first session projection.
- The in-session DM/Player preview switch is removed.
- Player world cards cannot operate monsters, NPCs, hazards, scene progression, reveals, removal, deck construction, or monster initiative.
- Scene progression is DM-only.
- Added `docs/DND_PLAY_MODEL.md` as the canonical role, rhythm-of-play, three-pillar, interface, and ease-of-use reference.
- Recorded SRD 5.1 versus SRD 5.2.1 edition and licensing boundaries.
- Added source-level role-boundary regression checks.

Tests actually run:

- Test files were added to `npm test`.
- The test suite was not executed because the environment could not resolve `github.com` for a local clone.

Browser/deployment verification:

- Not yet performed.

Known limitations:

- Static routes are not secure authentication.
- Player Library still comes from a shared browser module.
- Server-verified account, campaign role, claimed seat, command authorization, and player-safe network payloads remain required.

Next acceptance test:

- Open the DM and player routes in separate browser contexts, load the same Room, and verify that the DM receives all controls/private information while the player receives only the claimed character and revealed player-safe cards.
