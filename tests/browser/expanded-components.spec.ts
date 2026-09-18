import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const names = [
  'Flex',
  'Space',
  'Grid',
  'Layout',
  'Splitter',
  'Steps',
  'Anchor',
  'InputNumber',
  'DatePicker',
  'TimePicker',
  'Slider',
  'Upload',
  'Tree',
  'TreeSelect',
  'Cascader',
  'Avatar',
  'Statistic',
  'Timeline',
  'Segmented',
  'Image',
  'Popconfirm',
];

test('目录视图切换和新增控件在窄屏可达，交互语义通过 axe', async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('http://127.0.0.1:5173/');
  await page.getByRole('button', { name: '列表视图' }).click();
  await expect(page.locator('.catalog-grid').first()).toHaveAttribute('data-view', 'list');
  await page.getByLabel('查找组件').fill('Splitter');
  await page.getByRole('link', { name: '分隔面板 Splitter', exact: true }).click();
  await expect(page.getByRole('separator', { name: '资料目录宽度' })).toBeVisible();
  for (const name of names) {
    await page.goto(`http://127.0.0.1:5173/?component=${name}`);
    await expect(page.locator('.example-card').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name).toBe(true);
    expect((await new AxeBuilder({ page }).include('.preview-section').analyze()).violations, name).toEqual(
      [],
    );
  }
  await page.screenshot({ path: 'artifacts/preview-redesign/popconfirm-mobile.png', fullPage: true });
});

test('新增控件均有实际示例、API 与独立导入入口', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const name of names) {
    await page.goto(`http://127.0.0.1:5173/?component=${name}`);
    await expect(page.locator('.example-card').first()).toBeVisible();
    await expect(page.locator('#api')).toContainText(name);
    await expect(page.locator('.import-bar')).toContainText(`import { ${name} }`);
  }
  expect(errors).toEqual([]);
});

test('输入值、滑块与分隔面板支持真实键盘操作', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=InputNumber');
  await page.getByRole('spinbutton', { name: '份数' }).fill('21');
  expect(
    await page
      .getByRole('spinbutton')
      .evaluate((input) => (input as HTMLInputElement).validity.rangeOverflow),
  ).toBe(true);
  await page.goto('http://127.0.0.1:5173/?component=DatePicker');
  await page.getByLabel('交付日期').fill('2026-10-01');
  await expect(page.getByLabel('交付日期')).toHaveValue('2026-10-01');
  await page.goto('http://127.0.0.1:5173/?component=TimePicker');
  await page.getByLabel('开始时间').fill('14:30');
  await expect(page.getByLabel('开始时间')).toHaveValue('14:30');
  await page.goto('http://127.0.0.1:5173/?component=Slider');
  await page.getByRole('slider').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.aig-slider output')).toHaveText('105%');
  await page.goto('http://127.0.0.1:5173/?component=Splitter');
  const handle = page.getByRole('separator', { name: '资料目录宽度' });
  await handle.focus();
  await page.keyboard.press('End');
  await expect(handle).toHaveAttribute('aria-valuenow', '85');
});

test('树选择、级联路径和分段控件提交实际选择', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=TreeSelect');
  await page.getByRole('button', { name: /选择资料：/ }).click();
  const tree = page.getByRole('tree', { name: '选择资料' });
  await tree.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page.locator('input[name=documentId]')).toHaveValue('review');
  await page.goto('http://127.0.0.1:5173/?component=Cascader');
  await page.getByRole('button', { name: '选择资料路径', exact: true }).click();
  await page.getByRole('button', { name: '项目资料 ›', exact: true }).click();
  await page.getByRole('button', { name: '设计文件', exact: true }).click();
  await expect(page.locator('input[name=documentPath]')).toHaveValue('["project","design"]');
  await page.goto('http://127.0.0.1:5173/?component=Segmented');
  await page.getByRole('radio', { name: '列表' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: '网格' })).toBeChecked();
  await expect(page.getByRole('radio', { name: '地图' })).toBeDisabled();
});

test('文件取消、图片预览与气泡确认可完成操作', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Upload');
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'example.txt', mimeType: 'text/plain', buffer: Buffer.from('example') });
  await page.getByRole('button', { name: '取消上传', exact: true }).click();
  await expect(page.locator('.aig-upload')).toContainText('已取消');
  await page.getByRole('button', { name: '重试上传', exact: true }).click();
  await expect(page.locator('.aig-upload')).toContainText('已完成');
  await page.goto('http://127.0.0.1:5173/?component=Image');
  await page.getByRole('button', { name: '预览：精密线绘图形' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.goto('http://127.0.0.1:5173/?component=Popconfirm');
  await page.getByRole('button', { name: '移除资料', exact: true }).click();
  await page.getByRole('button', { name: '确认', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '资料已移除' })).toBeVisible();
});
