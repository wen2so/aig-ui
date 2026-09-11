'use client';
import{Menu}from'@base-ui/react/menu';
import type{ComponentProps}from'react';
import{classNames}from'../../internal/class-name.js';
import{useAigPortalContainer}from'../../theme/aig-provider.js';
/** 操作菜单自动处理越界和键盘导航。 */
function Content({className,...props}:ComponentProps<typeof Menu.Popup>){const container=useAigPortalContainer();return <Menu.Portal container={container}><Menu.Positioner sideOffset={8} className="aig-menu-positioner"><Menu.Popup {...props} className={classNames('aig-menu',className)}/></Menu.Positioner></Menu.Portal>;}
/** 支持原生链接或按钮的 render 组合。 */
function Item({className,...props}:ComponentProps<typeof Menu.Item>){return <Menu.Item {...props} className={classNames('aig-menu-item',className)}/>;}
/** Root、Trigger、Content 和 Item 组成完整操作菜单。 */
export const DropdownMenu={Root:Menu.Root,Trigger:Menu.Trigger,Content,Item,Group:Menu.Group,GroupLabel:Menu.GroupLabel,Separator:Menu.Separator};
