import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
for (const count of [50, 200])
  test(`测量 ${count} 个静止按钮与首次交互`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:5173/button-performance.html?count=${count}`);
    const buttons = page.locator('.aig-button');
    await expect(buttons).toHaveCount(count);
    await page.waitForTimeout(200);
    const before = await page.evaluate(() => ({
      mountMs: Number(document.body.dataset.mountMs),
      descendants: document.querySelectorAll('.aig-button *').length,
      rectangles: document.querySelectorAll('.aig-button rect').length,
    }));
    const started = performance.now();
    await buttons.first().hover();
    await expect(buttons.first()).toHaveAttribute('data-perimeter-visible', '');
    const interactionMs = performance.now() - started;
    const scrollMs = await page.evaluate(async () => {
      const start = performance.now();
      for (let i = 0; i < 30; i++) {
        scrollBy(0, 100);
        await new Promise(requestAnimationFrame);
      }
      return performance.now() - start;
    });
    mkdirSync('artifacts/performance', { recursive: true });
    writeFileSync(
      `artifacts/performance/buttons-${count}-${process.env.AIG_BENCHMARK_LABEL ?? 'current'}.json`,
      JSON.stringify({ count, ...before, interactionMs, scrollMs }, null, 2),
    );
  });
