import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SourceList } from './source-list.js';
it('缺失和可执行地址保持纯文本', () => {
  render(
    <SourceList
      sources={[
        { id: 'a', title: '危险地址', url: 'javascript:alert(1)' },
        { id: 'b', title: '无地址' },
        { id: 'c', title: '网页', url: 'https://example.com' },
      ]}
    />,
  );
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByText('无地址').tagName).toBe('SPAN');
});
