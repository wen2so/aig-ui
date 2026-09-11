import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('对话框锁定焦点，Escape 关闭后恢复触发按钮', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Dialog');
  const trigger = page.getByRole('button', { name: '打开对话框' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '保存当前设置' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  expect((await new AxeBuilder({ page }).include('[role=dialog]').analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('单选检索、菜单与抽屉保持真实键盘和状态行为', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Select');
  await page.getByRole('combobox', { name: '项目状态' }).click();
  await page.getByRole('option', { name: '已完成' }).click();
  await expect(page.getByRole('combobox', { name: '项目状态' })).toContainText('已完成');
  await page.goto('http://127.0.0.1:5173/?component=Combobox');
  const search = page.getByRole('combobox', { name: '查找项目成员' });
  await search.fill('不存在');
  await expect(page.getByText('暂无匹配选项')).toBeVisible();
  await search.fill('周');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(search).toHaveValue('周明');
  await page.goto('http://127.0.0.1:5173/?component=DropdownMenu');
  await page.getByRole('button', { name: '更多操作' }).click();
  await page.getByRole('menuitem', { name: '创建副本' }).click();
  await expect(page.getByRole('status')).toHaveText('已创建副本');
  await page.goto('http://127.0.0.1:5173/?component=Drawer');
  await page.getByRole('button', { name: '查看资料详情' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '查看资料详情' })).toBeFocused();
});

test('对话追加与历史插入保持向上阅读的位置', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Conversation');
  const viewport = page.getByRole('region', { name: '对话记录' });
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await viewport.evaluate((element) => {
    element.scrollTop = 40;
    element.dispatchEvent(new Event('scroll'));
  });
  await page.getByRole('button', { name: '追加演示消息' }).click();
  await expect(page.getByRole('button', { name: '有新内容，回到底部' })).toBeVisible();
  expect(await viewport.evaluate((element) => element.scrollTop)).toBeCloseTo(40, 0);
  const anchor = viewport.getByRole('article').nth(1);
  const before = await anchor.boundingBox();
  const anchorName = await anchor.textContent();
  await page.getByRole('button', { name: '加载历史消息' }).click();
  const after = await viewport.getByRole('article').filter({ hasText: anchorName! }).boundingBox();
  expect(Math.abs(before!.y - after!.y)).toBeLessThan(2);
  await page.getByRole('button', { name: '有新内容，回到底部' }).click();
  expect(
    await viewport.evaluate((element) => element.scrollHeight - element.clientHeight - element.scrollTop),
  ).toBeLessThan(2);
});

test('所有组件在移动视口可达，代表性预览通过 axe', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:5173');
  await expect(page.locator('.preview-count')).toContainText('50 个已实现组件');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('查找组件').fill('Confirmation');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});
