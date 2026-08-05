# Approved Product Decisions

Last updated: 2026-08-04

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
