import { Splitter } from './splitter.js';
export default { title: '布局/Splitter', component: Splitter };
export const preview = {
  name: 'Splitter',
  label: '分隔面板',
  description: '通过拖动或键盘调整两个面板的比例。',
};
/** 可直接运行的布局与交互示例。 */
export function Preview() {
  return (
    <Splitter
      label="资料目录宽度"
      first={<p>资料目录</p>}
      second={<p>拖动中间分隔线，或聚焦后使用方向键、Home 和 End 调整。</p>}
      style={{ minHeight: 180 }}
    />
  );
}
