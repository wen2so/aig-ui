# DatePicker

选择本地日期，支持范围限制与表单校验。

## 基本用法

```tsx
import { DatePicker } from 'aig-ui';
import 'aig-ui/styles.css';

<DatePicker aria-label="交付日期" defaultValue="2026-09-18" min="2026-01-01" max="2027-12-31" />;
```

## 状态与边界

输入框沿用主题，选择面板由浏览器提供，外观随浏览器和系统变化。支持 value、defaultValue、min、max、step、name、required、disabled 和原生表单重置；不包含范围选择、时区转换或自定义日期单元格。

通过 AigProvider 统一品牌和语义色。可见名称由 label 或 aria-label 提供，业务数据和持久化由宿主处理。
