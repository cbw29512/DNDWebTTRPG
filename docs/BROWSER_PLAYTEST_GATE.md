# Rendered Browser Playtest Gate

The project now has a Chromium/Playwright gate in addition to the Node source/regression suite.

## What it checks

- Public landing page explains the product and links Home, DM, and Player entry points.
- All six Wishing Cake pregens render in both 2014/SRD 5.1 and 2024/SRD 5.2.1 modes.
- Each player build has a visible portrait card, combat summary, RPG equipment doll, owned backpack, full sheet, six abilities, six saves, all 18 skills, attacks, features, spellcasting section, equipment section, and edition-specific import code.
- Character-card damage text is rejected if it displays d20 damage.
- Browser console/page errors fail the test.
- Representative tablet and phone layouts are checked for sheet containment; phone layout also rejects document-level horizontal overflow.
- Screenshots, traces, and video are retained as CI artifacts on failure.

## Execution

GitHub Actions installs Chromium, serves the repository as a static site, then runs `npx playwright test` after the complete Node regression suite succeeds.

This gate does not replace human tabletop playtesting or visual-art approval. It protects the rendered application against broken routes, missing DOM layers, JavaScript errors, missing portraits, incomplete character-sheet sections, and common responsive regressions.
