import { test, expect } from '@playwright/test';

test('2024 Wizard separates class and Magic Initiate access on Shield', async ({ page }) => {
  await page.goto('/player.html?character=elara-evoker&edition=2024',{waitUntil:'networkidle'});
  const card=page.locator('[data-spell-card="Shield"]');
  await expect(card).toBeVisible();
  await expect(card.locator('.spell-source-badges')).toContainText('Class · INT');
  await expect(card.locator('.spell-source-badges')).toContainText('Magic Initiate (Wizard) · INT');
  await expect(card.getByRole('button',{name:/Magic Initiate 1\/Long Rest/})).toBeVisible();
  await expect(card.getByRole('button',{name:'Use Slot'})).toBeVisible();
});

test('2024 Ranger Hunter’s Mark keeps free Favored Enemy uses separate from spell slots', async ({ page }) => {
  await page.goto('/player.html?character=fern-hunter&edition=2024',{waitUntil:'networkidle'});
  const card=page.locator('[data-spell-card="Hunter’s Mark"]');
  await expect(card).toBeVisible();
  await expect(card.locator('.spell-source-badges')).toContainText('Class · WIS');
  await expect(card.getByRole('button',{name:/Favored Enemy.*2\/Long Rest/})).toBeVisible();
  await expect(card.getByRole('button',{name:'Use Slot'})).toBeVisible();
  await card.getByRole('button',{name:/Favored Enemy.*2\/Long Rest/}).click();
  await expect(card.getByRole('button',{name:/Favored Enemy.*1 left/})).toBeVisible();
});

test('2024 Bard Magic Initiate spell advertises its own CHA casting source', async ({ page }) => {
  await page.goto('/player.html?character=lute-lore-bard&edition=2024',{waitUntil:'networkidle'});
  const card=page.locator('[data-spell-card="Sanctuary"]');
  await expect(card).toBeVisible();
  await expect(card.locator('.spell-source-badges')).toContainText('Magic Initiate (Cleric) · CHA');
  await expect(card.locator('.spell-access-combat')).toContainText('CHA · WIS save DC 13');
  await expect(card.getByRole('button',{name:/Magic Initiate 1\/Long Rest/})).toBeVisible();
  await expect(card.getByRole('button',{name:'Use Slot'})).toBeVisible();
});
