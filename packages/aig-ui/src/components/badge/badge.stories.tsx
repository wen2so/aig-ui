import { Badge } from './badge.js';
export default { title: '通用/Badge', component: Badge };
export const preview = {
  name: 'Badge',
  label: '标签',
  description: '用文字和语义色表达分类与状态，长标签可自然换行。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Badge>草稿</Badge>
      <Badge tone="success">已完成</Badge>
      <Badge tone="warning">待确认</Badge>
      <Badge tone="danger">处理失败</Badge>
    </div>
  );
}
