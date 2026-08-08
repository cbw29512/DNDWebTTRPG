import { wishingCakeCards as legacyWishingCakeCards } from './wishing-cake-cards.js';
import { wishingCakeSpatialCards } from './wishing-cake-spatial-cards.js';
import { wishingCakeAuditedRules } from './wishing-cake-audited-rules.js';
import { wishingCakeCombatRules } from './wishing-cake-combat.js';
import { wishingCakeMonsterStats } from './wishing-cake-monster-stats.js';
import { wishingCakeAdventureRuleOverrides } from './wishing-cake-adventure-rules.js';

const oldContextCardIds = new Set(['location', 'room']);
const explicitRevealTypes = new Set(['npc','monster','hazard','treasure','item']);
const baseCards = [
  ...wishingCakeSpatialCards,
  ...legacyWishingCakeCards.filter(card => !oldContextCardIds.has(card.id))
];
const auditedById = new Map(wishingCakeAuditedRules.map(card => [card.id, card]));
const baseIds = new Set(baseCards.map(card => card.id));

function applyRules(card) {
  try {
    const monster = wishingCakeMonsterStats[card.id];
    const adventureOverride = wishingCakeAdventureRuleOverrides[card.id];
    const combat = monster?.combat || wishingCakeCombatRules[card.id];
    let ruled = card;

    /* Monster DM faces are replaced, not merged. Stale legacy fields must never
     * survive alongside the canonical stat block. Player-facing summary/art may
     * still come from the adventure card record. */
    if (monster) ruled = { ...ruled, dmFace:monster.dmFace, rulesClassification:'Adventure Homebrew — 5e math checked' };
    if (adventureOverride) ruled = {
      ...ruled,
      ...adventureOverride,
      playerFace:{ ...(ruled.playerFace||{}), ...(adventureOverride.playerFace||{}) },
      dmFace:{ ...(ruled.dmFace||{}), ...(adventureOverride.dmFace||{}) }
    };

    /* Spatial context is public once loaded; stackable encounter content is not.
     * NPCs, monsters, hazards, treasure, and world-item cards require an explicit
     * DM Reveal action before they can enter any player projection or live table. */
    if (explicitRevealTypes.has(ruled.type)) ruled = { ...ruled, revealed:false };
    return combat ? { ...ruled, combat } : ruled;
  } catch (error) {
    console.error(`[Living Table] Could not assemble Wishing Cake card ${card?.id || 'unknown'}.`, error);
    throw error;
  }
}

export const wishingCakePackCards = Object.freeze([
  ...baseCards.map(base => {
    const audited = auditedById.get(base.id);
    return applyRules(audited ? { ...base, ...audited, revealed:base.revealed } : base);
  }),
  ...wishingCakeAuditedRules.filter(card => !baseIds.has(card.id)).map(applyRules)
]);

// Preserve the established manifest-module export name for future dynamic loaders.
export const wishingCakeCards = wishingCakePackCards;