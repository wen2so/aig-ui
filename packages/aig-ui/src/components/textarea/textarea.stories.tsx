import { Field } from '../field/field.js';
import { Textarea } from './textarea.js';
export default { title: '通用/Textarea', component: Textarea };
export const preview = {
  name: 'Textarea',
  label: '多行输入',
  description: '原生多行编辑，允许纵向调整高度并保留输入内容。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Field label="项目说明">{(props) => <Textarea {...props} placeholder="记录项目目标和说明" />}</Field>
  );
}
