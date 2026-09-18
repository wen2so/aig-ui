import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Popconfirm } from './popconfirm.js';

it('执行期间阻止重复确认和关闭，失败保留弹层并支持重试', async () => {
  const user = userEvent.setup();
  let reject!: (error: Error) => void;
  const confirm = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<void>((_, fail) => {
          reject = fail;
        }),
    )
    .mockResolvedValueOnce(undefined);
  render(<Popconfirm trigger={<button>移除</button>} title="移除资料" onConfirm={confirm} />);
  await user.click(screen.getByRole('button', { name: '移除' }));
  await user.click(screen.getByRole('button', { name: '确认' }));
  expect(screen.getByRole('button', { name: '确认' })).toBeDisabled();
  await user.keyboard('{Escape}');
  expect(screen.getByRole('dialog')).toBeVisible();
  await act(async () => reject(new Error('连接中断')));
  expect(await screen.findByRole('alert')).toHaveTextContent('连接中断');
  await user.click(screen.getByRole('button', { name: '确认' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(confirm).toHaveBeenCalledTimes(2);
});
