import { Card } from './card.js';
export default { title: '通用/Card', component: Card };
export const preview = {
  name: 'Card',
  label: '卡片',
  description: '自然伸展的内容表面，支持实色与柔和玻璃材质。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Card material="glass">
      <h3>项目概览</h3>
      <p>将相关内容组合为一个清晰的区域。</p>
    </Card>
  );
}
