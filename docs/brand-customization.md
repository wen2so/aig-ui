# 品牌与加载图形自定义

更新日期：2026-09-12。全局品牌通过 `AigProvider.brand` 配置，普通控件、主题浮层、BrandMark、LoadingMark 和 LoadingSequence 共用该作用域。

预览站在顶部提供唯一的“全局主题”入口，统一调整品牌颜色、SVG、材质、密度和环境动效。组件切换后继续沿用当前设置，接入代码与 Provider 属性说明也在该入口查看和复制。组件文档聚焦自身用法，应用侧通常在根布局配置一次 AigProvider。

```tsx
import { AigProvider, BrandMark, Button } from 'aig-ui';
import { LoadingSequence } from 'aig-ui/motion';
import 'aig-ui/styles.css';
import 'aig-ui/motion/styles.css';

const mark = (
  <>
    <path d="M100 38 162 100 100 162 38 100Z" />
    <path d="M70 100h60 M100 70v60" />
  </>
);

<AigProvider brand={{ color: '#267b86', accentColor: '#235660', mark }}>
  <BrandMark aria-label="应用品牌" aria-hidden={false} role="img" />
  <Button loading>正在保存</Button>
  <LoadingSequence taskId={taskId} status={status} label="准备资料">
    <ProjectContent />
  </LoadingSequence>
</AigProvider>;
```

## 配置字段

| 字段          | 类型        | 用途与默认行为                               |
| ------------- | ----------- | -------------------------------------------- |
| `color`       | `string`    | CSS 装饰色；同步生成强调底色、边界和浅表面色 |
| `accentColor` | `string`    | 文字和焦点的强调色；省略时由品牌色加深生成   |
| `mark`        | `ReactNode` | SVG 图形节点；默认采用三角与横线             |
| `loadingIcon` | `ReactNode` | 按钮族的完整加载图标；省略时使用品牌图形     |

品牌 SVG 使用 200 × 200 坐标。其他坐标可以嵌套 `<svg viewBox="0 0 24 24" width="200" height="200">…</svg>`。描边使用 `currentColor`，颜色随作用域改变。宿主传入可信的 React SVG 节点。

LoadingMark 会规范化 path、line、circle、rect、ellipse、polyline、polygon 的路径长度，并协调绘制与反向撤回；双环继续独立运行。实心填充在表面解构时随整体退出，线绘品牌适合使用 `fill="none"`。任务期间保持 `mark` 的 React 节点引用稳定，可以避免普通状态更新重新启动绘制。

## 局部覆盖

```tsx
<AigProvider brand={{ loadingIcon: <ApplicationLoadingSvg /> }}>
  <Button loading>全局加载图标</Button>
  <Button loading loadingIcon={<LocalLoadingSvg />}>
    局部加载图标
  </Button>
</AigProvider>
```

加载图标优先级为：Button 的 `loadingIcon`、最近主题的 `brand.loadingIcon`、`brand.mark`、默认迷你标记。IconButton 和 CopyButton 继承同一入口。自定义图标内部的 CSS 或 SVG 动画由宿主设置，减少动态效果偏好应提供静态显示。

嵌套 AigProvider 只覆盖本层提供的品牌字段。CSS Token 按原生层叠继承，`style` 中的 Token 优先于本层品牌生成值。浮层挂载在所属主题内部，继承相同颜色。

```tsx
<AigProvider
  brand={{ color: '#267b86' }}
  style={{
    '--aig-color-accent': '#235660',
    '--aig-motion-outer-period': '14s',
    '--aig-motion-inner-period': '7s',
    '--aig-motion-glint-period': '6.4s',
  }}
>
  <Application />
</AigProvider>
```

语义状态色继续表达成功、警告和危险。品牌色主要影响装饰、强调文字、焦点与边界；正文及语义状态色可继续通过对应 Token 设置。自定义强调色按实际背景核对文字对比度。
