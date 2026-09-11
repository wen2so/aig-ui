
import { Select } from './select.js';
export default { title: '通用/Select', component: Select };
export const preview = {"name":"Select","label":"选择器","description":"基于 Base UI 的单选下拉，支持键盘、空选项和已失效值提示。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <Select label="项目状态" defaultValue="active" options={[{value:'draft',label:'草稿'},{value:'active',label:'进行中'},{value:'done',label:'已完成'}]} />; }
