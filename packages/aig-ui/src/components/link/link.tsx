import type { ComponentPropsWithRef } from 'react';
/** 保留原生导航和下载语义的文字链接。 */
export function Link({ className = '', target, rel, ...props }: ComponentPropsWithRef<'a'>) { return <a {...props} target={target} rel={target === '_blank' ? `noopener noreferrer ${rel ?? ''}` : rel} className={`aig-link ${className}`} />; }
