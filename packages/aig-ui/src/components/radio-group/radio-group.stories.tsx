import { RadioGroup } from './radio-group.js';
export default { title: '通用/RadioGroup', component: RadioGroup };
export const preview = {
  name: 'RadioGroup',
  label: '单选组',
  description: '以原生 fieldset 和 radio 展示互斥选项，支持方向键和表单提交。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <RadioGroup
      label="资料可见范围"
      defaultValue="team"
      options={[
        { value: 'self', label: '仅自己' },
        { value: 'team', label: '项目成员' },
        { value: 'all', label: '全部成员' },
      ]}
    />
  );
}
