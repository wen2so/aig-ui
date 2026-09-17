import { Tabs, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'disabled',
    title: '锁定页签',
    description: '键盘切换跳过禁用项，活动标记保持巡行。',
    render: () => (
      <Tabs.Root defaultValue="overview">
        <Tabs.List aria-label="资料视图">
          <Tabs.Tab value="overview">概览</Tabs.Tab>
          <Tabs.Tab value="history">更新记录</Tabs.Tab>
          <Tabs.Tab value="locked" disabled>
            团队分析
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">资料与团队概览。</Tabs.Panel>
        <Tabs.Panel value="history">今天更新了设计记录。</Tabs.Panel>
      </Tabs.Root>
    ),
    code: '<Tabs.Tab value="locked" disabled>团队分析</Tabs.Tab>',
  },
];
export default examples;
