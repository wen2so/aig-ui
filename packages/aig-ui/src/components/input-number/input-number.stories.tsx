import { InputNumber } from './input-number.js';
export default { title: '数据录入/InputNumber', component: InputNumber };
export const preview = {
  name: 'InputNumber',
  label: '数字输入框',
  description: '输入数字，保留空值、步进与原生范围校验。',
};
/** 用真实控件展示数字输入框的输入和选择。 */
export function Preview() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <InputNumber aria-label="份数" defaultValue={2} min={1} max={20} step={1} />
    </div>
  );
}
