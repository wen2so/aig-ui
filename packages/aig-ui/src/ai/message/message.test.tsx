import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Message } from './message.js';
it('模型文本中的脚本、HTML 和远程图片保持禁用', () => {
  const { container } = render(
    <Message
      role="assistant"
      format="markdown"
      content={
        '<script>alert(1)</script>\n\n[危险](javascript:alert%281%29)\n\n![追踪](https://example.com/pixel.png)\n\n[来源](https://example.com)'
      }
    />,
  );
  expect(container.querySelector('script')).toBeNull();
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
});
