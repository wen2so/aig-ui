# Popconfirm

确认简短操作，支持异步执行与失败重试。

## 基本用法

```tsx
import { Popconfirm, Button } from 'aig-ui';
import 'aig-ui/styles.css';

<Popconfirm
  trigger={
    <Button variant="outline" tone="danger">
      移除资料
    </Button>
  }
  title="移除这份资料"
  description="仅从当前列表移除。"
  onConfirm={() => setRemoved(true)}
/>;
```

## 状态与边界

onConfirm 可返回 Promise；执行中阻止重复确认和关闭，失败保留弹层并显示错误，成功后关闭。复杂产物版本校验继续使用 AI Confirmation，实际权限和幂等由宿主执行。

共享主题颜色、精密边界与减少动态效果约定。示例中的数据由本地提供，宿主负责真实业务数据。
