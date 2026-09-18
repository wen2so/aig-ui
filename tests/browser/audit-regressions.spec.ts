import { groups } from '../../apps/preview/src/component-groups.js';
const catalogCount = groups.reduce((count, group) => count + group.names.split(' ').length, 0);
import { test, expect } from '@playwright/test';

for (const [component, trigger, popup] of [
  ['Select', '项目状态', '.aig-select-popup'],
  ['Combobox', '查找项目成员', '.aig-combobox-popup'],
  ['DropdownMenu', '更多操作', '.aig-menu'],
  ['Tooltip', '保存草稿', '.aig-tooltip'],
] as const)
  test(`${component} 浮层读取主题字体`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:5173/?component=${component}`);
    const control = page.getByRole(
      component === 'Select' || component === 'Combobox' ? 'combobox' : 'button',
      { name: trigger, exact: true },
    );
    await expect(control).toBeVisible();
    await page
      .locator('[data-aig-theme]')
      .first()
      .evaluate((element) => (element as HTMLElement).style.setProperty('--aig-font-family', 'monospace'));
    if (component === 'Tooltip') {
      await page.keyboard.press('Tab');
      await control.focus();
    } else if (component === 'Combobox') await control.fill('周');
    else await control.click();
    await expect(page.locator(popup)).toBeVisible();
    await expect(page.locator(popup)).toHaveCSS('font-family', 'monospace');
  });

test('目录不请求示例资料，组件直达只请求对应 Story 与 API', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(decodeURIComponent(request.url())));
  await page.goto('http://127.0.0.1:5173/');
  await expect(page.locator('.catalog-card')).toHaveCount(catalogCount);
  expect(requests.filter((url) => /\.stories\.|README\.md|component-api\//.test(url))).toEqual([]);
  await page.goto('http://127.0.0.1:5173/?component=Icon');
  await expect(page.locator('.example-card').first()).toBeVisible();
  await expect(page.locator('#api')).toContainText('LucideIcon');
  expect(requests.some((url) => url.includes('icon.stories'))).toBe(true);
  expect(
    requests.some((url) => url.includes('button.stories') || url.includes('component-api/components/button')),
  ).toBe(false);
});
