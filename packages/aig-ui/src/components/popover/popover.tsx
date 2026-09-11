'use client';
import{Popover as BasePopover}from'@base-ui/react/popover';
import type{ComponentProps}from'react';
import{classNames}from'../../internal/class-name.js';
import{useAigPortalContainer}from'../../theme/aig-provider.js';
/** 定位在触发元素附近的补充内容。 */
function Content({className,side='bottom',...props}:ComponentProps<typeof BasePopover.Popup>&{side?:'top'|'bottom'|'left'|'right'}){const container=useAigPortalContainer();return <BasePopover.Portal container={container}><BasePopover.Positioner side={side} sideOffset={8} className="aig-popover-positioner"><BasePopover.Popup {...props} className={classNames('aig-popover',className)}/></BasePopover.Positioner></BasePopover.Portal>;}
/** 使用 Title 和 Description 描述弹出内容。 */
export const Popover={Root:BasePopover.Root,Trigger:BasePopover.Trigger,Content,Title:BasePopover.Title,Description:BasePopover.Description,Close:BasePopover.Close};
