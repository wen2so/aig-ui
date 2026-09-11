import { it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './tabs.js';
it('切换页签更新选中与面板', () => {
  render(
    <Tabs.Root defaultValue="a">
      <Tabs.List>
        <Tabs.Tab value="a">甲</Tabs.Tab>
        <Tabs.Tab value="b">乙</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">内容甲</Tabs.Panel>
      <Tabs.Panel value="b">内容乙</Tabs.Panel>
    </Tabs.Root>,
  );
  fireEvent.click(screen.getByRole('tab', { name: '乙' }));
  expect(screen.getByRole('tab', { name: '乙' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('内容乙');
});
