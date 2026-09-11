import { Button } from '../button/button.js';
import { Drawer } from './drawer.js';
export default { title: '通用/Drawer', component: Drawer.Root };
export const preview = {
  name: 'Drawer',
  label: '抽屉',
  description: '复用对话框的焦点与关闭行为，在侧边展示详情与操作。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Drawer.Root>
      <Drawer.Trigger render={<Button variant="outline" />}>查看资料详情</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Title>资料详情</Drawer.Title>
        <Drawer.Description>项目资料的状态与说明。</Drawer.Description>
        <p>当前资料已完成解析。</p>
        <Drawer.Actions>
          <Drawer.Close render={<Button />}>完成</Drawer.Close>
        </Drawer.Actions>
      </Drawer.Content>
    </Drawer.Root>
  );
}
