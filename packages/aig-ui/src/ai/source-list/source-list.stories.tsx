
import { SourceList } from './source-list.js';
export default { title: 'AI/SourceList', component: SourceList };
export const preview = {"name":"SourceList","label":"来源列表","description":"展示真实传入的来源、地址和片段，缺失或非法地址使用普通文字。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <SourceList sources={[{id:'react',title:'React 官方文档',url:'https://react.dev',snippet:'本地演示来源，展示标题与引用说明。'},{id:'internal',title:'项目内部说明',snippet:'当前条目由调用方提供，尚未附带地址。'}]}/>; }
