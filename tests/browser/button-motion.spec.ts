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
      const band = svg.querySelector<SVGPolygonElement>('polygon[data-facet-kind=parallelogram]')!;
      const pair = [...band.points].map((point) => ({
        x: (point.x * bounds.width) / 300,
        y: (point.y * bounds.height) / 100,
      }));
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

test('梯形内部不闪切，独立块首次 hover 随机闪切，后续 hover 和键盘聚焦直接高亮', async ({ page }) => {
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
  expect(initial.length).toBeGreaterThanOrEqual(5);
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
        group: polygon.dataset.facetGroup,
        kind: polygon.dataset.facetKind,
        cells: Number(polygon.dataset.facetCells),
        stroke: getComputedStyle(polygon).stroke,
        frames: [80, 240, 280, 360, 400, 440, 600].map((time) =>
          Number(polygon.style.getPropertyValue(`--aig-facet-frame-${time}`)),
        ),
        values,
      };
    });
  });
  for (const { values, frames, kind, stroke } of sample) {
    expect(stroke).toBe('none');
    if (kind === 'trapezoid' || kind === 'edge') {
      expect(values.slice(0, 4)).toEqual([0, 0, 0, 0]);
      expect(values[5]).toBeCloseTo(0.75, 3);
      expect(values.slice(7)).toEqual(Array(11).fill(1));
      continue;
    }
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
  }
  const trapezoid = sample.filter(({ kind }) => kind === 'trapezoid');
  expect(trapezoid).toHaveLength(1);
  expect(trapezoid[0]!.cells).toBe(3);
  expect(new Set(trapezoid.map(({ group }) => group)).size).toBe(1);
  sample.forEach((facet) => {
    expect(facet.values).toEqual(sample.find((other) => other.group === facet.group)!.values);
  });
  // 只检查独立块的随机采样，梯形主体始终完整保留。
  for (const index of [1, 5, 9, 11, 13, 14]) {
    const binary = sample
      .map(({ values, kind, cells }) =>
        String(Number(kind !== 'trapezoid' && kind !== 'edge' && values[index]! > 0)).repeat(cells),
      )
      .join('');
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
  expect(new Set(sampledCombinations).size).toBeGreaterThan(2);
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
  await expect(highlight).not.toHaveAttribute('data-playing');
  await expect.poll(hidden).toBe(false);
  expect(await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('style')))).toEqual(
    firstSequence,
  );
  expect(await facets.evaluateAll((elements) => elements.map((el) => el.getAttribute('points')))).toEqual(
    firstGeometry,
  );
  await expect(highlight).not.toHaveAttribute('data-playing');
  await page.mouse.move(4, 4);
  await primary.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(primary).toBeFocused();
  await expect(highlight).toHaveAttribute('data-hovered');
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

test('中间帧的满亮和半透明拼接不产生浅色接缝，文字遮罩保持相同覆盖率', async ({ browser }) => {
  for (const deviceScaleFactor of [1, 2]) {
    const page = await browser.newPage({ deviceScaleFactor, viewport: { width: 1280, height: 900 } });
    try {
      await page.goto('http://127.0.0.1:5173/?component=Button');
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      await page.addStyleTag({
        content: `
        html { scroll-behavior: auto !important; }
        #example-reference .aig-button { width: 200.75px; }
        #example-reference :is(.aig-button-frame, .aig-button-content,
          .aig-button-contrast-content, .aig-button-contrast-frame) { visibility: hidden; }
      `,
      });
      const demo = page.locator('#example-reference');
      await demo.scrollIntoViewIfNeeded();
      await demo.getByRole('button', { name: '重置菜单入场与选中' }).click();
      // 非选中项的真实入场：280ms 全亮，880ms 整面淡出到半透明。
      const button = demo.getByRole('group', { name: '菜单入场演示' }).getByRole('button').nth(1);
      const highlight = button.locator('.aig-button-highlight');
      // 截图前完成定位并移开指针，避免截图滚动触发 hover，替换正在采样的入场动画。
      await page.mouse.move(0, 0);
      await button.scrollIntoViewIfNeeded();
      await expect(highlight).toHaveAttribute('data-playing', 'entrance');
      for (const time of [280, 880]) {
        await highlight.evaluate(async (el, time) => {
          el.getAnimations({ subtree: true }).forEach((animation) => {
            animation.pause();
            animation.currentTime = Number(animation.effect!.getTiming().delay) + time;
          });
          el.setAttribute('data-sample-time', String(time));
          await new Promise(requestAnimationFrame);
          await new Promise(requestAnimationFrame);
        }, time);
        for (const surface of ['fill', 'mask']) {
          // 给浅字层临时加整面颜色，直接观察真实文字遮罩的接缝。
          await button.locator('.aig-button-contrast').evaluate((el, surface) => {
            (el as HTMLElement).style.background = surface === 'mask' ? 'rgb(20, 80, 180)' : 'transparent';
          }, surface);
          const screenshot = await button.screenshot({
            path: test.info().outputPath(`button-seams-${deviceScaleFactor}x-${time}-${surface}.png`),
            animations: 'allow',
          });
          const spread = await page.evaluate(async (base64) => {
            const image = new Image();
            image.src = `data:image/png;base64,${base64}`;
            await image.decode();
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d')!;
            context.drawImage(image, 0, 0);
            const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
            const minimum = [255, 255, 255],
              maximum = [0, 0, 0];
            // 排除外围框线，只检查穿过全部内部斜边的中央区域。
            for (let y = Math.ceil(height * 0.3); y < height * 0.7; y++)
              for (let x = Math.ceil(width * 0.05); x < width * 0.95; x++)
                for (let channel = 0; channel < 3; channel++) {
                  const value = data[(y * width + x) * 4 + channel]!;
                  minimum[channel] = Math.min(minimum[channel]!, value);
                  maximum[channel] = Math.max(maximum[channel]!, value);
                }
            return Math.max(...maximum.map((value, channel) => value - minimum[channel]!));
          }, screenshot.toString('base64'));
          expect(spread, `${deviceScaleFactor}x / ${time}ms / ${surface}`).toBeLessThanOrEqual(3);
        }
      }
    } finally {
      await page.close();
    }
  }
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
  await expect(primary.locator('.aig-button-frame .aig-button-line').first()).toHaveCSS(
    'animation-name',
    'aig-button-perimeter',
  );
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

  const busy = matrix.locator('.aig-button[aria-busy="true"]').first();
  await expect(busy.locator('.aig-button-frame .aig-button-line')).toHaveCount(0);
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
  const icons = page.locator('#example-icons');
  const icon = icons.locator('.aig-icon-button');
  await expect(icon.locator('.aig-button-frame')).toHaveCSS('border-style', 'solid');
  expect(await icon.evaluate((element) => element.clientWidth === element.clientHeight)).toBe(true);

  await page.setViewportSize({ width: 360, height: 900 });
  const longButton = icons.locator('.aig-button').filter({ has: page.locator('[data-slot=trailing]') });
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
  await icons.screenshot({ path: test.info().outputPath('button-icons-mobile.png') });
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

test('边线默认隐藏，hover 绕行闭环连续且减少动态时停止', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  const button = page.locator('#example-variants .preview-actions > .aig-button').first();
  const lines = button.locator('.aig-button-frame .aig-button-line');
  await expect(lines).toHaveCount(0);
  await expect(button.locator('.aig-button-frame .aig-button-perimeter')).toBeHidden();
  expect(await lines.evaluateAll((elements) => elements.flatMap((el) => el.getAnimations()).length)).toBe(0);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await button.hover();
  await expect(button.locator('.aig-button-frame .aig-button-perimeter')).toBeVisible();
  await expect(lines).toHaveCount(3);
  const sample = async (time: number) =>
    lines.evaluateAll(
      (elements, time) =>
        elements.map((el) => {
          const animation = el.getAnimations()[0]!;
          animation.pause();
          animation.currentTime = time;
          const style = getComputedStyle(el);
          return {
            offset: parseFloat(style.strokeDashoffset),
            duration: style.animationDuration,
            iterations: style.animationIterationCount,
            width: el.getBoundingClientRect().width,
            height: el.getBoundingClientRect().height,
          };
        }),
      time,
    );
  const start = await sample(0);
  const middle = await sample(24000);
  const end = await sample(48000);
  start.forEach((line, index) => {
    expect(line.duration).toBe('48s');
    expect(line.iterations).toBe('infinite');
    expect(line.width).toBeGreaterThan(20);
    expect(line.height).toBeGreaterThan(20);
    expect(middle[index]!.offset).toBeCloseTo(line.offset - 50);
    expect(end[index]!.offset).toBeCloseTo(line.offset);
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const line of await lines.all()) await expect(line).toHaveCSS('animation-name', 'none');
});

test('三个等距亮头带渐隐尾迹加速绕行，高速连成光边并在离开后恢复', async ({ page }) => {
  test.setTimeout(45000);
  await page.goto('http://127.0.0.1:5173/?component=Button');
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  const button = page.locator('#example-variants .preview-actions > .aig-button').first();
  await button.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.install();
  const lengths = () =>
    button
      .locator('.aig-button-frame .aig-button-line')
      .evaluateAll((lines) => lines.map((line) => parseFloat(getComputedStyle(line).strokeDasharray)));
  expect(await lengths()).toEqual([]);
  await button.hover();
  await page.mouse.move(0, 0);
  await page.clock.runFor(100);
  const initial = await lengths();
  expect(initial).toEqual([3, 3, 3]);
  const rate = () =>
    button
      .locator('.aig-button-frame .aig-button-line')
      .first()
      .evaluate((line) => line.getAnimations()[0]?.playbackRate ?? 1);
  const light = () =>
    button
      .locator('.aig-button-frame .aig-button-line')
      .first()
      .evaluate((line) => {
        const style = getComputedStyle(line);
        return { opacity: Number(style.opacity), filter: style.filter };
      });
  const idleLight = await light();
  expect(idleLight.opacity).toBeCloseTo(0.08);
  expect(await rate()).toBe(1);
  await button.hover();
  await page.clock.runFor(300);
  expect(await rate()).toBeGreaterThan(1.1);
  expect(await rate()).toBeLessThan(3);
  await page.clock.runFor(700);
  const firstRate = await rate();
  expect(firstRate).toBeGreaterThan(1.5);
  await page.clock.runFor(2000);
  const laterRate = await rate();
  const laterLight = await light();
  expect(laterRate).toBeGreaterThan(3);
  await page.clock.runFor(3000);
  const fastestRate = await rate();
  await expect(button.locator('.aig-button-frame .aig-button-line').first()).toHaveCSS(
    'stroke-width',
    '0.55px',
  );
  const coreBounds = await button
    .locator('.aig-button-contrast-frame .aig-button-line')
    .first()
    .evaluate((line) => {
      const bounds = line.getBoundingClientRect();
      const clip = line.closest('.aig-button-contrast')!.getBoundingClientRect();
      return {
        left: bounds.left - clip.left,
        top: bounds.top - clip.top,
        right: clip.right - bounds.right,
        bottom: clip.bottom - bounds.bottom,
      };
    });
  Object.values(coreBounds).forEach((inset) => expect(inset).toBeGreaterThanOrEqual(0.9));
  expect(fastestRate).toBeGreaterThan(laterRate);
  const fastLight = await light();
  expect(laterLight.opacity).toBeGreaterThan(idleLight.opacity);
  // 加速提高后，第 6 秒已开始融合：移动线段变淡，完整光边逐渐显现。
  expect(fastLight.opacity).toBeLessThan(laterLight.opacity);
  expect(fastLight.opacity).toBeLessThanOrEqual(0.32);
  expect(
    await button
      .locator('.aig-button-frame .aig-button-ring')
      .evaluate((el) => Number(getComputedStyle(el).opacity)),
  ).toBeGreaterThan(0);
  expect(fastLight.filter).toContain('drop-shadow');
  expect(fastLight.filter).not.toBe(idleLight.filter);
  const trail = button.locator('.aig-button-frame .aig-button-line').first();
  await expect(trail.locator('.aig-button-tail')).toHaveCount(16);
  const profile = await trail.locator('rect').evaluateAll((elements) =>
    elements.map((el) => {
      const style = getComputedStyle(el);
      return {
        width: parseFloat(style.strokeWidth),
        opacity: Number(style.strokeOpacity),
        dash: style.strokeDasharray,
      };
    }),
  );
  expect(profile[0]!.width).toBeLessThan(profile[15]!.width);
  expect(profile[0]!.opacity).toBeLessThan(profile[16]!.opacity);
  expect(parseFloat(profile[16]!.dash)).toBeCloseTo(1.2);
  const midwayBounds = (await button.boundingBox())!;
  await page.screenshot({
    path: test.info().outputPath('button-trail-midway.png'),
    animations: 'allow',
    clip: {
      x: midwayBounds.x - 12,
      y: midwayBounds.y - 12,
      width: midwayBounds.width + 24,
      height: midwayBounds.height + 24,
    },
  });
  const growingLengths = await lengths();
  growingLengths.forEach((length) => expect(length).toBeGreaterThan(3));
  await page.clock.runFor(1000);
  // 7 秒时仍保留间隔，约 8 秒融合成完整光边。
  (await lengths()).forEach((length) => expect(length).toBeLessThan(100 / 3));
  await page.clock.runFor(6000);
  (await lengths()).forEach((length) => expect(length).toBeCloseTo(100 / 3, 3));
  await expect(button.locator('.aig-button-heat')).toHaveCSS('opacity', '1');
  await expect(trail).toHaveCSS('opacity', '0');
  const ring = button.locator('.aig-button-frame .aig-button-ring');
  await expect(ring).toHaveCSS('stroke-dasharray', 'none');
  await expect(ring).toHaveCSS('animation-name', 'none');
  await expect(ring).toHaveCSS('opacity', '0.32');
  const phases = await button
    .locator('.aig-button-frame .aig-button-line')
    .evaluateAll((lines) => lines.map((line) => parseFloat(getComputedStyle(line).strokeDashoffset)));
  expect(phases[0]! - phases[1]!).toBeCloseTo(100 / 3, 3);
  expect(phases[1]! - phases[2]!).toBeCloseTo(100 / 3, 3);
  const beforeLeaveRate = await rate();
  const bounds = (await button.boundingBox())!;
  await page.screenshot({
    path: test.info().outputPath('button-speed-glow.png'),
    animations: 'allow',
    clip: { x: bounds.x - 12, y: bounds.y - 12, width: bounds.width + 24, height: bounds.height + 24 },
  });
  const rates = await button
    .locator('.aig-button-line')
    .evaluateAll((lines) => lines.map((line) => line.getAnimations()[0]!.playbackRate));
  expect(rates).toEqual(Array(6).fill(rates[0]));
  await page.mouse.move(0, 0);
  await page.clock.runFor(300);
  expect(await rate()).toBeLessThan(beforeLeaveRate);
  expect(await rate()).toBeGreaterThan(1);
  await page.clock.runFor(1700);
  expect(await rate()).toBeGreaterThan(1);
  (await lengths()).forEach((length) => {
    expect(length).toBeGreaterThan(3);
    expect(length).toBeLessThan(100 / 3);
  });
  await page.clock.runFor(1100);
  expect(await rate()).toBe(1);
  expect(await lengths()).toEqual(initial);
  expect((await light()).opacity).toBeCloseTo(idleLight.opacity);
  expect((await light()).filter).toBe(idleLight.filter);
  await expect(button.locator('.aig-button-frame .aig-button-perimeter')).toBeHidden();
  expect(
    await button
      .locator('.aig-button-line')
      .evaluateAll((lines) => lines.flatMap((line) => line.getAnimations()).length),
  ).toBe(0);
});

test('边线完全收回后再次进入沿用停止位置，浅色副本同步恢复', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  const button = page.locator('#example-variants .preview-actions > .aig-button').first();
  await button.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.clock.install();
  await button.hover();
  await page.clock.runFor(1000);
  await page.mouse.move(0, 0);
  await page.clock.runFor(2000);
  // 固定收回末帧的位置，确认隐藏后不会回到 CSS 动画起点。
  await button.locator('.aig-button-line').evaluateAll((lines) =>
    lines.forEach((line) => {
      const animation = line.getAnimations()[0]!;
      animation.pause();
      animation.currentTime = 12345;
    }),
  );
  await page.clock.runFor(1100);
  await expect(button).not.toHaveAttribute('data-perimeter-visible');
  await button.hover();
  const times = await button
    .locator('.aig-button-line')
    .evaluateAll((lines) => lines.map((line) => Number(line.getAnimations()[0]!.currentTime)));
  expect(times).toHaveLength(6);
  times.forEach((time) => expect(Math.abs(time - 12345)).toBeLessThan(500));
  expect(Math.max(...times) - Math.min(...times)).toBeLessThan(1);
});

test('无填充按钮保留珍珠白反馈和原色文字，燃烧跟随语义色', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Button');
  for (const variant of ['outline', 'ghost']) {
    const button = page
      .locator(`#example-variants .preview-actions > .aig-button[data-variant=${variant}]`)
      .first();
    await button.hover();
    if (variant === 'ghost') {
      await expect(button.locator('.aig-button-frame')).toHaveCSS('background-image', 'none');
      await button.evaluate((el) => el.setAttribute('aria-pressed', 'true'));
      await expect(button).toHaveCSS('box-shadow', 'none');
    }
    await expect(button.locator('.aig-button-contrast')).toBeHidden();
    await expect(button.locator('.aig-button-heat')).toBeHidden();
    await expect(button.locator('.aig-button-highlight')).not.toHaveAttribute('data-playing');
    for (const tone of ['brand', 'success', 'danger']) {
      await button.evaluate((el, tone) => el.setAttribute('data-tone', tone), tone);
      await expect(button.locator('.aig-button-highlight')).toHaveCSS('fill', 'rgb(245, 243, 238)');
      await expect(button.locator('.aig-button-highlight polygon').first()).toHaveCSS('fill-opacity', '1');
    }
    await button.screenshot({ path: test.info().outputPath(`pearl-${variant}.png`), scale: 'css' });
  }
  const button = page.locator('#example-variants .preview-actions > .aig-button').first();
  await button.hover();
  const colors = [];
  for (const tone of ['success', 'danger', 'info']) {
    await button.evaluate((el, tone) => el.setAttribute('data-tone', tone), tone);
    colors.push(
      await button.locator('.aig-button-heat').evaluate((el) => getComputedStyle(el).backgroundImage),
    );
    expect(
      await button
        .locator('.aig-button-line')
        .first()
        .evaluate((el) => {
          const style = getComputedStyle(el);
          return (
            style.getPropertyValue('--aig-line-heat-color').trim() ===
            style.getPropertyValue('--aig-button-facet').trim()
          );
        }),
    ).toBe(true);
  }
  expect(new Set(colors).size).toBe(3);
});
