import { expect, test } from '@playwright/test';

test('按钮视图切换和图标收藏支持键盘，并保留可见激活反馈', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  const selection = page.locator('#example-selection');
  const group = selection.getByRole('group', { name: '工作区视图' });
  const graphic = group.getByRole('button', { name: '图形', exact: true });
  const data = group.getByRole('button', { name: '数据', exact: true });
  const saved = group.getByRole('button', { name: '收藏当前视图' });
  await expect(graphic).toHaveAttribute('aria-pressed', 'true');
  await data.focus();
  await page.keyboard.press('Enter');
  await expect(data).toHaveAttribute('aria-pressed', 'true');
  await expect(graphic).toHaveAttribute('aria-pressed', 'false');
  await expect(data).toHaveCSS('box-shadow', /inset/);
  await expect(selection).toContainText('当前显示数据视图');
  await saved.press('Space');
  await expect(saved).toHaveAttribute('aria-pressed', 'true');
  await expect(selection).toContainText('当前显示数据视图，已收藏');
  await selection.screenshot({ path: test.info().outputPath('button-selection.png') });
  await saved.press('Space');
  await expect(saved).toHaveAttribute('aria-pressed', 'false');
  await expect(selection).toContainText('当前显示数据视图');
});

test('首轮收回，hover 生成直角刻面并保持三档高亮，移出收回', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const primary = page.locator('#example-variants .preview-actions > .aig-button').first();
  const facets = primary.locator('.aig-button-highlight polygon');
  const hidden = () =>
    facets.evaluateAll((elements) => elements.every((el) => getComputedStyle(el).fillOpacity === '0'));
  await expect.poll(() => facets.count(), { timeout: 15000 }).toBeGreaterThan(0);
  await expect
    .poll(() => facets.evaluateAll((elements) => elements.every((el) => el.getAnimations().length === 0)))
    .toBe(true);
  await expect.poll(hidden).toBe(true);
  const initial = await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('points')));
  await primary.hover();
  const next = await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('points')));
  expect(next).not.toEqual(initial);
  expect([4, 6, 8]).toContain(next.length);
  // 在同一轮中采样两次明灭与稳定时刻，核对真实 CSS 播放节奏。
  const samples = await facets.first().evaluate((el) => {
    const animation = el.getAnimations()[0]!;
    animation.pause();
    const delay = Number(animation.effect!.getTiming().delay);
    const duration = Number(animation.effect!.getTiming().duration);
    const values = [0.22, 0.35, 0.5, 0.68, 0.9].map((progress) => {
      animation.currentTime = delay + duration * progress;
      return Number(getComputedStyle(el).fillOpacity);
    });
    animation.play();
    return values;
  });
  expect(samples[0]).toBeGreaterThan(0);
  expect(samples[1]).toBe(0);
  expect(samples[2]).toBeGreaterThan(0);
  expect(samples[3]).toBe(0);
  expect(samples[4]).toBeGreaterThan(0);
  await expect
    .poll(() => facets.evaluateAll((elements) => elements.every((el) => el.getAnimations().length === 0)))
    .toBe(true);
  await expect
    .poll(() =>
      facets.evaluateAll((elements) =>
        elements.every((el) => {
          const style = getComputedStyle(el);
          return Number(style.fillOpacity) === Number(style.getPropertyValue('--aig-facet-depth'));
        }),
      ),
    )
    .toBe(true);
  const depths = await facets.evaluateAll((elements) =>
    elements.map((el) => Number(getComputedStyle(el).fillOpacity)),
  );
  expect(new Set(depths).size).toBeLessThanOrEqual(3);
  expect(depths.every((depth) => [0.14, 0.22, 0.3].includes(depth))).toBe(true);
  await primary.screenshot({ path: test.info().outputPath('button-facets.png') });
  await page.mouse.move(4, 4);
  await expect.poll(hidden).toBe(true);
  await primary.hover();
  expect(await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('points')))).not.toEqual(
    next,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(hidden).toBe(false);
});

test('悬停、按压、选中与加载分别使用对应反馈', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  // 本用例观察按钮状态，滚动定位即时完成，保持指针停在目标上。
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const matrix = page.locator('#example-states');
  const primary = matrix.locator('.aig-button[data-variant=primary]:enabled').first();
  const frame = primary.locator('.aig-button-frame');
  const indicator = () =>
    primary.evaluate((el) => getComputedStyle(el.querySelector('.aig-button-content')!, '::before').opacity);
  await expect(frame).toHaveCSS('animation-name', 'aig-button-glint');
  expect(await indicator()).toBe('0');
  await primary.hover();
  await expect(frame).toHaveCSS('animation-name', 'aig-button-scan');
  await expect(frame).toHaveCSS('inset', '-1px');
  /* 悬停时左侧的固定三角指示点亮，与选中态共用同一个标记位。 */
  expect(await indicator()).toBe('1');
  await page.mouse.down();
  await expect(frame).toHaveCSS('inset', '1px');
  await page.mouse.up();
  await expect(frame).toHaveCSS('inset', '-1px');

  const ghost = matrix.locator('.aig-button[data-variant=ghost]:enabled').first();
  await ghost.hover();
  await expect
    .poll(() =>
      ghost.locator('.aig-button-frame').evaluate((el) => getComputedStyle(el, '::before').backgroundSize),
    )
    .toContain('11px');

  const busy = matrix.locator('.aig-button[aria-busy="true"]').first();
  await expect(busy.locator('.aig-button-frame')).toHaveCSS('animation-name', 'aig-button-scan');
  await expect(busy.locator('.aig-button-frame')).toHaveCSS('animation-duration', '1.7s');
  await expect(busy.locator('.aig-button-highlight')).not.toHaveAttribute('data-playing', '');
  const disabled = matrix.locator('.aig-button:disabled:not([aria-busy])').first();
  await expect(disabled.locator('.aig-button-highlight')).not.toHaveAttribute('data-playing', '');
  await expect(disabled.locator('.aig-button-frame')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(busy.locator('.aig-button-frame')).toHaveCSS('animation-name', 'none');
});

test('加载保留按钮尺寸，长文字与图标槽位在窄视口中保持分离', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page.locator('#example-variants').screenshot({ path: test.info().outputPath('button-variants.png') });
  const playground = page.locator('#example-playground');
  const button = playground.getByRole('button', { name: '开始创作', exact: true });
  const initial = await button.evaluate((element) => ({
    width: element.clientWidth,
    height: element.clientHeight,
  }));
  await playground.getByLabel('按钮状态').selectOption('loading');
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('aria-busy', 'true');
  expect(
    await button.evaluate((element) => ({ width: element.clientWidth, height: element.clientHeight })),
  ).toEqual(initial);
  await expect(button.locator('.aig-button-loading')).toBeVisible();
  await playground.getByLabel('按钮状态').selectOption('idle');
  await expect(button.locator('.aig-button-loading')).toHaveCount(0);
  await expect(button.locator('.aig-button-highlight polygon').first()).toHaveCSS('fill-opacity', '0');
  const sizes = page.locator('#example-sizes');
  await expect(sizes.locator('.aig-button[data-size=sm]').first()).toHaveCSS('min-height', '26px');
  const icon = sizes.locator('.aig-icon-button');
  expect(await icon.evaluate((element) => element.clientWidth === element.clientHeight)).toBe(true);

  await page.setViewportSize({ width: 360, height: 900 });
  const longButton = sizes.locator('.aig-button').filter({ has: page.locator('[data-slot=trailing]') });
  await longButton.scrollIntoViewIfNeeded();
  const bounds = await longButton.evaluate((element) => {
    const label = element.querySelector('.aig-button-label')!.getBoundingClientRect();
    const leading = element.querySelector('[data-slot=leading]')!.getBoundingClientRect();
    const trailing = element.querySelector('[data-slot=trailing]')!.getBoundingClientRect();
    return {
      fits: element.scrollWidth <= element.clientWidth,
      leadingFits: leading.right < label.left,
      trailingFits: label.right < trailing.left,
      iconWidth: leading.width,
      iconHeight: leading.height,
    };
  });
  expect(bounds.fits).toBe(true);
  expect(bounds.leadingFits).toBe(true);
  expect(bounds.trailingFits).toBe(true);
  expect(bounds.iconWidth).toBeGreaterThan(12);
  expect(bounds.iconWidth).toBe(bounds.iconHeight);
  await sizes.screenshot({ path: test.info().outputPath('button-sizes-mobile.png') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(longButton.locator('.aig-button-frame')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await longButton
      .locator('.aig-button-frame')
      .evaluate((element) => getComputedStyle(element, '::before').display),
  ).toBe('none');
  await expect(longButton.locator('.aig-button-frame')).toHaveCSS('border-style', 'solid');
});
