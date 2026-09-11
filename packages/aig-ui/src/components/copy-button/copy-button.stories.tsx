import { CopyButton } from './copy-button.js';
export default { title: '通用/CopyButton', component: CopyButton };
export const preview = {
  name: 'CopyButton',
  label: '复制按钮',
  description: '复制真实传入的文本，成功后反馈，失败时保留可手动复制的原文。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return <CopyButton value="aig-ui 示例请求标识" label="复制请求标识" />;
}
