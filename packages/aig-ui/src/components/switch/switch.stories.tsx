import { Switch } from './switch.js';
export default { title: '通用/Switch', component: Switch };
export const preview = {
  name: 'Switch',
  label: '开关',
  description: '即时二元状态，使用原生 checkbox 保留键盘和表单值。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <label style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
      <Switch defaultChecked />
      自动保存草稿
    </label>
  );
}
