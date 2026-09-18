import type { ComponentPropsWithRef, ReactNode } from 'react';
export interface StatisticProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'prefix'> {
  title: ReactNode;
  value: number | null;
  precision?: number;
  locale?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  description?: ReactNode;
}
/** 数值格式化与缺失值分开处理，不将未知值显示为零。 */
export function Statistic({
  title,
  value,
  precision = 0,
  locale = 'zh-CN',
  prefix,
  suffix,
  description,
  className = '',
  ...props
}: StatisticProps) {
  const digits = Math.min(20, Math.max(0, Math.floor(Number.isFinite(precision) ? precision : 0)));
  const formatted =
    value !== null && Number.isFinite(value)
      ? new Intl.NumberFormat(locale, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }).format(value)
      : '—';
  return (
    <div {...props} className={`aig-statistic ${className}`}>
      <div className="aig-statistic-title">{title}</div>
      <div className="aig-statistic-value">
        {prefix}
        <strong>{formatted}</strong>
        {suffix}
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
