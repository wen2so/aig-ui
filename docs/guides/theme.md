# 主题与品牌

更新日期：2026-09-14。全局品牌通过 `AigProvider.brand` 配置，字体通过 `AigProvider.font` 配置，普通控件、主题浮层、BrandMark、LoadingMark 和 LoadingSequence 共用该作用域。Provider 的 material 默认 glass，density 默认 comfortable，theme 默认 warm。

预览站在顶部提供唯一的“全局主题”入口，统一调整品牌颜色、SVG、字体、材质、密度和环境动效。组件切换后继续沿用当前设置，接入代码在该入口复制；Provider 的属性表与数据类型随其他组件一起在 [AigProvider 文档](http://127.0.0.1:5173/?component=AigProvider)中查看。组件文档聚焦自身用法，应用侧通常在根布局配置一次 AigProvider。

以下组合片段中的 taskId、status 与内容组件由宿主提供。

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

<AigProvider
  brand={{ color: '#267b86', accentColor: '#235660', mark }}
  font={{ family: ['Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'] }}
>
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

## 字体

字体由 `AigProvider.font` 设置，写成数组时按优先级编译为字体栈（通用关键字原样输出，含空格的具体字体名加引号），写成字符串时按宿主写好的 CSS 使用。

| 字段      | Token                | 用途与默认值                                                       |
| --------- | -------------------- | ------------------------------------------------------------------ |
| `family`  | `--aig-font-family`  | 正文、控件与浮层，默认 `system-ui, 'Microsoft YaHei', sans-serif`  |
| `display` | `--aig-font-display` | 标题与展示文字，默认 `STSong, 'Songti SC', SimSun, Georgia, serif` |
| `mono`    | `--aig-font-mono`    | 代码、路径与编号，默认 `ui-monospace, Consolas, monospace`         |

```tsx
<AigProvider
  font={{
    family: ['Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
    display: ['Songti SC', 'SimSun', 'serif'],
    mono: ['Consolas', 'monospace'],
  }}
>
  <Application />
</AigProvider>
```

省略的字段继承外层 Token，未声明的字体由浏览器沿字体栈回退；自定义字体文件由宿主自行加载，接入 web font 时保持 `font-display: swap`。Dialog、Toast 与全屏加载按组件声明读取 `--aig-font-family`，只要在 Provider 内部就使用该作用域的字体。

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

## 语义色系

`AigProvider.palette` 统一配置语义颜色，独立于 `brand.color`。省略字段继承外层，浮层使用所属主题色，`style` 中的 Token 覆盖优先。

| 字段 | 默认色 | 用途 |
| --- | --- | --- |
| danger | `#E60012` 鲜红 | 删除、移除、失败 |
| success | `#15803D` 绿色 | 确认、完成、通过 |
| warning | `#B45309` 琥珀 | 警告、需要留意 |
| info | `#1D4ED8` 蓝色 | 信息、进度 |
| neutral | `#52525B` 灰色 | 常规、中性 |

```tsx
<AigProvider palette={{ danger: '#e60012', success: '#15803d', warning: '#b45309', info: '#1d4ed8', neutral: '#52525b' }}>
  <Button variant="danger">删除记录</Button>
  <Button tone="success">确认通过</Button>
  <Button variant="outline" tone="warning">需要留意</Button>
</AigProvider>
```

Button 的 `variant` 表达操作层级，`tone` 表达语义色。`variant="danger"` 固定使用危险色，其余默认 `tone="brand"`。静止时文字、边框与细线使用语义色；稳定高亮保留三档刻面深浅，文字与细线在覆盖区域切换为浅色；加载与选中保留语义，禁用降低整体明度。全局主题抽屉提供可编辑色表和实时按钮示例。自定义颜色应结合文字和背景核对对比度。
