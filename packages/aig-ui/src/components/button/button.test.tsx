import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Button } from './button.js';
import { replayButtonFacets } from './button-motion.js';

let testTime = 0;
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  vi.spyOn(performance, 'now').mockReturnValue((testTime += 20_000));
});
afterEach(() => vi.restoreAllMocks());

it('入场未命中时不播放，命中后与交互共享冷却', () => {
  render(<Button entrance={false}>保存</Button>);
  const highlight = screen.getByRole('button').querySelector<SVGSVGElement>('.aig-button-highlight')!;
  vi.mocked(Math.random).mockReturnValue(0.5);
  replayButtonFacets(highlight, true);
  expect(highlight).not.toHaveAttribute('data-playing');
  vi.mocked(Math.random).mockReturnValue(0);
  replayButtonFacets(highlight, true);
  expect(highlight).toHaveAttribute('data-playing', 'entrance');
  delete highlight.dataset.playing;
  fireEvent.pointerOver(screen.getByRole('button'));
  expect(highlight).toHaveAttribute('data-hovered');
  expect(highlight).not.toHaveAttribute('data-playing');
});

it('命中概率时播放随机组合，重复进入与加载恢复保持几何且不重播，支持宿主取消', () => {
  const enter = vi.fn();
  const { rerender } = render(<Button onPointerEnter={enter}>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  fireEvent.pointerOver(button);
  expect(enter).toHaveBeenCalledOnce();
  const facets = [...button.querySelectorAll<SVGElement>('.aig-button-highlight polygon')];
  expect(facets.length).toBeGreaterThanOrEqual(5);
  expect(facets.filter((facet) => facet.dataset.facetKind === 'trapezoid')).toHaveLength(1);
  const snapshot = () =>
    [...button.querySelectorAll('polygon')].map((facet) => ({
      points: facet.getAttribute('points'),
      frames: facet.getAttribute('style'),
    }));
  const first = snapshot();
  expect(button.querySelector('.aig-button-highlight')).toHaveAttribute('data-playing', 'interaction');
  fireEvent.pointerOver(button);
  expect(snapshot()).toEqual(first);
  fireEvent.pointerLeave(button);
  fireEvent.pointerOver(button);
  expect(button.querySelector('.aig-button-highlight')).toHaveAttribute('data-hovered');
  expect(button.querySelector('.aig-button-highlight')).not.toHaveAttribute('data-playing');
  expect(button.querySelector('polygon')).toBe(facets[0]);
  const next = snapshot();
  expect(next).toEqual(first);
  rerender(<Button loading>保存</Button>);
  rerender(<Button>保存</Button>);
  expect(snapshot()).toEqual(next);
  const before = button.querySelector('svg')!.innerHTML;
  rerender(<Button onPointerEnter={(event) => event.preventDefault()}>保存</Button>);
  fireEvent.pointerOver(button);
  expect(button.querySelector('svg')!.innerHTML).toBe(before);
});

it('三段轮廓在重渲染和重复交互后保持结构', () => {
  const { rerender } = render(<Button>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  const styles = () =>
    [...button.querySelectorAll('.aig-button-frame .aig-button-line')].map((line) => line.outerHTML);
  expect(styles()).toHaveLength(0);
  fireEvent.pointerOver(button);
  const initial = styles();
  expect(initial).toHaveLength(3);
  expect(initial.every((markup) => markup.includes('pathLength="100"'))).toBe(true);
  fireEvent.pointerOver(button);
  fireEvent.pointerLeave(button);
  rerender(<Button loading>保存</Button>);
  rerender(<Button>保存</Button>);
  fireEvent.pointerOver(button);
  expect(styles()).toEqual(initial);
  expect(button.querySelector('.aig-button-highlight')).not.toHaveAttribute('data-playing');
});

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

it('前后图标保持装饰语义，加载保留内容槽位与切换状态', () => {
  const content = (
    <Button
      loading
      aria-pressed="true"
      leadingIcon={
        <svg>
          <title>保存图形</title>
        </svg>
      }
      trailingIcon={
        <svg>
          <title>前往</title>
        </svg>
      }
    >
      保存当前工作区
    </Button>
  );
  render(content);
  const button = screen.getByRole('button', { name: '保存当前工作区' });
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toBeDisabled();
  expect(button.querySelectorAll('.aig-button-content .aig-button-icon[aria-hidden="true"]')).toHaveLength(2);
  expect(button.querySelector('.aig-button-label')).toHaveTextContent('保存当前工作区');
});

it('加载中断刻面并清除悬停，恢复可用后不自动重播入场', () => {
  const { rerender } = render(<Button>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  fireEvent.pointerOver(button);
  const highlight = button.querySelector('.aig-button-highlight');
  expect(highlight).toHaveAttribute('data-playing', 'interaction');
  rerender(<Button loading>保存</Button>);
  expect(highlight).not.toHaveAttribute('data-playing');
  expect(highlight).not.toHaveAttribute('data-hovered');
  rerender(<Button>保存</Button>);
  expect(highlight).not.toHaveAttribute('data-playing');
});

it('首次交互可由宿主取消，entrance 不透传到原生按钮', () => {
  render(
    <Button entrance={false} onPointerEnter={(event) => event.preventDefault()}>
      取消预览
    </Button>,
  );
  const button = screen.getByRole('button', { name: '取消预览' });
  fireEvent.pointerOver(button);
  expect(button).not.toHaveAttribute('entrance');
  expect(button.querySelector('.aig-button-highlight')).not.toHaveAttribute('data-hovered');
  expect(button.querySelector('.aig-button-highlight')).not.toHaveAttribute('data-playing');
});

it('未命中时稳定高亮，跨按钮与重新挂载共享冷却，冷却结束后可再次随机触发', () => {
  vi.mocked(Math.random).mockReturnValue(0.5);
  const { unmount } = render(<Button entrance={false}>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  const highlight = button.querySelector('.aig-button-highlight');
  fireEvent.pointerOver(button);
  expect(highlight).toHaveAttribute('data-hovered');
  expect(highlight).not.toHaveAttribute('data-playing');
  fireEvent.pointerLeave(button);
  vi.mocked(Math.random).mockReturnValue(0);
  fireEvent.pointerOver(button);
  expect(highlight).toHaveAttribute('data-playing', 'interaction');
  unmount();
  render(<Button entrance={false}>继续</Button>);
  const next = screen.getByRole('button', { name: '继续' });
  fireEvent.pointerOver(next);
  expect(next.querySelector('.aig-button-highlight')).not.toHaveAttribute('data-playing');
  fireEvent.pointerLeave(next);
  vi.mocked(performance.now).mockReturnValue(testTime + 15_000);
  fireEvent.pointerOver(next);
  expect(next.querySelector('.aig-button-highlight')).toHaveAttribute('data-playing', 'interaction');
});
