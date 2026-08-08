import { test, expect } from '@playwright/test';

test('Long Rest restores spell uses and ends active concentration', async ({ page }) => {
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(`console: ${message.text()}`);});

  await page.goto('/player.html?character=brunna-life-cleric&edition=2014',{waitUntil:'domcontentloaded'});
  const deck=page.locator('.spell-card-deck');
  await expect(deck).toBeVisible();

  const shieldOfFaith=deck.locator('[data-spell-card="Shield of Faith"]');
  await expect(deck.locator('[data-slot-level="1"] strong')).toHaveText('4/4');
  await shieldOfFaith.getByRole('button',{name:'Use Slot'}).click();

  await expect(deck.locator('[data-slot-level="1"] strong')).toHaveText('3/4');
  await expect(deck.locator('[data-active-concentration] strong')).toHaveText('Shield of Faith');
  await expect(shieldOfFaith).toHaveClass(/is-concentrating/);

  await deck.getByRole('button',{name:/Long Rest/}).click();

  await expect(deck.locator('[data-slot-level="1"] strong')).toHaveText('4/4');
  await expect(deck.locator('[data-active-concentration] strong')).toHaveText('None');
  await expect(deck.locator('[data-spell-card="Shield of Faith"]')).not.toHaveClass(/is-concentrating/);

  expect(errors,`Browser errors: ${errors.join(' | ')}`).toEqual([]);
});
