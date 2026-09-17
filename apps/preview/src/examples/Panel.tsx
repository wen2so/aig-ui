import { Panel, Progress, Button, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'layout',
    title: '内容与操作分区',
    description: '侧轨标记主区域，页头和页脚形成稳定的阅读边界。',
    render: () => (
      <Panel>
        <Panel.Header>项目资料</Panel.Header>
        <Panel.Body>
          <p>已整理 12 份设计资料，等待团队审阅。</p>
          <Progress value={80} label="整理进度" />
        </Panel.Body>
        <Panel.Footer>
          <Button>继续整理</Button>
        </Panel.Footer>
      </Panel>
    ),
    code: '<Panel>\n  <Panel.Header>项目资料</Panel.Header>\n  <Panel.Body>资料内容</Panel.Body>\n  <Panel.Footer><Button>继续整理</Button></Panel.Footer>\n</Panel>',
    wide: true,
  },
];
export default examples;
