import assert from 'node:assert/strict';
import { DND_CARDS_SOURCE, resolveDungeonCardsAsset, normalizeDungeonCard } from '../src/library/dndcards-catalog.js';

const hero = normalizeDungeonCard({ id:'hero-test', kind:'character', name:'Hero', art:'assets/heroes/mara-ironjaw.webp' });
assert.equal(hero.art, `${DND_CARDS_SOURCE.assetBaseUrl}assets/heroes/mara-ironjaw.webp`);
assert.equal(resolveDungeonCardsAsset('https://example.com/card.webp'), 'https://example.com/card.webp');
assert.equal(resolveDungeonCardsAsset('🐲'), '🐲');
assert.ok(DND_CARDS_SOURCE.assetBaseUrl.includes(DND_CARDS_SOURCE.commit), 'Artwork must be pinned to the imported source commit');

console.log('polished DNDCards artwork regression checks passed');
