import { Timeline } from './timeline.js';
export default { title: '数据展示/Timeline', component: Timeline };
export const preview = { name: 'Timeline', label: '时间轴', description: '按时间顺序展示事件与业务状态。' };
/** 时间轴的可运行展示。 */
export function Preview() {
  return (
    <Timeline
      items={[
        { id: 'created', title: '创建项目', time: '09:00', description: '资料目录已建立', tone: 'success' },
        { id: 'review', title: '开始审核', time: '09:20', description: '等待确认识别结果', tone: 'info' },
      ]}
    />
  );
}
