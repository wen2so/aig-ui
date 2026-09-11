import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Tone } from '../badge/badge.js';
/** 错误默认使用 alert，其余使用 status；可通过 role 调整播报场景。 */
export function Alert({
  tone = 'info',
  title,
  children,
  className = '',
  ...props
}: Omit<ComponentPropsWithRef<'div'>, 'title'> & { tone?: Tone; title?: ReactNode }) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      {...props}
      data-tone={tone}
      className={`aig-alert ${className}`}
    >
      {title && <strong>{title}</strong>}
      {children && <div>{children}</div>}
    </div>
  );
}
