import { test, expect } from '@playwright/test';

async function loadWishingCake(page){
 await page.goto('/?launch=1',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.adventure-loader')).toBeVisible();
 await page.locator('[data-load-pack]').click();
 await expect(page.locator('.adventure-deck')).toBeVisible();
}

async function openCardBack(page,card){
 await expect(card).toBeVisible();
 await card.click();
 const modal=page.locator('.large-card-modal');
 await expect(modal).toBeVisible();
 const back=modal.locator('.large-card-back');
 await expect(back).toBeVisible();
 return {modal,back};
}

test('DM monster cards render the corrected canonical stat blocks',async({page})=>{
 await page.setViewportSize({width:1600,height:1000});
 await loadWishingCake(page);
 const deck=page.locator('.adventure-deck');

 const plate=deck.locator('[data-card-id="skeleton"]');
 let opened=await openCardBack(page,plate);
 await expect(opened.back).toContainText('STR 15 (+2)');
 await expect(opened.back).toContainText('Bite. Melee Weapon Attack: +4 to hit');
 await expect(opened.back).toContainText('1d8 + 2');
 await opened.modal.getByRole('button',{name:'Close full card'}).click();

 const boss=deck.locator('[data-card-id="monster-sepulchral"]');
 opened=await openCardBack(page,boss);
 await expect(opened.back).toContainText('13 (15 with Mage Armor; 20 against the triggering attack with Shield)');
 await expect(opened.back).toContainText('Staff. Melee Weapon Attack: +1 to hit');
 await expect(opened.back).toContainText('1d6 − 1');
 await expect(opened.back).toContainText('spell save DC 13, +5 to hit');
});

test('pregen full sheet exposes standard character details and persistent tracking',async({page})=>{
 await page.goto('/player.html?character=wendy-birthday-hero&edition=2024',{waitUntil:'domcontentloaded'});
 const panel=page.locator('.sheet-tracking-panel');
 await expect(panel).toBeVisible();
 for(const text of ['Player Name','Alignment','Size','Species','Class / Level','Background','Hit Die','Senses','Experience Points','Temporary HP','Heroic Inspiration','Death Saves','Exhaustion','Conditions','Currency','Personality','Ideal','Bond','Flaw'])await expect(panel.getByText(text,{exact:false}).first()).toBeVisible();

 await panel.locator('[data-sheet-field="playerName"]').fill('Playtest Player');
 await panel.locator('[data-sheet-number="xp"]').fill('900');
 await panel.locator('[data-sheet-number="xp"]').press('Tab');
 await panel.locator('[data-sheet-number="tempHp"]').fill('7');
 await panel.locator('[data-sheet-number="tempHp"]').press('Tab');
 await panel.locator('[data-sheet-number="deathSuccesses"]').fill('1');
 await panel.locator('[data-sheet-number="deathSuccesses"]').press('Tab');
 await panel.locator('[data-sheet-check="inspiration"]').check();
 await panel.locator('[data-sheet-condition="Prone"]').check();
 await panel.locator('[data-sheet-currency="gp"]').fill('42');
 await panel.locator('[data-sheet-currency="gp"]').press('Tab');

 await page.reload({waitUntil:'domcontentloaded'});
 const restored=page.locator('.sheet-tracking-panel');
 await expect(restored.locator('[data-sheet-field="playerName"]')).toHaveValue('Playtest Player');
 await expect(restored.locator('[data-sheet-number="xp"]')).toHaveValue('900');
 await expect(restored.locator('[data-sheet-number="tempHp"]')).toHaveValue('7');
 await expect(restored.locator('[data-sheet-number="deathSuccesses"]')).toHaveValue('1');
 await expect(restored.locator('[data-sheet-check="inspiration"]')).toBeChecked();
 await expect(restored.locator('[data-sheet-condition="Prone"]')).toBeChecked();
 await expect(restored.locator('[data-sheet-currency="gp"]')).toHaveValue('42');
});

test('2014 pregen sheet labels Inspiration rather than Heroic Inspiration',async({page})=>{
 await page.goto('/player.html?character=wendy-birthday-hero&edition=2014',{waitUntil:'domcontentloaded'});
 const panel=page.locator('.sheet-tracking-panel');
 await expect(panel).toBeVisible();
 await expect(panel.getByText('Inspiration',{exact:true})).toBeVisible();
 await expect(panel.getByText('Heroic Inspiration',{exact:true})).toHaveCount(0);
});
