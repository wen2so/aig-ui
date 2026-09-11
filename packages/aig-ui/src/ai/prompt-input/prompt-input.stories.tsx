import { useState } from 'react';
import { PromptInput } from './prompt-input.js';
export default { title: 'AI/PromptInput', component: PromptInput };
export const preview = {
  name: 'PromptInput',
  label: '提示输入',
  description: '输入与发送、停止入口，识别中文输入法并在失败后保留草稿。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  const [result, setResult] = useState('');
  return (
    <>
      <PromptInput
        defaultValue="整理这份演示资料的重点"
        onSubmit={(value) => setResult(`已收到演示任务：${value}`)}
      />
      <p role="status">{result}</p>
    </>
  );
}
