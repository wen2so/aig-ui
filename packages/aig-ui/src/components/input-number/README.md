# InputNumber

输入数字，保留空值、步进与原生范围校验。

## 基本用法

```tsx
import { InputNumber } from 'aig-ui';
import 'aig-ui/styles.css';

<InputNumber aria-label="份数" defaultValue={2} min={1} max={20} step={1} />;
```

## 状态与边界

value 是 number 或 null，空输入回调 null。min、max 和 step 使用浏览器表单约束，不在每次输入时强制截断用户草稿。保留 onChange、name、form、required 和原生重置。

通过 AigProvider 统一品牌和语义色。可见名称由 label 或 aria-label 提供，业务数据和持久化由宿主处理。
