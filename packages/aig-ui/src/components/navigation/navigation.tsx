import type{ComponentPropsWithRef}from'react';
/** 使用真实链接或宿主路由链接作为子节点。 */
function Root({className='',...props}:ComponentPropsWithRef<'nav'>){return <nav {...props} className={`aig-navigation ${className}`}/>;}
/** current 为当前路由的可访问标记。 */
function Item({current=false,className='',...props}:ComponentPropsWithRef<'a'>&{current?:boolean}){return <a {...props} aria-current={current?'page':undefined} className={`aig-navigation-item ${className}`}/>;}
/** 可直接调用 Navigation，也可组合 Item。 */
export const Navigation=Object.assign(Root,{Item});
