import { Separator } from './separator.js';
export default { title: '布局/Separator', component: Separator };
export const preview = {
  name: 'Separator',
  label: '分隔线',
  description: '按语义划分相邻内容，支持水平和垂直方向。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <span>主要内容</span>
      <Separator />
      <span>补充说明</span>
    </div>
  );
}
