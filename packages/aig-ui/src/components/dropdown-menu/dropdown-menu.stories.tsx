import{useState}from'react';import{Button}from'../button/button.js';
import { DropdownMenu } from './dropdown-menu.js';
export default { title: '通用/DropdownMenu', component: DropdownMenu.Root };
export const preview = {"name":"DropdownMenu","label":"操作菜单","description":"可用方向键选择的操作列表，支持禁用项与关闭恢复焦点。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { const[action,setAction]=useState('选择一个操作');return <><DropdownMenu.Root><DropdownMenu.Trigger render={<Button variant="outline"/>}>更多操作</DropdownMenu.Trigger><DropdownMenu.Content><DropdownMenu.Item onClick={()=>setAction('已创建副本')}>创建副本</DropdownMenu.Item><DropdownMenu.Item onClick={()=>setAction('已归档')}>归档资料</DropdownMenu.Item><DropdownMenu.Item disabled>永久删除</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Root><p role="status">{action}</p></>; }
