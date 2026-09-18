# Timeline

按时间顺序展示事件与业务状态。

## 基本用法

```tsx
import { Timeline } from 'aig-ui';
import 'aig-ui/styles.css';

<Timeline
  items={[
    { id: 'created', title: '创建项目', time: '09:00', description: '资料目录已建立', tone: 'success' },
    { id: 'review', title: '开始审核', time: '09:20', description: '等待确认识别结果', tone: 'info' },
  ]}
/>;
```

## 状态与边界

items 按宿主顺序展示，time 是可读文字，dateTime 可提供标准时间。tone 只表达已知状态，不会改变事件顺序。

共享主题颜色、精密边界与减少动态效果约定。示例中的数据由本地提供，宿主负责真实业务数据。
