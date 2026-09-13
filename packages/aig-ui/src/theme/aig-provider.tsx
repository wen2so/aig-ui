'use client';

import {
  createContext,
  useContext,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from 'react';

const PortalContext = createContext<HTMLDivElement | null | undefined>(undefined);
/** 品牌图形使用 200 × 200 坐标；其他坐标可通过嵌套 svg 的 viewBox 换算。 */
export interface AigBrand {
  /** SVG 图形节点，描边使用 currentColor；默认采用三角与横线。 */
  mark?: ReactNode;
  /** 按钮族的加载图标，支持完整 SVG；省略时使用品牌图形。 */
  loadingIcon?: ReactNode;
  /** 装饰线颜色，默认哑光玫瑰。 */
  color?: string;
  /** 文字和焦点的强调色，默认由品牌色加深生成。 */
  accentColor?: string;
}
const BrandContext = createContext<AigBrand>({});
/** 读取最近作用域的品牌配置。 */
export function useAigBrand() {
  return useContext(BrandContext);
}
/** 默认品牌描边供标题、按钮与加载序列共用。 */
export function BrandShape() {
  const { mark } = useAigBrand();
  return (
    mark ?? (
      <>
        <path d="M100 38 L164 148 L36 148 Z" />
        <line x1="60" y1="112" x2="140" y2="112" />
      </>
    )
  );
}
/** 可独立使用的品牌 SVG，继承主题颜色和宿主尺寸。 */
export function BrandMark({ className = '', ...props }: ComponentPropsWithRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
      {...props}
      className={`aig-brand-mark ${className}`}
    >
      <BrandShape />
    </svg>
  );
}
/** 主题作用域管理品牌、材质、密度、方向和浮层归属。 */
export interface AigProviderProps extends ComponentPropsWithRef<'div'> {
  /** 局部配置继承外层品牌；style 中的 Token 覆盖优先。 */
  brand?: AigBrand;
  /** 主题名称，默认 warm。 */
  theme?: string;
  /** 布局密度，默认 comfortable。 */
  density?: 'comfortable' | 'compact';
  /** 容器材质，默认 glass。 */
  material?: 'solid' | 'glass';
  style?: CSSProperties & Record<`--aig-${string}`, string | number>;
}
/** 浮层挂载到当前主题内部，继承宿主覆盖的 CSS 变量。 */
export function AigProvider({
  theme = 'warm',
  density = 'comfortable',
  material = 'glass',
  brand,
  style,
  children,
  ...props
}: AigProviderProps) {
  const inheritedBrand = useAigBrand();
  const resolvedBrand = { ...inheritedBrand, ...brand };
  const color = brand?.color;
  const accent = brand?.accentColor ?? (color ? `color-mix(in srgb, ${color} 58%, #202024)` : undefined);
  const brandStyle: AigProviderProps['style'] = {
    ...(color
      ? {
          '--aig-color-mark': color,
          '--aig-color-accent-soft': `color-mix(in srgb, ${color} 14%, white)`,
          '--aig-color-border-control': `color-mix(in srgb, ${color} 70%, #68686d)`,
          '--aig-color-border-subtle': `color-mix(in srgb, ${color} 25%, white)`,
          '--aig-color-surface-muted': `color-mix(in srgb, ${color} 7%, white)`,
        }
      : {}),
    ...(accent ? { '--aig-color-accent': accent, '--aig-color-focus': accent } : {}),
    ...style,
  };
  // 容器挂载后更新消费者，避免初始打开的浮层回退到 body。
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  return (
    <div
      {...props}
      style={brandStyle}
      data-aig-theme={theme}
      data-aig-density={density}
      data-aig-material={material}
    >
      <BrandContext.Provider value={resolvedBrand}>
        <PortalContext.Provider value={container}>
          {children}
          <div ref={setContainer} className="aig-portal-container" />
        </PortalContext.Provider>
      </BrandContext.Provider>
    </div>
  );
}
/** 返回最近主题的 Portal 容器；省略 Provider 时使用基础库默认容器。 */
export function useAigPortalContainer() {
  return useContext(PortalContext);
}
