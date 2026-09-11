import { it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from './toast.js';
function Trigger() {
  const manager = Toast.useManager();
  return <button onClick={() => manager.add({ title: '保存完成' })}>保存</button>;
}
it('提示提供标题和关闭入口', async () => {
  render(
    <Toast.Provider>
      <Trigger />
    </Toast.Provider>,
  );
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  expect(await screen.findByText('保存完成')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '关闭提示' }));
});
