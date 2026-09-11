import type { ComponentPropsWithRef } from 'react';
import { TaskStatus, type TaskState } from '../task-status/task-status.js';
/** 输入和输出由调用方先脱敏；组件以纯文本显示。 */
export function ToolResult({
  name,
  purpose,
  status,
  inputSummary,
  output,
  error,
  className = '',
  ...props
}: ComponentPropsWithRef<'section'> & {
  name: string;
  purpose: string;
  status: TaskState;
  inputSummary?: string;
  output?: string;
  error?: string;
}) {
  return (
    <section {...props} className={`aig-tool-result ${className}`}>
      <h3>{name}</h3>
      <p>{purpose}</p>
      <TaskStatus status={status} />
      {inputSummary && (
        <details>
          <summary>输入摘要</summary>
          <pre>{inputSummary}</pre>
        </details>
      )}
      {output !== undefined && (
        <details open>
          <summary>处理结果</summary>
          <pre>{output}</pre>
        </details>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
