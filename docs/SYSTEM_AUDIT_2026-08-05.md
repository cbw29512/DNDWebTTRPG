# Full System Audit — 2026-08-05

## Scope

The audit covered the current static prototype across the Dungeon Master route, player route, prepared-adventure board, card presentation, stack drawers, initiative, quests, local session state, Scene loading, role projections, responsive behavior, entry-point assets, documentation, and regression workflow.

## Executive result

The prototype is internally consistent enough to continue development, but it is not production-ready. The strongest areas are the card/board state model, role-specific projections, migration coverage, and the growing Node regression suite. The largest remaining risks are the absence of real browser automation, DOM-driven reconciliation, incomplete exact-resume combat state, and the lack of a true server security boundary.

## Findings fixed during this audit

### High — UI changes were being accepted without rendered-browser evidence

The previous CSS assertions proved declarations existed but did not prove the page looked correct. A screenshot exposed that the wrong elements had been equalized and that an expanded Treasure stack could distort the visible board.

Correction:

- the seven top board slots now use equal grid tracks;
- all seven slots share one outer height and heading track;
- tarot shells use one canonical width;
- stack drawers are viewport-contained;
- the project Definition of Done now explicitly requires deployed browser inspection.

### Medium — Project status contradicted current CI reality

`PROJECT_STATUS.md` stated that the complete suite could not run and that CI was still being added. The repository already had an active passing GitHub Actions workflow.

Correction:

- status documentation now records active automated regression coverage;
- remaining browser-testing limitations are separated from Node regression status.

### Medium — No global entry-route integrity test

Individual tests guarded features, but no test verified that every local asset referenced by the DM and player routes existed, shared asset versions matched, stylesheet authority remained ordered, and every test file was actually executed by `npm test`.

Correction:

- added `tests/system-audit.test.mjs`;
- added it to the complete regression command.

## Verified strengths

### Runtime and state

- Seven-slot board schema is consistent across manifests, local-session migration, Scene loading, and source rendering.
- Legacy Scene and Objective board entries migrate into Scene and quest state.
- Player projections remove DM-only faces and sensitive actor state.
- Grouped monster initiative, item derivation, quest ownership, and observer stability have dedicated regression checks.

### Layout architecture

- Prepared-adventure CSS is loaded after the base board and live-play priority layers.
- Desktop prepared slots have equal geometry.
- Phone layouts release fixed desktop geometry and stack vertically.
- Adventure Deck cards remain fixed tarot objects instead of responsive dashboard tiles.
- Expanded stack drawers are clamped inside the viewport.

### Delivery

- GitHub Actions runs the full Node suite on pull requests and pushes to `main`.
- GitHub Pages deployment is automated.
- DM and player entry routes use separate role markers and shared versioned assets.

## Open risks

### Critical before multiplayer — no authoritative server security boundary

The static routes and client-side projections are presentation boundaries, not authentication or authorization. A secure release requires server-side identity, campaign membership, seat ownership, command authorization, and player-safe payload construction.

### High — no automated real-browser suite

Current tests inspect source, data, and functions. They do not measure rendered bounding boxes, detect clipping, exercise focus order, capture screenshots, or verify interactions in Chromium, Firefox, and WebKit.

Required next step:

- add Playwright or equivalent browser smoke tests;
- check desktop, tablet, and phone viewports;
- assert equal slot bounding boxes and viewport-contained drawers;
- capture failure screenshots.

### High — DOM controls still participate in state reconciliation

Scene loading reconciles through rendered controls rather than one authoritative reducer. This increases coupling between visual structure and state behavior.

Required next step:

- move board/session transitions into a pure reducer;
- render only from resulting state;
- retain DOM events as commands, not state authority.

### High — exact combat resume is incomplete

The system does not yet guarantee restoration of round, active turn, initiative order, HP, temporary HP, conditions, concentration, resources, hazards, and pending choices.

### Medium — accessibility is source-checked but not interaction-tested

Skip links, semantic buttons, role routes, and mobile rules exist, but keyboard traversal, focus trapping, announcements, contrast, zoom, reduced motion, and screen-reader output are not automated.

### Medium — CSS architecture remains highly layered

Multiple global stylesheets use `!important` and late-loading authority layers. The current order is protected by tests, but future changes remain vulnerable to accidental cascade conflicts.

Recommended direction:

- consolidate board geometry into one module;
- introduce component-level custom properties;
- reduce global selectors and `!important` usage;
- document each final-authority stylesheet.

### Medium — content completeness

The Wishing Cake adventure still lacks a complete legal pregen roster and dedicated cards for every clue, trigger, reward, and persistent Area change.

### Low — redirect route is JavaScript-dependent

`dm.html` includes a noscript link, so this is not blocking, but the redirect itself depends on JavaScript.

## Release classification

- **Prototype demonstration:** acceptable with known limitations.
- **Private browser playtest:** acceptable after manual DM/player viewport and save/restore checks.
- **Public multiplayer release:** not acceptable.
- **Commercial printable product:** not acceptable until content, artwork rights, print resolution, and rules licensing are certified.

## Required next audit gate

The next UI change should not merge until a browser test measures the deployed result rather than only asserting CSS source text. At minimum, the test should verify:

1. seven equal board-slot widths and heights on desktop;
2. aligned heading and card baselines;
3. no horizontal clipping at the supported desktop width;
4. stack drawers remain inside the viewport;
5. mobile slots stack without fixed-height clipping;
6. keyboard focus reaches every primary control;
7. DM-only controls are absent from the player DOM.
