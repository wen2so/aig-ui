import type { ComponentPropsWithRef, ReactNode } from 'react';
export interface BreadcrumbItem {
  id: string;
  label: ReactNode;
  href?: string;
}
/** 最后一个条目表示当前页面。 */
export function Breadcrumb({
  items,
  className = '',
  ...props
}: ComponentPropsWithRef<'nav'> & { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="页面路径" {...props} className={`aig-breadcrumb ${className}`}>
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            {index > 0 && <span aria-hidden>/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
