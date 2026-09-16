/** 同一批挂载的按钮按视觉行错峰，行之间并行；120ms 对应参考素材的三帧。 */
const entranceQueue = new Map<SVGSVGElement, () => void>();
let entranceFrame = 0;

/** 只调整规则主体的分配比例；斜带边长、三角底边与斜率继续共用约束。 */
const facetProfiles = [
  [1, 1, 1],
  [1.35, 0.65, 1],
  [0.7, 1.45, 0.85],
  [1.1, 1.15, 0.75],
] as const;
export const BUTTON_FACET_LAYOUT_COUNT = facetProfiles.length * 2;
let nextButtonLayout = 0;

export function queueButtonEntrance(element: SVGSVGElement, play: () => void) {
  entranceQueue.set(element, play);
  if (!entranceFrame) {
    entranceFrame = requestAnimationFrame(() => {
      entranceFrame = 0;
      const entries = [...entranceQueue].map(([node, start]) => ({
        node,
        start,
        bounds: node.getBoundingClientRect(),
      }));
      entranceQueue.clear();
      entries.sort((a, b) => a.bounds.top - b.bounds.top || a.bounds.left - b.bounds.left);
      let rowTop = -Infinity;
      let column = 0;
      for (const entry of entries) {
        if (!entry.node.isConnected) continue;
        if (Math.abs(entry.bounds.top - rowTop) > 8) {
          rowTop = entry.bounds.top;
          column = 0;
        }
        // 长工具栏限制整体等待时间，避免最后几个操作迟迟没有反馈。
        entry.node.parentElement?.style.setProperty(
          '--aig-button-enter-delay',
          `${Math.min(column++, 3) * 120}ms`,
        );
        entry.start();
      }
    });
  }
  return () => {
    entranceQueue.delete(element);
    if (!entranceQueue.size && entranceFrame) {
      cancelAnimationFrame(entranceFrame);
      entranceFrame = 0;
    }
  };
}

/**
 * 两端直角梯形、平行四边形、中部等腰梯形和等腰三角形共享同一斜率。
 * 平行四边形的上、下边与三角形底边等长，均为水平偏移的两倍。
 * 通常使用 60°；紧凑按钮统一加陡，给主体留出足够宽度。
 * 按实际宽高换算到 300×100 坐标，避免固定 viewBox 任意拉伸斜角。
 */
export function createButtonFacets(width: number, height: number, flip = false, layout = 0) {
  const run = (Math.min(height / Math.sqrt(3), width / 8) * 300) / width;
  const body = (300 - 5 * run) / 3;
  const profile = facetProfiles[layout % facetProfiles.length]!;
  const left = body * profile[0];
  const middle = body * profile[1];
  const mirror = layout >= facetProfiles.length;
  const boundaries = [
    [
      [0, 0],
      [0, 100],
    ],
    [
      [left, 0],
      [left + run, 100],
    ],
    [
      [left + 2 * run, 0],
      [left + 3 * run, 100],
    ],
    [
      [left + middle + 4 * run, 0],
      [left + middle + 3 * run, 100],
    ],
    [
      [left + middle + 4 * run, 0],
      [left + middle + 5 * run, 100],
    ],
    [
      [300, 0],
      [300, 100],
    ],
  ];
  return Array.from({ length: 5 }, (_, index) => {
    const start = boundaries[index]!;
    const end = boundaries[index + 1]!;
    const points = [start[0]!, ...end, start[1]!].filter(
      (point, position, vertices) =>
        position === 0 || point[0] !== vertices[position - 1]![0] || point[1] !== vertices[position - 1]![1],
    );
    return {
      points: points
        .map(([x, y]) => `${(mirror ? 300 - x! : x!).toFixed(4)},${(flip ? 100 - y! : y!).toFixed(4)}`)
        .join(' '),
      motion: index === 3 ? 'tip' : index === 1 ? 'cut' : 'body',
    };
  });
}

/** 布局改变时适配实际尺寸，保留原有节点、镜像、色阶和播放进度。 */
function layoutButtonFacets(element: SVGSVGElement) {
  const button = element.closest('button');
  const width = button?.clientWidth || 300;
  const height = button?.clientHeight || 100;
  createButtonFacets(
    width,
    height,
    element.dataset.facetFlip === 'true',
    Number(element.dataset.facetLayout),
  ).forEach(({ points }, index) => {
    const facet = element.children[index]!;
    if (facet.getAttribute('points') !== points) facet.setAttribute('points', points);
  });
}

/** 相邻挂载从不同规则分区起步，尺寸与普通重渲染复用当前方案。 */
export function initializeButtonFacets(element: SVGSVGElement | null) {
  if (!element || element.childElementCount) return;
  element.dataset.facetFlip = String(Math.random() < 0.5);
  const layout = nextButtonLayout++ % BUTTON_FACET_LAYOUT_COUNT;
  element.dataset.facetLayout = String(layout);
  element.dataset.sequence = layout % 2 ? 'reverse' : 'forward';
  const depths = [1, 0.88, 0.94];
  element.replaceChildren(
    ...createButtonFacets(300, 100).map(({ motion }, index) => {
      const facet = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      facet.dataset.motion = motion;
      facet.style.setProperty('--aig-facet-depth', String(depths[index % depths.length]));
      return facet;
    }),
  );
  layoutButtonFacets(element);
}

/** 字体、宽度或换行改变时适配当前分区，保留本轮几何关系和动画进度。 */
export function observeButtonFacets(element: SVGSVGElement | null) {
  initializeButtonFacets(element);
  const button = element?.closest('button');
  if (!element || !button || typeof ResizeObserver === 'undefined') return;
  const observer = new ResizeObserver(() => layoutButtonFacets(element));
  observer.observe(button);
  return () => observer.disconnect();
}

/** 前段按 40ms 帧格硬切，后段淡出到当前选中或悬停状态。 */
export function replayButtonFacets(element: SVGSVGElement | null, entrance = false) {
  if (!element) return;
  initializeButtonFacets(element);
  delete element.dataset.playing;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  if (!entrance) {
    // 排除上一轮分区，避免随机抽到同一构图；序列同步交替，先出现的图形随轮次变化。
    const previous = Number(element.dataset.facetLayout);
    element.dataset.facetLayout = String(
      (previous + 1 + Math.floor(Math.random() * (BUTTON_FACET_LAYOUT_COUNT - 1))) %
        BUTTON_FACET_LAYOUT_COUNT,
    );
    element.dataset.sequence = element.dataset.sequence === 'forward' ? 'reverse' : 'forward';
    layoutButtonFacets(element);
    element.parentElement?.style.setProperty('--aig-button-enter-delay', '0ms');
  }
  void element.getBoundingClientRect();
  element.dataset.playing = entrance ? 'entrance' : 'interaction';
}
