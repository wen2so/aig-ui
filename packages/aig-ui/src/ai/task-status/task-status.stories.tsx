import { TaskStatus } from './task-status.js';
export default { title: 'AI/TaskStatus', component: TaskStatus };
export const preview = {
  name: 'TaskStatus',
  label: '任务状态',
  description: '表达排队、执行、待确认、完成、失败和取消等真实任务状态。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <TaskStatus
      status="awaiting-confirmation"
      steps={['已读取演示资料', '已整理候选结果', '等待用户审阅并确认']}
    />
  );
}
