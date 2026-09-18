# Flex

排列内容并控制间距、对齐和换行。

## 用法

```tsx
import { Flex } from 'aig-ui';
import 'aig-ui/styles.css';

<Flex wrap justify="space-between">
  <span>项目资料</span>
  <Button>新增资料</Button>
  <Button variant="outline">筛选</Button>
</Flex>;
```

保留原生元素属性、className 和 style，使用最近的 AigProvider 主题。布局随内容自然撑开，内容的加载、错误与持久化由宿主处理。
