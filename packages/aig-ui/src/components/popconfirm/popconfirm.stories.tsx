import { Popconfirm } from './popconfirm.js';
import { useState } from 'react';
import { Button } from '../button/button.js';
export default { title: '反馈/Popconfirm', component: Popconfirm };
export const preview = {
  name: 'Popconfirm',
  label: '气泡确认',
  description: '确认简短操作，支持异步执行与失败重试。',
};
/** 气泡确认的可运行展示。 */
export function Preview() {
  const [removed, setRemoved] = useState(false);
  return (
    <div>
      {removed ? (
        <p role="status">资料已移除</p>
      ) : (
        <Popconfirm
          trigger={
            <Button variant="outline" tone="danger">
              移除资料
            </Button>
          }
          title="移除这份资料"
          description="仅从当前列表移除。"
          onConfirm={() => setRemoved(true)}
        />
      )}
    </div>
  );
}
