import { test, expect } from '@playwright/test';

test('独立包与源码预览的玻璃和几何来自同一份公共样式', async ({ page, context }) => {
  await page.goto('http://127.0.0.1:4173');
  const preview = await context.newPage();
  await preview.goto('http://127.0.0.1:5173/?component=Card');
  const inspect = (element: Element) => {
    const style = getComputedStyle(element);
    const edge = getComputedStyle(element, '::before');
    return {
      background: style.backgroundImage,
      filter: style.backdropFilter,
      shadow: style.boxShadow,
      edge: edge.backgroundImage,
      inset: edge.inset,
    };
  };
  expect(await page.locator('.aig-card').evaluate(inspect)).toEqual(
    await preview.locator('.aig-card').evaluate(inspect),
  );
  await preview.close();
});

test('独立包的 Dialog、Toast 和全屏加载继承主题', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173');
  await page.getByRole('button', { name: '打开主题浮层' }).click();
  await expect(page.getByRole('dialog', { name: '主题浮层' })).toHaveCSS(
    'background-color',
    'rgb(240, 246, 250)',
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '显示主题提示' }).click();
  const toast = page.getByRole('dialog', { name: '主题提示' });
  await expect(toast).toBeVisible();
  expect(
    await toast.evaluate((element) => element.closest('[data-aig-theme]')?.getAttribute('data-testid')),
  ).toBe('theme');
  await page.getByRole('button', { name: '关闭提示' }).click();
  await page.getByRole('button', { name: '全屏加载' }).click();
  const loading = page.getByRole('dialog', { name: '消费项目加载中' });
  await expect(loading).toBeVisible();
  expect(
    await loading.evaluate((element) =>
      getComputedStyle(element).getPropertyValue('--aig-color-accent').trim(),
    ),
  ).toBe('rgb(38 78 112)');
  await loading.getByRole('button', { name: '完成加载' }).click();
  await expect(loading).toHaveCount(0);
});

test('Registry JSON 源码在独立项目中编辑并确认产物', async ({ page }) => {
  await page.goto('http://127.0.0.1:4173/?block=artifact-review');
  await page.getByRole('button', { name: '编辑内容' }).click();
  await page.getByRole('textbox', { name: '编辑产物内容' }).fill('独立安装后修改');
  await page.getByRole('button', { name: '保存修改' }).click();
  await expect(page.getByText('独立安装后修改', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '审核并应用' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('Next 生产构建包含服务端内容，水合后交互与浮层正常', async ({ page, request }) => {
  const response = await request.get('http://127.0.0.1:4174');
  expect(await response.text()).toContain('来自服务端的展示内容');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('http://127.0.0.1:4174');
  await page.getByRole('button', { name: '完成准备' }).click();
  await expect(page.locator('[data-aig-component=loading-sequence]')).toHaveAttribute(
    'data-phase',
    'complete',
  );
  await page.getByRole('button', { name: '打开对话框' }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('background-color', 'rgb(240, 246, 250)');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '打开对话框' })).toBeFocused();
  expect(errors).toEqual([]);
});

test('小高度、放大布局和强制颜色下仍能操作浮层', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 360 });
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:4173');
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
  });
  await page.getByRole('button', { name: '打开主题浮层' }).click();
  const dialog = page.getByRole('dialog', { name: '主题浮层' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: '关闭', exact: true }).click();
  await expect(dialog).toHaveCount(0);
});
