import { test, expect } from '@playwright/test';

const monsters=[
  {id:'priest',title:'Animated Present',checks:['Ac: 14','18 (4d6 + 4)','STR 10 (+0)','DEX 14 (+2)','Ribbon Lash','+4 to hit','1d8 + 2','DC 12 Dexterity']},
  {id:'skeleton',title:'Paper Plate Mimic',checks:['Ac: 13','27 (5d8 + 5)','STR 15 (+2)','DEX 12 (+1)','Bite','+4 to hit','1d8 + 3','1d4']},
  {id:'monster-pinata-mimic',title:'Piñata Mimic',checks:['Ac: 14','55 for four characters; 70 for five or six','STR 17 (+3)','DEX 14 (+2)','Gore','+5 to hit','2d8 + 3','DC 13 Strength','Candy Burst']},
  {id:'monster-sepulchral',title:'Sepulchral — Boss',checks:['13 (16 with mage armor; 21 with shield)','58 (13d6 + 13)','Staff','+4 to hit','1d6 + 1','Fire Bolt','+5 to hit','2d10','Spell save DC 13']}
];

test('all Wishing Cake monster DM cards render their approved stat blocks',async({page})=>{
  await page.setViewportSize({width:1880,height:1021});
  await page.goto('/?launch=1',{waitUntil:'networkidle'});
  await page.locator('[data-load-pack]').click();
  const deck=page.locator('.adventure-deck');
  await expect(deck).toBeVisible();
  for(const monster of monsters){
    const card=deck.locator(`.tarot-card[data-card-id="${monster.id}"]`).first();
    await expect(card,`${monster.title} card missing from DM deck`).toBeAttached();
    await expect(card).toContainText(monster.title);
    const back=card.locator('.tarot-face.tarot-back');
    await expect(back,`${monster.title} DM back missing`).toBeAttached();
    for(const text of monster.checks)await expect(back,`${monster.title} missing ${text}`).toContainText(text);
  }
});
