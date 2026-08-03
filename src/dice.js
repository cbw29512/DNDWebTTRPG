const VALID_MODES = new Set(["normal", "advantage", "disadvantage"]);

export const rollDie = (sides, rng = Math.random) => {
  if (!Number.isInteger(sides) || sides < 2) {
    throw new RangeError("Die sides must be an integer of at least 2.");
  }

  const sample = rng();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
    throw new RangeError("Random source must return a number from 0 up to, but not including, 1.");
  }

  return Math.floor(sample * sides) + 1;
};

export const rollD20 = (mode = "normal", rng = Math.random) => {
  if (!VALID_MODES.has(mode)) {
    throw new RangeError(`Unknown d20 roll mode: ${mode}`);
  }

  const rolls = mode === "normal"
    ? [rollDie(20, rng)]
    : [rollDie(20, rng), rollDie(20, rng)];

  const total = mode === "advantage"
    ? Math.max(...rolls)
    : mode === "disadvantage"
      ? Math.min(...rolls)
      : rolls[0];

  return {
    mode,
    rolls,
    total,
    discarded: rolls.length === 2 ? rolls.find((value, index) => value !== total || index > 0) ?? total : null
  };
};
