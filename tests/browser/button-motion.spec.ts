import { expect, test } from '@playwright/test';

test('规则刻面按实际宽高适配，窄屏保留对称三角和一致斜率', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const button = page.locator('#example-reference .aig-button').first();
  const highlight = button.locator('.aig-button-highlight');
  const geometry = () =>
    highlight.evaluate((el) => {
      const svg = el as SVGSVGElement;
      const bounds = svg.getBoundingClientRect();
      const shapes = [...svg.querySelectorAll<SVGPolygonElement>('polygon[data-clipped=false]')].map(
        (polygon) =>
          [...polygon.points].map((point) => ({
            x: (point.x * bounds.width) / 300,
            y: (point.y * bounds.height) / 100,
          })),
      );
      const angles: number[] = [];
      for (const points of shapes)
        points.forEach((point, i) => {
          const next = points[(i + 1) % points.length]!;
          const dx = Math.abs(next.x - point.x),
            dy = Math.abs(next.y - point.y);
          if (dx > 0.01 && dy > 0.01) angles.push((Math.atan2(dy, dx) * 180) / Math.PI);
        });
      const host = svg.closest('button')!;
      const triangle = shapes.find((points) => points.length === 3)!;
      const base = triangle.filter((point) =>
        triangle.some((other) => other !== point && other.y === point.y),
      );
      const pair = shapes.slice(0, 2).flat();
      const xs = pair.filter((point) => point.y === 0).map((point) => point.x);
      const edgeDifference = Math.abs(Math.max(...xs) - Math.min(...xs) - Math.abs(base[1]!.x - base[0]!.x));
      const target =
        (Math.atan2(host.clientHeight, Math.min(host.clientHeight / Math.sqrt(3), host.clientWidth / 8)) *
          180) /
        Math.PI;
      return {
        spread: Math.max(...angles) - Math.min(...angles),
        angle: angles[0]!,
        error: Math.abs(angles[0]! - target),
        width: bounds.width,
        edgeDifference,
      };
    });
  await button.scrollIntoViewIfNeeded();
  await expect(highlight).not.toHaveAttribute('data-playing');
  await expect.poll(async () => (await geometry()).error).toBeLessThan(0.5);
  await expect
    .poll(async () => button.locator('.aig-button-text-mask path').count())
    .toBe(await highlight.locator('polygon').count());
  await expect.poll(async () => (await geometry()).edgeDifference).toBeLessThan(0.01);
  const desktop = await geometry();
  await page.setViewportSize({ width: 360, height: 900 });
  await button.scrollIntoViewIfNeeded();
  await expect.poll(async () => Math.abs((await geometry()).width - desktop.width)).toBeGreaterThan(5);
  await expect.poll(async () => (await geometry()).spread).toBeLessThan(0.01);
  await expect.poll(async () => (await geometry()).edgeDifference).toBeLessThan(0.01);
  await expect.poll(async () => (await geometry()).error).toBeLessThan(0.5);
  await page.setViewportSize({ width: 1280, height: 720 });
  await button.hover();
  await highlight.evaluate((el) => {
    el.getAnimations({ subtree: true }).forEach((animation) => {
      animation.pause();
      animation.currentTime = 440;
    });
    el.setAttribute('data-sample-time', '440');
  });
  const lit = await highlight
    .locator('polygon')
    .evaluateAll((elements) => elements.map((el) => Number(getComputedStyle(el).fillOpacity)));
  expect(lit.some((value) => value === 0)).toBe(true);
  expect(lit.some((value) => value > 0)).toBe(true);
  await button.screenshot({ path: test.info().outputPath('regular-facets-440ms.png'), scale: 'css' });
});

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

test('规则网格逐帧随机拼块，每轮 hover 更新组合并收束为稳定底色', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const primary = page.locator('#example-variants .preview-actions > .aig-button').first();
  const facets = primary.locator('.aig-button-highlight polygon');
  const highlight = primary.locator('.aig-button-highlight');
  const hidden = () =>
    facets.evaluateAll((elements) => elements.every((el) => getComputedStyle(el).fillOpacity === '0'));
  await expect.poll(() => facets.count()).toBeGreaterThan(0);
  await expect(highlight).not.toHaveAttribute('data-playing');
  await expect.poll(hidden).toBe(true);
  const initial = await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('points')));
  expect(initial.length).toBeGreaterThanOrEqual(8);
  await primary.hover();
  await expect(highlight).toHaveAttribute('data-playing', 'interaction');
  const firstGeometry = await facets.evaluateAll((elements) =>
    elements.map((el) => el.getAttribute('points')),
  );
  const firstSequence = await facets.evaluateAll((elements) =>
    elements.map((el) => el.getAttribute('style')),
  );
  expect(firstGeometry).not.toEqual(initial);
  // 实测每个边界的前后值，验证 CSS 读取本轮随机采样表且没有插值拖影。
  const sample = await highlight.evaluate((el) => {
    return [...el.querySelectorAll('polygon')].map((polygon) => {
      const animation = polygon.getAnimations()[0]!;
      animation.pause();
      const values = [
        79, 80, 119, 120, 239, 240, 279, 280, 359, 360, 399, 400, 439, 440, 600, 680, 760, 999,
      ].map((ms) => {
        animation.currentTime = ms;
        return Number(getComputedStyle(polygon).fillOpacity);
      });
      animation.play();
      return {
        clipped: polygon.dataset.clipped === 'true',
        frames: [80, 240, 280, 360, 400, 440, 600].map((time) =>
          Number(polygon.style.getPropertyValue(`--aig-facet-frame-${time}`)),
        ),
        values,
      };
    });
  });
  for (const { values, frames, clipped } of sample) {
    const [preflash, first, full, a, b, c, last] = frames;
    expect(values.slice(0, 15)).toEqual([
      0,
      preflash,
      preflash,
      0,
      0,
      first,
      first,
      full,
      full,
      a,
      a,
      b,
      b,
      c,
      last,
    ]);
    expect(values[15]).toBeCloseTo((last! + 1) / 2, 3);
    expect(values[16]).toBe(1);
    if (clipped) expect([preflash, first, a, b, c, last]).toEqual([0, 0, 0, 0, 0, 0]);
  }
  // 按实际渲染亮度检查轮廓分组，防止三单元梯形或尖端相接的锯齿回归。
  for (const index of [1, 5, 9, 11, 13, 14]) {
    const binary = sample.map(({ values }) => Number(values[index]! > 0)).join('');
    const groups = [...binary.matchAll(/1+/g)];
    expect(groups.length).toBeGreaterThan(0);
    expect(groups.length).toBeLessThanOrEqual(2);
    groups.forEach((group, position) => {
      expect([1, 2]).toContain(group[0].length);
      const previous = groups[position - 1];
      if (previous) expect(group.index - previous.index - previous[0].length).toBeGreaterThanOrEqual(2);
    });
  }
  const sampledCombinations = [5, 7, 9, 11, 13].map((index) =>
    sample.map(({ values }) => values[index]).join(','),
  );
  expect(new Set(sampledCombinations).size).toBe(5);
  await expect(highlight).not.toHaveAttribute('data-playing');
  await expect
    .poll(() =>
      facets.evaluateAll((elements) => elements.map((el) => Number(getComputedStyle(el).fillOpacity))),
    )
    .toEqual(sample.map(() => 1));
  await primary.screenshot({ path: test.info().outputPath('button-facets.png') });
  await page.mouse.move(4, 4);
  await expect.poll(hidden).toBe(true);
  await primary.hover();
  await expect(highlight).toHaveAttribute('data-playing', 'interaction');
  expect(await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('style')))).not.toEqual(
    firstSequence,
  );
  expect(await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('points')))).not.toEqual(
    firstGeometry,
  );
  await expect(highlight).not.toHaveAttribute('data-playing');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(hidden).toBe(false);
  const reducedGeometry = await facets.evaluateAll((elements) =>
    elements.map((el) => el.getAttribute('points')),
  );
  await page.mouse.move(4, 4);
  await primary.hover();
  await expect(highlight).not.toHaveAttribute('data-playing');
  expect(await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('points')))).toEqual(
    reducedGeometry,
  );
});

test('参考菜单同排错峰，只有选中项保持实底，键盘可切换选择', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const demo = page.locator('#example-reference');
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole('button', { name: '重置菜单入场与选中' }).click();
  const buttons = demo.getByRole('group', { name: '菜单入场演示' }).getByRole('button');
  await expect(buttons).toHaveCount(4);
  await expect
    .poll(() =>
      buttons.evaluateAll((elements) =>
        elements.map((el) => getComputedStyle(el).getPropertyValue('--aig-button-enter-delay')),
      ),
    )
    .toEqual(['0ms', '120ms', '240ms', '360ms']);
  await expect(demo.locator('.aig-button-highlight[data-playing]')).toHaveCount(0);
  const fills = () =>
    buttons.evaluateAll((elements) =>
      elements.map((el) =>
        [...el.querySelectorAll('polygon')].some((facet) => Number(getComputedStyle(facet).fillOpacity) > 0),
      ),
    );
  await expect.poll(fills).toEqual([true, false, false, false]);
  await buttons.nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(demo.locator('.aig-button-highlight[data-playing]')).toHaveCount(0);
  await expect.poll(fills).toEqual([false, true, false, false]);
  await demo.screenshot({ path: test.info().outputPath('button-reference.png') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await demo.getByRole('button', { name: '重置菜单入场与选中' }).click();
  await expect(demo.locator('.aig-button-highlight[data-playing]')).toHaveCount(0);
  await expect.poll(fills).toEqual([true, false, false, false]);
});

test('浅字区域与实际闪切刻面同步，未覆盖区域保留深字', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const button = page.locator('#example-variants .preview-actions > .aig-button').first();
  const highlight = button.locator('.aig-button-highlight');
  const overlay = button.locator('.aig-button-contrast');
  const alphas = () =>
    button
      .locator('.aig-button-text-mask path')
      .evaluateAll((elements) => elements.map((el) => Number(el.getAttribute('fill-opacity'))));
  await expect(highlight).not.toHaveAttribute('data-playing', '');
  // 首次打开时等待字体完成排版，避免取样期间按钮移位导致 hover 退出。
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const idle = await button.locator('.aig-button-content').evaluate((el) => getComputedStyle(el).color);
  await button.hover();
  await highlight.evaluate((el) => {
    el.querySelectorAll('polygon').forEach((polygon) =>
      polygon.getAnimations().forEach((animation) => {
        animation.pause();
        animation.currentTime = 0;
      }),
    );
    el.setAttribute('data-sample-time', '0');
  });
  await expect.poll(async () => (await alphas()).every((value) => value === 0)).toBe(true);
  await expect(button.locator('.aig-button-content')).toHaveCSS('color', idle);
  const sample = async (progress: number) => {
    await highlight.evaluate((el, progress) => {
      el.getAnimations({ subtree: true }).forEach((animation) => {
        if (!(animation instanceof CSSAnimation)) return;
        const timing = animation.effect!.getTiming();
        animation.currentTime = Number(timing.delay) + Number(timing.duration) * progress;
      });
      el.setAttribute('data-sample-time', String(progress));
    }, progress);
  };
  await sample(0.09);
  await expect.poll(async () => (await alphas()).some((value) => value > 0 && value < 1)).toBe(true);
  const expectedAlphas = () =>
    highlight
      .locator('polygon')
      .evaluateAll((elements) => elements.map((el) => Number(getComputedStyle(el).fillOpacity)));
  await expect.poll(alphas).toEqual(await expectedAlphas());
  await sample(0.24);
  await expect.poll(async () => (await alphas()).some((value) => value > 0)).toBe(true);
  await expect.poll(alphas).toEqual(await expectedAlphas());
  expect((await alphas()).some((value) => value === 0)).toBe(true);
  await sample(0.12);
  await expect.poll(async () => (await alphas()).every((value) => value === 0)).toBe(true);
  await sample(0.96);
  await expect.poll(async () => (await alphas()).some((value) => value > 0)).toBe(true);
  await highlight.evaluate((el) => {
    el.querySelectorAll('polygon').forEach((polygon) =>
      polygon.getAnimations().forEach((animation) => animation.finish()),
    );
    el.setAttribute('data-sample-time', 'finished');
  });
  await expect
    .poll(() =>
      highlight.evaluate((el) => ({
        hovered: el.hasAttribute('data-hovered'),
        lit: [...el.querySelectorAll('polygon')].filter(
          (polygon) => Number(getComputedStyle(polygon).fillOpacity) > 0,
        ).length,
        clipped: [...el.parentElement!.querySelectorAll('.aig-button-text-mask path')].filter(
          (path) => Number(path.getAttribute('fill-opacity')) > 0,
        ).length,
      })),
    )
    .toEqual({
      hovered: true,
      lit: await highlight.locator('polygon').count(),
      clipped: await highlight.locator('polygon').count(),
    });
  await expect(button).toHaveAccessibleName('开始创作');
  await page.mouse.move(4, 4);
  await expect.poll(async () => (await alphas()).every((value) => value === 0)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.hover();
  await expect.poll(async () => (await alphas()).some((value) => value > 0)).toBe(true);
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(overlay).toHaveCSS('display', 'none');
});

test('悬停、按压、选中与加载分别使用对应反馈', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  // 本用例观察按钮状态，滚动定位即时完成，保持指针停在目标上。
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const matrix = page.locator('#example-states');
  const primary = matrix.locator('.aig-button[data-variant=primary]:enabled').first();
  const frame = primary.locator('.aig-button-frame');
  const edgeDifference = () =>
    primary.evaluate((el) => {
      const frame = el.querySelector('.aig-button-frame')!.getBoundingClientRect();
      const facets = el.querySelector('.aig-button-highlight')!.getBoundingClientRect();
      return Math.max(
        ...(['left', 'top', 'right', 'bottom'] as const).map((edge) => Math.abs(frame[edge] - facets[edge])),
      );
    });
  const indicator = () =>
    primary.evaluate((el) => getComputedStyle(el.querySelector('.aig-button-content')!, '::before').opacity);
  await expect(primary.locator('.aig-button-highlight')).not.toHaveAttribute('data-playing');
  await expect(frame).toHaveCSS('animation-name', 'none');
  expect(await indicator()).toBe('0');
  await primary.hover();
  await expect(frame).toHaveCSS('animation-name', 'aig-button-scan');
  await expect(frame).toHaveCSS('inset', '-1px');
  await expect.poll(edgeDifference).toBeLessThan(0.1);
  /* 悬停时左侧的固定三角指示点亮，与选中态共用同一个标记位。 */
  expect(await indicator()).toBe('1');
  await page.mouse.down();
  await expect(frame).toHaveCSS('inset', '1px');
  await expect.poll(edgeDifference).toBeLessThan(0.1);
  await page.mouse.up();
  await expect(frame).toHaveCSS('inset', '-1px');
  await expect.poll(edgeDifference).toBeLessThan(0.1);

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
  await expect(icon.locator('.aig-button-frame')).toHaveCSS('border-style', 'solid');
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
