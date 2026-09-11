import type { ComponentPropsWithRef, ReactNode } from 'react';
import { StatusIndicator } from '../../components/status-indicator/status-indicator.js';
export type TaskState =
  | 'idle'
  | 'queued'
  | 'running'
  | 'streaming'
  | 'awaiting-confirmation'
  | 'succeeded'
  | 'failed'
  | 'cancelled';
const labels: Record<TaskState, string> = {
  idle: '等待输入',
  queued: '任务已排队',
  running: '正在处理',
  streaming: '正在生成',
  'awaiting-confirmation': '等待确认',
  succeeded: '任务已完成',
  failed: '任务未完成',
  cancelled: '任务已取消',
};
/** 仅显示可公开的步骤摘要，任务调度由宿主管理。 */
export function TaskStatus({
  status,
  summary,
  steps,
  actions,
  className = '',
  ...props
}: ComponentPropsWithRef<'div'> & {
  status: TaskState;
  summary?: string;
  steps?: string[];
  actions?: ReactNode;
}) {
  return (
    <div {...props} className={`aig-task-status ${className}`}>
      <StatusIndicator
        label={summary ?? labels[status]}
        tone={
          status === 'failed'
            ? 'danger'
            : status === 'succeeded'
              ? 'success'
              : status === 'awaiting-confirmation'
                ? 'warning'
                : 'info'
        }
        busy={status === 'running' || status === 'streaming' || status === 'queued'}
      />
      {steps && (
        <ol>
          {steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      )}
      {actions && <div>{actions}</div>}
    </div>
  );
}
