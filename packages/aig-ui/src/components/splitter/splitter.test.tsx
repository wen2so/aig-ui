import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Splitter } from './splitter.js';

test('键盘调整遵守比例边界并保留受控值', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <Splitter
      label="目录宽度"
      first="目录"
      second="内容"
      defaultValue={40}
      min={30}
      max={60}
      onValueChange={change}
    />,
  );
  const handle = screen.getByRole('separator');
  handle.focus();
  await user.keyboard('{End}');
  expect(handle).toHaveAttribute('aria-valuenow', '60');
  await user.keyboard('{ArrowRight}');
  expect(handle).toHaveAttribute('aria-valuenow', '60');
  await user.keyboard('{Home}');
  expect(handle).toHaveAttribute('aria-valuenow', '30');
  rerender(<Splitter label="目录宽度" first="目录" second="内容" value={50} onValueChange={change} />);
  await user.keyboard('{ArrowLeft}');
  expect(change).toHaveBeenLastCalledWith(48);
  expect(handle).toHaveAttribute('aria-valuenow', '50');
});
