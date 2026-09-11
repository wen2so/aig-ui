
import { Breadcrumb } from './breadcrumb.js';
export default { title: '通用/Breadcrumb', component: Breadcrumb };
export const preview = {"name":"Breadcrumb","label":"面包屑","description":"展示页面层级，当前页使用明确的导航语义。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <Breadcrumb items={[{id:'home',label:'工作空间',href:'#top'},{id:'project',label:'示例项目'}]}/>; }
