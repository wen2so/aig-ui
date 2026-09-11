import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('tarball 按钮支持键盘操作、暖白主题和可访问名称', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173');
  await page.getByRole('button', { name: '保存设置' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: '设置已保存' })).toBeVisible();
  await expect(page.getByRole('button', { name: '保存设置' })).toHaveCSS(
    'background-color',
    'rgb(125, 78, 87)',
  );
  await page.getByRole('button', { name: '完成加载' }).click();
  await expect(page.locator('[data-aig-component=loading-sequence]')).toHaveAttribute(
    'data-phase',
    'complete',
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: 'artifacts/button-consumer.png', fullPage: true });
});
