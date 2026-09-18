import { Button } from '../button/button.js';
import { Tooltip } from './tooltip.js';
export default { title: '数据展示/Tooltip', component: Tooltip.Root };
export const preview = {
  name: 'Tooltip',
  label: '工具提示',
  description: '在悬停或键盘聚焦时提供简短补充说明。',
};
/** 展示可复用组件的代表性状态。 */
export function Preview() {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button variant="outline" />}>保存草稿</Tooltip.Trigger>
        <Tooltip.Content>保留当前编辑内容，稍后继续。</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
