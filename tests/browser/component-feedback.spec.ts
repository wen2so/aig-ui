import { test, expect } from '@playwright/test';

test('输入聚焦扩展刻线，保持文本区域和控件尺寸稳定', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Input');
  const input = page.getByRole('textbox', { name: '工作空间名称' });
  const size = await input.boundingBox();
  const resting = await input.evaluate((el) => getComputedStyle(el).backgroundSize);
  await input.click();
  await expect.poll(() => input.evaluate((el) => getComputedStyle(el).backgroundSize)).not.toBe(resting);
  await expect.poll(() => input.evaluate((el) => getComputedStyle(el).backgroundSize)).toContain('1px 16px');
  await input.fill('稳定的文字与展开的边线');
  const focused = await input.boundingBox();
  expect(focused!.width).toBe(size!.width);
  expect(focused!.height).toBe(size!.height);
  await expect(input).toHaveValue('稳定的文字与展开的边线');
});

test('选择族通过内核与外轨建立明确状态，减少动画保持最终形态', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [component, role, name] of [
    ['Checkbox', 'checkbox', '接收处理结果通知'],
    ['Switch', 'switch', '自动保存草稿'],
    ['RadioGroup', 'radio', '仅自己'],
  ] as const) {
    await page.goto(`http://127.0.0.1:5173/?component=${component}`);
    const control = page.getByRole(role, { name, exact: true });
    if (role !== 'radio') await control.uncheck();
    const resting = await control.evaluate((el) => getComputedStyle(el, '::after').scale);
    await control.check();
    await expect(control).toBeChecked();
    expect(await control.evaluate((el) => getComputedStyle(el, '::after').scale)).not.toBe(resting);
    expect(await control.evaluate((el) => getComputedStyle(el, '::after').animationName)).toBe('none');
    const bounds = await control.boundingBox();
    expect(bounds!.width).toBeGreaterThan(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('页签与折叠面板在键盘激活后展开定位线', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=Tabs');
  const tabs = page.getByRole('tablist', { name: '项目视图' });
  const activity = tabs.getByRole('tab', { name: '动态' });
  const resting = await activity.evaluate((el) => getComputedStyle(el, '::after').transform);
  await tabs.getByRole('tab', { name: '概览' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(activity).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(activity).toHaveAttribute('aria-selected', 'true');
  await expect
    .poll(() => activity.evaluate((el) => getComputedStyle(el, '::after').transform))
    .not.toBe(resting);
  await expect(page.getByRole('tabpanel').filter({ hasText: '今天创建了项目。' })).toBeVisible();
  await page.goto('http://127.0.0.1:5173/?component=Accordion');
  const trigger = page.getByRole('button', { name: '键盘操作', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(() => trigger.evaluate((el) => getComputedStyle(el, '::before').scale)).toBe('1');
  await page.goto('http://127.0.0.1:5173/?component=Navigation');
  const activityLink = page.locator('.aig-navigation').getByRole('link', { name: '最近动态' });
  const nodeScale = await activityLink.evaluate((el) => getComputedStyle(el, '::before').scale);
  await activityLink.click();
  await expect(activityLink).toHaveAttribute('aria-current', 'page');
  await expect
    .poll(() => activityLink.evaluate((el) => getComputedStyle(el, '::before').scale))
    .not.toBe(nodeScale);
});

test('对话框居中，双侧抽屉贴边并占满视口高度', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://127.0.0.1:5173/?component=Dialog');
  await page.getByRole('button', { name: '打开对话框' }).click();
  const dialog = page.getByRole('dialog', { name: '保存当前设置' });
  await expect(dialog).toHaveCSS('position', 'fixed');
  const centered = await dialog.boundingBox();
  expect(centered!.x + centered!.width / 2).toBeCloseTo(720, 0);
  expect(centered!.y + centered!.height / 2).toBeCloseTo(480, 0);
  await page.keyboard.press('Escape');
  await page.goto('http://127.0.0.1:5173/?component=Drawer');
  for (const [side, label] of [
    ['right', '查看资料详情'],
    ['left', '从左侧查看'],
  ] as const) {
    await page.getByRole('button', { name: label, exact: true }).click();
    const drawer = page.getByRole('dialog', { name: '资料详情' });
    await expect(drawer).toHaveAttribute('data-side', side);
    const bounds = await drawer.boundingBox();
    expect(bounds!.y).toBe(0);
    expect(bounds!.height).toBe(960);
    expect(side === 'right' ? bounds!.x + bounds!.width : bounds!.x).toBe(side === 'right' ? 1440 : 0);
    await expect(drawer).toHaveCSS('overflow-y', 'auto');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: label, exact: true })).toBeFocused();
  }
});

test('任务等待确认保留静态末节点，状态语义与运动一致', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=TaskStatus');
  const status = page.locator('.aig-task-status[data-state="awaiting-confirmation"]').first();
  await expect(status).toBeVisible();
  const node = status.locator('li').last();
  expect(await node.evaluate((el) => getComputedStyle(el, '::before').animationName)).toBe('none');
});

test('正文与图标保持稳定，卡片角标及选择箭头沿实际边界表达状态', async ({ page }) => {
  for (const [component, selector] of [
    ['Text', '.aig-text'],
    ['Heading', '.aig-heading'],
    ['Icon', '.aig-icon'],
  ] as const) {
    await page.goto(`http://127.0.0.1:5173/?component=${component}`);
    const content = page.locator(selector).first();
    await expect(content).toHaveCSS('animation-name', 'none');
    await expect(content).toHaveCSS('background-image', 'none');
  }
  await page.goto('http://127.0.0.1:5173/?component=Card');
  const card = page.locator('.aig-card').first();
  for (const pseudo of ['::before', '::after']) {
    const corner = await card.evaluate((el, part) => {
      const style = getComputedStyle(el, part);
      return { radius: style.borderRadius, rotate: style.rotate, animation: style.animationName };
    }, pseudo);
    expect(corner).toEqual({ radius: '0px', rotate: 'none', animation: 'aig-glint-x' });
  }
  await page.goto('http://127.0.0.1:5173/?component=Select');
  const select = page.getByRole('combobox', { name: '项目状态' });
  const caret = select.locator('.aig-select-caret');
  await expect(caret).toHaveCSS('animation-name', 'none');
  const closed = await caret.evaluate((el) => getComputedStyle(el).transform);
  await select.click();
  await expect(select).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(() => caret.evaluate((el) => getComputedStyle(el).transform)).not.toBe(closed);
});
