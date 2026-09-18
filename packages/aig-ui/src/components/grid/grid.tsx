import type { ComponentPropsWithRef, CSSProperties } from 'react';
export interface GridProps extends ComponentPropsWithRef<'div'> {
  /** 固定列数；省略时按最小列宽自动换行。 */ columns?: number;
  minColumnWidth?: number;
  gap?: CSSProperties['gap'];
}
/** 自动列使用 min(100%, 最小列宽)，确保窄屏内容不会撑出容器。 */
export function Grid({
  columns,
  minColumnWidth = 220,
  gap = 16,
  className = '',
  style,
  ...props
}: GridProps) {
  const template =
    columns === undefined
      ? `repeat(auto-fit, minmax(min(100%, ${Math.max(1, minColumnWidth)}px), 1fr))`
      : `repeat(${Math.max(1, Math.floor(columns))}, minmax(0, 1fr))`;
  return (
    <div
      {...props}
      className={`aig-grid ${className}`}
      style={{ display: 'grid', minWidth: 0, gridTemplateColumns: template, gap, ...style }}
    />
  );
}
