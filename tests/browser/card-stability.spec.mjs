import { test, expect } from '@playwright/test';

const almostEqual=(a,b,tolerance=1)=>Math.abs(a-b)<=tolerance;

async function box(locator){
  const value=await locator.boundingBox();
  expect(value).not.toBeNull();
  return value;
}

function expectStable(before,after,label){
  expect(almostEqual(before.x,after.x),`${label} x moved ${after.x-before.x}px`).toBe(true);
  expect(almostEqual(before.y,after.y),`${label} y moved ${after.y-before.y}px`).toBe(true);
  expect(almostEqual(before.width,after.width),`${label} width changed ${after.width-before.width}px`).toBe(true);
  expect(almostEqual(before.height,after.height),`${label} height changed ${after.height-before.height}px`).toBe(true);
}

test('opening and closing a card modal does not move the card or page', async ({page})=>{
  await page.setViewportSize({width:1280,height:700});
  await page.goto('/?launch=1',{waitUntil:'domcontentloaded'});
  await page.locator('[data-load-pack]').click();

  const card=page.locator('.fixed-board .tarot-card.image-only-card').first();
  await expect(card).toBeVisible();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(50);

  const before=await box(card);
  const scrollBefore=await page.evaluate(()=>({x:scrollX,y:scrollY,width:document.documentElement.clientWidth}));

  await card.click();
  await expect(page.locator('.large-card-modal')).toBeVisible();
  const open=await box(card);
  const scrollOpen=await page.evaluate(()=>({x:scrollX,y:scrollY,width:document.documentElement.clientWidth}));
  expectStable(before,open,'Card while modal is open');
  expect(scrollOpen.x).toBe(scrollBefore.x);
  expect(scrollOpen.y).toBe(scrollBefore.y);
  expect(scrollOpen.width).toBe(scrollBefore.width);

  await page.getByRole('button',{name:'Close full card'}).click();
  await expect(page.locator('.large-card-modal')).toHaveCount(0);
  const after=await box(card);
  const scrollAfter=await page.evaluate(()=>({x:scrollX,y:scrollY,width:document.documentElement.clientWidth}));
  expectStable(before,after,'Card after modal closes');
  expect(scrollAfter).toEqual(scrollBefore);

  const artTransform=await card.locator('.card-art svg').evaluate(node=>getComputedStyle(node).transform);
  expect(artTransform).toBe('none');
});
