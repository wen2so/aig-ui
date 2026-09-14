import { test, expect } from '@playwright/test';

test('标记从实际进度撤回，静态和减少动画停止双环', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=LoadingMark');
  const svg = page.getByRole('img', { name: '加载标记' });
  await page.getByRole('button', { name: '重新绘制' }).click();
  await page.waitForTimeout(650);
  const before = await svg
    .locator('path')
    .evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset));
  expect(before).toBeGreaterThan(0);
  expect(before).toBeLessThan(1);
  await page.getByRole('button', { name: '撤回描边' }).click();
  const after = await svg
    .locator('path')
    .evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset));
  expect(Math.abs(before - after)).toBeLessThan(0.15);
  await expect
    .poll(() =>
      svg.locator('path').evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset)),
    )
    .toBe(1);
  await page.getByRole('button', { name: '静态', exact: true }).click();
  expect(await svg.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: '重新绘制' }).click();
  await expect(svg).toHaveAttribute('data-reduced', 'true');
  expect(await svg.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});

test('预览目录支持搜索与窄屏自然滚动', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('http://127.0.0.1:5173');
  await page.getByLabel('查找组件').fill('LoadingMark');
  await expect(page.getByRole('link', { name: '加载标记 LoadingMark', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '按钮 Button' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('查找组件').fill('');
  await page.screenshot({ path: 'artifacts/preview-mobile.png', fullPage: true });
});

test('加载序列完成一次交接，释放内容与动画，旧任务完成信号被隔离', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=LoadingSequence');
  const section = page.locator('#LoadingSequence');
  const sequence = section.locator('[data-aig-component=loading-sequence]');
  await section.getByLabel('就绪时机').selectOption('manual');
  await expect(sequence.locator('.aig-sequence-content')).toHaveAttribute('inert', '');
  await section.getByRole('button', { name: '任务就绪' }).click();
  await expect(sequence).toHaveAttribute('data-phase', 'complete');
  await expect(section.getByText('完成交接 1 次')).toBeVisible();
  await expect(sequence.locator('.aig-sequence-content')).not.toHaveAttribute('inert');
  await expect(sequence.locator('.aig-sequence-layer')).toHaveCount(0);
  expect(await sequence.evaluate((element) => element.getAnimations().length)).toBe(0);
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

test('标记保持镂空，回放呈现错峰描边与退出前的清晰线条', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=LoadingSequence');
  const section = page.locator('#LoadingSequence');
  await section.getByLabel('就绪时机').selectOption('manual');
  const sequence = section.locator('[data-aig-component=loading-sequence]');
  await expect
    .poll(() =>
      sequence.locator('line').evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset)),
    )
    .toBe(0);
  for (const part of await sequence
    .locator('.aig-loading-mark circle, .aig-loading-mark path, .aig-loading-mark line')
    .all())
    await expect(part).toHaveCSS('fill', 'none');
  await expect(sequence.locator('.aig-sequence-layer')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await sequence.screenshot({ path: 'artifacts/loading-hollow-holding.png' });
  await section.getByRole('button', { name: '任务就绪' }).click();
  await expect(sequence).toHaveAttribute('data-phase', 'exiting');
  await expect
    .poll(() =>
      sequence.locator('.aig-loading-mark path').evaluate((element) => element.getAnimations().length),
    )
    .toBeGreaterThan(0);
  await sequence.evaluate((element) =>
    element
      .getAnimations({ subtree: true })
      .filter((animation) => Number.isFinite(animation.effect?.getTiming().iterations))
      .forEach((animation) => {
        animation.pause();
        animation.currentTime = 250;
      }),
  );
  expect(
    await sequence
      .locator('.aig-loading-mark path')
      .evaluate((element) => parseFloat(getComputedStyle(element).strokeDashoffset)),
  ).toBeGreaterThan(0);
  const opacity = await sequence
    .locator('.aig-sequence-layer')
    .evaluate((element) => Number(getComputedStyle(element).opacity));
  expect(opacity).toBeGreaterThan(0.9);
  await sequence.screenshot({ path: 'artifacts/loading-hollow-erasing.png' });
});

test('退出 450ms 旧文字消失且内容尚未出现，撤回仍可见', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=LoadingSequence');
  await page.getByLabel('就绪时机').selectOption('manual');
  const sequence = page.locator('[data-aig-component=loading-sequence]');
  await expect
    .poll(() => sequence.locator('line').evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset)))
    .toBe(0);
  await page.getByRole('button', { name: '任务就绪' }).click();
  await expect(sequence).toHaveAttribute('data-phase', 'exiting');
  await sequence.evaluate((el) =>
    el
      .getAnimations({ subtree: true })
      .filter((a) => a.effect?.getTiming().iterations !== Infinity)
      .forEach((a) => {
        a.pause();
        a.currentTime = 450;
      }),
  );
  await expect(sequence.locator('.aig-sequence-label')).toHaveCSS('opacity', '0');
  await expect(sequence.locator('.aig-sequence-content')).toHaveCSS('opacity', '0');
  await expect(sequence.locator('.aig-sequence-layer')).toHaveCSS('opacity', '1');
  const offset = await sequence
    .locator('.aig-loading-mark path')
    .evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));
  expect(offset).toBeGreaterThan(0);
  expect(offset).toBeLessThan(1);
  await sequence.screenshot({ path: 'artifacts/design-review/exit-450.png' });
});

test('重放后全部轨道继承倍率，暂停同时冻结自动就绪', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=LoadingSequence');
  await page.getByLabel('速度').selectOption('0.25');
  await page.getByRole('button', { name: '重试', exact: true }).click();
  const sequence = page.locator('[data-aig-component=loading-sequence]');
  await expect
    .poll(() =>
      sequence.evaluate((el) => el.getAnimations({ subtree: true }).every((a) => a.playbackRate === 0.25)),
    )
    .toBe(true);
  await page.getByRole('button', { name: '暂停', exact: true }).click();
  await page.waitForTimeout(100);
  const before = await sequence.evaluate((el) =>
    el.getAnimations({ subtree: true }).map((a) => a.currentTime),
  );
  await page.waitForTimeout(2500);
  await expect(sequence).toHaveAttribute('data-phase', 'loading');
  expect(
    await sequence.evaluate((el) => el.getAnimations({ subtree: true }).map((a) => a.currentTime)),
  ).toEqual(before);
  await page.getByRole('button', { name: '继续', exact: true }).click();
  await page.getByRole('button', { name: '原版对照' }).click();
  await expect
    .poll(() =>
      page
        .locator('iframe')
        .evaluate((el) =>
          (el as HTMLIFrameElement).contentDocument?.getAnimations().every((a) => a.playbackRate === 0.25),
        ),
    )
    .toBe(true);
  await page.getByRole('button', { name: '暂停', exact: true }).click();
  await page.waitForTimeout(2500);
  expect(
    await page
      .locator('iframe')
      .evaluate((el) => (el as HTMLIFrameElement).contentDocument?.body.classList.contains('is-ready')),
  ).toBe(false);
});
