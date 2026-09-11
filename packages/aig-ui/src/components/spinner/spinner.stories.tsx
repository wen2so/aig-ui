import { Spinner } from './spinner.js';
export default { title: '通用/Spinner', component: Spinner };
export const preview = {
  name: 'Spinner',
  label: '等待指示',
  description: '局部未定进度等待，提供可访问名称。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return <Spinner label="正在读取资料" />;
}
