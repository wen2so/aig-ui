import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './switch.js';
it('受控开关由宿主更新状态', () => {
  const change = vi.fn();
  render(<Switch checked={false} onCheckedChange={change} aria-label="自动保存" />);
  fireEvent.click(screen.getByRole('switch'));
  expect(change).toHaveBeenCalledWith(true);
  expect(screen.getByRole('switch')).not.toBeChecked();
});
