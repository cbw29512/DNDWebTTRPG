# The Living Table — Project Status

Last updated: 2026-08-03

This is the source of truth for scope, current state, and execution order.

## Product goal

Deliver a card-driven synchronized online tabletop where the DM reveals the world and players take complete turns from their character cards.

## Implemented now

- Dedicated repository and product identity
- Product vision, MVP specification, architecture, and approved decisions
- Static DM battle-board prototype
- Dice roller fixed at the top
- Standard d20, d12, d10, d8, d6, d4, and d100 rolls
- D&D-style advantage: roll two d20s and keep the higher result
- D&D-style disadvantage: roll two d20s and keep the lower result
- Both d20 results remain visible for advantage/disadvantage verification
- Ruined Chapel room/battle scene
- DM encounter deck
- Room, monster, hazard, and treasure card states
- Reveal/hide interaction
- Initiative and round progression
- Turn panel identifies the actual active combatant
- Active-player character/action/resource panels
- Event log
- Responsive single-column fallback

## Prototype audit findings

The 2026-08-03 behavior audit found and corrected these misleading states:

- Advantage and disadvantage previously behaved exactly like an ordinary single d20 roll.
- The bottom panel continued to say `Your Turn` after initiative advanced to a monster.
- Action and character-sheet buttons looked operational despite having no behavior.

Corrections:

- Dice resolution moved into a separately tested module.
- Advantage and disadvantage now roll two independent d20s and visibly show which result is kept.
- Monster turns are identified as DM-controlled turns.
- Unimplemented action controls are disabled and labeled as planned prototype features.
- Tests now enforce d20 keep-high/keep-low behavior and truthful placeholder controls.

## Prototype limitations

- Single browser only; no real DM/player synchronization
- Demo data is hard-coded
- Dice are client-side and are not cryptographically secure or server-authoritative
- Action buttons beyond dice/reveal/end-turn are intentionally disabled visual placeholders
- No modifiers, roll formulas, attack resolution, target selection, or roll visibility modes yet
- No targeting, damage resolution, conditions, concentration, spell spending, item consumption, undo, persistence, login, reconnection, or private audience filtering
- No separate player projection yet
- No browser-level accessibility or visual regression test yet

## MVP workstreams

1. Shared schemas and deterministic state engine
2. Server-authoritative sessions and WebSocket sync
3. Role-filtered DM and player projections
4. Card definitions, instances, zones, and reveals
5. Initiative/turn state machine
6. Dice, commands, resolution confirmation, and event history
7. Character resources, spells, items, conditions, and effects
8. Ruined Chapel end-to-end encounter
9. Accessibility, security, reconnect, and playtest hardening

## Non-negotiable gates

- No hidden DM data in player payloads
- DM override and undo
- Every mutation logged as an event
- D&D editions explicitly versioned
- Original or properly licensed content only
- Keyboard-capable encounter loop
- Rule controls must have deterministic tests before being described as functional
- Placeholder controls must be visibly disabled or labeled
- Visual review of deployed behavior
- Status and issues updated with every meaningful change

## Definition of Done

A feature is complete only when implementation, automated tests, permission/visibility tests, accessibility review, documentation, issue status, and deployed visual verification are all complete.
