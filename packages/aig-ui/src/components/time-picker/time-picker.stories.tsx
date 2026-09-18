import { TimePicker } from './time-picker.js';
export default { title: '数据录入/TimePicker', component: TimePicker };
export const preview = {
  name: 'TimePicker',
  label: '时间选择器',
  description: '选择本地时间，支持分钟或秒级步长。',
};
/** 用真实控件展示时间选择器的输入和选择。 */
export function Preview() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <TimePicker aria-label="开始时间" defaultValue="09:30" step={60} />
    </div>
  );
}
