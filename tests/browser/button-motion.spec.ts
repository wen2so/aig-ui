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

test('悬停时三角刻面随机分配明度并闪切组装，静止与移出后全部收回', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  // 本用例按 hover 取样，滚动定位即时完成，保持指针停在目标上。
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const variants = page.locator('#example-variants');
  await variants.getByRole('button', { name: '重置操作层级', exact: true }).click();
  const primary = variants.locator('.preview-actions > .aig-button').first();
  const facets = primary.locator('.aig-button-highlight polygon');
  const opacities = () =>
    facets.evaluateAll((elements) => elements.map((el) => Number(getComputedStyle(el).fillOpacity)));

  /* 静止态：按钮表面没有三角结构 */
  expect(await opacities()).toEqual(Array(8).fill(0));

  /* 每块都是三角面，拼合后铺满整个按钮 */
  const shapes = await facets.evaluateAll((elements) =>
    elements.map((el) => (el as SVGPolygonElement).getAttribute('points')!.trim().split(/\s+/).length),
  );
  expect(shapes).toEqual(Array(8).fill(3));

  await primary.hover();
  /* 闪切期间每块都会经过暗淡的一段，等待条件要看是否停在各自的明度上，而不是"大于零"。 */
  const stable = () =>
    facets.evaluateAll((elements) =>
      elements.map((el) => {
        const style = getComputedStyle(el);
        return {
          depth: Number(style.getPropertyValue('--aig-facet-depth')),
          opacity: Number(style.fillOpacity),
        };
      }),
    );
  await expect
    .poll(async () => (await stable()).every((facet) => Math.abs(facet.opacity - facet.depth) < 0.01))
    .toBe(true);

  /* 明度随机分配：至少三档形成层次，整轮覆盖足够的深浅跨度 */
  const settled = (await stable()).map((facet) => facet.opacity);
  expect(new Set(settled).size).toBeGreaterThanOrEqual(3);
  expect(Math.max(...settled)).toBeLessThan(0.75);
  expect(Math.min(...settled)).toBeGreaterThan(0.25);
  expect(Math.max(...settled) - Math.min(...settled)).toBeGreaterThanOrEqual(0.22);

  /* 每块闪三下再稳定；明度同时决定时机，越深的刻面出现越早 */
  const plan = await facets.evaluateAll((elements) =>
    elements.map((el) => {
      const style = getComputedStyle(el);
      const frames = (el.getAnimations()[0]?.effect as KeyframeEffect)?.getKeyframes() ?? [];
      return {
        depth: Number(style.getPropertyValue('--aig-facet-depth')),
        delay: Number.parseFloat(style.animationDelay),
        frames: frames.length,
      };
    }),
  );
  expect(plan.every((facet) => facet.frames >= 6 && facet.delay >= 0)).toBe(true);
  const deepestFirst = [...plan].sort((a, b) => b.depth - a.depth);
  for (let index = 1; index < deepestFirst.length; index++) {
    expect(deepestFirst[index]!.delay).toBeGreaterThanOrEqual(deepestFirst[index - 1]!.delay);
  }

  /* 悬停同时点亮左侧的固定三角指示，文字保持清晰 */
  await expect
    .poll(() =>
      primary.evaluate(
        (el) => getComputedStyle(el.querySelector('.aig-button-content')!, '::before').opacity,
      ),
    )
    .toBe('1');
  expect(
    await primary.evaluate((el) => getComputedStyle(el.querySelector('.aig-button-content')!).opacity),
  ).toBe('1');
  await variants.screenshot({ path: test.info().outputPath('button-hover-facets.png') });

  /* 再次悬停会换一套明度分配 */
  await page.mouse.move(4, 4);
  await expect.poll(async () => (await opacities()).every((value) => value === 0)).toBe(true);
  await primary.hover();
  await expect
    .poll(async () => (await stable()).every((facet) => Math.abs(facet.opacity - facet.depth) < 0.01))
    .toBe(true);
  expect((await stable()).map((facet) => facet.opacity)).not.toEqual(settled);

  /* 移出：全部收回 */
  await page.mouse.move(4, 4);
  await expect.poll(async () => (await opacities()).every((value) => value === 0)).toBe(true);

  /* 减少动态效果时直接给出稳定形态，不经过组装 */
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await primary.hover();
  await expect.poll(async () => (await opacities()).every((value) => value > 0)).toBe(true);
  await page.mouse.move(4, 4);
  await expect.poll(async () => (await opacities()).every((value) => value === 0)).toBe(true);
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
  await expect(busy.locator('.aig-button-highlight polygon').first()).toHaveCSS('fill-opacity', '0');
  const disabled = matrix.locator('.aig-button:disabled:not([aria-busy])').first();
  await expect(disabled.locator('.aig-button-highlight polygon').first()).toHaveCSS('fill-opacity', '0');
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
