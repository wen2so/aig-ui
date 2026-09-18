# Grid

按列数或最小列宽自动组织内容。

## 用法

```tsx
import { Grid } from 'aig-ui';
import 'aig-ui/styles.css';

<Grid minColumnWidth={160}>
  {['设计资料', '处理任务', '审核结果'].map((title) => (
    <Card key={title}>{title}</Card>
  ))}
</Grid>;
```

保留原生元素属性、className 和 style，使用最近的 AigProvider 主题。columns 指定固定列数；省略时按 minColumnWidth 自动换行，gap 控制间距。固定列数不会自动变成移动端单列，需要自动重排时省略 columns。
