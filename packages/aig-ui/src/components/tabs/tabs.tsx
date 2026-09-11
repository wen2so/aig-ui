'use client';
import{Tabs as BaseTabs}from'@base-ui/react/tabs';
import type{ComponentProps}from'react';
import{classNames}from'../../internal/class-name.js';
/** 页签列表按内容自然换行。 */
function List({className,...props}:ComponentProps<typeof BaseTabs.List>){return <BaseTabs.List {...props} className={classNames('aig-tabs-list',className)}/>;}
/** 使用稳定 value 与面板关联。 */
function Tab({className,...props}:ComponentProps<typeof BaseTabs.Tab>){return <BaseTabs.Tab {...props} className={classNames('aig-tab',className)}/>;}
/** keepMounted 可保留面板内编辑状态。 */
function Panel({className,...props}:ComponentProps<typeof BaseTabs.Panel>){return <BaseTabs.Panel {...props} className={classNames('aig-tab-panel',className)}/>;}
/** Root 提供 value/defaultValue/onValueChange。 */
export const Tabs={Root:BaseTabs.Root,List,Tab,Panel};
