
import { Confirmation } from './confirmation.js';
export default { title: 'AI/Confirmation', component: Confirmation };
export const preview = {"name":"Confirmation","label":"操作确认","description":"绑定产物与具体版本，明确影响，阻止重复提交并处理失败与版本冲突。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <Confirmation artifactId="demo-summary" revision="1" currentRevision="1" target="应用项目摘要" summary="将演示摘要写入当前项目说明。" impact="替换现有项目说明，可在版本记录中查看。" onConfirm={async()=>{}}/>; }
