import { Panel } from './panel.js';
export default { title: '布局/Panel', component: Panel };
export const preview = {
  name: 'Panel',
  label: '面板',
  description: 'Header、Body、Footer 组织内容，支持受约束容器内滚动。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Panel scroll style={{ maxHeight: 260 }}>
      <Panel.Header>处理记录</Panel.Header>
      <Panel.Body>
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>示例资料 {i + 1} 已读取。</p>
        ))}
      </Panel.Body>
      <Panel.Footer>底部操作始终可达</Panel.Footer>
    </Panel>
  );
}
