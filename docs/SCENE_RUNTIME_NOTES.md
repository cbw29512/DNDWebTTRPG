# Ordered Scene Runtime Notes

The first runtime implementation follows `docs/SCENE_MODEL.md`:

- Location is the broad environment and remains active across room changes.
- Room is the immediate battle-map-scale area and is replaced when the party moves.
- Each prepared scene declares one `locationId`, one `roomId`, associated board cards, order, and connected exits.
- Loading a room reconciles the board atomically and records `currentSceneId`, `currentLocationId`, `currentRoomId`, `roomHistory`, and `discoveredScenes` in the local session.
- Loaded does not mean revealed. Existing card visibility remains authoritative.

## Current boundary

This is still a browser-local scene runner. It does not provide authentication, server-authoritative projections, multiplayer synchronization, or cross-device reconnect. Some Wishing Cake hazards, clues, and treasure references still need dedicated cards before every room can be called content-complete.
