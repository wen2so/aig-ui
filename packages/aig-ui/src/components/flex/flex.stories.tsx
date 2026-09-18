import { Flex } from './flex.js';
import { Button } from '../button/button.js';
export default { title: '布局/Flex', component: Flex };
export const preview = { name: 'Flex', label: '弹性布局', description: '排列内容并控制间距、对齐和换行。' };
/** 可直接运行的布局与交互示例。 */
export function Preview() {
  return (
    <Flex wrap justify="space-between">
      <span>项目资料</span>
      <Button>新增资料</Button>
      <Button variant="outline">筛选</Button>
    </Flex>
  );
}
