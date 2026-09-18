# Splitter

通过拖动或键盘调整两个面板的比例。

## 用法

```tsx
import { Splitter } from 'aig-ui';
import 'aig-ui/styles.css';

<Splitter
  label="资料目录宽度"
  first={<p>资料目录</p>}
  second={<p>拖动中间分隔线，或聚焦后使用方向键、Home 和 End 调整。</p>}
  style={{ minHeight: 180 }}
/>;
```

保留原生元素属性、className 和 style，使用最近的 AigProvider 主题。value / onValueChange 提供受控比例，defaultValue 设置初始值。min 和 max 以百分比约束面板；横向使用左右方向键，纵向使用上下方向键，Shift 加大步长，Home / End 到达边界。面板内容独立滚动，触屏通过分隔线拖动。
