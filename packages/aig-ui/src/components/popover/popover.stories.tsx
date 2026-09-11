import { Button } from '../button/button.js';
import { Popover } from './popover.js';
export default { title: '通用/Popover', component: Popover.Root };
export const preview = {
  name: 'Popover',
  label: '弹出内容',
  description: '在触发元素旁展示补充操作，支持焦点恢复和越界定位。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Popover.Root>
      <Popover.Trigger render={<Button variant="outline" />}>查看同步说明</Popover.Trigger>
      <Popover.Content>
        <Popover.Title>自动同步</Popover.Title>
        <Popover.Description>保存后的更改会在下次同步时更新。</Popover.Description>
        <Popover.Close render={<Button size="sm" />}>知道了</Popover.Close>
      </Popover.Content>
    </Popover.Root>
  );
}
