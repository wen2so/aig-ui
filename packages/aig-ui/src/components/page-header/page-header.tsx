import type { ComponentPropsWithRef, ReactNode } from 'react';
/** 标题使用页面 h1，操作通过 actions 传入。 */
export function PageHeader({
  title,
  description,
  actions,
  className = '',
  ...props
}: Omit<ComponentPropsWithRef<'header'>, 'title'> & {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header {...props} className={`aig-page-header ${className}`}>
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="aig-page-header-actions">{actions}</div>}
    </header>
  );
}
