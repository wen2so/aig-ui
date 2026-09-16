import { expect, it } from 'vitest';
import { BUTTON_FLASH_FRAMES, createButtonFacets, createButtonFlashFrames } from './button-facets.js';

type Point = [number, number];
const parse = (points: string) => points.split(' ').map((point) => point.split(',').map(Number) as Point);
const area = (points: Point[]) =>
  Math.abs(
    points.reduce((sum, point, i) => {
      const next = points[(i + 1) % points.length]!;
      return sum + point[0] * next[1] - next[0] * point[1];
    }, 0),
  ) / 2;
const rowSpan = (shapes: Point[][], y: number) => {
  const xs = shapes
    .flat()
    .filter((point) => point[1] === y)
    .map((point) => point[0]);
  return Math.max(...xs) - Math.min(...xs);
};

it.each([
  [80, 32],
  [140, 26],
  [220, 40],
  [160, 80],
  [800, 32],
])('%s×%s 网格完整覆盖，内部三角同斜率，两单元组成等边长平行四边形', (width, height) => {
  for (let seed = 0; seed < 32; seed++) {
    const facets = createButtonFacets(width!, height!, seed);
    const shapes = facets.map(({ points }) => parse(points));
    expect(shapes.reduce((sum, points) => sum + area(points), 0)).toBeCloseTo(30000, 1);
    const runs: number[] = [];
    shapes.forEach((points) => {
      expect([3, 4]).toContain(points.length);
      const crosses: number[] = [];
      points.forEach((point, i) => {
        expect(point[0]).toBeGreaterThanOrEqual(0);
        expect(point[0]).toBeLessThanOrEqual(300);
        expect(point[1]).toBeGreaterThanOrEqual(0);
        expect(point[1]).toBeLessThanOrEqual(100);
        const next = points[(i + 1) % points.length]!;
        const after = points[(i + 2) % points.length]!;
        const dx = next[0] - point[0],
          dy = next[1] - point[1];
        if (Math.abs(dx) > 0.001 && Math.abs(dy) > 0.001) runs.push(Math.abs(dx / dy) * 100);
        crosses.push(dx * (after[1] - next[1]) - dy * (after[0] - next[0]));
      });
      expect(crosses.every((value) => value > 0) || crosses.every((value) => value < 0)).toBe(true);
    });
    expect(Math.max(...runs) - Math.min(...runs)).toBeLessThan(0.05);
    expect((runs[0]! * width!) / 300).toBeCloseTo(Math.min(height! / Math.sqrt(3), width! / 8), 1);
    const full = shapes.filter((_, index) => !facets[index]!.clipped);
    full.forEach((triangle) => {
      expect(triangle).toHaveLength(3);
      const apex = triangle[1]!;
      expect(apex[0]).toBeCloseTo((triangle[0]![0] + triangle[2]![0]) / 2, 3);
    });
    const base = Math.abs(full[0]![2]![0] - full[0]![0]![0]);
    const pair = full.slice(0, 2);
    expect(rowSpan(pair, 0)).toBeCloseTo(base, 3);
    expect(rowSpan(pair, 100)).toBeCloseTo(base, 3);
  }
});

it('随机闪切只包含完整三角和平行四边形，组间分离、排除裁切块，同种子可复算', () => {
  const plans = new Set<string>();
  const groupSizes = new Set<number>();
  for (let seed = 0; seed < 64; seed++) {
    const facets = createButtonFacets(140, 26, seed);
    const frames = createButtonFlashFrames(facets, seed);
    expect(frames).toEqual(createButtonFlashFrames(facets, seed));
    plans.add(JSON.stringify(frames));
    expect(new Set(frames.map((frame) => frame.join(','))).size).toBe(BUTTON_FLASH_FRAMES.length);
    frames.forEach((frame, index) => {
      expect(frame).toHaveLength(facets.length);
      if (BUTTON_FLASH_FRAMES[index] === 280) return;
      expect(frame.some((value) => value === 0)).toBe(true);
      expect(frame.some((value) => value > 0)).toBe(true);
      const lit = BUTTON_FLASH_FRAMES[index] === 80 ? 0.16 : 1;
      expect(frame.every((value) => value === 0 || value === lit)).toBe(true);
      frame.forEach((value, cell) => {
        if (facets[cell]!.clipped) expect(value).toBe(0);
      });
      const binary = frame.map((value) => Number(value > 0)).join('');
      const groups = [...binary.matchAll(/1+/g)];
      expect(groups.length).toBeLessThanOrEqual(2);
      groups.forEach((group, position) => {
        expect([1, 2]).toContain(group[0].length);
        groupSizes.add(group[0].length);
        const previous = groups[position - 1];
        if (previous) expect(group.index - previous.index - previous[0].length).toBeGreaterThanOrEqual(2);
      });
    });
  }
  expect(plans.size).toBe(64);
  expect([...groupSizes].sort()).toEqual([1, 2]);
});
