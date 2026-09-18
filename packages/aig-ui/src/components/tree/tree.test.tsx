import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Tree } from './tree.js';

test('树的焦点浏览不修改选择，禁用项无法激活，收起后回到父项', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <Tree
      label="资料"
      nodes={[
        {
          id: 'root',
          label: '项目',
          children: [
            { id: 'a', label: '设计' },
            { id: 'b', label: '锁定', disabled: true },
          ],
        },
      ]}
      onValueChange={change}
    />,
  );
  const tree = screen.getByRole('tree');
  tree.focus();
  await user.keyboard('{ArrowRight}{ArrowDown}');
  expect(change).not.toHaveBeenCalled();
  expect(tree).toHaveAttribute('aria-activedescendant', screen.getByRole('treeitem', { name: '设计' }).id);
  await user.keyboard('{Enter}');
  expect(change).toHaveBeenLastCalledWith('a');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(change).toHaveBeenCalledTimes(1);
  await user.keyboard('{ArrowLeft}{ArrowLeft}');
  expect(screen.getByRole('treeitem', { name: '项目' })).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('treeitem', { name: '设计' })).not.toBeInTheDocument();
});
