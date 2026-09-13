import { test, expect } from '@playwright/test';

test('访问状态页明确区分未找到、过期和受限', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=access-state-page');
  await expect(page.getByRole('heading', { name: '登录已过期' })).toBeVisible();
  await expect(page.getByRole('link', { name: '重新登录' })).toBeVisible();
  await page.getByLabel('演示访问状态').selectOption('forbidden');
  await expect(page.getByRole('heading', { name: '访问受限' })).toBeVisible();
  await expect(page.getByRole('link', { name: '重新登录' })).toHaveCount(0);
  await page.getByLabel('演示访问状态').selectOption('not-found');
  await expect(page.getByRole('heading', { name: '页面未找到' })).toBeVisible();
});

test('设置表单校验、失败保留与重试保存', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=settings-form');
  const name = page.getByRole('textbox', { name: '项目名称' });
  await name.fill('');
  await page.getByRole('button', { name: '保存设置' }).click();
  await expect(page.getByText('请填写项目名称。', { exact: true })).toBeVisible();
  await expect(name).toBeFocused();
  await name.fill('修改后的项目');
  await page.getByRole('button', { name: '保存设置' }).click();
  await expect(page.getByText('演示保存失败，修改内容已保留。', { exact: true })).toBeVisible();
  await expect(name).toHaveValue('修改后的项目');
  await page.getByLabel('模拟保存失败').uncheck();
  await page.getByRole('button', { name: '保存设置' }).click();
  await expect(page.getByText('当前设置已同步', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog', { name: '设置已保存' })).toBeVisible();
});

test('筛选列表覆盖空结果、分页、详情与读取失败', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=filterable-list');
  await page.getByRole('searchbox', { name: '查找资料' }).fill('不存在');
  await expect(page.getByRole('heading', { name: '暂无匹配资料' })).toBeVisible();
  await page.getByRole('button', { name: '清除筛选' }).click();
  await page.getByRole('button', { name: '下一页' }).click();
  await page.getByRole('button', { name: '查看项目资料 6', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('demo-6');
  await page.keyboard.press('Escape');
  await page.getByLabel('演示列表状态').selectOption('error');
  await page.getByRole('button', { name: '重试读取' }).click();
  await expect(page.getByRole('table', { name: '项目资料列表' })).toBeVisible();
});

test('助手页面停止后保留文本，失败后可重新生成', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=ai-assistant');
  await page.getByRole('button', { name: '发送', exact: true }).click();
  await expect(page.getByRole('article', { name: '助手消息' })).toContainText('演示');
  await page.getByRole('button', { name: '停止生成' }).click();
  const stopped = await page.getByRole('article', { name: '助手消息' }).textContent();
  await page.waitForTimeout(250);
  expect(await page.getByRole('article', { name: '助手消息' }).textContent()).toBe(stopped);
  await expect(page.getByRole('textbox', { name: '输入任务' })).toHaveValue('整理演示资料中的重点');
  await page.getByLabel('模拟生成中断').check();
  await page.getByRole('button', { name: '重新生成' }).click();
  await expect(page.getByText('任务未完成', { exact: true })).toBeVisible();
  await page.getByLabel('模拟生成中断').uncheck();
  await page.getByRole('button', { name: '重新生成' }).click();
  await expect(page.getByText('任务已完成', { exact: true })).toBeVisible();
});

test('产物审核显式确认，保留失败与版本冲突', async ({ page }) => {
  await page.goto('http://127.0.0.1:5173/?component=artifact-review');
  await page.getByRole('button', { name: '编辑内容' }).click();
  await page.getByRole('textbox', { name: '编辑产物内容' }).fill('修改后的项目摘要');
  await page.getByRole('button', { name: '保存修改' }).click();
  await expect(page.getByText('修改后的项目摘要', { exact: true })).toBeVisible();
  await page.getByLabel('演示执行结果').selectOption('failure');
  // 正文说明与浮层重叠时，操作命中仍归属浮层。
  await page
    .locator('.example-caption')
    .evaluate((el) =>
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * 0.72, behavior: 'instant' }),
    );
  await page.getByRole('button', { name: '审核并应用' }).click();
  await page.getByRole('button', { name: '确认执行' }).click();
  await expect(page.getByText('演示执行失败，请重试。', { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.getByRole('dialog').evaluate((el) => {
        const dialog = el.getBoundingClientRect();
        const caption = document.querySelector('.example-caption')!.getBoundingClientRect();
        const top = Math.max(dialog.top, caption.top);
        const bottom = Math.min(dialog.bottom, caption.bottom);
        const y = top < bottom ? (top + bottom) / 2 : dialog.top + dialog.height / 2;
        return el.contains(document.elementFromPoint(dialog.left + dialog.width / 2, y));
      }),
    )
    .toBe(true);
  await page.getByRole('button', { name: '关闭审核' }).click();
  await page.getByLabel('演示执行结果').selectOption('conflict');
  await page.getByRole('button', { name: '审核并应用' }).click();
  await page.getByRole('button', { name: '确认执行' }).click();
  await expect(page.getByText('内容版本已变化，请重新检查后确认。', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '确认执行' })).toBeDisabled();
});
