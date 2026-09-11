
import { Progress } from './progress.js';
export default { title: '通用/Progress', component: Progress };
export const preview = {"name":"Progress","label":"进度","description":"展示真实已知进度，非法或未知数值降级为未定进度。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <div style={{display:'grid',gap:20}}><Progress value={64} label="资料导入进度" /><Progress label="正在等待结果" /></div>; }
