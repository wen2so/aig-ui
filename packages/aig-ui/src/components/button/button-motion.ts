import {
  BUTTON_FLASH_FRAMES,
  combineButtonFacets,
  createButtonFacets,
  createButtonFlashFrames,
} from './button-facets.js';

/** 同一批挂载的按钮按视觉行错峰，行之间并行；120ms 对应参考素材的三帧。 */
const entranceQueue = new Map<SVGSVGElement, () => void>();
let entranceFrame = 0;

let seedSerial = 0;

/** 入场与交互共享冷却，切换页面或扫过多个按钮时也不会连续闪切。 */
let nextFlashAt = 0;
const FLASH_CHANCE = 0.08;
const FLASH_COOLDOWN_MS = 15_000;

function nextButtonSeed(previous = -1) {
  const seed = (Math.floor(Math.random() * 4294967296) ^ ++seedSerial) >>> 0;
  return seed === previous ? (seed + 1) >>> 0 : seed;
}

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

/** 尺寸变化时按同一种子适配网格与采样表，保留已有节点和播放进度。 */
function layoutButtonFacets(element: SVGSVGElement) {
  const button = element.closest('button');
  const width = button?.clientWidth || 300;
  const height = button?.clientHeight || 100;
  const seed = Number(element.dataset.facetSeed);
  const facets = createButtonFacets(width, height, seed);
  const frames = createButtonFlashFrames(facets, seed);
  const shapes = combineButtonFacets(facets);
  while (element.childElementCount > shapes.length) element.lastElementChild!.remove();
  shapes.forEach(({ points, clipped, group, kind, cells }, index) => {
    let facet = element.children[index] as SVGPolygonElement | undefined;
    if (!facet) {
      facet = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      element.append(facet);
    }
    facet.dataset.clipped = String(clipped);
    facet.dataset.facetGroup = String(group);
    facet.dataset.facetKind = kind;
    facet.dataset.facetCells = String(cells);
    if (facet.getAttribute('points') !== points) facet.setAttribute('points', points);
    frames.forEach((frame, offset) => {
      const name = `--aig-facet-frame-${BUTTON_FLASH_FRAMES[offset]}`;
      const value = String(frame[group]);
      if (facet.style.getPropertyValue(name) !== value) facet.style.setProperty(name, value);
    });
  });
}

/** 挂载时生成一轮网格和随机组合，普通重渲染复用当前种子。 */
export function initializeButtonFacets(element: SVGSVGElement | null) {
  if (!element || element.dataset.facetSeed !== undefined) return;
  element.dataset.facetSeed = String(nextButtonSeed());
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
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const now = performance.now();
  if (now < nextFlashAt || Math.random() >= FLASH_CHANCE) return;
  nextFlashAt = now + FLASH_COOLDOWN_MS;
  delete element.dataset.playing;
  if (!entrance) {
    element.dataset.facetSeed = String(nextButtonSeed(Number(element.dataset.facetSeed)));
    layoutButtonFacets(element);
    element.parentElement?.style.setProperty('--aig-button-enter-delay', '0ms');
  }
  void element.getBoundingClientRect();
  element.dataset.playing = entrance ? 'entrance' : 'interaction';
}
