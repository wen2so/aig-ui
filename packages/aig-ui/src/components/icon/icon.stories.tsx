import { Check, Search, Settings } from 'lucide-react';
import { Icon } from './icon.js';
export default { title: '通用/Icon', component: Icon };
export const preview = {
  name: 'Icon',
  label: '图标',
  description: '统一线性图标尺寸，区分装饰图标和具名图像。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Icon icon={Check} label="已完成" />
      <Icon icon={Search} label="搜索" />
      <Icon icon={Settings} label="设置" />
    </div>
  );
}
