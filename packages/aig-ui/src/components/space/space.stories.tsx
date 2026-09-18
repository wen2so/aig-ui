import { Space } from './space.js';
import { Button } from '../button/button.js';
export default { title: '布局/Space', component: Space };
export const preview = { name: 'Space', label: '间距', description: '为相邻操作提供水平或垂直间距。' };
/** 可直接运行的布局与交互示例。 */
export function Preview() {
  return (
    <Space>
      <Button>保存</Button>
      <Button variant="outline">取消</Button>
      <Button variant="ghost" tone="danger">
        删除
      </Button>
    </Space>
  );
}
