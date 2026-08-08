import { test, expect } from '@playwright/test';

test('equipment doll uses rules-neutral hand slots and reserves both for Two-Handed weapons', async ({ page }) => {
  await page.setViewportSize({ width: 1524, height: 934 });
  await page.goto('/player.html?character=wendy-birthday-hero&edition=2014', { waitUntil: 'domcontentloaded' });

  const doll = page.locator('.rpg-paper-doll');
  await expect(doll).toBeVisible();
  await expect(doll).toContainText('Hand 1 + Hand 2 are the active grip');
  await expect(doll).toContainText('Two-Handed weapons reserve both');
  await expect(doll.getByText('Gloves / Gauntlets', { exact: true })).toBeVisible();
  await expect(doll.getByText('Hand 1', { exact: true })).toBeVisible();
  await expect(doll.getByText('Hand 2', { exact: true })).toBeVisible();

  const backpack = page.locator('.backpack');
  const longbow = backpack.locator('[data-item-id="longbow"]');
  await longbow.getByRole('button', { name: 'Equip' }).click();

  const hand1 = doll.locator('[data-equipment-slot="mainHand"]');
  const hand2 = doll.locator('[data-equipment-slot="offHand"]');
  await expect(hand1).toContainText('Longbow');
  await expect(hand2).toContainText('Longbow');
  await expect(page.locator('.active-attack')).toContainText('Longbow');

  const shield = backpack.locator('[data-item-id="shield"]');
  await shield.getByRole('button', { name: 'Equip' }).click();
  await expect(hand1).toContainText('Shield');
  await expect(hand2).toContainText('Empty');
  await expect(page.locator('.active-attack')).toContainText('No weapon equipped');
});
