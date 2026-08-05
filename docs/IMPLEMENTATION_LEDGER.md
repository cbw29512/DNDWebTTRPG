# Implementation Ledger

Last updated: 2026-08-04

This ledger records meaningful merged work, its exact merge SHA, what it actually accomplished, and what remained unfinished. New entries are appended; prior entries are not rewritten to make the project appear more complete.

## Repository roles

- `cbw29512/DNDWebTTRPG`: runtime, website, sessions, campaigns, and multiplayer
- `cbw29512/DNDCards`: authoritative reusable card definitions and artwork

## Recent implementation history

| PR | Merge SHA | Delivered | Remaining boundary |
|---|---|---|---|
| #40 | `8c3c32156e4c4012e95e672b56f65089e0a88638` | Full-card modal | Browser visual regression still needed |
| #41 | `22102c4a9c6cb3db1dcdc37aefb211573542c3cb` | Birthday adventure content | Not yet a complete executable multiplayer adventure |
| #42 | `bb316696cf3f2dc0fc5889bb959996d96893df5e` | Quest tracker | Later integrated into local session; shared server state still missing |
| #43 | `ea4dd1ec61593017de41f1c5029edccaa9a7bfc5` | Board scaling | Full responsive/browser QA still required |
| #44 | `e7ef4d5321c235e9c2e46f2e522e4f5880649f51` | Runtime slot guard | Legacy Objective source remains and should be removed cleanly |
| #45 | `b5720aff94029e09cab3dda4cb24c2016e5d9633` | Player interactive demo | Not a connected multiplayer player session |
| #46 | `01130c53259802f58990e6d97c4b952ec49a59fc` | RPG equipment doll | Drag/drop requires browser regression testing |
| #47 | `706c6fdfc8c5588f1092e65a0a985c95160c53b1` | Rules-driven item cards | DM/player payload separation needs continued enforcement |
| #48 | `709c11d92768abcf77d6c868d7b21ba0978d790d` | Adventure loader | Loading initially stored metadata rather than constructing a full session |
| #49 | `8f3f168202eaf42d7e4e7b807cf20cdfdb2b5614` | DM and Player libraries | Browser-local sample data, not accounts or campaigns |
| #50 | `07e16318c7a3444d07629968ae8c0d055c6069e4` | First pregen and continuity audit | One partial pregen, not a complete roster |
| #51 | `3dced960aee84dc63ccf1a63427193ac1a3d966c` | Modal card-control proxy fix | Browser interaction testing still needed |
| #52 | `fa53b3dff0a37151f30b3769ce7d351cc84b1556` | Imported pinned `DNDCards` catalog | Dynamic CDN dependency and incomplete playable-character integration remain |
| #53 | `a49ea833b3541427311a443708ce67f759bf7b27` | Viewport-layer expanded stacks | Needed anchoring and outside-click refinement |
| #54 | `5e38ca6262c6b0109a7e06be8295190295c378a9` | Stack opens below and dismisses outside | Browser QA remains |
| #55 | `f67ccb83cece26d760b0f5d01a706ef119a092de` | Monster combat shorthand | Extended to all card types in #56 |
| #56 | `dc88a728a88e77bad88ced23c7f54856a819d67e` | All card types use front/back shorthand layouts | Source content quality varies by card |
| #57 | `a183627e70e8fb6b7a6bcc35be1699db51c4a414` | DM/player playtest audit | Confirmed prototype limitations and central product gap |
| #58 | `fac8c429c8f346874d7431edf44e205c8264b5eb` | Canonical browser-local adventure session | Single-device only; session creation still needs full scene execution |
| #59 | `046fa3b5a0620b498a87ec964b9f3710315e47da` | Quest and player state connected to local session | Observer-based bridge and browser QA remain risks |
| #60 | `025608342fc64033f013455c625d5b01df051ffd` | Player Library filters | No real campaign-owned library yet |
| #61 | `533376e16f267d9c3c6eb3b5ff3193644d3cd109` | Pinned `DNDCards` artwork and polished tarot layout | Missing art, commercial rights, and print exports remain |
| #62 | `bc7767ef31eb19a7197a3a607d13b73760135682` | Catalog-wide card quality audit | Introduced recursive observer freeze fixed in #63 |
| #63 | `13586eab5a1d6df5f89ef98e5af167d0355e2723` | Fixed recursive audit site lockup | Broader observer cleanup and browser smoke tests still required |

## Current product truth

### Working as a local prototype

- Card-driven DM board
- DM/Player inspection views
- Card placement, reveal, flip, remove, grouping, and basic initiative
- DM and Player libraries
- Imported version-pinned `DNDCards` catalog and artwork resolution
- Polished card previews and card-quality reporting
- Player equipment doll and local item interactions
- Browser-local adventure, quest, and player-state persistence

### Not implemented as a real product yet

- User authentication
- Separate DM and player logins
- Real campaign records and memberships
- Join codes and invitations backed by a server
- Pregen reservation and claiming
- Campaign lobby and ready checks
- Six complete legal pregens
- Ordered scene execution with automatic room-content loading
- Shared authoritative multiplayer state
- Real-time synchronization and reconnect
- Complete D&D combat resolution
- Server-side player-safe projections
- Cross-device persistence
- Final artwork-rights certification and 300-DPI print exports

## Current priority

**Stability and ordered scene execution.**

The next acceptance test is:

1. Load The Wishing Cake from its manifest.
2. Receive an ordered scene list.
3. Load the opening scene.
4. Automatically place the room, NPCs, clues, monsters, hazards, quests, and treasure assigned to that scene.
5. Keep unrevealed content DM-only.
6. Advance to the next scene without manually rebuilding the board.
7. Save, reload, and recover the exact scene and character state.

## Ledger update template

Append this for every major merged PR:

```markdown
### YYYY-MM-DD — PR #NN: Title

- Merge SHA: `...`
- Milestone advanced:
- Actually delivered:
- Tests actually run:
- Browser/deployment verification:
- Known limitations:
- Next acceptance test:
```
