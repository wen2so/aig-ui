import { DatePicker } from './date-picker.js';
export default { title: '数据录入/DatePicker', component: DatePicker };
export const preview = {
  name: 'DatePicker',
  label: '日期选择器',
  description: '选择本地日期，支持范围限制与表单校验。',
};
/** 用真实控件展示日期选择器的输入和选择。 */
export function Preview() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <DatePicker aria-label="交付日期" defaultValue="2026-09-18" min="2026-01-01" max="2027-12-31" />
    </div>
  );
}
