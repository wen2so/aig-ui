import { it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Conversation } from './conversation.js';
it('普通重渲染不产生未读，流式更新产生未读，历史插入保持位置', () => {
  const ui = (version = 1, first = 'a', last = 'b') => (
    <Conversation firstMessageId={first} lastMessageId={last} contentVersion={version}>
      <p>正文</p>
    </Conversation>
  );
  const view = render(ui());
  const viewport = screen.getByRole('region');
  Object.defineProperties(viewport, {
    scrollHeight: { configurable: true, value: 1000 },
    clientHeight: { value: 200 },
  });
  viewport.scrollTop = 100;
  fireEvent.scroll(viewport);
  view.rerender(ui());
  expect(screen.getByRole('button', { name: '回到底部' })).toBeVisible();
  view.rerender(ui(2));
  expect(screen.getByRole('button', { name: '有新内容，回到底部' })).toBeVisible();
  Object.defineProperty(viewport, 'scrollHeight', { value: 1200 });
  view.rerender(ui(2, 'older'));
  expect(viewport.scrollTop).toBe(300);
  fireEvent.click(screen.getByRole('button'));
  expect(viewport.scrollTop).toBe(1200);
});
