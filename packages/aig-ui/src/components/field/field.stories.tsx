import { Field } from './field.js';
export default { title: '通用/Field', component: Field };
export const preview = {
  name: 'Field',
  label: '表单字段',
  description: '为原生控件关联标签、说明、必填信息与稳定错误 ID。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Field label="项目名称" required description="用于识别工作空间。" error="请填写项目名称。">
      {(props) => <input {...props} className="aig-input" />}
    </Field>
  );
}
