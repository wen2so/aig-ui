import { Heading } from './heading.js';
export default { title: '通用/Heading', component: Heading };
export const preview = {
  name: 'Heading',
  label: '标题',
  description: '语义级别与视觉大小分别设置，保持页面标题层级。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Heading level={3} size="lg">
      工作空间
    </Heading>
  );
}
