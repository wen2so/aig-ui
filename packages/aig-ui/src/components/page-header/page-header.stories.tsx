import{Button}from'../button/button.js';
import { PageHeader } from './page-header.js';
export default { title: '通用/PageHeader', component: PageHeader };
export const preview = {"name":"PageHeader","label":"页面标题区","description":"组织标题、说明和主要操作，窄屏下自然换行。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <PageHeader title="项目资料" description="集中管理文件、状态和处理结果。" actions={<Button onClick={event=>{event.currentTarget.textContent='项目已创建';}}>新建项目</Button>}/>; }
