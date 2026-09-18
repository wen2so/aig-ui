# Statistic

格式化数值，区分有效数据与未知值。

## 基本用法

```tsx
import { Statistic } from 'aig-ui';
import 'aig-ui/styles.css';

<Statistic title="已处理资料" value={1286} suffix="份" description="示例数据，用于展示数值排版。" />;
```

## 状态与边界

null 和非有限数值显示破折号，precision 限定在 0–20 位小数。locale 默认 zh-CN，宿主提供有效的 Intl locale。

共享主题颜色、精密边界与减少动态效果约定。示例中的数据由本地提供，宿主负责真实业务数据。
