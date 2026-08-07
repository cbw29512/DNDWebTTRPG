import { test, expect } from '@playwright/test';

const pregens=['wendy-birthday-hero','merrin-thief','elara-evoker','brunna-life-cleric','fern-hunter','lute-lore-bard'];

for(const id of pregens){
  for(const edition of ['2014','2024']){
    test(`${id} ${edition} exposes the complete player-sheet fields`,async({page})=>{
      await page.setViewportSize({width:1440,height:1000});
      await page.goto(`/player.html?character=${id}&edition=${edition}`,{waitUntil:'networkidle'});
      const sheet=page.locator('.full-character-sheet');
      const complete=sheet.locator('.sheet-completeness');
      await expect(complete).toBeVisible();
      const inspiration=edition==='2024'?'Heroic Inspiration':'Inspiration';
      for(const label of ['Temporary Hit Points','Death Saves',inspiration,'Exhaustion','Conditions','Advancement','Currency','Alignment','Appearance','Backstory','Personality','Ideal','Bond','Flaw'])await expect(complete.getByText(label,{exact:true})).toBeVisible();
      await expect(sheet.locator('.sheet-abilities .sheet-ability')).toHaveCount(6);
      await expect(sheet.locator('.sheet-skills li')).toHaveCount(18);
      await expect(sheet.getByRole('heading',{name:'Saving Throws'})).toBeVisible();
      await expect(sheet.getByRole('heading',{name:'Proficiencies & Languages'})).toBeVisible();
      await expect(sheet.getByRole('heading',{name:'Attacks & Combat Shortcuts'})).toBeVisible();
      await expect(sheet.getByRole('heading',{name:'Features & Traits'})).toBeVisible();
      await expect(sheet.getByRole('heading',{name:'Spellcasting'})).toBeVisible();
      await expect(sheet.getByRole('heading',{name:'Equipment & Backpack'})).toBeVisible();
    });
  }
}

test('sheet trackers persist separately from character rules data',async({page})=>{
  await page.goto('/player.html?character=wendy-birthday-hero&edition=2024',{waitUntil:'networkidle'});
  const panel=page.locator('.sheet-completeness');
  await panel.locator('[data-track="tempHp"][data-delta="1"]').click();
  await expect(panel.locator('[data-track-value="tempHp"]')).toHaveText('1');
  await page.reload({waitUntil:'networkidle'});
  await expect(page.locator('.sheet-completeness [data-track-value="tempHp"]')).toHaveText('1');
});
