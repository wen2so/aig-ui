# TreeSelect

从树形目录选择节点并提交稳定标识。

## 基本用法

```tsx
import { TreeSelect } from 'aig-ui';
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

<TreeSelect label="选择资料" nodes={nodes} defaultValue="design" name="documentId" />;
```

## 状态与边界

value / defaultValue 为节点 ID，name 对应隐藏表单值，支持清除、失效值展示和 leafOnly。弹层使用 Tree 的键盘交互。表单级重置请由受控 value 处理。

通过 AigProvider 统一品牌和语义色。可见名称由 label 或 aria-label 提供，业务数据和持久化由宿主处理。
