'use client';
import type { ComponentPropsWithRef, ReactNode } from 'react';
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

/** 每次随机抽取一至两块切片，各闪现一次，整轮在 480ms 内收回。 */
function replayButtonSlices(element: Element | null) {
  const animations = element?.getAnimations?.({ subtree: true }) ?? [];
  animations.forEach((animation) => {
    (animation.effect as KeyframeEffect | null)?.setKeyframes([{ opacity: 0 }, { opacity: 0 }]);
    animation.finish();
  });
  const count = Math.min(animations.length, 1 + Math.floor(Math.random() * 2));
  for (let index = 0; index < count; index++) {
    const [animation] = animations.splice(Math.floor(Math.random() * animations.length), 1);
    const effect = animation!.effect as KeyframeEffect | null;
    if (!effect) continue;
    const offsets = [0, 0.1 + Math.random() * 0.1, 0.4 + Math.random() * 0.2, 1];
    effect.setKeyframes(
      offsets.map((offset, frame) => ({
        offset,
        opacity: frame === 1 ? 1 : 0,
        easing: 'steps(1, end)',
      })),
    );
    effect.updateTiming({ delay: Math.random() * 120, duration: 240 + Math.random() * 120 });
    animation!.currentTime = 0;
    animation!.play();
  }
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
  ...props
}: ButtonProps) {
  const brand = useAigBrand();
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
        replayButtonSlices(event.currentTarget.querySelector('.aig-button-enter'));
      }}
    >
      <span className="aig-button-frame" aria-hidden="true">
        {/* 四块三角共用顶点，每轮选取部分切片短暂闪现。 */}
        <svg
          ref={replayButtonSlices}
          className="aig-button-enter"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          focusable="false"
        >
          <polygon points="0,0 42,0 0,100" />
          <polygon points="42,0 68,100 0,100" />
          <polygon points="42,0 100,0 68,100" />
          <polygon points="100,0 100,100 68,100" />
        </svg>
      </span>
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
