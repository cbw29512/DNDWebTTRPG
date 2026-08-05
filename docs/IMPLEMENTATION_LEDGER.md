# Implementation Ledger

Last updated: 2026-08-05

This ledger records meaningful merged work, its exact merge SHA, what it actually accomplished, and what remained unfinished. New entries are appended; prior entries are not rewritten to make the project appear more complete.

## Repository roles

- `cbw29512/DNDWebTTRPG`: runtime, website, mutable campaign instances, sessions, campaigns, and multiplayer
- `cbw29512/DNDCards`: authoritative reusable card definitions, artwork, and print assets

## Recent implementation history

| PR | Merge SHA | Delivered | Remaining boundary |
|---|---|---|---|
| #40 | `8c3c32156e4c4012e95e672b56f65089e0a88638` | Full-card modal | Browser visual regression still needed |
| #41 | `22102c4a9c6cb3db1dcdc37aefb211573542c3cb` | Birthday adventure content | Not yet a complete executable multiplayer adventure |
| #42 | `bb316696cf3f2dc0fc5889bb959996d96893df5e` | Quest tracker | Later integrated into local session; shared server state still missing |
| #43 | `ea4dd1ec61593017de41f1c5029edccaa9a7bfc5` | Board scaling | Full responsive/browser QA still required |
| #44 | `e7ef4d5321c235e9c2e46f2e522e4f5880649f51` | Runtime slot guard | Later updated to preserve the expanded context model |
| #45 | `b5720aff94029e09cab3dda4cb24c2016e5d9633` | Player interactive demo | Not a connected multiplayer player session |
| #46 | `01130c53259802f58990e6d97c4b952ec49a59fc` | RPG equipment doll | Drag/drop requires browser regression testing |
| #47 | `706c6fdfc8c5588f1092e65a0a985c95160c53b1` | Rules-driven item cards | DM/player payload separation needs continued enforcement |
| #48 | `709c11d92768abcf77d6c868d7b21ba0978d790d` | Adventure loader | Loading initially stored metadata rather than constructing a full session |
| #49 | `8f3f168202eaf42d7e4e7b807cf20cdfdb2b5614` | DM and Player libraries | Browser-local sample data, not accounts or campaigns |
| #50 | `07e16318c7a3444d07629968ae8c0d055c6069e4` | First pregen and continuity audit | One partial pregen, not a complete roster |
| #51 | `3dced960aee84dc63ccf1c5029edccaa9a7bfc5` | Modal card-control proxy fix | Browser interaction testing still needed |
| #52 | `fa53b3dff0a37151f30b3769ce7d351cc84b1556` | Imported pinned `DNDCards` catalog | Dynamic CDN dependency and incomplete playable-character integration remain |
| #53 | `a49ea833b3541427311a443708ce67f759bf7b27` | Viewport-layer expanded stacks | Needed anchoring and outside-click refinement |
| #54 | `5e38ca6262c6b0109a7e06be8295190295c378a9` | Stack opens below and dismisses outside | Browser QA remains |
| #55 | `f67ccb83cece26d760b0f5d01a706ef119a092de` | Monster combat shorthand | Extended to all card types in #56 |
| #56 | `dc88a728a88e77bad88ced23c7f54856a819d67e` | All card types use front/back shorthand layouts | Source content quality varies by card |
| #57 | `a183627e70e8fb6b7a6bcc35be1699db51c4a414` | DM/player playtest audit | Confirmed prototype limitations and central product gap |
| #58 | `fac8c429c8f346874d7431edf44e205c8264b5eb` | Canonical browser-local adventure session | Single-device only; session creation still needed full Scene execution |
| #59 | `046fa3b5a0620b498a87ec964b9f3710315e47da` | Quest and player state connected to local session | Observer-based bridge and browser QA remain risks |
| #60 | `025608342fc64033f013455c625d5b01df051ffd` | Player Library filters | No real campaign-owned library yet |
| #61 | `533376e16f267d9c3c6eb3b5ff3193644d3cd109` | Pinned `DNDCards` artwork and polished tarot layout | Missing art, commercial rights, and print exports remain |
| #62 | `bc7767ef31eb19a7197a3a607d13b73760135682` | Catalog-wide card quality audit | Introduced recursive observer freeze fixed in #63 |
| #63 | `13586eab5a1d6df5f89ef98e5af167d0355e2723` | Fixed recursive audit site lockup | Broader observer cleanup and browser smoke tests still required |
| #64 | `d1eade785acaf1502e77f1a47d14726ab2de879c` | Permanent project control charter, decision log, status, and ledger | Documents require continued maintenance after every major build |
| #65 | `3583908183c250d4dbea5683206d2026b21a2309` | Stabilized Quest Tracker observer rendering and added regression source checks | Other older observers and browser smoke coverage still require work |
| #66 | `a8f0bbe4450f94d4d361f29e388749bc51f6df24` | First canonical distinction between broad Location and immediate Room | Refined and superseded by the complete Site/Scene model in #71 |
| #67 | `14bf00aef6ee7ea238010a320fd866435844f729` | First executable ordered Wishing Cake Room flow and browser-local Scene progress | Original two-level spatial model was incomplete; corrected in #71 |
| #68 | `3036a5fece5819740467890ce1b8198246363099` | Phone-responsive layout, touch targets, single-column views, and stack bottom sheet | Deployed iPhone and Android visual verification remains required |
| #69 | `25028ae67ad8561b67a4a4dcd6753e5624d2bea4` | Separate immutable DM/player routes, player-safe projections, and role play model | Static routes are not secure authentication or server authorization |
| #70 | `525b7fb2a086517d61ddcbb55b342f2c96caa200` | Locked the ease-first North Star and burden-removal product test | Documentation must continue to govern runtime decisions |
| #71 | `c5829a9aab8bb0917a99235843c345fc89f26351` | Corrected hierarchy to Campaign/World → Location → Site → Area/Room with Scene as the active event; added card types, manifest v2, readable context layout, save migration, state containers, and canonical game-memory/pain-point models | Automated tests were added but not executed; browser/deployment verification, direct session reducer, complete combat persistence, item instances, NPC memory, Area changes, and authoritative multiplayer remain unfinished |

## Current product truth

### Working as a local prototype

- Dedicated Dungeon Master and player entry routes
- Player-safe card projection from the player route's first render
- Card-driven DM board with placement, reveal, flip, remove, grouped stacks, and basic grouped initiative
- DM and Player libraries
- Imported version-pinned `DNDCards` catalog and artwork resolution
- Polished card previews and card-quality reporting
- Player equipment doll and local item interactions
- Ordered Wishing Cake Scene manifest
- Automatic DOM-based Scene board reconciliation
- Context hierarchy shown as Location, Site, Area / Room, and Current Scene
- Browser-local adventure, quest, board, character, hierarchy, and event-state foundation
- Legacy browser-save migration into local session schema v2
- Project North Star, role model, place/Scene model, game-memory model, pain-point priorities, and anti-drift controls

### Defined and scaffolded but not complete

- Exact mid-combat resume
- Full combat state: round, active turn, actions, movement, reactions, HP, temporary HP, conditions, concentration, hazards, recharge, and death saves
- Persistent item instances: exact identity, known/hidden properties, charges, attunement, curse knowledge, provenance, ownership, and consumed/lost state
- NPC dialogue, promise, lie, attitude, relationship, and last-known-place memory
- Persistent Area alterations, traps, clues, opened doors, defeated creatures, and claimed treasure
- Recorded short rests, long rests, resource recovery, and advancement

### Not implemented as a real connected product yet

- Secure user authentication and authorization
- Server-backed campaign records and memberships
- Join codes and invitations
- Pregen reservation, claiming, and ready lobby
- Six complete legal edition-specific pregens
- Direct authoritative board/session reducer
- Shared real-time multiplayer synchronization
- Reconnect and cross-device persistence
- Server-side player-safe network payloads
- Complete D&D combat-resolution support
- Final artwork-rights certification and 300-DPI print exports

## Current priority

**Prove exact continuity rather than adding more disconnected interface.**

1. Browser-playtest the corrected four-card context on DM and player routes.
2. Replace DOM card-picker reconciliation with a direct authoritative state reducer.
3. Implement and prove saved combat with exact mid-turn resume.
4. Implement persistent item instances and player/DM knowledge boundaries.
5. Implement NPC memory and persistent Area state.
6. Complete the Wishing Cake cards and six legal level-three pregens.
7. Move the proven local state model to server-authoritative multiplayer.

## Next acceptance test

1. Load The Wishing Cake.
2. Confirm the board shows `Bramblewick → The Wishing Cake Inn → Grand Celebration Hall → The Stolen Wish`.
3. Advance below the inn.
4. Confirm Location remains Bramblewick while Site becomes Old Celebration Halls, Area becomes Holding Cells, and Scene becomes Escape and Ceiling Ambush.
5. Confirm unrelated later-room cards are absent from the opening board.
6. Confirm players receive only revealed player-safe context and associated cards.
7. Save and refresh.
8. Confirm the exact hierarchy, board, quests, character, inventory foundation, and event history return.
9. Confirm the legacy board guard does not delete Site, Scene, or Objective state.

## Ledger update template

Append this for every major merged PR:

```markdown
### YYYY-MM-DD — PR #NN: Title

- Merge SHA: `...`
- Burden removed:
- Milestone advanced:
- Actually delivered:
- Tests actually run:
- Browser/deployment verification:
- Known limitations:
- Next acceptance test:
```
