# The Wishing Cake — Adventure Playtest Audit

Date: 2026-08-06

## Release decision

The adventure content is ready for a controlled tabletop playtest after the corrections on this branch. It is not yet commercially complete because the audited art keys and alt text still require a final visual review against the rendered card faces and the complete six-character pregen roster is unfinished.

## Corrected adventure flow

1. **The Stolen Wish** — social opening, unavoidable theft, then two Animated Presents cover Sepulchral's escape. The cellar clue becomes a one-way passage into the dungeon.
2. **Holding Cells** — lock escape plus one Paper Plate Mimic for four characters; add a second for five or six.
3. **Hall of Rejected Wishes** — guaranteed core clue, optional boon or brief fear complication, and a clear choice between the optional Soul Cellar and the main route.
4. **Soul Cellar** — optional side objective, three usable clues, and a defined Soul Chorus reward.
5. **Piñata Pen** — one scaled Piñata Mimic, one visible exploding-string hazard, a noncombat resolution, and Healing Candy reward.
6. **Wrapping Room** — six-progress-before-three-failures skill challenge with damage, teamwork options, and fail-forward passage.
7. **Birthday Cult Room** — solvable melody and riddle with three independent clue sources; wrong answers add Animated Presents dynamically instead of preloading an unexplained enemy.
8. **Cake Chamber** — negotiation before initiative, exact combat scaling, ritual clock, environmental chandelier option, bloodied parley, and Wendy-controlled ending.

## Major defects corrected

- Removed Sepulchral's boss card from the opening combat and initial initiative roster.
- Added the second Animated Present to the opening board so the board matches the encounter text.
- Removed the unexplained Animated Present from the Cult Room's initial board.
- Removed the duplicate Sepulchral NPC/Boss placement from the finale.
- Added Healing Candy to the Piñata Pen reward slot where it is actually earned.
- Replaced incomplete phrases such as "use the supplied monster-card damage" with exact attack bonuses, save DCs, damage, ranges, conditions, recharge limits, and morale.
- Reduced and scaled the Piñata Mimic from an excessive 105 HP to 55 HP for four characters or 70 HP for five or six.
- Rebuilt Sepulchral as a complete encounter stat block with AC, HP, abilities, saves, spell DC, spell attack, slots, actions, tactics, bloodied parley, and nonlethal defeat.
- Defined exact Exploding Piñata, Wrapping Machine, and Wish Circle mechanics.
- Added fail-forward outcomes so a failed lock, puzzle, or hazard does not end the one-shot.
- Made clue delivery redundant so the melody and final emotional truth cannot be lost behind one optional room or failed check.
- Added explicit board instructions to every Scene card.
- Added required art keys and meaningful alt text for every audited Scene, monster, hazard, and core reward card.

## Encounter expectations

The adventure targets four to six level-three characters. Default board setup assumes four characters unless a Scene's scaling note says otherwise.

- Opening: two CR 1/2 Animated Presents; remove one for a very inexperienced group.
- Holding Cells: one CR 1 Paper Plate Mimic; add a second for five or six characters.
- Piñata Pen: approximately CR 3 with a visible environmental hazard and a peaceful resolution.
- Finale: Sepulchral plus one Animated Present for four characters; add a second for five or six. The Wish Circle adds urgency rather than raw damage.

These values are suitable for an initial playtest, not a claim of perfect balance. Record actual rounds, damage taken, rests, failed checks, and whether each clue was understood.

## Board placement contract

Each loaded Scene must place exactly one Location, one Site, one Area, and then only the cards physically or mechanically active in NPCs, Monsters, Traps/Hazards, and Treasure/Rewards.

Dynamic cards are added only when their trigger occurs:

- Holding Cells: second mimic for five or six characters.
- Cult Room: one Animated Present for each wrong answer, maximum two.
- Cake Chamber: second Animated Present for five or six characters; 8 temporary HP if the party rested or accumulated three puzzle failures.

## Picture audit boundary

The content layer now requires an `artKey`, meaningful `artAlt`, and `artRequired: true` for every audited visual card. This prevents a card from being considered complete when its visual is absent or unlabeled. The next visual pass must open every rendered front and confirm:

- the image matches the exact subject and room;
- no duplicate or unrelated art is reused;
- text remains readable over the image;
- characters, hazards, and locations are visually distinct;
- no copyrighted third-party character or logo is present;
- the player face does not reveal DM-only information.

## Playtest checklist

- Run once with four characters and once with six.
- Time every Scene and total session length.
- Record every place the DM pauses to search for a rule.
- Confirm every transition is understood without DM invention.
- Confirm board cards added by the loader match the Scene instructions.
- Confirm the Soul Cellar can be skipped without making the Cult Room impossible.
- Confirm three wrong puzzle answers still advance the story.
- Confirm the Wrapping Room cannot cause a total-party dead end.
- Confirm the finale supports negotiation, interruption, surrender, and combat.
- Ask Wendy's player whether the ending preserved her agency.
