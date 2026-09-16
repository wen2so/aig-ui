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
 * 用交替朝向的等腰三角形铺满按钮，闪切使用单三角或双单元平行四边形。
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

/** 只点亮完整三角或双单元平行四边形；裁切块、梯形和反向挖空不参与闪切。 */
function randomCombination(facets: readonly { clipped: boolean }[], random: () => number) {
  const count = facets.length;
  const values = Array<number>(count).fill(0);
  const occupied = new Set<number>();
  const groups = 1 + Math.floor(random() * 2);
  for (let group = 0; group < groups; group++) {
    const length = 1 + Math.floor(random() * 2);
    const starts = Array.from({ length: count - length + 1 }, (_, start) => start).filter(
      (start) =>
        facets.slice(start, start + length).every((facet) => !facet.clipped) &&
        // 留出两个空单元，让轮廓之间有实际间距，避免尖端相接形成锯齿。
        Array.from({ length: length + 4 }, (_, offset) => start + offset - 2).every(
          (cell) => !occupied.has(cell),
        ),
    );
    if (!starts.length) break;
    const start = starts[Math.floor(random() * starts.length)]!;
    // 满亮拼块避免半透明描边叠加，让平行四边形内部共享边消失。
    for (let cell = start; cell < start + length; cell++) {
      occupied.add(cell);
      values[cell] = 1;
    }
  }
  return values;
}

/** 每轮生成完整采样表，CSS 按表硬切；同组单元共用亮度，视觉上合成连续块面。 */
export function createButtonFlashFrames(facets: readonly { clipped: boolean }[], seed: number) {
  const count = facets.length;
  const random = seededRandom(seed ^ 0x9e3779b9);
  const used = new Set<string>();
  return BUTTON_FLASH_FRAMES.map((time) => {
    if (time === 280) return Array<number>(count).fill(1);
    let values = randomCombination(facets, random);
    let signature = values.join(',');
    for (let attempt = 0; used.has(signature) && attempt < 32; attempt++) {
      values = randomCombination(facets, random);
      signature = values.join(',');
    }
    used.add(signature);
    return time === 80 ? values.map((value) => value * 0.16) : values;
  });
}
