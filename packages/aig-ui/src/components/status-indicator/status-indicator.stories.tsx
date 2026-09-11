
import { StatusIndicator } from './status-indicator.js';
export default { title: '通用/StatusIndicator', component: StatusIndicator };
export const preview = {"name":"StatusIndicator","label":"状态指示","description":"以文字和状态点表达真实业务状态，支持忙碌提示。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <div style={{display:'flex',gap:24}}><StatusIndicator tone="success" label="服务正常" /><StatusIndicator tone="info" label="正在同步" busy /></div>; }
