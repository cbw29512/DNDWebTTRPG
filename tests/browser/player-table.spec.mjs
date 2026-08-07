import { test, expect } from '@playwright/test';

const pregens = [
  ['wendy-birthday-hero', 'Wendy’s Birthday Hero'],
  ['merrin-thief', 'Merrin Quickstep'],
  ['elara-evoker', 'Elara Starling'],
  ['brunna-life-cleric', 'Brunna Hearthkeeper'],
  ['fern-hunter', 'Fern Greenbough'],
  ['lute-lore-bard', 'Lute Bellweather']
];

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

for (const [id, name] of pregens) {
  for (const edition of ['2014', '2024']) {
    test(`${name} renders a complete ${edition} player build`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await verifyPlayerBuild(page, id, name, edition);
    });
  }
}

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
