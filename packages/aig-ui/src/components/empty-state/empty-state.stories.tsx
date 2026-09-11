import { EmptyState } from './empty-state.js';
export default { title: '通用/EmptyState', component: EmptyState };
export const preview = {
  name: 'EmptyState',
  label: '空状态',
  description: '区分初次使用和筛选为空，显示下一步引导。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return <EmptyState title="暂无匹配资料" description="调整筛选条件后查看结果。" />;
}
