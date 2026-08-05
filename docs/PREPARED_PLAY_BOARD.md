# Prepared Play Board Contract

The live card board must make a prepared adventure easier to run without turning its spatial context into manual bookkeeping.

## Prepared-adventure ownership

During prepared play:

- **Location**, **Site**, and **Area** are controlled by adventure progression.
- The DM advances those three through the adventure controls rather than dragging or manually replacing cards.
- Their cards can still be opened, flipped, and revealed when appropriate.
- They cannot be removed or replaced from the live board accidentally.
- Homebrew/edit mode may later restore manual spatial controls explicitly.

## Current event

Scene remains temporal adventure state rather than a board column.

The DM board must display the current event:

- in the adventure-position bar;
- in the Area heading; and
- on the Area card.

The player route must not derive hidden Scene titles directly from the adventure manifest. Player context is limited to spatial cards already present in the player-safe board projection, and legacy Scene labels must be removed from player Area cards.

## Live-board hierarchy

The board remains:

1. Location
2. Site
3. Area
4. NPCs
5. Monsters
6. Traps / Hazards
7. Treasure / Rewards

Quests remain in the Quest Tracker.

## Layout

The live board sizes to its contents. It must not stretch vertically merely because preparation or initiative panels are taller.

The current position should be readable as:

`Location → Site → Area | Current event`

## Stability and safety

The prepared-play enhancement observes only `#app`, disconnects while applying its own idempotent changes, and reconnects afterward. It must not create a self-triggering mutation loop.

Adventure and card titles must be escaped before being inserted into generated markup.
