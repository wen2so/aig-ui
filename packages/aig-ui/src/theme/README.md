# AigProvider

主题作用域：统一品牌、字体、材质、密度与浮层归属。

从 `aig-ui` 导入，并在宿主导入 `aig-ui/styles.css`；动效与 AI 组件另加对应入口的 `styles.css`。公共类型和默认值见 theme/aig-provider.tsx，可编译示例见 theme/aig-provider.stories.tsx。

应用侧通常在根布局配置一次，页面切换后继续沿用。嵌套 Provider 只覆盖本层提供的字段，其余 Token 按原生层叠继承；浮层挂载到最近的主题容器，与所属作用域使用同一套颜色和字体。支持原生属性、className、style 和 ref，其中 `style` 中的 `--aig-` Token 优先于本层生成值。

| 属性       | 类型                         | 用途与默认行为                         |
| ---------- | ---------------------------- | -------------------------------------- |
| `brand`    | `AigBrand`                   | 品牌图形、装饰色与强调色               |
| `font`     | `AigFont`                    | 正文、标题与等宽字体栈                 |
| `theme`    | `string`                     | 主题名称，默认 `warm`                  |
| `density`  | `'comfortable' \| 'compact'` | 控件尺寸与内容间距，默认 `comfortable` |
| `material` | `'solid' \| 'glass'`         | 卡片、面板与浮层表面，默认 `glass`     |
| `style`    | `CSSProperties`              | 直接覆盖 `--aig-` Token，优先级最高    |

## 品牌

品牌图形使用 200 × 200 坐标和 `currentColor`，其他坐标可以嵌套 `<svg viewBox="0 0 24 24" width="200" height="200">`。品牌色同步生成强调底色、边界色与浅表面色。

| 字段          | 用途与默认行为                             |
| ------------- | ------------------------------------------ |
| `color`       | CSS 装饰色；默认哑光玫瑰                   |
| `accentColor` | 文字和焦点的强调色；省略时由品牌色加深生成 |
| `mark`        | 品牌 SVG 节点；默认采用三角与横线          |
| `loadingIcon` | 按钮族的完整加载图标；省略时使用品牌图形   |

## 字体

`font` 的字符串按宿主写好的 CSS 原样使用，数组按优先级编译为字体栈：通用关键字原样输出，含空格的具体字体名加引号。省略的字段继承外层 Token，未声明的字体由浏览器沿字体栈回退；自定义字体文件由宿主自行加载。

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

浮层与全屏加载按组件声明补一次 `--aig-font-family`，因此独立于宿主排版设置仍可读；只要它们在 Provider 内部，就使用该作用域的字体。

## 材质与密度

`material` 影响 Card、Panel、Dialog 与浮层的表面，`density` 影响 Card、Panel、Table 的间距。两者都写成 `data-aig-` 属性，可在同一页面按区域切换。

```tsx
<AigProvider material="solid" density="compact">
  <ProjectTable />
</AigProvider>
```

语义状态色继续表达成功、警告和危险，品牌色主要用于装饰、强调文字、焦点与边界。自定义强调色按实际背景核对文字对比度。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

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

Button 的 `variant` 表达操作层级，`tone` 表达语义色。`variant="danger"` 固定使用危险色，其余默认 `tone="brand"`。静止时文字、边框与细线使用语义色；稳定高亮使用实色和白字；加载与选中保留语义，禁用降低整体明度。全局主题抽屉提供可编辑色表和实时按钮示例。自定义颜色应结合文字和背景核对对比度。
