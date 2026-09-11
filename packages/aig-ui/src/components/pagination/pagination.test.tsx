import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './pagination.js';
it('分页边界和下一页回调', () => {
  const change = vi.fn();
  const { rerender } = render(<Pagination page={1} pageCount={2} onPageChange={change} />);
  expect(screen.getByText('上一页')).toBeDisabled();
  fireEvent.click(screen.getByText('下一页'));
  expect(change).toHaveBeenCalledWith(2);
  rerender(<Pagination page={99} pageCount={2} onPageChange={change} />);
  expect(screen.getByText('下一页')).toBeDisabled();
});
