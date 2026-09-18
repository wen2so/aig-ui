# Layout

组合标题、侧栏、正文与底部区域。

## 用法

```tsx
import { Layout } from 'aig-ui';
import 'aig-ui/styles.css';

<Layout>
  <Layout.Header>资料工作台</Layout.Header>
  <Layout.Aside>项目目录</Layout.Aside>
  <Layout.Content>当前项目的资料与任务</Layout.Content>
  <Layout.Footer>所有更改已保存</Layout.Footer>
</Layout>;
```

保留原生元素属性、className 和 style，使用最近的 AigProvider 主题。布局随内容自然撑开，内容的加载、错误与持久化由宿主处理。
