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

/** 三角形和四边形共享边界；宽阔主体与窄斜切交替，避免平均分成条纹。 */
function createButtonFacets() {
  const count = 4 + Math.floor(Math.random() * 2);
  const weights = Array.from({ length: count }, (_, index) => (index % 2 ? 0.7 : 1.3) + Math.random() * 0.2);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const triangle = count - 2;
  let consumed = 0;
  const boundaries = [
    [
      [0, 0],
      [0, 100],
    ],
  ];
  for (let index = 1; index < count; index++) {
    consumed += weights[index - 1]!;
    const x = (consumed / total) * 300;
    const skew = (index < triangle ? -1 : 1) * (16 + Math.random() * 6);
    boundaries.push([
      [x + skew, 0],
      [x - skew, 100],
    ]);
  }
  boundaries.push([
    [300, 0],
    [300, 100],
  ]);
  const tip = (boundaries[triangle]![0]![0]! + boundaries[triangle + 1]![0]![0]!) / 2;
  boundaries[triangle]![0]![0] = tip;
  boundaries[triangle + 1]![0]![0] = tip;
  const flip = Math.random() < 0.5;
  return Array.from({ length: count }, (_, index) => {
    const start = boundaries[index]!;
    const end = boundaries[index + 1]!;
    const points = [start[0]!, ...end, start[1]!].filter(
      (point, position, vertices) =>
        position === 0 || point[0] !== vertices[position - 1]![0] || point[1] !== vertices[position - 1]![1],
    );
    return {
      points: points.map(([x, y]) => `${x!.toFixed(2)},${(flip ? 100 - y! : y!).toFixed(2)}`).join(' '),
      motion: index === triangle ? 'tip' : index === 1 ? 'cut' : 'body',
    };
  });
}

/** 挂载期间固定几何、角色和深度，交互与重渲染只改变播放状态。 */
export function initializeButtonFacets(element: SVGSVGElement | null) {
  if (!element || element.childElementCount) return;
  const depths = [1, 0.88, 0.94];
  element.replaceChildren(
    ...createButtonFacets().map(({ points, motion }, index) => {
      const facet = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      facet.setAttribute('points', points);
      facet.dataset.motion = motion;
      facet.style.setProperty('--aig-facet-depth', String(depths[index % depths.length]));
      return facet;
    }),
  );
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
