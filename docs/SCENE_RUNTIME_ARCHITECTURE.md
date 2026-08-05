# Scene Runtime Architecture

The prepared adventure manifest owns immutable scene definitions. The browser-local session owns the active scene and runtime progress.

## Immutable adventure data

Each scene contains:

- `id`
- `order`
- `title`
- `locationId`
- `locationTitle`
- `roomId`
- associated `npc`, `monster`, `hazard`, and `treasure` card IDs
- connected exits

## Runtime session data

The local session records:

- `currentSceneId`
- `currentLocationId`
- `currentRoomId`
- `roomHistory`
- `discoveredScenes`
- reconciled board state

The scene runtime never mutates the source manifest. It derives a target board from the selected scene, preserves broad Location cards, replaces the immediate Room, and reconciles associated card slots through the existing local-session board bridge.

Loaded and revealed remain separate concepts. Loading prepares content for the DM; existing reveal rules determine what players can see.
