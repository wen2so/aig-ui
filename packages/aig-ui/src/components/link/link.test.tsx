import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Link } from './link.js';
it('外链保留安全属性和调用方 rel', () => {
  render(
    <Link href="https://example.com" target="_blank" rel="external">
      来源
    </Link>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer external');
});
