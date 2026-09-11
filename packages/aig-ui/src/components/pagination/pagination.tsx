import{Button}from'../button/button.js';
import type{ComponentPropsWithRef}from'react';
/** 页数和当前页使用从 1 开始的整数。 */
export interface PaginationProps extends ComponentPropsWithRef<'nav'> {page:number;pageCount:number;onPageChange:(page:number)=>void;}
/** 只显示相邻页和当前位置，避免巨大页码列表。 */
export function Pagination({page,pageCount,onPageChange,className='',...props}:PaginationProps){const count=Number.isFinite(pageCount)?Math.max(1,Math.trunc(pageCount)):1;const current=Number.isFinite(page)?Math.max(1,Math.min(count,Math.trunc(page))):1;return <nav aria-label="分页" {...props} className={`aig-pagination ${className}`}><Button variant="outline" size="sm" disabled={current<=1} onClick={()=>onPageChange(current-1)}>上一页</Button><span aria-current="page">第 {current} / {count} 页</span><Button variant="outline" size="sm" disabled={current>=count} onClick={()=>onPageChange(current+1)}>下一页</Button></nav>;}
