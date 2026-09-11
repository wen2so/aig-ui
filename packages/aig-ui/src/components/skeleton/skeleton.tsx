import type{ComponentPropsWithRef}from'react';
/** 仅作装饰占位，加载状态由区域 aria-busy 或可见说明表达。 */
export function Skeleton({className='',...props}:ComponentPropsWithRef<'div'>){return <div {...props} aria-hidden="true" className={`aig-skeleton ${className}`}/>;}
