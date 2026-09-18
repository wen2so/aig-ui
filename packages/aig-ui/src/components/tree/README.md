# Tree

按层级浏览内容，支持展开、键盘导航与单选。

## 基本用法

```tsx
import { Tree } from 'aig-ui';
import 'aig-ui/styles.css';
const nodes = [
  {
    id: 'project',
    label: '项目资料',
    children: [
      { id: 'design', label: '设计文件' },
      { id: 'review', label: '审核记录' },
      { id: 'locked', label: '只读资料', disabled: true },
    ],
  },
];

<Tree label="项目目录" nodes={nodes} defaultExpandedIds={['project']} />;
```

## 状态与边界

nodes.id 在整棵树中必须唯一。方向键上下移动焦点，左右展开或回到父项，Home / End 定位首尾，Enter / Space 选择。焦点与选择独立，支持连续字符检索。仅提供单选，不包含复选、拖拽或异步加载。

通过 AigProvider 统一品牌和语义色。可见名称由 label 或 aria-label 提供，业务数据和持久化由宿主处理。
