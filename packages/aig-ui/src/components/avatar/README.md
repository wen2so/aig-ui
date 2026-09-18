# Avatar

展示头像，图片失败时回退到姓名。

## 基本用法

```tsx
import { Avatar } from 'aig-ui';
import 'aig-ui/styles.css';

<div style={{ display: 'flex', gap: 16 }}>
  <Avatar name="林舟" />
  <Avatar name="设计团队" size={48} />
  <Avatar name="图片不可用" src="/missing-avatar.png" />
</div>;
```

## 状态与边界

name 提供替代名称；加载失败显示姓名前两个字符，fallback 可自定义占位。

共享主题颜色、精密边界与减少动态效果约定。示例中的数据由本地提供，宿主负责真实业务数据。
