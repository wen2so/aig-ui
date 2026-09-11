import { Checkbox } from './checkbox.js';
export default { title: '通用/Checkbox', component: Checkbox };
export const preview = {
  name: 'Checkbox',
  label: '复选框',
  description: '原生复选框，支持受控值、真实表单值和中间状态。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <label style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
      <Checkbox name="notifications" defaultChecked />
      接收处理结果通知
    </label>
  );
}
