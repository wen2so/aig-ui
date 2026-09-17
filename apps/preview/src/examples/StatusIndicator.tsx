import { tones, StatusIndicator, toneLabels, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'tones',
    title: '持续状态',
    description: '核心缓慢巡行，运行中的状态增加轨道运动。',
    render: () => (
      <div className="example-stack">
        {tones.map((tone, i) => (
          <StatusIndicator key={tone} tone={tone} label={toneLabels[i]!} busy={tone === 'info'} />
        ))}
      </div>
    ),
    code: '<StatusIndicator tone="success" label="已完成" />\n<StatusIndicator tone="info" label="进行中" busy />',
  },
];
export default examples;
