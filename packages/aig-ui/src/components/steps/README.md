# Steps

展示流程位置、完成与失败状态。

## 用法

```tsx
import { Steps } from 'aig-ui';
import 'aig-ui/styles.css';

<Steps
  current={1}
  items={[
    { id: 'upload', title: '上传资料', description: '资料已就绪' },
    { id: 'review', title: '核对内容', description: '检查识别结果' },
    { id: 'done', title: '完成' },
  ]}
/>;
```

保留原生元素属性、className 和 style，使用最近的 AigProvider 主题。current 为从 0 开始的步骤索引。items.status 可覆盖单步状态，onStepChange 存在时标题成为按钮；是否允许跳转由 disabled 和宿主业务控制。
