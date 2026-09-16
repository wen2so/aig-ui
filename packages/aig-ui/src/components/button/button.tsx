'use client';
import { useEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import { BrandMark, useAigBrand } from '../../theme/aig-provider.js';
import { useButtonContrast } from './button-contrast.js';
import {
  initializeButtonFacets,
  observeButtonFacets,
  queueButtonEntrance,
  replayButtonFacets,
} from './button-motion.js';

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
  /** 挂载时播放一次错峰入场，默认 true；密集列表或静态缩略图可关闭。 */
  entrance?: boolean;
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
  entrance = true,
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
  const entranceConsumedRef = useRef(false);
  const cancelEntranceRef = useRef<(() => void) | undefined>(undefined);
  const finishFrameRef = useRef(0);
  useEffect(() => observeButtonFacets(highlightRef.current), []);
  /** 每次重新进入播放新分区；同一次悬停内的聚焦不会重复触发。 */
  const activateHighlight = () => {
    const element = highlightRef.current;
    if (!element || element.hasAttribute('data-hovered')) return;
    cancelEntranceRef.current?.();
    element.dataset.hovered = '';
    replayButtonFacets(element);
  };
  useEffect(() => {
    const element = highlightRef.current;
    initializeButtonFacets(element);
    if (disabled || loading) {
      entranceConsumedRef.current = true;
      if (element) {
        delete element.dataset.playing;
        delete element.dataset.hovered;
      }
      return;
    }
    if (element && entrance && !entranceConsumedRef.current) {
      cancelEntranceRef.current = queueButtonEntrance(element, () => {
        entranceConsumedRef.current = true;
        replayButtonFacets(element, true);
      });
    }
    return () => {
      cancelEntranceRef.current?.();
      cancelAnimationFrame(finishFrameRef.current);
      if (element) delete element.dataset.playing;
    };
  }, [disabled, loading, entrance]);
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
          if (highlightRef.current.dataset.playing === 'interaction')
            delete highlightRef.current.dataset.playing;
        }
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (highlightRef.current && !event.currentTarget.matches(':hover')) {
          delete highlightRef.current.dataset.hovered;
          if (highlightRef.current.dataset.playing === 'interaction')
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
          // 等本帧所有块面提交结束状态；外沿 CSS transition 不参与刻面的完成判断。
          cancelAnimationFrame(finishFrameRef.current);
          finishFrameRef.current = requestAnimationFrame(() => {
            const pending = element
              .getAnimations({ subtree: true })
              .some(
                (animation) =>
                  animation instanceof CSSAnimation &&
                  animation.animationName.startsWith('aig-button-facet-') &&
                  animation.playState !== 'finished',
              );
            if (!pending) delete element.dataset.playing;
          });
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
