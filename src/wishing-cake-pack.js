import { wishingCakeCards } from './wishing-cake-cards.js';
import { wishingCakeSpatialCards } from './wishing-cake-spatial-cards.js';

const oldContextCardIds = new Set(['location', 'room']);

export const wishingCakePackCards = Object.freeze([
  ...wishingCakeSpatialCards,
  ...wishingCakeCards.filter(card => !oldContextCardIds.has(card.id))
]);
