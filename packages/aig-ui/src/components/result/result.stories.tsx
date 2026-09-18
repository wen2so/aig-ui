import { Result } from './result.js';
export default { title: '反馈/Result', component: Result };
export const preview = {
  name: 'Result',
  label: '结果',
  description: '明确表达成功、失败、未找到、登录过期或访问受限。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return <Result status="session-expired" description="重新登录后继续当前工作。" />;
}
