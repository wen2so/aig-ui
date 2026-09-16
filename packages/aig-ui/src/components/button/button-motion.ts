/** 同一批挂载的按钮按视觉行错峰，行之间并行；120ms 对应参考素材的三帧。 */
const entranceQueue = new Map<SVGSVGElement, () => void>();
let entranceFrame = 0;

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
export function createButtonFacets(width: number, height: number, flip = false) {
  const run = (Math.min(height / Math.sqrt(3), width / 8) * 300) / width;
  const body = (300 - 5 * run) / 3;
  const boundaries = [
    [
      [0, 0],
      [0, 100],
    ],
    [
      [body, 0],
      [body + run, 100],
    ],
    [
      [body + 2 * run, 0],
      [body + 3 * run, 100],
    ],
    [
      [2 * body + 4 * run, 0],
      [2 * body + 3 * run, 100],
    ],
    [
      [2 * body + 4 * run, 0],
      [2 * body + 5 * run, 100],
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
      points: points.map(([x, y]) => `${x!.toFixed(4)},${(flip ? 100 - y! : y!).toFixed(4)}`).join(' '),
      motion: index === 3 ? 'tip' : index === 1 ? 'cut' : 'body',
    };
  });
}

/** 布局改变时适配实际尺寸，保留原有节点、镜像、色阶和播放进度。 */
function layoutButtonFacets(element: SVGSVGElement) {
  const button = element.closest('button');
  const width = button?.clientWidth || 300;
  const height = button?.clientHeight || 100;
  createButtonFacets(width, height, element.dataset.facetFlip === 'true').forEach(({ points }, index) => {
    const facet = element.children[index]!;
    if (facet.getAttribute('points') !== points) facet.setAttribute('points', points);
  });
}

/** 仅随机选择整体上下镜像，顶点、角度和比例不再分别随机化。 */
export function initializeButtonFacets(element: SVGSVGElement | null) {
  if (!element || element.childElementCount) return;
  element.dataset.facetFlip = String(Math.random() < 0.5);
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

/** 字体、宽度或换行改变时同步规则几何；普通 hover 复用原有布局。 */
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
  if (!entrance) element.parentElement?.style.setProperty('--aig-button-enter-delay', '0ms');
  void element.getBoundingClientRect();
  element.dataset.playing = entrance ? 'entrance' : 'interaction';
}
