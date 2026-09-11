import { Skeleton } from './skeleton.js';
export default { title: '通用/Skeleton', component: Skeleton };
export const preview = {
  name: 'Skeleton',
  label: '加载占位',
  description: '在数据到达前保留内容空间，跟随系统减少动态效果偏好。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <div aria-busy="true" aria-label="正在读取内容" style={{ display: 'grid', gap: 12 }}>
      <Skeleton style={{ width: '40%', height: 24 }} />
      <Skeleton />
      <Skeleton style={{ width: '75%' }} />
    </div>
  );
}
