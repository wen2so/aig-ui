import { test, expect } from '@playwright/test';

test('全部组件与页面在品牌环境和窄屏保持可见，记录迁移样张', async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:5173/');
  const cards = page.locator('.catalog-card');
  await expect(cards).toHaveCount(55);
  const links = await cards.evaluateAll((els) =>
    els.map((el) => el.querySelector('.catalog-card-caption')!.getAttribute('href')!),
  );
  for (const link of links) {
    const url = new URL(link, 'http://127.0.0.1:5173/');
    const component = url.searchParams.get('component')!;
    await page.goto(url.href);
    const section = page.locator('.preview-section');
    await expect(section).toBeVisible();
    await expect(section).toHaveAttribute('id', component);
    await expect(page.locator('.example-card').first()).toBeVisible();
    await section.screenshot({
      path: `artifacts/design-review/${component}.png`,
    });
  }
  await page.goto('http://127.0.0.1:5173/');
  for (const width of [320, 360, 390, 667, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: width === 667 ? 375 : 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `视口 ${width}`,
    ).toBe(true);
  }
});

test('共享玻璃与显式实色通过公共样式继承，强制颜色保留边界', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Card');
  const glass = page.locator('.aig-card').first();
  await expect(glass).toHaveCSS('backdrop-filter', 'blur(46px) saturate(1.55)');
  expect(await glass.evaluate((el) => getComputedStyle(el).boxShadow.split('rgb').length - 1)).toBe(6);
  await glass.evaluate((el) => el.setAttribute('data-material', 'solid'));
  await expect(glass).toHaveCSS('backdrop-filter', 'none');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(glass).toHaveCSS('box-shadow', 'none');
});
