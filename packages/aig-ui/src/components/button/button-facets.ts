type Point = readonly [number, number];

export interface ButtonFacet {
  points: string;
  clipped: boolean;
  /** 同一来源块的拆分单元始终共享一条动画。 */
  group: number;
  kind: 'triangle' | 'parallelogram' | 'trapezoid' | 'edge';
}

/** 同一轮用种子复算网格与组合，尺寸变化不会重新抽取一轮动画。 */
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** 网格只在按钮左右边界裁切，内部顶点始终留在统一三角网格上。 */
function clipAtX(points: Point[], boundary: number, keepRight: boolean): Point[] {
  const result: Point[] = [];
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length]!;
    const inside = keepRight ? point[0] >= boundary : point[0] <= boundary;
    const nextInside = keepRight ? next[0] >= boundary : next[0] <= boundary;
    if (inside) result.push(point);
    if (inside !== nextInside) {
      const ratio = (boundary - point[0]) / (next[0] - point[0]);
      result.push([boundary, point[1] + (next[1] - point[1]) * ratio]);
    }
  });
  return result.filter((point, index) => {
    const previous = result[(index + result.length - 1) % result.length]!;
    return Math.abs(point[0] - previous[0]) + Math.abs(point[1] - previous[1]) > 0.00001;
  });
}

/**
 * 用三角网格拼出原始块并保留归属，梯形内部的拆分单元不独立闪切。
 * 基础平行四边形的上、下边等于单三角的底边；合并更多单元时为整倍数。
 * 通常使用 60° 斜边，紧凑按钮统一加陡；一轮内只随机网格整体偏移和上下朝向。
 */
export function createButtonFacets(width: number, height: number, seed: number) {
  const random = seededRandom(seed);
  const run = Math.min(height / Math.sqrt(3), width / 8);
  const phase = random() * 2;
  const flip = random() < 0.5;
  const facets: ButtonFacet[] = [];
  // phase 最大接近 2，最左侧第 -3 个单元仍可能有一小段落在按钮内。
  for (let index = -3; index < Math.ceil(width / run) + 1; index++) {
    const x = (index + phase) * run;
    const baseY = (index % 2 === 0) !== flip ? 0 : height;
    const vertices: Point[] = [
      [x, baseY],
      [x + run, height - baseY],
      [x + 2 * run, baseY],
    ];
    const points = clipAtX(clipAtX(vertices, 0, true), width, false);
    if (points.length < 3) continue;
    facets.push({
      points: points
        .map(([px, py]) => `${((px * 300) / width).toFixed(4)},${((py * 100) / height).toFixed(4)}`)
        .join(' '),
      clipped: x < 0 || x + 2 * run > width,
      group: facets.length,
      kind: 'edge',
    });
  }
  const first = facets.findIndex((facet) => !facet.clipped);
  const count = facets.filter((facet) => !facet.clipped).length;
  // 三个完整单元构成一个梯形主体，剩余单元随机组成独立三角或平行四边形。
  const trapezoid = first + Math.floor(random() * (count - 2));
  const end = first + count;
  for (let index = first; index < end;) {
    const boundary = index < trapezoid ? trapezoid : end;
    const length = index === trapezoid ? 3 : Math.min(1 + Math.floor(random() * 2), boundary - index);
    const kind = length === 3 ? 'trapezoid' : length === 2 ? 'parallelogram' : 'triangle';
    for (let cell = index; cell < index + length; cell++) {
      facets[cell]!.group = index;
      facets[cell]!.kind = kind;
    }
    index += length;
  }
  // 独立块至少保留三角与平行四边形各一组，紧凑按钮也有两种可变轮廓。
  const independent = facets.filter((facet) => facet.kind === 'triangle' || facet.kind === 'parallelogram');
  if (!independent.some((facet) => facet.kind === 'triangle')) {
    const start = independent[0]!.group;
    for (let cell = start; cell < start + 2; cell++) {
      facets[cell]!.group = cell;
      facets[cell]!.kind = 'triangle';
    }
  } else if (!independent.some((facet) => facet.kind === 'parallelogram')) {
    const start = facets.findIndex(
      (facet, index) => facet.kind === 'triangle' && facets[index + 1]?.kind === 'triangle',
    );
    for (let cell = start; cell < start + 2; cell++) {
      facets[cell]!.group = start;
      facets[cell]!.kind = 'parallelogram';
    }
  }
  facets.forEach((facet, index) => {
    if (facet.clipped) facet.group = index < first ? 0 : end;
  });
  return facets;
}

/** 合并同源单元为单个凸多边形，半透明阶段也不会出现内部描边叠加。 */
export function combineButtonFacets(facets: readonly ButtonFacet[]) {
  const groups = new Map<number, ButtonFacet[]>();
  facets.forEach((facet) => groups.set(facet.group, [...(groups.get(facet.group) ?? []), facet]));
  return [...groups.values()].map((members) => {
    const points: Point[] = [...new Set(members.flatMap((facet) => facet.points.split(' ')))].map((point) => {
      const [x, y] = point.split(',').map(Number);
      return [x!, y!];
    });
    points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (a: Point, b: Point, c: Point) =>
      (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const half = (vertices: Point[]) => {
      const hull: Point[] = [];
      for (const point of vertices) {
        while (hull.length >= 2 && cross(hull[hull.length - 2]!, hull[hull.length - 1]!, point) <= 0.00001)
          hull.pop();
        hull.push(point);
      }
      return hull.slice(0, -1);
    };
    const outline = [...half(points), ...half([...points].reverse())];
    return {
      ...members[0]!,
      points: outline.map((point) => point.join(',')).join(' '),
      cells: members.length,
    };
  });
}

/** 40ms 采样点；280ms 短暂补齐，其余时间点独立组合，600ms 后进入收束。 */
export const BUTTON_FLASH_FRAMES = [80, 240, 280, 360, 400, 440, 480, 520, 560, 600] as const;

/** 以原始块为单位抽取闪切组合；梯形主体及边缘填充只统一显现和收束。 */
function randomCombination(facets: readonly ButtonFacet[], random: () => number) {
  let candidates = facets.flatMap((facet, index) =>
    facet.group === index && (facet.kind === 'triangle' || facet.kind === 'parallelogram')
      ? [{ start: index, length: facet.kind === 'triangle' ? 1 : 2 }]
      : [],
  );
  const active = new Set<number>();
  const count = Math.min(Math.max(1, candidates.length - 1), 1 + Math.floor(random() * 2));
  for (let index = 0; index < count && candidates.length; index++) {
    const selected = Math.floor(random() * candidates.length);
    const group = candidates.splice(selected, 1)[0]!;
    active.add(group.start);
    candidates = candidates.filter(
      (other) =>
        other.start >= group.start + group.length + 2 || group.start >= other.start + other.length + 2,
    );
  }
  return facets.map((facet) => (active.has(facet.group) ? 1 : 0));
}

/** 每轮生成完整采样表，CSS 按表硬切；同组单元共用亮度，视觉上合成连续块面。 */
export function createButtonFlashFrames(facets: readonly ButtonFacet[], seed: number) {
  const count = facets.length;
  const random = seededRandom(seed ^ 0x9e3779b9);
  let previous = '';
  return BUTTON_FLASH_FRAMES.map((time) => {
    if (time === 280) return Array<number>(count).fill(1);
    let values = randomCombination(facets, random);
    let signature = values.join(',');
    for (let attempt = 0; signature === previous && attempt < 16; attempt++) {
      values = randomCombination(facets, random);
      signature = values.join(',');
    }
    previous = signature;
    return time === 80 ? values.map((value) => value * 0.16) : values;
  });
}
