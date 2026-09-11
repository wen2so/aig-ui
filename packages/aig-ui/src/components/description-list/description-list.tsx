import type { ComponentPropsWithRef, ReactNode } from 'react';
/** 标签使用稳定 id 作为列表键。 */
export interface DescriptionItem {id:string;label:ReactNode;value:ReactNode;}
/** 展示调用方提供的信息，长标识保持完整。 */
export function DescriptionList({items,columns=1,className='',...props}:ComponentPropsWithRef<'dl'> & {items:DescriptionItem[];columns?:1|2|3}){return <dl {...props} data-columns={columns} className={`aig-description-list ${className}`}>{items.map(item=><div key={item.id}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>;}
