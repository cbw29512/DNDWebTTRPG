import { AUDIENCES, ROLES, validateParticipant, validateSession } from "./schema.js";

const cardVisibleTo = (card, participant) => {
  if (participant.role === ROLES.DM) return true;
  if (!card.revealed) return false;
  if (card.audience === AUDIENCES.EVERYONE) return true;
  if (card.audience === AUDIENCES.CONTROLLER) return card.controllerId === participant.id;
  if (card.audience === AUDIENCES.SELECTED) return card.participantIds?.includes(participant.id) ?? false;
  return false;
};

const projectActor = (actor, participant) => {
  if (participant.role === ROLES.DM || actor.controllerId === participant.id) return structuredClone(actor);
  const publicActor = {
    id: actor.id,
    name: actor.name,
    kind: actor.kind,
    initiative: actor.initiative,
    publicStatus: actor.publicStatus
  };
  if (actor.kind === "player") {
    publicActor.hp = structuredClone(actor.hp);
    publicActor.ac = actor.ac;
  }
  return publicActor;
};

const projectCard = (card, participant) => {
  if (!cardVisibleTo(card, participant)) return null;
  if (participant.role === ROLES.DM) return structuredClone(card);
  return {
    id: card.id,
    title: card.title,
    type: card.type,
    revealed: card.revealed,
    face: structuredClone(card.playerFace)
  };
};

export const projectSessionFor = (session, participant) => {
  validateSession(session);
  validateParticipant(participant);
  if (!session.participants.some(entry => entry.id === participant.id)) throw new RangeError("Participant is not seated in this session.");

  return {
    id: session.id,
    participant: structuredClone(participant),
    actors: session.actors.map(actor => projectActor(actor, participant)),
    cards: session.cards.map(card => projectCard(card, participant)).filter(Boolean)
  };
};
