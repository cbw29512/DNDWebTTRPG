import { wishingCakeCards as legacyWishingCakeCards } from './wishing-cake-cards.js';
import { wishingCakeSpatialCards } from './wishing-cake-spatial-cards.js';
import { wishingCakeAuditedRules } from './wishing-cake-audited-rules.js';
import { wishingCakeCombatRules } from './wishing-cake-combat.js';
import { wishingCakeMonsterStats } from './wishing-cake-monster-stats.js';

const oldContextCardIds = new Set(['location', 'room']);
const baseCards = [
  ...wishingCakeSpatialCards,
  ...legacyWishingCakeCards.filter(card => !oldContextCardIds.has(card.id))
];
const auditedById = new Map(wishingCakeAuditedRules.map(card => [card.id, card]));
const baseIds = new Set(baseCards.map(card => card.id));

function applyRules(card) {
  const monster = wishingCakeMonsterStats[card.id];
  const combat = monster?.combat || wishingCakeCombatRules[card.id];
  const ruled = monster ? { ...card, dmFace:{ ...(card.dmFace||{}), ...monster.dmFace } } : card;
  return combat ? { ...ruled, combat } : ruled;
}

export const wishingCakePackCards = Object.freeze([
  ...baseCards.map(base => {
    const audited = auditedById.get(base.id);
    return applyRules(audited ? { ...base, ...audited, revealed: base.revealed } : base);
  }),
  ...wishingCakeAuditedRules.filter(card => !baseIds.has(card.id)).map(applyRules)
]);

// Preserve the established manifest-module export name for future dynamic loaders.
export const wishingCakeCards = wishingCakePackCards;
