export const ROLES = Object.freeze({ DM: "dm", PLAYER: "player" });
export const CARD_TYPES = Object.freeze({ LOCATION:"location", ROOM:"room", NPC:"npc", MONSTER:"monster", HAZARD:"hazard", OBJECTIVE:"objective", TREASURE:"treasure", CHARACTER:"character", SPELL:"spell", ITEM:"item", FEATURE:"feature", CONDITION:"condition", EFFECT:"effect" });
export const AUDIENCES = Object.freeze({ DM_ONLY:"dm-only", EVERYONE:"everyone", CONTROLLER:"controller", SELECTED:"selected" });

const nonEmpty = (value, name) => { if (typeof value !== "string" || value.trim() === "") throw new TypeError(`${name} must be a non-empty string.`); };
const finite = (value, name) => { if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`); };

export const validateParticipant = participant => {
  if (!participant || typeof participant !== "object") throw new TypeError("Participant must be an object.");
  nonEmpty(participant.id, "participant.id"); nonEmpty(participant.name, "participant.name");
  if (!Object.values(ROLES).includes(participant.role)) throw new RangeError(`Unknown participant role: ${participant.role}`);
  return participant;
};

export const validateActor = actor => {
  if (!actor || typeof actor !== "object") throw new TypeError("Actor must be an object.");
  nonEmpty(actor.id, "actor.id"); nonEmpty(actor.name, "actor.name"); nonEmpty(actor.kind, "actor.kind");
  finite(actor.initiative, "actor.initiative"); finite(actor.hp.current, "actor.hp.current"); finite(actor.hp.max, "actor.hp.max");
  if (actor.hp.current < 0 || actor.hp.max < 1 || actor.hp.current > actor.hp.max) throw new RangeError("Actor hit points are invalid.");
  return actor;
};

export const validateCard = card => {
  if (!card || typeof card !== "object") throw new TypeError("Card must be an object.");
  nonEmpty(card.id, "card.id"); nonEmpty(card.title, "card.title");
  if (!Object.values(CARD_TYPES).includes(card.type)) throw new RangeError(`Unknown card type: ${card.type}`);
  if (!Object.values(AUDIENCES).includes(card.audience)) throw new RangeError(`Unknown card audience: ${card.audience}`);
  if (typeof card.revealed !== "boolean") throw new TypeError("card.revealed must be boolean.");
  if (!card.playerFace || typeof card.playerFace !== "object") throw new TypeError("card.playerFace must be an object.");
  if (!card.dmFace || typeof card.dmFace !== "object") throw new TypeError("card.dmFace must be an object.");
  if (card.uses) {
    finite(card.uses.max, "card.uses.max");
    if (card.uses.max < 1) throw new RangeError("card.uses.max must be at least 1.");
  }
  return card;
};

export const validateSession = session => {
  if (!session || typeof session !== "object") throw new TypeError("Session must be an object.");
  nonEmpty(session.id, "session.id");
  if (!Array.isArray(session.participants) || !Array.isArray(session.actors) || !Array.isArray(session.cards)) throw new TypeError("Session collections must be arrays.");
  session.participants.forEach(validateParticipant); session.actors.forEach(validateActor); session.cards.forEach(validateCard);
  return session;
};
