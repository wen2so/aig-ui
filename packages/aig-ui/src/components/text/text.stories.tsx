import { Text } from './text.js';
export default { title: '通用/Text', component: Text };
export const preview = { name: 'Text', label: '文本', description: '正文与说明文字，支持语义色和自然换行。' };
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <>
      <Text>清晰的信息，平静的界面。</Text>
      <Text size="sm" tone="muted">
        辅助说明保持可读。
      </Text>
    </>
  );
}
