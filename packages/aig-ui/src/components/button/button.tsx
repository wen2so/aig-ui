'use client';
import { useEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { BrandMark, useAigBrand } from '../../theme/aig-provider.js';
import { useButtonContrast } from './button-contrast.js';

/** 执行动作的原生按钮。 */
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** 操作层级，默认 primary。 */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** 语义色；danger 层级固定使用危险色，其余默认使用品牌色。 */
  tone?: 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
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

/** 三角形与四边形贯穿按钮高度拼接，端部以宽阔梯形贴边。 */
function createButtonFacets() {
  const count = 4 + Math.floor(Math.random() * 2);
  const weights = Array.from({ length: count }, () => 0.85 + Math.random() * 0.3);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const triangle = 1 + Math.floor(Math.random() * (count - 2));
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
    boundaries.push([
      [x + skew, 0],
      [x - skew, 100],
    ]);
  }
  boundaries.push([
    [300, 0],
    [300, 100],
  ]);
  // 单块在上边缘收成顶点，底边保持原有宽度，相邻块共享顶点形成四边形。
  const tip = (boundaries[triangle]![0]![0]! + boundaries[triangle + 1]![0]![0]!) / 2;
  boundaries[triangle]![0]![0] = tip;
  boundaries[triangle + 1]![0]![0] = tip;
  const flip = Math.random() < 0.5;
  return Array.from({ length: count }, (_, index) => {
    const start = boundaries[index]!;
    const end = boundaries[index + 1]!;
    // 每块均连接上下边缘，共享斜线直接拼接，避免半高色块单独消失。
    const points = [start[0]!, ...end, ...start.slice(1).reverse()].filter(
      (point, position, vertices) =>
        position === 0 || point[0] !== vertices[position - 1]![0] || point[1] !== vertices[position - 1]![1],
    );
    return points.map(([x, y]) => `${x!.toFixed(2)},${(flip ? 100 - y! : y!).toFixed(2)}`).join(' ');
  });
}

/** 每次挂载只初始化一次结构和配色，重渲染与交互均复用原有刻面。 */
function initializeButtonFacets(element: SVGSVGElement | null) {
  if (!element || element.childElementCount) return;
  const depths = [0.88, 0.94, 1].sort(() => Math.random() - 0.5);
  element.replaceChildren(
    ...createButtonFacets().map((points, index) => {
      const facet = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      facet.setAttribute('points', points);
      facet.style.setProperty('--aig-facet-depth', String(depths[index % depths.length]));
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

/** 每次挂载选择一组协调布局，上下横线互补、两侧竖线错向移动。 */
function initializeButtonLines(element: HTMLSpanElement | null) {
  if (!element || element.dataset.initialized) return;
  element.dataset.initialized = '';
  const profiles = [
    { start: 20, end: 54, length: 18, direction: 1 },
    { start: 54, end: 20, length: 16, direction: -1 },
    { start: 30, end: 48, length: 20, direction: 1 },
  ];
  const profile = profiles[Math.floor(Math.random() * profiles.length)]!;
  const offset = Math.random() * 4 - 2;
  element.querySelectorAll<HTMLElement>('.aig-button-line').forEach((line, index) => {
    const leading = index % 2 === 0;
    line.style.setProperty('--aig-line-position', `${(leading ? profile.start : profile.end) + offset}%`);
    line.style.setProperty('--aig-line-length', `${profile.length + (leading ? 0 : 2)}%`);
    line.style.setProperty('--aig-line-rest', leading ? '0.65' : '1');
    line.style.setProperty('--aig-line-active', leading ? '1.25' : '0.65');
    line.style.setProperty('--aig-line-shift', `${profile.direction * (leading ? 35 : -35)}%`);
    line.style.setProperty('--aig-line-delay', `${index < 2 ? 0 : 60}ms`);
  });
}

/** 保留表单、键盘、ref 和可访问名称的按钮。 */
export function Button({
  variant = 'primary',
  tone = 'brand',
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
  const interactedRef = useRef(false);
  /** 首次交互播放刻面，后续交互直接保持稳定高亮。 */
  const activateHighlight = () => {
    const element = highlightRef.current;
    if (!element) return;
    element.dataset.hovered = '';
    if (!interactedRef.current) {
      interactedRef.current = true;
      replayButtonFacets(element);
    }
  };
  useEffect(() => {
    const element = highlightRef.current;
    initializeButtonFacets(element);
    if (disabled || loading) {
      if (element) delete element.dataset.playing;
      return;
    }
    return () => {
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
      data-tone={variant === 'danger' ? 'danger' : tone}
      data-size={size}
      className={`aig-button ${className}`}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.defaultPrevented || disabled || loading || event.pointerType === 'touch') return;
        activateHighlight();
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
          activateHighlight();
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
      <span ref={initializeButtonLines} className="aig-button-frame" aria-hidden="true">
        <span className="aig-button-line" data-edge="top" />
        <span className="aig-button-line" data-edge="bottom" />
        <span className="aig-button-line" data-edge="start" />
        <span className="aig-button-line" data-edge="end" />
      </span>
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
