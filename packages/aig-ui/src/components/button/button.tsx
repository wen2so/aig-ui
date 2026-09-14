'use client';
import { useEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { BrandMark, useAigBrand } from '../../theme/aig-provider.js';
import { useButtonContrast } from './button-contrast.js';

/** 执行动作的原生按钮。 */
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** 操作层级，默认 primary。 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** 控件尺寸，默认 md。 */
  size?: 'sm' | 'md' | 'lg';
  /** 保留名称和尺寸，并禁用重复激活。 */
  loading?: boolean;
  /** 本按钮的加载 SVG，优先于 AigProvider.brand.loadingIcon；使用 currentColor 继承颜色。 */
  loadingIcon?: ReactNode;
  /** 文字前的装饰图标，按钮名称由 children 或 aria-label 提供。 */
  leadingIcon?: ReactNode;
  /** 文字后的装饰图标，适合方向或展开提示。 */
  trailingIcon?: ReactNode;
}

/** 加载标记的按钮版：与全屏 LoadingMark 同源的迷你线绘，绘制、保持、撤回循环。 */
function ButtonMark() {
  const { mark } = useAigBrand();
  if (mark != null) return <BrandMark className="aig-button-mark" strokeWidth={14} />;
  return (
    <svg className="aig-button-mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle className="aig-button-mark-ring" cx="12" cy="12" r="11" />
      <circle className="aig-button-mark-arc" cx="12" cy="12" r="10" />
      <path className="aig-button-mark-tri" pathLength={1} d="M12 4.6 L19.7 17.8 L4.3 17.8 Z" />
      <line className="aig-button-mark-bar" pathLength={1} x1="7.2" y1="13.4" x2="16.8" y2="13.4" />
    </svg>
  );
}

/** 色块贯穿按钮高度，以梯形和少量不规则多边形分散拼接，端部自然贴边。 */
function createButtonFacets() {
  const count = 4 + Math.floor(Math.random() * 2);
  const weights = Array.from({ length: count }, () => 0.85 + Math.random() * 0.3);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const kink = 1 + Math.floor(Math.random() * (count - 1));
  const turn = 2 + Math.floor(Math.random() * (count - 2));
  let consumed = 0;
  const boundaries: number[][][] = [
    [
      [0, 0],
      [0, 100],
    ],
  ];
  for (let index = 1; index < count; index++) {
    consumed += weights[index - 1]!;
    const x = (consumed / total) * 300;
    // 两组斜边在不同位置转向，宽窄变化形成舒展的梯形，避免重复平行条纹。
    const skew = (index < turn ? 1 : -1) * (10 + Math.random() * 10);
    const points = [[x + skew, 0]];
    if (index === kink) {
      const ratio = 0.3 + Math.random() * 0.4;
      points.push([x + skew * (1 - 2 * ratio) + (Math.random() < 0.5 ? -1 : 1) * 12, ratio * 100]);
    }
    points.push([x - skew, 100]);
    boundaries.push(points);
  }
  boundaries.push([
    [300, 0],
    [300, 100],
  ]);
  const flip = Math.random() < 0.5;
  return Array.from({ length: count }, (_, index) => {
    const start = boundaries[index]!;
    const end = boundaries[index + 1]!;
    // 每块均连接上下边缘，共享斜线直接拼接，避免半高色块单独消失。
    const points = [start[0]!, ...end, ...start.slice(1).reverse()];
    return points.map(([x, y]) => `${x!.toFixed(2)},${(flip ? 100 - y! : y!).toFixed(2)}`).join(' ');
  });
}

/** 每次挂载只初始化一次结构和配色，重渲染与交互均复用原有刻面。 */
function initializeButtonFacets(element: SVGSVGElement | null) {
  if (!element || element.childElementCount) return;
  const depths = [0.88, 0.94, 1];
  element.replaceChildren(
    ...createButtonFacets().map((points) => {
      const facet = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      facet.setAttribute('points', points);
      facet.style.setProperty('--aig-facet-depth', String(depths[Math.floor(Math.random() * depths.length)]));
      return facet;
    }),
  );
}

/** 约四成刻面快慢交错闪切，稳定时刻覆盖后半程；整轮最长 800ms。 */
function replayButtonFacets(element: SVGSVGElement | null) {
  if (!element) return;
  initializeButtonFacets(element);
  delete element.dataset.playing;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const facets = [...element.querySelectorAll('polygon')];
  const order = [...facets];
  for (let index = order.length - 1; index > 0; index--) {
    const target = Math.floor(Math.random() * (index + 1));
    [order[index], order[target]] = [order[target]!, order[index]!];
  }
  const flashCount = Math.round(facets.length * 0.4);
  order.forEach((facet, index) => {
    const flashes = index < flashCount;
    facet.dataset.motion = flashes ? 'flash' : 'settle';
    // 闪切结束时刻铺满后半程，短促和较慢的节奏交替出现。
    const end = Math.round(900 + (620 * index) / (flashCount - 1));
    const duration = flashes
      ? Math.min(
          end - 100,
          index % 2 === 0 ? 560 + Math.round(Math.random() * 140) : 940 + Math.round(Math.random() * 140),
        )
      : 620;
    const delay = flashes
      ? end - duration
      : 180 + Math.round((700 * (index - flashCount)) / Math.max(1, order.length - flashCount - 1));
    // 统一缩放到 800ms，先确定结束时刻，避免独立取整造成超时。
    const scaledDuration = Math.round((duration * 800) / 1520);
    const scaledEnd = Math.round(((delay + duration) * 800) / 1520);
    facet.style.setProperty('--aig-facet-delay', `${scaledEnd - scaledDuration}ms`);
    facet.style.setProperty('--aig-facet-duration', `${scaledDuration}ms`);
  });
  void element.getBoundingClientRect();
  element.dataset.playing = '';
}

/** 同批按钮按行从左到右错开播放，清理时取消对应排队项。 */
const entranceQueue = new Map<SVGSVGElement, () => void>();
const cancellations = new WeakMap<SVGSVGElement, () => void>();
let entranceFrame = 0;
function queueButtonEntrance(element: SVGSVGElement, play: () => void) {
  entranceQueue.set(element, play);
  if (!entranceFrame) {
    entranceFrame = requestAnimationFrame(() => {
      entranceFrame = 0;
      const entries = [...entranceQueue].map(([node, callback]) => ({
        node,
        callback,
        rect: node.getBoundingClientRect(),
      }));
      entranceQueue.clear();
      entries.sort((a, b) => a.rect.top - b.rect.top);
      const rows: (typeof entries)[] = [];
      entries.forEach((entry) => {
        const row = rows.find((items) => Math.abs(items[0]!.rect.top - entry.rect.top) <= 12);
        if (row) row.push(entry);
        else rows.push([entry]);
      });
      rows.forEach((row) => {
        row.sort((a, b) => a.rect.left - b.rect.left);
        row.forEach(({ node, callback }, index) => {
          const timer = window.setTimeout(callback, index * 140);
          cancellations.set(node, () => window.clearTimeout(timer));
        });
      });
    });
  }
  return () => {
    entranceQueue.delete(element);
    cancellations.get(element)?.();
    cancellations.delete(element);
  };
}

/** 保留表单、键盘、ref 和可访问名称的按钮。 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingIcon,
  leadingIcon,
  trailingIcon,
  disabled,
  type = 'button',
  className = '',
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: ButtonProps) {
  const brand = useAigBrand();
  const highlightRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const contrastRef = useRef<HTMLSpanElement>(null);
  useButtonContrast(highlightRef, contentRef, contrastRef);
  const enteredRef = useRef(false);
  useEffect(() => {
    const element = highlightRef.current;
    initializeButtonFacets(element);
    if (disabled || loading) {
      if (element) delete element.dataset.playing;
      return;
    }
    if (enteredRef.current) return;
    let cancelEntrance: (() => void) | undefined;
    const play = () => {
      if (!element || enteredRef.current) return;
      cancelEntrance = queueButtonEntrance(element, () => {
        replayButtonFacets(element);
        enteredRef.current = true;
      });
    };
    if (document.readyState === 'complete') play();
    else window.addEventListener('load', play, { once: true });
    return () => {
      window.removeEventListener('load', play);
      cancelEntrance?.();
      if (element) delete element.dataset.playing;
    };
  }, [disabled, loading]);
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-aig-component="button"
      data-variant={variant}
      data-size={size}
      className={`aig-button ${className}`}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.defaultPrevented || disabled || loading || event.pointerType === 'touch') return;
        const element = highlightRef.current;
        if (element) {
          entranceQueue.delete(element);
          cancellations.get(element)?.();
          enteredRef.current = true;
          element.dataset.hovered = '';
        }
        replayButtonFacets(element);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (highlightRef.current && !event.currentTarget.matches(':focus-visible')) {
          delete highlightRef.current.dataset.hovered;
          delete highlightRef.current.dataset.playing;
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (highlightRef.current && !event.currentTarget.matches(':hover')) {
          delete highlightRef.current.dataset.hovered;
          delete highlightRef.current.dataset.playing;
        }
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (
          !event.defaultPrevented &&
          !disabled &&
          !loading &&
          event.currentTarget.matches(':focus-visible')
        ) {
          if (highlightRef.current) {
            entranceQueue.delete(highlightRef.current);
            cancellations.get(highlightRef.current)?.();
            enteredRef.current = true;
            highlightRef.current.dataset.hovered = '';
          }
          replayButtonFacets(highlightRef.current);
        }
      }}
    >
      <svg
        ref={highlightRef}
        className="aig-button-highlight"
        onAnimationEnd={(event) => {
          const element = event.currentTarget;
          // 最后一块播放结束后清理播放标记，稳定刻面继续决定浅字覆盖区域。
          if (
            element.getAnimations({ subtree: true }).every((animation) => animation.playState === 'finished')
          ) {
            delete element.dataset.playing;
          }
        }}
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      ></svg>
      <span className="aig-button-frame" aria-hidden="true" />
      {loading && (
        <span className="aig-button-loading" aria-hidden="true">
          {loadingIcon ?? brand.loadingIcon ?? <ButtonMark />}
        </span>
      )}
      <span ref={contentRef} className="aig-button-content">
        {leadingIcon != null && (
          <span className="aig-button-icon" data-slot="leading" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <span className="aig-button-label">{children}</span>
        {trailingIcon != null && (
          <span className="aig-button-icon" data-slot="trailing" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </span>
      <span ref={contrastRef} className="aig-button-contrast" aria-hidden="true" inert />
    </button>
  );
}
