import { ResultDemo, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'states',
    title: '结果与恢复操作',
    description: '切换全部结果类型，查看文案与恢复入口。',
    render: () => <ResultDemo />,
    code: '<Result status="success" description="资料已保留。" actions={<Button>返回工作区</Button>} />',
    wide: true,
  },
];
export default examples;
