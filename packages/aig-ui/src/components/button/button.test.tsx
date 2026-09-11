import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Button } from './button.js';

it('默认使用普通按钮，加载时保留名称并阻止重复动作', () => {
  const click = vi.fn();
  const ref = createRef<HTMLButtonElement>();
  const { rerender } = render(
    <Button ref={ref} onClick={click}>
      保存
    </Button>,
  );
  expect(ref.current).toHaveAttribute('type', 'button');
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  rerender(
    <Button loading onClick={click}>
      保存
    </Button>,
  );
  fireEvent.click(screen.getByRole('button', { name: '保存' }));
  expect(click).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
});
