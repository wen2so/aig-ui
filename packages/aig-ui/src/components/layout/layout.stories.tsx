import { Layout } from './layout.js';
export default { title: '布局/Layout', component: Layout };
export const preview = { name: 'Layout', label: '页面布局', description: '组合标题、侧栏、正文与底部区域。' };
/** 可直接运行的布局与交互示例。 */
export function Preview() {
  return (
    <Layout>
      <Layout.Header>资料工作台</Layout.Header>
      <Layout.Aside>项目目录</Layout.Aside>
      <Layout.Content>当前项目的资料与任务</Layout.Content>
      <Layout.Footer>所有更改已保存</Layout.Footer>
    </Layout>
  );
}
