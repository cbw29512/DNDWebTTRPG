import { rollDie, rollD20 } from "./dice.js";

export const COMMANDS = Object.freeze({
  ROLL_DIE: "ROLL_DIE",
  ROLL_D20: "ROLL_D20",
  TOGGLE_CARD: "TOGGLE_CARD",
  END_TURN: "END_TURN",
  UNDO: "UNDO"
});

const CARD_LABELS = Object.freeze({
  room: "The Ruined Chapel",
  priest: "Cult Priest",
  skeleton: "Skeletons",
  hazard: "Falling Stones",
  treasure: "Treasure Chest"
});

const clone = value => structuredClone(value);

export const createInitialState = () => ({
  revision: 0,
  nextEventId: 1,
  roll: "Ready",
  total: null,
  rollDetail: "Choose a die",
  active: 0,
  round: 2,
  events: [
    { id: 0, type: "SESSION_STARTED", text: "DM reveals The Ruined Chapel to everyone." },
    { id: -1, type: "TURN_STARTED", text: "Lyria is up." }
  ],
  undoStack: [],
  revealed: {
    room: true,
    priest: true,
    skeleton: true,
    hazard: false,
    treasure: false
  },
  actors: [
    ["Lyria", "Rogue", 24],
    ["Skeleton A", "Monster", 18],
    ["Thorin", "Fighter", 15],
    ["Cult Priest", "Monster", 13],
    ["Elandra", "Wizard", 11],
    ["Skeleton B", "Monster", 8],
    ["Dain", "Cleric", 6]
  ]
});

const snapshotForUndo = state => {
  const snapshot = clone(state);
  snapshot.undoStack = [];
  return snapshot;
};

const appendEvent = (state, type, text, data = {}) => {
  const event = { id: state.nextEventId, type, text, data };
  state.nextEventId += 1;
  state.events.unshift(event);
  return event;
};

const validateCommand = command => {
  if (!command || typeof command !== "object") throw new TypeError("Command must be an object.");
  if (!Object.values(COMMANDS).includes(command.type)) throw new RangeError(`Unsupported command: ${command.type}`);
};

export const applyCommand = (currentState, command, dependencies = {}) => {
  validateCommand(command);
  const random = dependencies.random ?? Math.random;

  if (command.type === COMMANDS.UNDO) {
    if (currentState.undoStack.length === 0) return { state: currentState, event: null };
    const previous = clone(currentState.undoStack.at(-1));
    previous.undoStack = currentState.undoStack.slice(0, -1).map(clone);
    previous.revision = currentState.revision + 1;
    previous.events = clone(currentState.events);
    previous.nextEventId = currentState.nextEventId;
    const event = appendEvent(previous, "COMMAND_UNDONE", "DM undoes the previous action.", {
      restoredRevision: currentState.revision - 1
    });
    return { state: previous, event };
  }

  const state = clone(currentState);
  state.undoStack.push(snapshotForUndo(currentState));
  state.revision += 1;
  let event;

  switch (command.type) {
    case COMMANDS.ROLL_DIE: {
      const total = rollDie(command.sides, random);
      const actor = state.actors[state.active][0];
      state.roll = `d${command.sides}`;
      state.total = total;
      state.rollDetail = `d${command.sides} = ${total}`;
      event = appendEvent(state, "DIE_ROLLED", `${actor} rolls ${state.rollDetail}.`, {
        sides: command.sides,
        rolls: [total],
        kept: total
      });
      break;
    }
    case COMMANDS.ROLL_D20: {
      const result = rollD20(command.mode, random);
      const actor = state.actors[state.active][0];
      const title = command.mode === "advantage" ? "Advantage" : command.mode === "disadvantage" ? "Disadvantage" : "d20";
      const detail = result.rolls.length === 2
        ? `${title}: ${result.rolls.join(" and ")} → keep ${result.total}`
        : `d20 = ${result.total}`;
      state.roll = title;
      state.total = result.total;
      state.rollDetail = detail;
      event = appendEvent(state, "D20_ROLLED", `${actor} rolls ${detail}.`, {
        mode: command.mode,
        rolls: result.rolls,
        kept: result.total
      });
      break;
    }
    case COMMANDS.TOGGLE_CARD: {
      if (!(command.key in state.revealed)) throw new RangeError(`Unknown card: ${command.key}`);
      state.revealed[command.key] = !state.revealed[command.key];
      const action = state.revealed[command.key] ? "reveals" : "hides";
      event = appendEvent(state, "CARD_VISIBILITY_CHANGED", `DM ${action} ${CARD_LABELS[command.key]}.`, {
        key: command.key,
        revealed: state.revealed[command.key]
      });
      break;
    }
    case COMMANDS.END_TURN: {
      state.active = (state.active + 1) % state.actors.length;
      if (state.active === 0) state.round += 1;
      const actor = state.actors[state.active][0];
      event = appendEvent(state, "TURN_STARTED", `${actor}'s turn begins.`, {
        active: state.active,
        round: state.round
      });
      break;
    }
    default:
      throw new RangeError(`Unsupported command: ${command.type}`);
  }

  return { state, event };
};

export const eventText = state => state.events.map(event => event.text);
