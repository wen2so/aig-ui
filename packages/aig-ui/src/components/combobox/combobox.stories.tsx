import { Combobox } from './combobox.js';
export default { title: '数据录入/Combobox', component: Combobox };
export const preview = {
  name: 'Combobox',
  label: '检索选择',
  description: '输入文字检索单选项，保留键盘选择、无结果提示与真实表单值。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Combobox
      label="查找项目成员"
      placeholder="输入成员名称"
      options={[
        { value: 'lin', label: '林清' },
        { value: 'zhou', label: '周明' },
        { value: 'chen', label: '陈曦' },
      ]}
    />
  );
}
