import { test, expect } from '@playwright/test';

test('标记从实际进度撤回，静态和减少动画停止双环', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  const svg = page.getByRole('img', { name: '加载标记' });
  await page.getByRole('button', { name: '重新绘制' }).click();
  await page.waitForTimeout(650);
  const before = await svg.locator('path').evaluate(element => parseFloat(getComputedStyle(element).strokeDashoffset));
  expect(before).toBeGreaterThan(0); expect(before).toBeLessThan(1);
  await page.getByRole('button', { name: '撤回描边' }).click();
  const after = await svg.locator('path').evaluate(element => parseFloat(getComputedStyle(element).strokeDashoffset));
  expect(Math.abs(before - after)).toBeLessThan(.15);
  await expect.poll(() => svg.locator('path').evaluate(element => parseFloat(getComputedStyle(element).strokeDashoffset))).toBe(1);
  await page.getByRole('button', { name: '静态', exact: true }).click();
  expect(await svg.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: '重新绘制' }).click();
  await expect(svg).toHaveAttribute('data-reduced', 'true');
  expect(await svg.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test('预览目录支持搜索与窄屏自然滚动', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('http://127.0.0.1:5173');
  await page.getByLabel('查找组件').fill('LoadingMark');
  await expect(page.getByRole('heading', { name: '加载标记 LoadingMark' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '按钮 Button' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('查找组件').fill('');
  await page.screenshot({ path: 'artifacts/preview-mobile.png', fullPage: true });
});

test('加载序列完成一次交接，释放内容与动画，旧任务完成信号被隔离', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173');
  const section = page.locator('#LoadingSequence');
  const sequence = section.locator('[data-aig-component=loading-sequence]');
  await expect(sequence.locator('.aig-sequence-content')).toHaveAttribute('inert', '');
  await section.getByRole('button', { name: '任务就绪' }).click();
  await expect(sequence).toHaveAttribute('data-phase', 'complete');
  await expect(section.getByText('完成交接 1 次')).toBeVisible();
  await expect(sequence.locator('.aig-sequence-content')).not.toHaveAttribute('inert');
  expect(await sequence.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
  await section.getByRole('button', { name: '任务就绪' }).click();
  await expect(section.getByText('完成交接 1 次')).toBeVisible();
  await section.getByRole('button', { name: '重试', exact: true }).click();
  await section.getByRole('button', { name: '任务就绪' }).click();
  await section.getByRole('button', { name: '重试', exact: true }).click();
  await page.waitForTimeout(1500);
  await expect(sequence).toHaveAttribute('data-phase', 'loading');
  await expect(section.getByText('完成交接 1 次')).toBeVisible();
  await section.getByRole('button', { name: '模拟失败' }).click();
  await expect(section.getByRole('alert')).toContainText('加载未完成');
  await section.getByRole('button', { name: '重试', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await section.getByRole('button', { name: '任务就绪' }).click();
  await expect(sequence).toHaveAttribute('data-phase', 'complete');
  await expect(section.getByText('完成交接 2 次')).toBeVisible();
});
