import type { ComponentPropsWithRef } from 'react';
/** 局部等待指示，默认名称为正在加载。 */
export function Spinner({
  label = '正在加载',
  size = 20,
  className = '',
  style,
  ...props
}: ComponentPropsWithRef<'span'> & { label?: string; size?: number }) {
  return (
    <span
      {...props}
      role="status"
      aria-label={label}
      className={`aig-spinner ${className}`}
      style={{ width: size, height: size, ...style }}
    />
  );
}
