# Command and Event Model

The Living Table treats every gameplay change as a command applied to authoritative state.

## Current prototype commands

- `ROLL_DIE`
- `ROLL_D20`
- `TOGGLE_CARD`
- `END_TURN`
- `UNDO`

The browser UI does not directly mutate dice results, card visibility, initiative, rounds, or the event log. It dispatches a command to `applyCommand` and renders the returned state.

## State revisions

Every accepted command increments `revision`. Undo restores the previous snapshot but is also recorded as a new revision. This prevents clients from treating undo as if history never existed.

## Events

Every accepted gameplay command produces a typed event containing:

- monotonically increasing event ID;
- event type;
- human-readable event-log text;
- structured data needed for synchronization and testing.

Examples include raw dice results and the kept die, card visibility changes, and the active combatant/round after turn advancement.

## Undo

The static prototype stores prior snapshots in memory. This is intentionally temporary. The networked implementation will use persisted append-only events, periodic snapshots, authorization checks, and explicit inverse/compensating events.

## Next steps

1. Add runtime command/state schema validation.
2. Give commands stable IDs for idempotent retries.
3. Add participant/role authorization.
4. Separate system-neutral state from the D&D rules adapter.
5. Persist events and snapshots on the authoritative server.
6. Project filtered state separately for the DM and each player.
