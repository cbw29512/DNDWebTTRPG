import { wishingCakeCards as legacyWishingCakeCards } from './wishing-cake-cards.js';
import { wishingCakeSpatialCards } from './wishing-cake-spatial-cards.js';

const oldContextCardIds = new Set(['location', 'room']);

export const wishingCakePackCards = Object.freeze([
  ...wishingCakeSpatialCards,
  ...legacyWishingCakeCards.filter(card => !oldContextCardIds.has(card.id))
]);

// Preserve the established manifest-module export name for future dynamic loaders.
export const wishingCakeCards = wishingCakePackCards;
