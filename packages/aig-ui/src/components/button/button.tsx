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

/* 悬停高亮：八块不规则三角面拼成亮面，各面朝不同方向张开，避免读成锯齿或斜纹。
   面与面之间留细缝；明度由 randomizeFacetDepths 在每次移入时重新分配。 */
const BUTTON_FACETS = [
  '1.3,2.2 1.0,97.7 72.6,28.7',
  '75.0,30.5 2.3,99.0 147.5,71.8',
  '297.5,0.1 2.5,0.2 77.3,27.1',
  '2.5,99.8 297.5,99.8 150.0,74.5',
  '77.5,28.5 150.0,69.5 222.5,28.5',
  '297.5,0.5 77.5,27.8 222.7,27.1',
  '152.5,71.8 297.7,99.0 225.0,30.5',
  '299.0,97.7 298.7,2.2 227.4,28.7',
] as const;

/* 每次移入重新分配刻面明度：九块各自独立取值，整轮保证覆盖足够的深浅跨度。
   明度分布每次悬停都不同，同时决定出现时机——越深越早，闪切顺序也就不再固定。 */
function randomizeFacetDepths(element: Element | null) {
  if (!element) return;
  const facets = [...element.querySelectorAll<SVGPolygonElement>('.aig-button-highlight polygon')];
  let depths: number[] = [];
  for (let attempt = 0; attempt < 8; attempt++) {
    depths = facets.map(() => 0.3 + Math.random() * 0.38);
    if (Math.max(...depths) - Math.min(...depths) >= 0.22) break;
  }
  facets.forEach((facet, index) => {
    facet.style.setProperty('--aig-facet-depth', depths[index]!.toFixed(3));
  });
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
        randomizeFacetDepths(event.currentTarget.querySelector('.aig-button-highlight'));
      }}
    >
      <svg
        className="aig-button-highlight"
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {BUTTON_FACETS.map((points) => (
          <polygon key={points} points={points} />
        ))}
      </svg>
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
