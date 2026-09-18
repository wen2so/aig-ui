import { Steps } from './steps.js';
export default { title: '导航/Steps', component: Steps };
export const preview = { name: 'Steps', label: '步骤条', description: '展示流程位置、完成与失败状态。' };
/** 可直接运行的布局与交互示例。 */
export function Preview() {
  return (
    <Steps
      current={1}
      items={[
        { id: 'upload', title: '上传资料', description: '资料已就绪' },
        { id: 'review', title: '核对内容', description: '检查识别结果' },
        { id: 'done', title: '完成' },
      ]}
    />
  );
}
