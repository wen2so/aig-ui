import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Button } from './button.js';

it('移入时生成数量可变的直角三角和三档明度，支持宿主取消', () => {
  const enter = vi.fn();
  const { rerender } = render(<Button onPointerEnter={enter}>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  fireEvent.pointerOver(button);
  expect(enter).toHaveBeenCalledOnce();
  const facets = [...button.querySelectorAll<SVGElement>('.aig-button-highlight polygon')];
  expect([4, 6, 8]).toContain(facets.length);
  const depths = facets.map((facet) => Number(facet.style.getPropertyValue('--aig-facet-depth')));
  expect(depths.every((depth) => [0.14, 0.22, 0.3].includes(depth))).toBe(true);
  expect(new Set(depths).size).toBeLessThanOrEqual(3);
  for (const facet of facets) {
    const points = facet
      .getAttribute('points')!
      .split(' ')
      .map((point) => point.split(',').map(Number));
    const rightAngle = points.some((point, index) => {
      const a = points[(index + 1) % 3]!;
      const b = points[(index + 2) % 3]!;
      return (
        Math.abs((a[0]! - point[0]!) * (b[0]! - point[0]!) + (a[1]! - point[1]!) * (b[1]! - point[1]!)) < 0.01
      );
    });
    expect(rightAngle).toBe(true);
  }
  const before = button.querySelector('svg')!.innerHTML;
  rerender(<Button onPointerEnter={(event) => event.preventDefault()}>保存</Button>);
  fireEvent.pointerOver(button);
  expect(button.querySelector('svg')!.innerHTML).toBe(before);
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
  expect(button.querySelectorAll('.aig-button-icon[aria-hidden="true"]')).toHaveLength(2);
  expect(button.querySelector('.aig-button-label')).toHaveTextContent('保存当前工作区');
});
