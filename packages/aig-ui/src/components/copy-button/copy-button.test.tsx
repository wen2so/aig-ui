import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyButton } from './copy-button.js';
it('复制成功与拒绝分别反馈', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  const success = vi.fn();
  render(<CopyButton value="原文" onCopySuccess={success} />);
  fireEvent.click(screen.getByRole('button'));
  await waitFor(() => expect(success).toHaveBeenCalledOnce());
  expect(screen.getByRole('status')).toHaveTextContent('已复制');
  writeText.mockRejectedValue(Error('denied'));
  fireEvent.click(screen.getByRole('button'));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('请手动复制'));
  expect(screen.getByRole('textbox')).toHaveValue('原文');
  expect(success).toHaveBeenCalledOnce();
});
