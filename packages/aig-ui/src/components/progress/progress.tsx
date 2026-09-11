import type { ComponentPropsWithRef } from 'react';
/** value 只接收有限的 0–100 数值。 */
export function Progress({
  value,
  label = '任务进度',
  className = '',
  ...props
}: Omit<ComponentPropsWithRef<'progress'>, 'value' | 'max'> & { value?: number; label?: string }) {
  const valid = Number.isFinite(value) && value! >= 0 && value! <= 100;
  return (
    <progress
      {...props}
      aria-label={label}
      max={100}
      value={valid ? value : undefined}
      className={`aig-progress ${className}`}
    />
  );
}
