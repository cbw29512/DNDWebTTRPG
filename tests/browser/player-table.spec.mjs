import { test, expect } from '@playwright/test';

const pregens = [
  ['wendy-birthday-hero', 'Wendy’s Birthday Hero'],
  ['merrin-thief', 'Merrin Quickstep'],
  ['elara-evoker', 'Elara Starling'],
  ['brunna-life-cleric', 'Brunna Hearthkeeper'],
  ['fern-hunter', 'Fern Greenbough'],
  ['lute-lore-bard', 'Lute Bellweather']
];
const spellcasters = new Set(['elara-evoker','brunna-life-cleric','fern-hunter','lute-lore-bard']);

async function collectPageErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

async function verifyPlayerBuild(page, id, name, edition) {
  const errors = await collectPageErrors(page);
  await page.goto(`/player.html?character=${id}&edition=${edition}`, { waitUntil: 'networkidle' });

  await expect(page.locator('.site-shell-nav')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'DM Table' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Player Table' })).toBeVisible();

  const loadedCard = page.locator('.loaded-pregen-card');
  await expect(loadedCard).toBeVisible();
  await expect(loadedCard).toHaveAttribute('data-loaded-character', id);
  await expect(loadedCard).toHaveAttribute('data-character-edition', `dnd-${edition}`);
  await expect(loadedCard.locator('.pregen-character-front h3')).toHaveText(name);
  await expect(loadedCard.locator('.pregen-portrait img')).toBeVisible();
  expect(await loadedCard.locator('.pregen-portrait img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);

  const combat = loadedCard.locator('.pregen-combat-line');
  await expect(combat).toBeVisible();
  for (const label of ['AC', 'HP', 'INIT', 'PB']) await expect(combat.getByText(label, { exact: true })).toBeVisible();
  const damage = loadedCard.locator('.pregen-primary-attack small');
  if (await damage.count()) await expect(damage).not.toContainText(/d20/i);

  await expect(page.locator('.rpg-paper-doll')).toBeVisible();
  await expect(page.locator('.backpack')).toBeVisible();
  await expect(page.locator('.full-character-sheet')).toBeVisible();
  await expect(page.locator('#full-sheet-title')).toHaveText(name);
  await expect(page.locator('.full-character-sheet')).toContainText(edition === '2024' ? '2024 / SRD 5.2.1' : '2014 / SRD 5.1');

  await expect(page.locator('.sheet-abilities .sheet-ability')).toHaveCount(6);
  await expect(page.locator('.sheet-skills li')).toHaveCount(18);
  const saves = page.locator('.sheet-panel').filter({ has: page.getByRole('heading', { name: 'Saving Throws' }) }).locator('li');
  await expect(saves).toHaveCount(6);
  await expect(page.getByRole('heading', { name: 'Attacks & Combat Shortcuts' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Features & Traits' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spellcasting' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Equipment & Backpack' })).toBeVisible();

  if (spellcasters.has(id)) {
    const deck=page.locator('.spell-card-deck');
    await expect(deck).toBeVisible();
    await expect(deck.getByRole('heading',{name:'Spell Cards'})).toBeVisible();
    await expect(deck.locator('.spell-deck-warning')).toHaveCount(0);
    expect(await deck.locator('.compact-spell-card').count()).toBeGreaterThan(0);
    const sourceTexts=await deck.locator('.compact-spell-card>footer>span').allTextContents();
    for(const source of sourceTexts)expect(source).toMatch(/PHB (2014|2024) p\.\d+/);
    const cardTexts=await deck.locator('.compact-spell-card').allTextContents();
    for(const text of cardTexts)expect(text).not.toMatch(/damage[^\n]*d20/i);
  } else {
    await expect(page.locator('.spell-card-deck')).toHaveCount(0);
  }

  const importCode = page.locator('.sheet-import strong');
  await expect(importCode).toContainText(edition === '2024' ? '-24' : '-14');

  expect(errors, `Browser errors for ${id} ${edition}: ${errors.join(' | ')}`).toEqual([]);
}

test('public landing page explains the product and links both roles', async ({ page }) => {
  const errors = await collectPageErrors(page);
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: /Run the adventure/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Run The Wishing Cake' })).toBeVisible();
  await expect(page.getByRole('link', { name: /DM Table/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Player Table/ }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /From adventure pack to live table/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test('DM can launch Wishing Cake and advance the prepared scene', async ({ page }) => {
  const errors = await collectPageErrors(page);
  await page.setViewportSize({ width: 1880, height: 1021 });
  await page.goto('/?launch=1', { waitUntil: 'networkidle' });
  await expect(page.locator('.adventure-loader')).toBeVisible();
  await page.locator('[data-load-pack]').click();
  await expect(page.locator('.scene-runtime')).toBeVisible();
  await expect(page.locator('[data-scene-select]')).toBeVisible();
  await expect(page.locator('.fixed-board > .board-slot[data-slot]')).toHaveCount(7);

  const slots = await page.locator('.fixed-board > .board-slot[data-slot]').evaluateAll(nodes => nodes.map(node => {
    const rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }));
  const heightSpread = Math.max(...slots.map(slot => slot.height)) - Math.min(...slots.map(slot => slot.height));
  expect(heightSpread).toBeLessThanOrEqual(1);
  for (const width of slots.map(slot => slot.width)) expect(width).toBeGreaterThan(200);

  const visibleCards = page.locator('.fixed-board .tarot-card:visible');
  const cardCount = await visibleCards.count();
  expect(cardCount).toBeGreaterThan(0);
  const cardWidths = await visibleCards.evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
  for (const width of cardWidths) expect(Math.abs(width - 148)).toBeLessThanOrEqual(1);

  const select = page.locator('[data-scene-select]');
  const before = await select.inputValue();
  await page.locator('[data-scene-next]').click();
  await expect.poll(() => select.inputValue()).not.toBe(before);
  const after = await select.inputValue();
  expect(after).not.toBe(before);
  await expect(page.locator('[data-scene-status]')).toContainText(/active/i);
  expect(errors, `DM browser errors: ${errors.join(' | ')}`).toEqual([]);
});

for (const [id, name] of pregens) {
  for (const edition of ['2014', '2024']) {
    test(`${name} renders a complete ${edition} player build`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await verifyPlayerBuild(page, id, name, edition);
    });
  }
}

test('wizard spell deck spends and restores the real level-3 slot pool', async ({ page }) => {
  await page.goto('/player.html?character=elara-evoker&edition=2014',{waitUntil:'networkidle'});
  const deck=page.locator('.spell-card-deck');
  await expect(deck).toBeVisible();
  await expect(deck.locator('[data-slot-level="1"] strong')).toHaveText('4/4');
  await expect(deck.locator('[data-slot-level="2"] strong')).toHaveText('2/2');
  const missile=deck.locator('[data-spell-card="Magic Missile"]');
  await expect(missile).toContainText('1d4+1 force');
  await missile.getByRole('button',{name:'Use Slot'}).click();
  await expect(deck.locator('[data-slot-level="1"] strong')).toHaveText('3/4');
  await deck.getByRole('button',{name:/Long Rest/}).click();
  await expect(deck.locator('[data-slot-level="1"] strong')).toHaveText('4/4');
});

test('edition-specific spell cards expose the correct healing dice', async ({ page }) => {
  await page.goto('/player.html?character=brunna-life-cleric&edition=2014',{waitUntil:'networkidle'});
  await expect(page.locator('[data-spell-card="Cure Wounds"]')).toContainText('1d8 + spellcasting ability modifier');
  await page.goto('/player.html?character=brunna-life-cleric&edition=2024',{waitUntil:'networkidle'});
  await expect(page.locator('[data-spell-card="Cure Wounds"]')).toContainText('2d8 + spellcasting ability modifier');
});

test('Lore Bard spell deck stays inside each SRD publishing baseline', async ({ page }) => {
  await page.goto('/player.html?character=lute-lore-bard&edition=2014',{waitUntil:'networkidle'});
  await expect(page.locator('[data-spell-card="Charm Person"]')).toBeVisible();
  await expect(page.locator('[data-spell-card="Dissonant Whispers"]')).toHaveCount(0);
  await page.goto('/player.html?character=lute-lore-bard&edition=2024',{waitUntil:'networkidle'});
  await expect(page.locator('[data-spell-card="Dissonant Whispers"]')).toBeVisible();
});

test('2024 Elf lineage level-3 spell displays source-specific free and slot casts separately', async ({ page }) => {
  await page.goto('/player.html?character=elara-evoker&edition=2024',{waitUntil:'networkidle'});
  const detect=page.locator('[data-spell-card="Detect Magic"]');
  await expect(detect).toBeVisible();
  await expect(detect.locator('.spell-source-badges')).toContainText('High Elf Lineage · INT');
  await expect(detect.getByRole('button',{name:/High Elf Lineage 1\/Long Rest/})).toBeVisible();
  await expect(detect.getByRole('button',{name:'Use Slot'})).toBeVisible();
});

test('player table remains usable at tablet width', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await verifyPlayerBuild(page, 'elara-evoker', 'Elara Starling', '2024');
  const sheet = await page.locator('.full-character-sheet').boundingBox();
  expect(sheet.width).toBeLessThanOrEqual(820);
});

test('player table remains usable at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await verifyPlayerBuild(page, 'merrin-thief', 'Merrin Quickstep', '2024');
  const sheet = await page.locator('.full-character-sheet').boundingBox();
  expect(sheet.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2)).toBe(true);
});
