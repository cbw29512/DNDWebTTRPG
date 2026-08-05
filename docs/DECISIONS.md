# Approved Product Decisions

Last updated: 2026-08-05

1. The project lives in `cbw29512/DNDWebTTRPG`.
2. Working product name: **The Living Table**.
3. The primary interface is a card-driven battle board, not a traditional map editor.
4. The dice roller remains accessible across the top of both DM and player screens.
5. The DM can see player stats, spells, items, charges, resources, conditions, and turn state.
6. Players see only their own private character information plus cards the DM reveals to them.
7. Room, NPC, monster, hazard, clue, quest, treasure, item, feature, spell, and condition information are represented as cards.
8. Cards have separate public/player and private/DM faces where appropriate.
9. The DM controls card visibility: everyone, selected players, or DM only.
10. The active player takes a structured turn directly from their character cards.
11. The first complete product path will use The Wishing Cake as the prepared one-shot integration target.
12. The DM always retains override and undo authority.
13. Digital dice, manual result entry, and later physical-dice support are allowed.
14. The engine is system-neutral; the first rules module targets D&D 5e.
15. D&D 2014 and D&D 2024 remain separately versioned.
16. No official logos, copied art, trade dress, or unlicensed rulebook text.
17. Hidden information must be filtered server-side, never merely hidden in the browser.
18. Accessibility, privacy, source/licensing metadata, testing, and project-status updates are part of Definition of Done.
19. Features outside the current milestone remain recorded, but cannot displace the complete DM-to-player play path.
20. A feature is not complete until it has been visually tested in the deployed product—not merely merged.
21. `cbw29512/DNDCards` is the authoritative source for reusable card definitions, artwork, and print assets.
22. `DNDWebTTRPG` owns runtime instances, ownership, reveals, resources, campaigns, sessions, and multiplayer; it must not become a duplicate card catalog.
23. A prepared adventure is an ordered executable package. The DM does not manually rebuild published scenes during play.
24. Loading a prepared scene automatically prepares its room, NPCs, monsters, hazards, clues, quests, treasure, triggers, and next-scene links.
25. Automatically prepared content is not automatically player-visible. Reveal state remains separate from load state.
26. Homebrew mode allows manual scene construction and ordering. A saved homebrew adventure then behaves like a prepared adventure.
27. One unified account may be a DM in one campaign and a player in another. Separate account systems are not required.
28. Players join a campaign, choose an available pregen, claim it, mark ready, and enter play when the DM starts.
29. Pregens must be complete, legal, edition-specific D&D 5e characters before being called playable.
30. The target prepared-adventure roster is at least six complete level-three pregens covering distinct party roles.
31. Card fronts contain artwork, name, type, and CR/rarity/level/role badge with minimal extra text.
32. Card backs contain compact game shorthand sufficient to run the card without opening a rulebook.
33. The shorthand system uses `HP` for hit points and established visual symbols for armor, melee, ranged, spells, movement, DCs, saves, damage, traits, reactions, and resources.
34. Board, quests, characters, inventory, combat, scene progression, and campaign membership ultimately use one authoritative session state.
35. Browser-local state is a development milestone, not multiplayer or cross-device persistence.
36. Full-document `MutationObserver` rendering is prohibited unless narrowly justified, guarded, tested, and documented.
37. Every meaningful PR records its milestone, exact merge SHA, delivered behavior, tests actually run, browser verification, remaining limitations, and next acceptance test.
38. `docs/PROJECT_CONTROL.md`, `docs/IMPLEMENTATION_LEDGER.md`, `PROJECT_STATUS.md`, and this decision log must remain synchronized after major changes.
39. A **Location** is the broad place containing play: a city, biome, coast, cave system, castle, temple, region, or similar large environment.
40. A **Room** is the party's immediate playable surroundings and battle-map scale, including enclosed chambers and open encounter areas such as clearings, campsites, bridges, shore sections, and ambush zones.
41. A Room always belongs to a Location. Moving between rooms normally leaves the Location unchanged.
42. The Location changes only when the party leaves the broad environment and enters another broad environment.
43. Room cards contain picture-first fronts, player read-aloud information, and DM-only checks, DCs, triggers, secrets, consequences, related cards, and conditional exits.
44. Room transitions may be triggered by player actions. Example: turning a torch bracket after a successful DC 15 check can reveal a secret door and change the current Room to `secret-room-1` while the Location remains the castle.
45. Location and Room are not interchangeable terms in manifests, state, UI labels, tests, or documentation. `docs/SCENE_MODEL.md` is the canonical spatial definition.
46. DM and player experiences use separate entry points and immutable runtime roles. There is no in-session DM/Player view switch.
47. The DM controls the adventure, rooms, scenes, NPCs, monsters, hazards, hidden information, reveals, adjudication, consequences, pacing, and progression.
48. A player controls only the claimed character and character-owned cards, resources, actions, spells, equipment, and choices.
49. Player interfaces never expose world-card mutation controls such as monster attacks, monster initiative, NPC checks, scene loading, hidden-card inspection, reveal/hide, or adventure-deck construction.
50. The interface follows the core table rhythm: the DM describes the scene, players describe their characters' actions, and the DM adjudicates and narrates the result.
51. Social interaction, exploration, and combat are equal product pillars. The application must not become a combat-only dashboard.
52. Player-safe projection is a payload boundary. DM-only information must be absent before rendering; CSS hiding is not security.
53. Static DM and player routes are interaction prototypes only. Secure role enforcement requires server-verified account, campaign membership, role, seat, and player-safe projection.
54. `docs/DND_PLAY_MODEL.md` is the canonical reference for role responsibilities, table rhythm, three-pillar interface requirements, and ease-of-use acceptance tests.
55. Rules content and compatibility remain edition-labeled against SRD 5.1 for the 2014 rules and SRD 5.2.1 for revised 2024/5.5e rules. Non-SRD protected expression is not copied into the product.
56. The primary reason The Living Table exists is to make D&D easier to track and easier to play for both the Dungeon Master and players.
57. Every feature must remove a meaningful bookkeeping, lookup, navigation, repeated-entry, or cognitive burden. A feature that adds more tracking than it removes must be redesigned or rejected.
58. Automation handles setup, state, calculations, reminders, and bookkeeping; it does not replace imagination, roleplay, player intent, DM adjudication, or DM authority.
59. The same game fact should have one authoritative state owner and should not require duplicate manual tracking across modules or screens.
60. `docs/NORTH_STAR.md` is the highest-level product filter and outranks visual novelty, feature count, technical cleverness, and marketplace expansion.
61. Decisions 39–45 are refined by the complete hierarchy in `docs/SCENE_MODEL.md`: **Campaign / World → Location → Site → Area / Room**, with **Scene** representing what is happening in that immediate area.
62. Campaign / World is persistent game context and normally belongs in the application frame rather than consuming a live board card slot.
63. Location is a broad city, settlement, biome, coast, region, or comparable part of the world. A building such as an inn is not a city Location.
64. Site is a named destination, building, compound, dungeon, camp, ruin, cave complex, or other sub-place inside a Location.
65. Area / Room is the immediate battle-map-scale space surrounding the characters, including outdoor encounter zones.
66. Scene is temporal, not spatial. Conversation, discovery, puzzle, combat, rest, aftermath, or another event can change Scene without changing Location, Site, or Area.
67. The live board's context row is Location, Site, Area / Room, and Current Scene. People, monsters, hazards, objectives, and treasure remain associated cards rather than spatial levels.
68. Loading a Scene prepares the exact Location, Site, Area / Room, Scene card, NPCs, monsters, hazards, objectives, treasure, transitions, and saved persistent state.
69. The source Wishing Cake adventure does not name its city. `Bramblewick` is an original working label isolated so it can be renamed without altering the model.
70. Exact resume is a core product requirement. The authoritative session must be able to restore meaningful play state even in the middle of combat.
71. Exact resume includes place hierarchy, active Scene, initiative, round, turn, HP, temporary HP, conditions, concentration, resources, hazards, room changes, quests, NPC memory, inventory instances, and event history.
72. Every acquired item is a persistent instance with identity, known and hidden properties, ownership, quantity or charges, attunement, curse knowledge, provenance, transfers, and consumed/lost state.
73. NPC instances retain important dialogue, promises, lies, favors, relationship state, knowledge, last known place, and unresolved business.
74. Immutable adventure and card definitions remain separate from mutable campaign instances. Play never mutates the purchased source package.
75. `docs/GAME_STATE_MEMORY_MODEL.md` and `docs/DND_PAIN_POINTS.md` are canonical references for tracking scope, exact resume, and burden-reduction priorities.
76. Decision 67 is superseded: the live board's spatial context is **Location → Site → Area**. Current Scene remains session progress and appears as concise context on the Area and in DM adventure controls, not as a separate board slot.
77. Decision 68 is refined: loading a Scene prepares the exact Location, Site, Area, NPCs, monsters, hazards, treasure, transitions, and saved state. A separate Scene card is optional source content and is not required on the live board.
78. Objectives and quests appear in the dedicated Quest Tracker rather than consuming a live encounter-board slot. Quest definitions and quest state remain authoritative even though their board column is removed.
79. The canonical live-board schema contains exactly seven slots: `location`, `site`, `room` (presented as Area), `npc`, `monster`, `hazard`, and `treasure`.
80. Scene definitions may remain reusable source cards, but Scene identity and progress are session metadata. The active Scene's player-safe and DM details are composed into the current Area card instead of becoming a board instance.
81. Quest definitions remain cards, but adventure manifests activate them through `startingQuests` and per-Scene `questIds`; quest instances and visibility live in `quests` and `questState`, never in a board payload.
82. Browser-local schema version 3 migrates older `scene` and `objective` board entries by preserving active Scene and quest state, then discarding those legacy board keys. Post-render board-pruning guards are prohibited for this model.
