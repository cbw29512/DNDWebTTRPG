import { wishingCakeCards as legacyWishingCakeCards } from './wishing-cake-cards.js';
import { wishingCakeSpatialCards } from './wishing-cake-spatial-cards.js';
import { wishingCakeAuditedRules } from './wishing-cake-audited-rules.js';

const oldContextCardIds = new Set(['location', 'room']);
const baseCards = [
  ...wishingCakeSpatialCards,
  ...legacyWishingCakeCards.filter(card => !oldContextCardIds.has(card.id))
];
const auditedById = new Map(wishingCakeAuditedRules.map(card => [card.id, card]));

export const wishingCakePackCards = Object.freeze([
  ...baseCards.map(card => auditedById.get(card.id) ?? card),
  ...wishingCakeAuditedRules.filter(card => !baseCards.some(base => base.id === card.id))
]);

// Preserve the established manifest-module export name for future dynamic loaders.
export const wishingCakeCards = wishingCakePackCards;
