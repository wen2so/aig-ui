# Cascader

逐级选择叶节点并提交完整路径。

## 基本用法

```tsx
import { Cascader } from 'aig-ui';
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

<Cascader label="选择资料路径" options={nodes} name="documentPath" />;
```

## 状态与边界

value 是从根到叶的 ID 数组。逐级选择，只有叶节点提交；name 对应 JSON 编码的路径字符串。禁用节点不接受选择。支持清除和失效路径展示；表单级重置由受控 value 处理。

通过 AigProvider 统一品牌和语义色。可见名称由 label 或 aria-label 提供，业务数据和持久化由宿主处理。
