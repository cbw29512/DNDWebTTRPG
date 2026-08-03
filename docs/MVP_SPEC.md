# MVP Specification — One Complete Encounter

## Success criterion

Four players and one DM can complete a single D&D-style combat encounter from room reveal through treasure assignment without relying on another character sheet, initiative tracker, or dice application.

## Required demo encounter

**The Ruined Chapel**

- 1 room card
- 1 objective card: stop the ritual
- 1 cult-priest NPC/monster card
- 2 skeleton monster cards
- 1 falling-stones hazard card
- 1 treasure-chest card
- 4 level-5 pregenerated characters

## MVP screens

### DM Battle Board

- Dice roller fixed across the top
- Encounter deck with facedown/revealed state
- Private DM notes
- Shared room/battle area
- Initiative order and round counter
- Player summary cards
- Selected card inspector
- Event/history log
- Reveal/hide controls
- Turn override controls

### Player Screen

- Same top dice roller
- Only publicly or privately revealed world cards
- Shared battle area
- Initiative and round
- Active character card
- Action, bonus action, reaction, movement, and free interaction state
- Attacks, spells, features, items, conditions, resources, and active effects
- End Turn control

## Required interaction loop

1. DM loads encounter.
2. DM reveals room card to everyone.
3. DM reveals monsters to everyone.
4. Initiative is rolled or manually entered.
5. Current combatant is highlighted.
6. Player selects an attack, spell, feature, item, or basic action.
7. Required targets are selected.
8. Dice are rolled digitally or result is entered manually.
9. Damage/healing/effects are proposed.
10. DM confirms or overrides resolution.
11. Resources and active effects update.
12. Player ends turn.
13. System advances initiative and rounds.
14. DM performs monster turns using monster cards.
15. Combat ends.
16. DM reveals treasure.
17. Treasure is assigned and character state persists.

## MVP state tracking

### Combatant

- current/max HP
- temporary HP
- AC
- initiative
- speed and movement remaining
- action/bonus action/reaction/free interaction availability
- conditions
- concentration
- active effects and durations
- death/dying state

### Character resources

- spell slots
- class/ancestry/background feature uses
- item quantities and charges
- ammunition where enabled
- inspiration or equivalent
- hit dice for later rest support

### World card state

- card ID/type
- owner/controller
- zone
- face state
- audience/visibility
- current HP/uses/charges where applicable
- targets
- duration
- linked cards
- event history

## Explicit non-goals for MVP

- video or voice conferencing
- account billing
- marketplace
- public matchmaking
- campaign creation suite
- arbitrary map editor
- automation for every D&D rule
- AI-generated adventures
- mobile-native app
- multiple game systems
- homebrew publishing platform

## Quality gates

- No hidden DM content is serialized into unauthorized player payloads.
- Every state-changing action has an event-log entry.
- DM can undo the last resolution and manually override state.
- Player cannot act outside their turn unless using an allowed reaction/interrupt flow.
- Dice results include formula, individual dice, modifier, actor, visibility, and timestamp/order.
- Keyboard-only operation works for the entire encounter.
- Color is never the sole indicator of ownership, condition, availability, or turn state.
- A deterministic automated test completes the demo combat loop.

## MVP Definition of Done

The MVP is done only when the demo encounter can be run in two browser sessions—one DM and one or more players—with synchronized state, reconnect recovery, automated tests, documented setup, and a recorded end-to-end playtest.
