import type { ComponentPropsWithRef, CSSProperties } from 'react';
export interface FlexProps extends ComponentPropsWithRef<'div'> {
  /** 主轴方向。 */ direction?: CSSProperties['flexDirection'];
  /** 子项间距，数字按像素处理。 */ gap?: CSSProperties['gap'];
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
}
/** 弹性排列保持原生元素属性，style 可覆盖布局默认值。 */
export function Flex({
  direction = 'row',
  gap = 12,
  align = 'center',
  justify,
  wrap = false,
  className = '',
  style,
  ...props
}: FlexProps) {
  return (
    <div
      {...props}
      className={`aig-flex ${className}`}
      style={{
        display: 'flex',
        minWidth: 0,
        flexDirection: direction,
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    />
  );
}
