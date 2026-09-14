import { expect, test } from '@playwright/test';

test('样板沿用参考字体，保存与删除确认继承主题，静态阅读保持稳定', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=visual-study');
  const sample = page.locator('.visual-study');
  await page.evaluate(() => document.fonts.ready);
  await expect(sample).toHaveCSS('font-family', /Inter, "Microsoft YaHei"/);
  await expect(sample.locator('h2')).toHaveCSS('font-family', /Inter/);
  expect(
    await page.evaluate(() => ({
      body: document.fonts.check('400 14px Inter'),
      mono: document.fonts.check('400 12px "JetBrains Mono"'),
    })),
  ).toEqual({ body: true, mono: true });
  await expect
    .poll(() =>
      sample.evaluate(
        (el) =>
          el.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0);
  await sample.getByLabel('名称').fill('产品研究组');
  await sample.getByRole('button', { name: '保存配置' }).click();
  const dialog = page.getByRole('dialog', { name: '保存工作空间配置' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('font-family', /Inter, "Microsoft YaHei"/);
  await expect(dialog).toContainText('产品研究组');
  await dialog.getByRole('button', { name: '确认保存' }).click();
  await expect(dialog).toBeHidden();
  await expect(sample.getByRole('status').filter({ hasText: '配置已保存。' })).toBeVisible();
  await sample.getByRole('button', { name: '删除工作空间', exact: true }).click();
  const removal = page.getByRole('dialog', { name: '删除工作空间' });
  const danger = removal.getByRole('button', { name: '确认删除' });
  expect(
    await danger.evaluate((el) => getComputedStyle(el).getPropertyValue('--aig-color-danger').trim()),
  ).toBe('#e60012');
  await removal.getByRole('button', { name: '保留工作空间' }).click();
  await expect(removal).toBeHidden();
  await expect(sample.getByLabel('名称')).toHaveValue('产品研究组');
});

test('加载完成后交接给可编辑内容，窄屏内容自然重排', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:5173/?component=visual-study');
  const sample = page.locator('.visual-study');
  await sample.getByRole('button', { name: '播放加载交接' }).click();
  const sequence = sample.locator('.aig-loading-sequence');
  await expect(sequence).toHaveAttribute('data-phase', 'loading');
  await expect(sequence.locator('.aig-loading-mark')).toBeVisible();
  await expect(sequence).toHaveAttribute('data-phase', 'complete', { timeout: 10000 });
  await sample.getByLabel('名称').fill('移动工作空间');
  await expect(sample.locator('.visual-study-summary')).toContainText('移动工作空间');
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await sample.screenshot({ path: 'artifacts/quiet-study-mobile.png' });
});

test('组件总览的缩略图保持静态，真实演示从详情进入', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/');
  const miniatures = page.locator('.catalog-miniature');
  await expect(miniatures).toHaveCount(57);
  await expect
    .poll(() =>
      miniatures.evaluateAll(
        (elements) =>
          elements
            .flatMap((el) => el.getAnimations({ subtree: true }))
            .filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0);
  await page.getByRole('link', { name: '视觉样板 visual-study', exact: true }).click();
  await expect(page.locator('.visual-study')).toBeVisible();
});
