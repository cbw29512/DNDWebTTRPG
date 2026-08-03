# Architecture — Card, Visibility, Turn, and Event Model

## Architecture goals

- Server-authoritative shared state
- Role- and audience-filtered payloads
- Reconnectable sessions
- Deterministic action resolution
- Complete event history and undo support
- System-neutral core with D&D rules adapter
- DM authority without silent client-side mutation

## Recommended MVP stack

- TypeScript
- React or similarly componentized web UI
- Node.js server
- WebSocket synchronization
- SQLite for development, PostgreSQL-ready schema
- Shared runtime schemas for client/server validation
- Playwright for end-to-end tests
- Vitest or Node test runner for state-machine tests

The static prototype may remain dependency-light, but the networked MVP should not use GitHub Pages as its final runtime because it requires authoritative server state and private audience filtering.

## Core entities

### Session

- id
- rulesModule
- phase: lobby | story | combat | downtime | ended
- activeSceneId
- round
- activeTurnId
- createdBy
- participants
- revision

### Participant

- id
- sessionId
- accountId or temporary seat token
- role: dm | player | observer
- controlledActorIds
- permissions
- connection state

### CardDefinition

Immutable authored content:

- id
- cardType
- title
- public face
- DM face
- art reference
- tags
- rules metadata
- source/license metadata

### CardInstance

Mutable runtime state:

- id
- definitionId
- sessionId
- ownerId
- controllerId
- zone
- faceState
- audience
- state values
- links
- revision

### Actor

- id
- character/monster card instance
- statistics
- resources
- conditions
- active effects
- inventory card IDs
- prepared/known card IDs

### TurnState

- actorId
- movementRemaining
- actionAvailable
- bonusActionAvailable
- reactionAvailable
- interactionAvailable
- declaredAction
- selectedTargets
- pendingResolutionId
- readiedAction

### Event

Append-only record:

- sequence
- sessionId
- actor/user
- eventType
- command payload
- accepted result
- visibility
- timestamp
- inverse/undo metadata

## Visibility model

Never send a complete DM object to a player and merely hide it with CSS.

Every card/event must define an audience:

- dm-only
- everyone
- specific participant IDs
- specific actor/controller IDs
- role-based

The server projects the authoritative state into a separate view for each connected participant.

Examples:

- A facedown monster card may expose only card back, zone, and size.
- A revealed monster may expose name, art, public effects, and injury band—but not exact HP or private tactics.
- A private clue exposes its content only to the selected player and DM.

## Command flow

1. Client sends a command with expected session revision.
2. Server authenticates participant and permission.
3. Rules adapter validates phase, turn, targets, and resources.
4. Server creates pending resolution when DM confirmation is required.
5. DM confirms, adjusts, or rejects.
6. Server appends accepted event(s).
7. Server mutates authoritative state.
8. Server increments revision.
9. Server emits filtered projections to each participant.

## Example commands

- REVEAL_CARD
- HIDE_CARD
- MOVE_CARD
- START_COMBAT
- SET_INITIATIVE
- BEGIN_TURN
- DECLARE_ACTION
- ROLL_DICE
- PROPOSE_DAMAGE
- CONFIRM_RESOLUTION
- APPLY_CONDITION
- SPEND_RESOURCE
- END_TURN
- ADVANCE_ROUND
- END_COMBAT
- ASSIGN_LOOT
- UNDO_LAST_RESOLUTION
- OVERRIDE_STATE

## Dice model

A roll stores:

- expression
- individual dice
- kept/discarded dice
- modifier
- total
- actor
- purpose
- visibility
- source card/action
- event sequence

Support:

- digital roll
- advantage/disadvantage
- manual result entry
- private DM roll
- selected-player roll
- public roll

## Rules-module boundary

The core engine understands generic concepts: cards, zones, actors, resources, commands, events, audiences, turns, effects, and durations.

A D&D module supplies:

- action economy terminology
- advantage/disadvantage
- attack/save/check formulas
- spell-slot rules
- concentration rules
- common conditions
- rest recovery
- death saves
- edition-specific card content

D&D 2014 and D&D 2024 must be separate adapters or explicit versioned configurations.

## Security requirements

- Server-authoritative state
- Signed, expiring seat invitations
- Permission checks on every command
- Audience filtering before serialization
- Rate limiting for dice/chat/commands
- Event audit trail
- No secrets in client bundles
- No private messages or hidden card faces in logs visible to players
- Test suite attempts unauthorized reads and writes

## Persistence and reconnect

A reconnecting client receives:

- session revision
- participant-specific projected snapshot
- events after last acknowledged sequence

Commands use idempotency keys so reconnect/retry does not double-spend resources or repeat damage.
