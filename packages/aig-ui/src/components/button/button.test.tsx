import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Button } from './button.js';

it('首次交互播放随机组合，重复进入与加载恢复保持几何且不重播，支持宿主取消', () => {
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
