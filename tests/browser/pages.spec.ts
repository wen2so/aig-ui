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

test('设置表单校验、失败保留与重试保存',async({page})=>{
  await page.goto('http://127.0.0.1:5173/?component=settings-form');
  const name=page.getByRole('textbox',{name:'项目名称'});
  await name.fill('');
  await page.getByRole('button',{name:'保存设置'}).click();
  await expect(page.getByText('请填写项目名称。')).toBeVisible();
  await expect(name).toBeFocused();
  await name.fill('修改后的项目');
  await page.getByRole('button',{name:'保存设置'}).click();
  await expect(page.getByText('演示保存失败，修改内容已保留。')).toBeVisible();
  await expect(name).toHaveValue('修改后的项目');
  await page.getByLabel('模拟保存失败').uncheck();
  await page.getByRole('button',{name:'保存设置'}).click();
  await expect(page.getByText('当前设置已同步')).toBeVisible();
  await expect(page.getByRole('dialog',{name:'设置已保存'})).toBeVisible();
});

test('筛选列表覆盖空结果、分页、详情与读取失败',async({page})=>{
  await page.goto('http://127.0.0.1:5173/?component=filterable-list');
  await page.getByRole('searchbox',{name:'查找资料'}).fill('不存在');
  await expect(page.getByRole('heading',{name:'暂无匹配资料'})).toBeVisible();
  await page.getByRole('button',{name:'清除筛选'}).click();
  await page.getByRole('button',{name:'下一页'}).click();
  await page.getByRole('button',{name:'查看项目资料 6',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText('demo-6');
  await page.keyboard.press('Escape');
  await page.getByLabel('演示列表状态').selectOption('error');
  await page.getByRole('button',{name:'重试读取'}).click();
  await expect(page.getByRole('table')).toBeVisible();
});
