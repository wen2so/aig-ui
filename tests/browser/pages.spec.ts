import {test,expect} from '@playwright/test';

test('访问状态页明确区分未找到、过期和受限',async({page})=>{
  await page.goto('http://127.0.0.1:5173/?component=access-state-page');
  await expect(page.getByRole('heading',{name:'登录已过期'})).toBeVisible();
  await expect(page.getByRole('link',{name:'重新登录'})).toBeVisible();
  await page.getByLabel('演示访问状态').selectOption('forbidden');
  await expect(page.getByRole('heading',{name:'访问受限'})).toBeVisible();
  await expect(page.getByRole('link',{name:'重新登录'})).toHaveCount(0);
  await page.getByLabel('演示访问状态').selectOption('not-found');
  await expect(page.getByRole('heading',{name:'页面未找到'})).toBeVisible();
});
