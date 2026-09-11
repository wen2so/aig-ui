import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ComponentType } from 'react';

const stories = import.meta.glob<{ preview?: { name: string }; Preview?: ComponentType }>('../packages/aig-ui/src/components/**/*.stories.tsx', { eager: true });
describe('公共组件的可编译预览', () => {
  for (const story of Object.values(stories)) {
    if (!story.preview || !story.Preview) continue;
    const Preview = story.Preview;
    it(`${story.preview.name} 可渲染示例`, () => {
      const { container } = render(<Preview />);
      expect(container.childElementCount).toBeGreaterThan(0);
    });
  }
});
