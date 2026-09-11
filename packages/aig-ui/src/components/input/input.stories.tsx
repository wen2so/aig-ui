import { Field } from '../field/field.js';
import { Input } from './input.js';
export default { title: '通用/Input', component: Input };
export const preview = {"name":"Input","label":"输入框","description":"原生单行输入，保留受控值、自动填充、错误与中文输入事件。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <Field label="工作空间名称" description="支持中文输入与自动填充。">{props=><Input {...props} placeholder="输入工作空间名称" autoComplete="organization" />}</Field>; }
