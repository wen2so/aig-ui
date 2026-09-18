import { Tabs } from './tabs.js';
export default { title: '导航/Tabs', component: Tabs.Root };
export const preview = {
  name: 'Tabs',
  label: '页签',
  description: '使用可控值组织同一区域的不同视图，支持方向键与面板关联。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List aria-label="项目视图">
        <Tabs.Tab value="overview">概览</Tabs.Tab>
        <Tabs.Tab value="activity">动态</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">项目资料与最近状态。</Tabs.Panel>
      <Tabs.Panel value="activity">今天创建了项目。</Tabs.Panel>
    </Tabs.Root>
  );
}
