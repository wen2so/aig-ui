'use client';
import { useEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { BrandMark, useAigBrand } from '../../theme/aig-provider.js';

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

/** 将矩形分为二至四列，每列沿随机对角线分成两个直角三角形。 */
function createButtonFacets() {
  const columns = 2 + Math.floor(Math.random() * 3);
  const edges = Array.from({ length: columns + 1 }, (_, index) =>
    index === 0 ? 0 : index === columns ? 300 : ((index + (Math.random() - 0.5) * 0.36) * 300) / columns,
  );
  return edges.slice(0, -1).flatMap((left, index) => {
    const right = edges[index + 1]!;
    const corners = [
      [left, 0],
      [right, 0],
      [right, 100],
      [left, 100],
    ];
    const triangles =
      Math.random() < 0.5
        ? [
            [0, 1, 2],
            [0, 2, 3],
          ]
        : [
            [0, 1, 3],
            [1, 2, 3],
          ];
    return triangles.map((indices) => {
      const points = indices.map((i) => corners[i]!);
      const cx = points.reduce((sum, point) => sum + point[0]!, 0) / 3;
      const cy = points.reduce((sum, point) => sum + point[1]!, 0) / 3;
      // 等比向重心收拢，保留细缝和水平、垂直两条直角边。
      return points
        .map(([x, y]) => `${(cx + (x! - cx) * 0.97).toFixed(2)},${(cy + (y! - cy) * 0.97).toFixed(2)}`)
        .join(' ');
    });
  });
}

/** 重建本轮刻面，颜色使用三档浅色，闪切由样式控制。 */
function replayButtonFacets(element: SVGSVGElement | null) {
  if (!element) return;
  delete element.dataset.playing;
  const depths = [0.14, 0.22, 0.3];
  const facets = createButtonFacets().map((points) => {
    const facet = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    facet.setAttribute('points', points);
    facet.style.setProperty('--aig-facet-depth', String(depths[Math.floor(Math.random() * depths.length)]));
    facet.style.setProperty('--aig-facet-delay', `${Math.round(Math.random() * 280)}ms`);
    facet.style.setProperty('--aig-facet-duration', `${1000 + Math.round(Math.random() * 240)}ms`);
    return facet;
  });
  element.replaceChildren(...facets);
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
  const enteredRef = useRef(false);
  useEffect(() => {
    const element = highlightRef.current;
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
      <span className="aig-button-content">
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
    </button>
  );
}
