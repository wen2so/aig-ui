import { groups } from '../../apps/preview/src/component-groups.js';
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('对话框锁定焦点，Escape 关闭后恢复触发按钮', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Dialog');
  await page.evaluate(() => document.fonts.ready);
  const trigger = page.getByRole('button', { name: '打开对话框' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '保存当前设置' });
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await dialog.screenshot({ path: test.info().outputPath('Dialog-open.png') });
  await page.keyboard.press('Tab');
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  expect((await new AxeBuilder({ page }).include('[role=dialog]').analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('单选检索、菜单与抽屉保持真实键盘和状态行为', async ({ page, browserName }) => {
  await page.goto('http://127.0.0.1:5173/?component=Select');
  await page.getByRole('combobox', { name: '项目状态' }).click();
  await page.locator('.aig-select-popup').screenshot({ path: test.info().outputPath('Select-open.png') });
  await page.getByRole('option', { name: '已完成' }).click();
  await expect(page.getByRole('combobox', { name: '项目状态' })).toContainText('已完成');
  await page.goto('http://127.0.0.1:5173/?component=Combobox');
  const search = page.getByRole('combobox', { name: '查找项目成员' });
  await search.fill('不存在');
  await expect(page.getByText('暂无匹配选项')).toBeVisible();
  if (browserName === 'chromium')
    await page
      .locator('.aig-combobox-popup')
      .screenshot({ path: test.info().outputPath('Combobox-empty.png') });
  await search.fill('周');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(search).toHaveValue('周明');
  await page.goto('http://127.0.0.1:5173/?component=DropdownMenu');
  await page.getByRole('button', { name: '更多操作' }).click();
  await page.getByRole('menu').screenshot({ path: test.info().outputPath('DropdownMenu-open.png') });
  await page.getByRole('menuitem', { name: '创建副本' }).click();
  await expect(page.getByRole('status').filter({ hasText: '已创建副本' })).toHaveText('已创建副本');
  await page.goto('http://127.0.0.1:5173/?component=Drawer');
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole('button', { name: '查看资料详情' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').screenshot({ path: test.info().outputPath('Drawer-open.png') });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '查看资料详情' })).toBeFocused();
});

test('对话追加与历史插入保持向上阅读的位置', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Conversation');
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const viewport = page.getByRole('region', { name: '对话记录' });
  await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await viewport.evaluate((element) => {
    element.scrollTop = 40;
    element.dispatchEvent(new Event('scroll'));
  });
  await expect(page.getByRole('button', { name: '回到底部', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '追加演示消息' }).click();
  await expect(page.getByRole('button', { name: '有新内容，回到底部' })).toBeVisible();
  expect(await viewport.evaluate((element) => element.scrollTop)).toBeCloseTo(40, 0);
  const anchor = viewport.getByRole('article').nth(1);
  const before = await anchor.evaluate(
    (element) =>
      element.getBoundingClientRect().top -
      element.closest('.aig-conversation-viewport')!.getBoundingClientRect().top,
  );
  const anchorName = await anchor.textContent();
  await page.getByRole('button', { name: '加载历史消息' }).click();
  const after = await viewport
    .getByRole('article')
    .filter({ hasText: anchorName! })
    .evaluate(
      (element) =>
        element.getBoundingClientRect().top -
        element.closest('.aig-conversation-viewport')!.getBoundingClientRect().top,
    );
  expect(Math.abs(before - after)).toBeLessThan(2);
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
  await expect(page.locator('.catalog-card')).toHaveCount(
    groups.reduce((count, group) => count + group.names.split(' ').length, 0),
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('查找组件').fill('Confirmation');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});
