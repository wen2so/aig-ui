import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Button } from './button.js';

it('刻面在挂载后固定，色块贯穿高度、三角形与四边形贴边拼接，局部快慢闪切支持宿主取消', () => {
  const enter = vi.fn();
  const { rerender } = render(<Button onPointerEnter={enter}>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  fireEvent.pointerOver(button);
  expect(enter).toHaveBeenCalledOnce();
  const facets = [...button.querySelectorAll<SVGElement>('.aig-button-highlight polygon')];
  expect([4, 5]).toContain(facets.length);
  const depths = facets.map((facet) => Number(facet.style.getPropertyValue('--aig-facet-depth')));
  expect(depths.every((depth) => [0.88, 0.94, 1].includes(depth))).toBe(true);
  expect(new Set(depths).size).toBeLessThanOrEqual(3);
  const shapes = facets.map((facet) =>
    facet
      .getAttribute('points')!
      .split(' ')
      .map((point) => point.split(',').map(Number)),
  );
  expect(shapes.every((points) => points.length === 3 || points.length === 4)).toBe(true);
  expect(
    shapes.every(
      (points) => points.some((point) => point[1] === 0) && points.some((point) => point[1] === 100),
    ),
  ).toBe(true);
  expect(shapes.filter((points) => points.length === 3)).toHaveLength(1);
  expect(
    shapes
      .filter((points) => points.some((point) => point[0] === 0 || point[0] === 300))
      .every((points) => points.length >= 4),
  ).toBe(true);
  // 每个内部节点最多连接三块，覆盖面积与按钮一致。
  const incidence = new Map<string, number>();
  for (const points of shapes) {
    for (const point of points) {
      if (point[1] === 0 || point[1] === 100) continue;
      const key = point.join(',');
      incidence.set(key, (incidence.get(key) ?? 0) + 1);
    }
  }
  expect(Math.max(...incidence.values())).toBeLessThanOrEqual(3);
  const area = shapes.reduce(
    (sum, points) =>
      sum +
      Math.abs(
        points.reduce((cross, point, index) => {
          const next = points[(index + 1) % points.length]!;
          return cross + point[0]! * next[1]! - next[0]! * point[1]!;
        }, 0),
      ) /
        2,
    0,
  );
  expect(Math.abs(area - 30000)).toBeLessThan(2);
  const geometry = facets.map((facet) => facet.getAttribute('points'));
  const flashes = facets.filter((facet) => facet.dataset.motion === 'flash');
  expect(flashes).toHaveLength(Math.round(facets.length * 0.4));
  const durations = flashes
    .map((facet) => parseFloat(facet.style.getPropertyValue('--aig-facet-duration')))
    .sort((a, b) => a - b);
  expect(durations[0]).toBeLessThanOrEqual(369);
  expect(durations.at(-1)).toBeGreaterThanOrEqual(474);
  const finishes = flashes.map(
    (facet) =>
      parseFloat(facet.style.getPropertyValue('--aig-facet-delay')) +
      parseFloat(facet.style.getPropertyValue('--aig-facet-duration')),
  );
  expect(Math.min(...finishes)).toBe(474);
  expect(Math.max(...finishes)).toBe(800);
  fireEvent.pointerLeave(button);
  fireEvent.pointerOver(button);
  expect([...button.querySelectorAll('polygon')]).toEqual(facets);
  expect(facets.map((facet) => facet.getAttribute('points'))).toEqual(geometry);
  expect(facets.map((facet) => Number(facet.style.getPropertyValue('--aig-facet-depth')))).toEqual(depths);
  rerender(<Button loading>保存</Button>);
  rerender(<Button>保存</Button>);
  expect(facets.map((facet) => facet.getAttribute('points'))).toEqual(geometry);
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
  expect(button.querySelectorAll('.aig-button-content .aig-button-icon[aria-hidden="true"]')).toHaveLength(2);
  expect(button.querySelector('.aig-button-label')).toHaveTextContent('保存当前工作区');
});
