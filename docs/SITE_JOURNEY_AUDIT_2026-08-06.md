# Site Journey Audit — 2026-08-06

## User journey audited

Home → Dungeon Master → local session → scene control → live board → Player Table → Home.

## Confirmed failures

1. The bare GitHub Pages URL opened the DM application with no explanatory hero or onboarding surface.
2. The Player Table existed at `player.html` but had no persistent discoverable navigation from the DM surface.
3. Local session and scene controls were rendered after the complete application in the body flex order, making scene advancement easy to miss.
4. Prepared Location/Site/Area locking removed the same DOM hooks used by the scene reconciler. This prevented reliable scene-driven replacement of prepared spatial cards.
5. The legacy `dm.html` redirect returned to the bare root, which now needs to represent Home rather than silently selecting the DM role.
6. No permanent route navigation connected Home, DM, Player, and scene controls.

## Corrections

- Added a public hero/home experience that explains the product, the current local-playtest boundary, and the four-step workflow.
- Added persistent Home / DM Table / Scenes / Player Table navigation to both runtime roles.
- Moved Local Session and DM Scene Control ahead of the live board in visual order.
- Preserved internal prepared-slot picker/removal hooks while blocking only trusted user mutation events; synthetic scene-engine clicks are allowed.
- Updated `dm.html` so the legacy DM route explicitly enters DM mode rather than Home.
- Added regression coverage for route discoverability, scene-control visibility, home behavior, and scene-engine/user-lock separation.

## Playtest route contract

- `/DNDWebTTRPG/` — Home / explanation / entry choices.
- `/DNDWebTTRPG/?dm=1` — resume/open the DM table without the Home surface.
- `/DNDWebTTRPG/?launch=1` — open the DM table and Adventure Master Card loader.
- `/DNDWebTTRPG/player.html` — Player Table.
- `/DNDWebTTRPG/dm.html` — compatibility redirect into DM mode.

## Current synchronization boundary

The local prototype stores session state in browser `localStorage`. DM and Player routes can share that storage within the same browser profile. This is not yet a networked multi-device session service.
