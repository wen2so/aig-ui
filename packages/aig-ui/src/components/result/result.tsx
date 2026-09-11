import type { ComponentPropsWithRef, ReactNode } from 'react';
/** 结果仅表示业务状态，HTTP 状态由宿主路由或服务端设置。 */
export interface ResultProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  status: 'success' | 'error' | 'not-found' | 'session-expired' | 'forbidden';
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
}
const titles = {
  success: '操作已完成',
  error: '操作未完成',
  'not-found': '页面未找到',
  'session-expired': '登录已过期',
  forbidden: '访问受限',
};
/** 提供明确的结果说明和恢复操作。 */
export function Result({
  status,
  title = titles[status],
  description,
  actions,
  className = '',
  ...props
}: ResultProps) {
  return (
    <section {...props} data-status={status} className={`aig-result ${className}`}>
      <span className="aig-result-symbol" aria-hidden>
        {status === 'success' ? '✓' : '!'}
      </span>
      <h2>{title}</h2>
      {description && <div>{description}</div>}
      {actions && <div className="aig-result-actions">{actions}</div>}
    </section>
  );
}
