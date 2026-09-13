import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Confirmation } from './confirmation.js';
it('连续激活只提交一次，绑定旧版本并拒绝失效确认', async () => {
  let resolve!: () => void;
  const confirm = vi.fn(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      }),
  );
  const props = {
    artifactId: 'doc',
    revision: '1',
    currentRevision: '1',
    target: '应用结果',
    summary: '替换文本',
    impact: '当前说明',
    onConfirm: confirm,
  };
  const { rerender } = render(<Confirmation {...props} />);
  fireEvent.click(screen.getByRole('button', { name: '确认执行' }));
  fireEvent.click(screen.getByRole('button', { name: '确认执行' }));
  expect(confirm).toHaveBeenCalledOnce();
  expect(confirm).toHaveBeenCalledWith({ artifactId: 'doc', revision: '1' });
  rerender(<Confirmation {...props} currentRevision="2" />);
  resolve();
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('版本已变化'));
  expect(screen.getByRole('button', { name: '确认执行' })).toBeDisabled();
  expect(screen.getByRole('status')).not.toHaveTextContent('操作已完成');
});
it('失败后保留目标并可重试', async () => {
  const confirm = vi.fn().mockRejectedValueOnce(Error('保存失败')).mockResolvedValue(undefined);
  render(
    <Confirmation
      artifactId="doc"
      revision="1"
      currentRevision="1"
      target="应用"
      summary="摘要"
      impact="说明"
      onConfirm={confirm}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: '确认执行' }));
  await screen.findByText('保存失败');
  fireEvent.click(screen.getByRole('button', { name: '确认执行' }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('操作已完成'));
});
