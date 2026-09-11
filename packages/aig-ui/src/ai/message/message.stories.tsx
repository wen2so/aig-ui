import { Message } from './message.js';
export default { title: 'AI/Message', component: Message };
export const preview = {
  name: 'Message',
  label: '消息',
  description: '展示用户或助手消息，支持纯文本、安全 Markdown 和消息操作。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Message
      role="assistant"
      format="markdown"
      content={'已整理 **3 项重点**。\n\n- 检查资料来源\n- 确认版本\n- 审阅后应用\n\n这是本地演示内容。'}
    />
  );
}
