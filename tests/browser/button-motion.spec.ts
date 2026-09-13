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

test('三角切片入场与每次悬停时重播，完成后保持文字与边框清晰', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  const variants = page.locator('#example-variants');
  await variants.getByRole('button', { name: '重置操作层级', exact: true }).click();
  const buttons = variants.locator('.preview-actions > .aig-button');
  const sample = await buttons.evaluateAll((elements) => {
    const slices = elements.flatMap((el) => Array.from(el.querySelectorAll('.aig-button-enter polygon')));
    const animations = slices.map((el) => el.getAnimations()[0]!);
    animations.forEach((animation) => animation.pause());
    const frames = [0, 96, 180, 360, 600].map((time) => {
      animations.forEach((animation) => {
        animation.currentTime = time;
      });
      return slices.map((el) => Number(getComputedStyle(el).opacity));
    });
    animations.forEach((animation) => animation.finish());
    return {
      frames,
      selectedCounts: elements.map(
        (el) =>
          Array.from(el.querySelectorAll('.aig-button-enter polygon')).filter((slice) =>
            (slice.getAnimations()[0]!.effect as KeyframeEffect)
              .getKeyframes()
              .some((frame) => Number(frame.opacity) === 1),
          ).length,
      ),
      singleFlash: animations.every(
        (animation) =>
          (animation.effect as KeyframeEffect).getKeyframes().filter((frame) => Number(frame.opacity) === 1)
            .length <= 1,
      ),
      textVisible: elements.every(
        (el) => getComputedStyle(el.querySelector('.aig-button-content')!).opacity === '1',
      ),
      contained: elements.every((el) => {
        const frame = el.querySelector('.aig-button-frame')!.getBoundingClientRect();
        const art = el.querySelector('.aig-button-enter')!.getBoundingClientRect();
        return art.width === frame.width && art.height === frame.height;
      }),
    };
  });
  expect(sample.frames[0]!.every((opacity) => opacity === 0)).toBe(true);
  expect(sample.frames.flat().every((opacity) => opacity === 0 || opacity === 1)).toBe(true);
  expect(sample.selectedCounts.every((count) => count >= 1 && count <= 2)).toBe(true);
  expect(sample.singleFlash).toBe(true);
  expect(sample.frames[3]!.every((opacity) => opacity === 0)).toBe(true);
  expect(sample.frames[4]!.every((opacity) => opacity === 0)).toBe(true);
  expect(sample.textVisible).toBe(true);
  expect(sample.contained).toBe(true);

  for (const time of [96, 360, 600]) {
    await buttons.locator('.aig-button-enter polygon').evaluateAll((elements, currentTime) => {
      elements.forEach((el) => {
        const animation = el.getAnimations()[0]!;
        animation.pause();
        animation.currentTime = currentTime;
      });
    }, time);
    await variants.screenshot({ path: test.info().outputPath(`button-entry-${time}ms.png`) });
  }
  await buttons.locator('.aig-button-enter polygon').evaluateAll((elements) => {
    elements.forEach((el) => el.getAnimations()[0]!.finish());
  });

  const primary = buttons.first();
  const settled = () =>
    primary
      .locator('.aig-button-enter polygon')
      .evaluateAll((elements) =>
        elements.every(
          (el) => getComputedStyle(el).opacity === '0' && el.getAnimations()[0]?.playState === 'finished',
        ),
      );
  for (let replay = 0; replay < 2; replay++) {
    await page.mouse.move(0, 0);
    expect(await settled()).toBe(true);
    await primary.hover();
    expect(await settled()).toBe(false);
    await expect
      .poll(
        () =>
          primary
            .locator('.aig-button-enter polygon')
            .evaluateAll((elements) => elements.some((el) => getComputedStyle(el).opacity === '1')),
        { intervals: [16, 32] },
      )
      .toBe(true);
    await expect.poll(settled).toBe(true);
  }
  await page.mouse.down();
  expect(await settled()).toBe(true);
  await page.mouse.up();
  await primary.focus();
  await primary.press('Enter');
  expect(await settled()).toBe(true);

  // 环境暂停和系统减少动态效果均直接展示稳定形态。
  await page.getByRole('button', { name: '全局主题', exact: true }).click();
  await page.getByRole('button', { name: '暂停环境动效', exact: true }).click();
  await page.getByRole('button', { name: '完成设置', exact: true }).click();
  await variants.getByRole('button', { name: '重置操作层级', exact: true }).click();
  await expect(primary.locator('.aig-button-enter')).toHaveCSS('visibility', 'hidden');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(primary.locator('.aig-button-enter polygon').first()).toHaveCSS('animation-name', 'none');
  await expect(primary.locator('.aig-button-enter polygon').first()).toHaveCSS('opacity', '0');
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
  expect(await indicator()).toBe('0');
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
  await expect(busy.locator('.aig-button-enter')).toHaveCSS('visibility', 'hidden');
  const disabled = matrix.locator('.aig-button:disabled:not([aria-busy])').first();
  await expect(disabled.locator('.aig-button-enter')).toHaveCSS('visibility', 'hidden');
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
  await expect(button.locator('.aig-button-enter polygon').first()).toHaveCSS('opacity', '0');
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
