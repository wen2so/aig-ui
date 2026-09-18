import { Button } from '../button/button.js';
import { Toast } from './toast.js';
export default { title: '反馈/Toast', component: Toast };
export const preview = {
  name: 'Toast',
  label: '轻提示',
  description: '提供状态播报、关闭和自动计时，悬停与键盘焦点期间暂停。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Toast.Provider>
      <Trigger />
    </Toast.Provider>
  );
}
function Trigger() {
  const manager = Toast.useManager();
  return (
    <Button onClick={() => manager.add({ title: '设置已保存', description: '本地演示操作已完成。' })}>
      显示结果提示
    </Button>
  );
}
