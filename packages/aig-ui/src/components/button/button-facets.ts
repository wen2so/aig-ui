type Point = readonly [number, number];

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
 * 用交替朝向的等腰三角形铺满按钮。两单元组成平行四边形，三单元组成梯形。
 * 基础平行四边形的上、下边等于单三角的底边；合并更多单元时为整倍数。
 * 通常使用 60° 斜边，紧凑按钮统一加陡；一轮内只随机网格整体偏移和上下朝向。
 */
export function createButtonFacets(width: number, height: number, seed: number) {
  const random = seededRandom(seed);
  const run = Math.min(height / Math.sqrt(3), width / 8);
  const phase = random() * 2;
  const flip = random() < 0.5;
  const facets: { points: string; clipped: boolean }[] = [];
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
    });
  }
  return facets;
}

/** 40ms 采样点；280ms 短暂补齐，其余时间点独立组合，600ms 后进入收束。 */
export const BUTTON_FLASH_FRAMES = [80, 240, 280, 360, 400, 440, 480, 520, 560, 600] as const;

/** 随机点亮或挖空一至两组相邻单元，每组一至三个，形成三角、平行四边形与梯形。 */
function randomCombination(count: number, random: () => number) {
  const cutout = random() < 0.5;
  const values = Array<number>(count).fill(cutout ? 1 : 0);
  const occupied = new Set<number>();
  const groups = 1 + Math.floor(random() * 2);
  for (let group = 0; group < groups; group++) {
    const length = 1 + Math.floor(random() * 3);
    const starts = Array.from({ length: count - length + 1 }, (_, start) => start).filter((start) =>
      Array.from({ length: length + 2 }, (_, offset) => start + offset - 1).every(
        (cell) => !occupied.has(cell),
      ),
    );
    if (!starts.length) break;
    const start = starts[Math.floor(random() * starts.length)]!;
    // 满亮拼块避免半透明描边叠加，让共享边在合成后的平行四边形、梯形内部消失。
    const opacity = cutout ? 0 : 1;
    for (let cell = start; cell < start + length; cell++) {
      occupied.add(cell);
      values[cell] = opacity;
    }
  }
  return values;
}

/** 每轮生成完整采样表，CSS 按表硬切；同组单元共用亮度，视觉上合成连续块面。 */
export function createButtonFlashFrames(count: number, seed: number) {
  const random = seededRandom(seed ^ 0x9e3779b9);
  const used = new Set<string>();
  return BUTTON_FLASH_FRAMES.map((time) => {
    if (time === 280) return Array<number>(count).fill(1);
    let values = randomCombination(count, random);
    let signature = values.join(',');
    for (let attempt = 0; used.has(signature) && attempt < 32; attempt++) {
      values = randomCombination(count, random);
      signature = values.join(',');
    }
    used.add(signature);
    return time === 80 ? values.map((value) => value * 0.16) : values;
  });
}
