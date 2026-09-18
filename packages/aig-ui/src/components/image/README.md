# Image

展示图片、失败占位和可关闭的放大预览。

## 基本用法

```tsx
import { Image } from 'aig-ui';
import 'aig-ui/styles.css';
const sample =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"><rect width="400" height="220" fill="#f5f3ee"/><g fill="none" stroke="#7d4e57"><path d="M200 34 290 182H110Z"/><path d="M155 146H245"/><rect x="16" y="16" width="368" height="188" stroke-opacity=".3"/></g></svg>',
  );

<Image src={sample} alt="精密线绘图形" width={400} height={220} caption="点击图片打开预览。" />;
```

## 状态与边界

alt 必填。默认启用点击放大，preview={false} 可关闭。加载失败显示 fallback；预览使用 Dialog 支持 Escape、焦点锁定和返回。

共享主题颜色、精密边界与减少动态效果约定。示例中的数据由本地提供，宿主负责真实业务数据。
