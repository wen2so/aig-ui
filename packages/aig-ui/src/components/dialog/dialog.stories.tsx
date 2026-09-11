import {Button} from '../button/button.js';
import { Dialog } from './dialog.js';
export default { title: '通用/Dialog', component: Dialog.Root };
export const preview = {"name":"Dialog","label":"对话框","description":"以可组合部件提供模态焦点管理、键盘关闭与主题内浮层。"};
/** 展示可复用组件的代表性状态。 */
export function Preview() { return <Dialog.Root><Dialog.Trigger render={<Button variant="outline"/>}>打开对话框</Dialog.Trigger><Dialog.Content><Dialog.Title>保存当前设置</Dialog.Title><Dialog.Description>检查内容后保存，或关闭继续编辑。</Dialog.Description><Dialog.Actions><Dialog.Close render={<Button/>}>完成</Dialog.Close></Dialog.Actions></Dialog.Content></Dialog.Root>; }
