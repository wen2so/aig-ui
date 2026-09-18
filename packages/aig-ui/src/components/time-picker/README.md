# TimePicker

选择本地时间，支持分钟或秒级步长。

## 基本用法

```tsx
import { TimePicker } from 'aig-ui';
import 'aig-ui/styles.css';

<TimePicker aria-label="开始时间" defaultValue="09:30" step={60} />;
```

## 状态与边界

输入框沿用主题，选择面板由浏览器提供，外观随浏览器和系统变化。支持 value、defaultValue、min、max、step、name、required、disabled 和原生表单重置；不包含范围选择、时区转换或自定义日期单元格。

通过 AigProvider 统一品牌和语义色。可见名称由 label 或 aria-label 提供，业务数据和持久化由宿主处理。
