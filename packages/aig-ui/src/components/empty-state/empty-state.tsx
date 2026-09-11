import type { ComponentPropsWithRef, ReactNode } from 'react';
/** 空状态说明由调用方按实际场景提供。 */
export interface EmptyStateProps extends Omit<ComponentPropsWithRef<'section'>,'title'> {title:string;description?:ReactNode;actions?:ReactNode;icon?:ReactNode;}
/** 为无内容区域提供说明和操作。 */
export function EmptyState({title,description,actions,icon,className='',...props}:EmptyStateProps) {return <section {...props} className={`aig-empty-state ${className}`}>{icon && <div aria-hidden>{icon}</div>}<h3>{title}</h3>{description && <div>{description}</div>}{actions && <div className="aig-empty-actions">{actions}</div>}</section>;}
