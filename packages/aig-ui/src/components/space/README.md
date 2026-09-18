# Space

为相邻操作提供水平或垂直间距。

## 用法

```tsx
import { Space } from 'aig-ui';
import 'aig-ui/styles.css';

<Space>
  <Button>保存</Button>
  <Button variant="outline">取消</Button>
  <Button variant="ghost" tone="danger">
    删除
  </Button>
</Space>;
```

保留原生元素属性、className 和 style，使用最近的 AigProvider 主题。布局随内容自然撑开，内容的加载、错误与持久化由宿主处理。
