# Anchor

定位页面章节并标记滚动位置。

## 用法

```tsx
import { Anchor } from 'aig-ui';
import 'aig-ui/styles.css';

<div>
  <Anchor
    items={[
      { id: 'anchor-summary', title: '项目摘要' },
      { id: 'anchor-details', title: '处理详情' },
    ]}
  />
  <section id="anchor-summary" style={{ scrollMarginTop: 90, paddingBlock: 30 }}>
    项目摘要
  </section>
  <section id="anchor-details" style={{ scrollMarginTop: 90, paddingBlock: 30 }}>
    处理详情
  </section>
</div>;
```

保留原生元素属性、className 和 style，使用最近的 AigProvider 主题。items.id 对应当前文档中真实存在的章节 ID。使用原生 URL 锚点保留浏览器历史；宿主用 scroll-margin-top 设置固定标题的避让距离，offset 用于判定当前章节。
