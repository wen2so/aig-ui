import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test('总览分类、检索、组件直达和浏览器返回保持一致', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('http://127.0.0.1:5173/');
  await expect(page.locator('.catalog-card')).toHaveCount(56);
  await page.screenshot({ path: 'artifacts/preview-redesign/overview-desktop.png' });
  await page.getByRole('button', { name: '数据录入', exact: true }).click();
  await expect(page.locator('.catalog-card')).toHaveCount(8);
  await page.getByRole('link', { name: '输入框 Input', exact: true }).click();
  await expect(page).toHaveURL(/component=Input/);
  await expect(page.getByRole('heading', { name: 'Input 输入框', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.locator('.catalog-card')).toHaveCount(56);
  await page.getByLabel('查找组件').fill('  LoAdInGmArK  ');
  await expect(page.locator('.catalog-card')).toHaveCount(1);
  await page.getByRole('link', { name: '加载标记 LoadingMark', exact: true }).click();
  await expect(page.locator('#LoadingMark')).toBeVisible();
  await page.reload();
  await expect(page.locator('#LoadingMark')).toBeVisible();
  await page.getByLabel('查找组件').fill('没有这种组件');
  await expect(page.getByRole('heading', { name: '当前没有匹配的组件' })).toBeVisible();
  await page.getByRole('button', { name: '查看全部组件' }).click();
  await page.getByLabel('查找组件').fill('Button');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('示例参数、重置、源码复制和当前 API 可实际使用', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('http://127.0.0.1:5173/?component=Button');
  const playground = page.locator('#example-playground');
  await playground.getByLabel('操作层级').selectOption('secondary');
  await playground.getByLabel('按钮尺寸').selectOption('lg');
  await playground.getByRole('button', { name: '开始创作' }).click();
  await expect(playground.getByRole('status').filter({ hasText: '已执行' })).toHaveText('已执行 1 次');
  await playground.getByLabel('按钮状态').selectOption('disabled');
  await expect(playground.getByRole('button', { name: '开始创作' })).toBeDisabled();
  await playground.getByRole('button', { name: '重置交互试验台' }).click();
  await expect(playground.getByLabel('操作层级')).toHaveValue('primary');
  await expect(playground.getByRole('status').filter({ hasText: '已执行' })).toHaveText('已执行 0 次');
  await page.getByRole('button', { name: '查看操作层级代码' }).click();
  await expect(page.locator('#code-variants')).toContainText('variant="secondary"');
  await page.getByRole('button', { name: '复制操作层级代码' }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('variant="secondary"');
  await expect(page.locator('#api')).toContainText('variant');
  await expect(page.locator('#api')).toContainText('操作层级，默认 primary。');
  await page.locator('#example-states').screenshot({ path: 'artifacts/preview-redesign/button-states.png' });
});

test('静止底线光点持续巡航，禁用保持静态，支持暂停与减少动画', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  const idle = page.locator('#example-states .aig-button[data-variant=primary]:enabled');
  const disabled = page.locator(
    '#example-states .aig-button[data-variant=primary]:disabled:not([aria-busy])',
  );
  await expect(idle.locator('.aig-button-frame')).toHaveCSS('animation-name', 'aig-button-glint');
  await expect(disabled.locator('.aig-button-frame')).toHaveCSS('animation-name', 'none');
  await expect(disabled).toBeDisabled();
  const measurements = await idle.evaluate((el) => {
    const frame = el.querySelector('.aig-button-frame')!;
    const animation = frame.getAnimations()[0]!;
    animation.pause();
    animation.currentTime = 0;
    const start = getComputedStyle(frame).getPropertyValue('--aig-glint-x');
    const opacity = getComputedStyle(frame).opacity;
    const textOpacity = getComputedStyle(el).opacity;
    animation.currentTime = 3200;
    return {
      start,
      end: getComputedStyle(frame).getPropertyValue('--aig-glint-x'),
      opacity,
      finalOpacity: getComputedStyle(frame).opacity,
      filter: getComputedStyle(frame).filter,
      textOpacity,
      finalTextOpacity: getComputedStyle(el).opacity,
    };
  });
  expect(measurements.start).not.toBe(measurements.end);
  expect(measurements.opacity).toBe(measurements.finalOpacity);
  expect(measurements.filter).toBe('none');
  expect(measurements.textOpacity).toBe(measurements.finalTextOpacity);
  await page.getByRole('button', { name: '全局主题', exact: true }).click();
  await page.getByRole('button', { name: '暂停环境动效' }).click();
  await page.getByRole('button', { name: '完成设置', exact: true }).click();
  await expect(idle.locator('.aig-button-frame')).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(disabled.locator('.aig-button-frame')).toHaveCSS('animation-name', 'none');
  await expect(idle.locator('.aig-button-frame')).toHaveCSS('animation-name', 'none');
  await page.goto('http://127.0.0.1:5173/?component=Input');
  await expect(page.getByLabel('等待开通')).toBeDisabled();
  await expect(page.getByLabel('等待开通')).toHaveCSS('animation-name', 'none');
});

test('桌面和移动文档保持内容可达、目录可开关、表单可恢复', async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [1920, 1280, 768, 390, 360, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const component of ['', 'Button', 'Input', 'Card', 'Table']) {
      await page.goto(`http://127.0.0.1:5173/?component=${component}`);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${component} at ${width}`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('http://127.0.0.1:5173/?component=Input');
  await page.getByRole('button', { name: '组件目录' }).click();
  await expect(page.getByRole('navigation', { name: '组件目录' })).toBeVisible();
  await page
    .getByRole('navigation', { name: '组件目录' })
    .getByRole('link', { name: 'Button 按钮', exact: true })
    .click();
  await expect(page.getByRole('navigation', { name: '组件目录' })).toBeHidden();
  await page.goto('http://127.0.0.1:5173/?component=Input');
  const form = page.locator('#example-validation');
  await form.getByRole('button', { name: '保存项目' }).click();
  await expect(form.getByRole('alert')).toContainText('填写项目名称');
  await form.getByLabel('项目名称').fill('春日灵感集');
  await form.getByRole('button', { name: '保存项目' }).click();
  await expect(form.getByRole('status').filter({ hasText: '已保存' })).toContainText('春日灵感集');
  await page.screenshot({ path: 'artifacts/preview-redesign/mobile-input.png', fullPage: true });
});

test('品牌 SVG 和颜色在加载、浮层与导航中保持一致', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page.getByRole('button', { name: '全局主题', exact: true }).click();
  await page.getByLabel('品牌 SVG', { exact: true }).selectOption('diamond');
  await page.getByLabel('品牌色', { exact: true }).fill('#267b86');
  await page.getByRole('button', { name: '完成设置', exact: true }).click();
  await expect(page.locator('.preview-brand svg path').first()).toHaveAttribute(
    'd',
    'M100 38 162 100 100 162 38 100Z',
  );
  await expect(page.locator('#example-states .aig-button-mark path').first()).toHaveAttribute(
    'd',
    'M100 38 162 100 100 162 38 100Z',
  );
  await expect(page.locator('#example-custom-loading .aig-button-loading')).toHaveCount(3);
  await page
    .getByRole('navigation', { name: '组件目录', exact: true })
    .getByRole('link', { name: 'Dialog 对话框', exact: true })
    .click();
  await page.locator('.preview-example').getByRole('button').first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(
    await page
      .getByRole('dialog')
      .evaluate((el) => getComputedStyle(el).getPropertyValue('--aig-color-mark').trim()),
  ).toBe('#267b86');
  await page.keyboard.press('Escape');
  await page
    .getByRole('navigation', { name: '组件目录', exact: true })
    .getByRole('link', { name: 'LoadingSequence 加载序列', exact: true })
    .click();
  await expect(page.locator('.aig-loading-mark g path').first()).toHaveAttribute(
    'd',
    'M100 38 162 100 100 162 38 100Z',
  );
  await page.screenshot({ path: 'artifacts/preview-refinement/custom-brand.png' });
  await page.getByLabel('就绪时机').selectOption('manual');
  await page.getByRole('button', { name: '全局主题', exact: true }).click();
  await page.getByLabel('品牌 SVG', { exact: true }).selectOption('orbit');
  await page.getByRole('button', { name: '完成设置', exact: true }).click();
  await expect(page.locator('.aig-loading-mark g circle')).toHaveAttribute('pathLength', '1');
  await page.getByRole('button', { name: '任务就绪', exact: true }).click();
  await expect(page.locator('[data-aig-component=loading-sequence]')).toHaveAttribute(
    'data-phase',
    'complete',
  );
  await expect(page.getByText('完成交接 1 次')).toBeVisible();
});

test('折叠内容经过中间高度，快速反向操作后状态正确', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Accordion');
  const trigger = page.locator('#example-basic').getByRole('button', { name: '组件用途', exact: true });
  const panel = page.locator('#example-basic .aig-accordion-panel').first();
  const openHeight = (await panel.boundingBox())!.height;
  await trigger.click();
  const height = await panel.evaluate((el) => {
    const transition = el
      .getAnimations()
      .find((animation) => animation instanceof CSSTransition && animation.transitionProperty === 'height');
    if (!transition) throw new Error('缺少高度过渡');
    transition.pause();
    transition.currentTime = 200;
    const height = el.getBoundingClientRect().height;
    transition.play();
    return height;
  });
  expect(height).toBeGreaterThan(0);
  expect(height).toBeLessThan(openHeight);
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(async () => (await panel.boundingBox())?.height).toBe(openHeight);
  await expect(page.locator('#api')).toContainText('multiple');
  await expect(page.locator('#api')).toContainText('keepMounted');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(panel).toHaveCSS('transition-duration', '0s');
});

test('目录导航平滑滚动并保留浏览器历史', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page
    .getByRole('navigation', { name: '本页目录' })
    .getByRole('link', { name: 'API 属性', exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(700);
  await expect
    .poll(() => page.locator('#api').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBeLessThan(120);
  await page.evaluate(() => {
    const positions: number[] = [];
    document.documentElement.dataset.scrollSamples = '[]';
    const record = () => {
      positions.push(scrollY);
      document.documentElement.dataset.scrollSamples = JSON.stringify(positions);
    };
    window.addEventListener('scroll', record);
    window.setTimeout(() => window.removeEventListener('scroll', record), 2000);
  });
  await page
    .getByRole('navigation', { name: '组件目录', exact: true })
    .getByRole('link', { name: 'CopyButton 复制按钮', exact: true })
    .click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  const samples: number[] = await page.evaluate(() =>
    JSON.parse(document.documentElement.dataset.scrollSamples!),
  );
  expect(samples.filter((y) => y > 0).length).toBeGreaterThan(2);
  await page.goBack();
  await expect(page).toHaveURL(/component=Button/);
});

test('顶部分类在总览、详情、筛选与历史间准确定位，当前组件目录保持可见', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:5173/#%FF');
  await expect(page.getByRole('heading', { name: '线条，自有节奏。', exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:5173/?component=LoadingSequence');
  const sidebar = page.getByRole('navigation', { name: '组件目录', exact: true });
  const active = sidebar.getByRole('link', { name: 'LoadingSequence 加载序列', exact: true });
  const sidebarBounds = (await sidebar.boundingBox())!;
  const activeBounds = (await active.boundingBox())!;
  expect(activeBounds.y).toBeGreaterThanOrEqual(sidebarBounds.y);
  expect(activeBounds.y + activeBounds.height).toBeLessThanOrEqual(sidebarBounds.y + sidebarBounds.height);

  const topNav = page.getByRole('navigation', { name: '主导航', exact: true });
  for (const [label, id] of [
    ['动效', 'catalog-motion'],
    ['页面组合', 'catalog-pages'],
    ['组件', 'catalog-components'],
  ]) {
    await topNav.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(topNav.getByRole('link', { name: label, exact: true })).toHaveAttribute(
      'aria-current',
      'location',
    );
    await expect
      .poll(() => page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top)))
      .toBe(92);
    await expect(page.locator(`#${id}`)).toBeFocused();
  }

  await page.getByRole('button', { name: '数据录入', exact: true }).click();
  await expect(page.locator('.catalog-card')).toHaveCount(8);
  await topNav.getByRole('link', { name: '动效', exact: true }).click();
  await expect(page.locator('.catalog-card')).toHaveCount(56);
  await expect
    .poll(() => page.locator('#catalog-motion').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBe(92);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await topNav.getByRole('link', { name: '动效', exact: true }).click();
  await expect
    .poll(() => page.locator('#catalog-motion').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBe(92);
  await page.getByRole('link', { name: '加载序列 LoadingSequence', exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL(/#catalog-motion$/);
  await expect
    .poll(() => page.locator('#catalog-motion').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBe(92);

  await page.setViewportSize({ width: 360, height: 800 });
  await topNav.getByRole('link', { name: '页面组合', exact: true }).click();
  await expect
    .poll(() => page.locator('#catalog-pages').evaluate((el) => Math.round(el.getBoundingClientRect().top)))
    .toBe(148);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await topNav.getByRole('link', { name: '组件', exact: true }).click();
  await expect
    .poll(() =>
      page.locator('#catalog-components').evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBe(148);
  await page.keyboard.press('Control+k');
  await expect(page.getByLabel('查找组件')).toBeFocused();
  await page.getByLabel('查找组件').fill('Button');
  await topNav.getByRole('link', { name: '动效', exact: true }).click();
  await expect(page.getByLabel('查找组件')).toHaveValue('');
  await expect(page.locator('.catalog-card')).toHaveCount(56);
  expect(errors).toEqual([]);
});

test('全局主题入口集中设置并支持键盘返回、跨页保持和统一恢复', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  const trigger = page.getByRole('button', { name: '全局主题', exact: true });
  await expect(trigger).toHaveCount(1);
  await expect(page.locator('main .brand-controls')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '品牌与自定义' })).toHaveCount(0);
  await trigger.click();
  const settings = page.getByRole('dialog', { name: '全局主题', exact: true });
  await expect(settings).toBeVisible();
  await settings.getByLabel('品牌色', { exact: true }).fill('#267b86');
  await settings.getByLabel('品牌 SVG', { exact: true }).selectOption('diamond');
  await settings.getByLabel('正文字体', { exact: true }).selectOption('serif');
  await settings.getByLabel('标题字体', { exact: true }).selectOption('inherit');
  await settings.getByLabel('等宽字体', { exact: true }).selectOption('terminal');
  await settings.getByLabel('预览材质').selectOption('solid');
  await settings.getByLabel('预览密度').selectOption('compact');
  await settings.getByRole('button', { name: '暂停环境动效' }).click();
  expect(
    await settings.evaluate((el) => getComputedStyle(el).getPropertyValue('--aig-color-mark').trim()),
  ).toBe('#267b86');
  // 字体随选择即时生效：正文、标题与代码分别读取对应 Token。
  await expect(page.locator('.preview-shell')).toHaveCSS('font-family', /Songti SC/);
  await expect(settings.locator('.brand-settings-sample strong')).toHaveCSS('font-family', /Songti SC/);
  await page.keyboard.press('Escape');
  await expect(settings).toBeHidden();
  await expect(trigger).toBeFocused();
  await page
    .getByRole('navigation', { name: '组件目录', exact: true })
    .getByRole('link', { name: 'Input 输入框', exact: true })
    .click();
  await expect(page.locator('.preview-shell')).toHaveAttribute('data-aig-material', 'solid');
  await expect(page.locator('.preview-shell')).toHaveAttribute('data-aig-density', 'compact');
  await expect(page.locator('.preview-shell')).toHaveAttribute('data-ambient', 'paused');
  await expect(page.locator('.component-header h1 span')).toHaveCSS('font-family', /Songti SC/);
  await expect(page.locator('#content .example-code').first()).toHaveCSS('font-family', /Cascadia Code/);
  await trigger.click();
  await expect(settings.getByLabel('品牌色', { exact: true })).toHaveValue('#267b86');
  await expect(settings.getByLabel('品牌 SVG', { exact: true })).toHaveValue('diamond');
  await expect(settings.getByLabel('正文字体', { exact: true })).toHaveValue('serif');
  await expect(settings.getByLabel('等宽字体', { exact: true })).toHaveValue('terminal');
  await page.setViewportSize({ width: 320, height: 640 });
  expect(await settings.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  await settings.getByRole('button', { name: '恢复默认', exact: true }).click();
  await expect(settings.getByLabel('品牌色', { exact: true })).toHaveValue('#b98b90');
  await expect(settings.getByLabel('正文字体', { exact: true })).toHaveValue('system');
  await expect(settings.getByLabel('标题字体', { exact: true })).toHaveValue('serif');
  await expect(settings.getByLabel('等宽字体', { exact: true })).toHaveValue('system');
  await expect(page.locator('.preview-shell')).toHaveAttribute('data-aig-material', 'glass');
  await expect(page.locator('.preview-shell')).toHaveAttribute('data-aig-density', 'comfortable');
  await expect(page.locator('.preview-shell')).toHaveAttribute('data-ambient', 'running');
  await settings.screenshot({ path: 'artifacts/preview-refinement/global-theme-mobile.png' });
  await settings.getByRole('button', { name: '完成设置', exact: true }).click();
  await expect(trigger).toBeFocused();
});

test('主题作用域作为组件文档提供示例与属性表', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('http://127.0.0.1:5173');
  const card = page.getByRole('link', { name: '主题作用域 AigProvider', exact: true });
  await expect(card).toBeVisible();
  const topNav = page.getByRole('navigation', { name: '主导航', exact: true });
  await topNav.getByRole('link', { name: '主题', exact: true }).click();
  await expect(page).toHaveURL(/#catalog-theme$/);
  await expect(topNav.getByRole('link', { name: '主题', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await card.click();
  await expect(page).toHaveURL(/component=AigProvider/);
  await expect(page.getByRole('heading', { name: 'AigProvider 主题作用域', exact: true })).toBeVisible();
  await expect(page.locator('.import-bar code')).toContainText("import { AigProvider } from 'aig-ui';");
  const themeApi = page.locator('#api');
  await expect(themeApi).toContainText('AigBrand');
  await expect(themeApi).toContainText('AigFont');
  await expect(themeApi).toContainText('loadingIcon');
  await expect(themeApi).toContainText('density');
  const providerTable = themeApi.getByRole('region').first();
  await providerTable.focus();
  await expect(providerTable).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => providerTable.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await expect(page.locator('#guidelines')).toContainText('--aig-font-mono');
});
