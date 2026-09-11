
import { Alert } from './alert.js';
export default { title: '通用/Alert', component: Alert };
export const preview = {"name":"Alert","label":"区域提示","description":"在内容区域展示说明、警告或错误，保留恢复操作。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <Alert tone="warning" title="部分资料等待确认">检查文件名称后继续处理。</Alert>; }
