
import { Accordion } from './accordion.js';
export default { title: '通用/Accordion', component: Accordion.Root };
export const preview = {"name":"Accordion","label":"折叠面板","description":"将补充信息逐项展开，保留按钮、标题和内容关联。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <Accordion.Root defaultValue={['purpose']}><Accordion.Item value="purpose"><Accordion.Header><Accordion.Trigger>组件用途</Accordion.Trigger></Accordion.Header><Accordion.Panel>主要内容保持直接可见，补充说明按需展开。</Accordion.Panel></Accordion.Item><Accordion.Item value="keyboard"><Accordion.Header><Accordion.Trigger>键盘操作</Accordion.Trigger></Accordion.Header><Accordion.Panel>使用 Tab 移动，Enter 或 Space 展开。</Accordion.Panel></Accordion.Item></Accordion.Root>; }
