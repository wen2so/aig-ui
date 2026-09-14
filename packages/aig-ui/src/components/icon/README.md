# Icon

统一线性图标尺寸，区分装饰图标和具名图像。

从 `aig-ui/icon` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 icon.tsx，可编译示例见 icon.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.0 线框视觉：几何细线图标，继承文字颜色。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。


项目操作图标统一采用 Lucide，按名称导入后交给 Icon。默认尺寸为 20px、描边为 1.5px，省略 label 时使用装饰语义；独立图像通过 label 提供名称。

```tsx
import { Search, Trash2 } from 'lucide-react';
import { Icon, Button } from 'aig-ui';

<Icon icon={Search} label="搜索" />
<Button variant="danger" leadingIcon={<Icon icon={Trash2} />}>删除记录</Button>
```

原生复选框遮罩由 `scripts/icons.mjs` 从同一 Lucide 版本生成，执行 `pnpm tokens` 同步。品牌标识与加载序列保留品牌设计图形。
