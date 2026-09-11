import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('对话框锁定焦点，Escape 关闭后恢复触发按钮', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Dialog');
  const trigger = page.getByRole('button', { name: '打开对话框' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '保存当前设置' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
  expect((await new AxeBuilder({ page }).include('[role=dialog]').analyze()).violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
