import { TaskStatus, type Example } from '../example-helpers.js';
const examples: Example[] = [
  {
    id: 'states',
    title: '任务生命周期',
    description: '等待、执行、确认和完成采用不同的状态标记。',
    render: () => (
      <div className="example-stack">
        {(
          [
            'idle',
            'queued',
            'running',
            'streaming',
            'awaiting-confirmation',
            'succeeded',
            'failed',
            'cancelled',
          ] as const
        ).map((status) => (
          <TaskStatus key={status} status={status} />
        ))}
      </div>
    ),
    code: '<TaskStatus status="running" />\n<TaskStatus status="awaiting-confirmation" />\n<TaskStatus status="succeeded" />',
  },
];
export default examples;
