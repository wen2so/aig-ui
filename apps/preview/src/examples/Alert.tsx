import { tones, Alert, toneLabels, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'tones',
    title: '提示层级',
    description: '文字、侧轨与语义色一起表达消息的性质。',
    render: () => (
      <div className="example-stack">
        {tones.slice(1).map((tone, i) => (
          <Alert key={tone} tone={tone} title={toneLabels[i + 1]}>
            当前资料已保留，可继续查看详情。
          </Alert>
        ))}
      </div>
    ),
    code: '<Alert tone="info" title="进行中">正在处理资料。</Alert>\n<Alert tone="danger" title="处理失败">当前资料已保留。</Alert>',
  },
];
export default examples;
