import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Button } from './button.js';
import { createButtonFacets } from './button-motion.js';

it.each([
  [80, 32],
  [140, 26],
  [220, 40],
  [160, 80],
])('规则刻面在 %s×%s 下共用斜率，三角对称、斜带平行且无交叉', (width, height) => {
  for (const flip of [false, true]) {
    const shapes = createButtonFacets(width!, height!, flip).map(({ points }) =>
      points.split(' ').map((point) => point.split(',').map(Number)),
    );
    const runs: number[] = [];
    for (const points of shapes) {
      const crosses: number[] = [];
      points.forEach((point, index) => {
        const next = points[(index + 1) % points.length]!;
        const after = points[(index + 2) % points.length]!;
        const dx = next[0]! - point[0]!;
        const dy = next[1]! - point[1]!;
        if (dx && dy) runs.push(Math.abs(dx));
        crosses.push(dx * (after[1]! - next[1]!) - dy * (after[0]! - next[0]!));
      });
      expect(crosses.every((cross) => cross > 0) || crosses.every((cross) => cross < 0)).toBe(true);
    }
    expect(Math.max(...runs) - Math.min(...runs)).toBeLessThan(0.02);
    const triangle = shapes.find((points) => points.length === 3)!;
    const apex = triangle.find((point) => triangle.filter((other) => other[1] === point[1]).length === 1)!;
    const base = triangle.filter((point) => point !== apex);
    expect(apex[0]).toBeCloseTo((base[0]![0]! + base[1]![0]!) / 2, 2);
    const band = shapes[1]!;
    expect(band[1]![0]! - band[0]![0]!).toBeCloseTo(band[2]![0]! - band[3]![0]!, 2);
    const triangleBase = Math.abs(base[1]![0]! - base[0]![0]!);
    expect(band[1]![0]! - band[0]![0]!).toBeCloseTo(triangleBase, 2);
    const physicalRun = (runs[0]! * width!) / 300;
    expect(physicalRun).toBeCloseTo(Math.min(height! / Math.sqrt(3), width! / 8), 2);
  }
});

it('刻面在挂载后固定，色块贯穿高度、三角形与四边形贴边拼接，局部快慢闪切支持宿主取消', () => {
  const enter = vi.fn();
  const { rerender } = render(<Button onPointerEnter={enter}>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  fireEvent.pointerOver(button);
  expect(enter).toHaveBeenCalledOnce();
  const facets = [...button.querySelectorAll<SVGElement>('.aig-button-highlight polygon')];
  expect(facets).toHaveLength(5);
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
  expect(facets.filter((facet) => facet.dataset.motion === 'cut')).toHaveLength(1);
  expect(facets.filter((facet) => facet.dataset.motion === 'tip')).toHaveLength(1);
  expect(button.querySelector('.aig-button-highlight')).toHaveAttribute('data-playing', 'interaction');
  fireEvent.pointerLeave(button);
  fireEvent.pointerOver(button);
  expect(button.querySelector('.aig-button-highlight')).toHaveAttribute('data-hovered');
  expect(button.querySelector('.aig-button-highlight')).not.toHaveAttribute('data-playing');
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

it('细线随机布局在重渲染和重复交互后保持固定', () => {
  const { rerender } = render(<Button>保存</Button>);
  const button = screen.getByRole('button', { name: '保存' });
  const styles = () =>
    [...button.querySelectorAll('.aig-button-frame .aig-button-line')].map((line) =>
      line.getAttribute('style'),
    );
  const initial = styles();
  expect(initial).toHaveLength(4);
  expect(initial.every((style) => style?.includes('--aig-line-position'))).toBe(true);
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
