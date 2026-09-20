# Button

用于提交、确认和普通操作，IconButton 与 CopyButton 复用同一按钮实现。

## 基本用法

```tsx
import { Button } from 'aig-ui';
import 'aig-ui/styles.css';

<Button onClick={save}>保存草稿</Button>
<Button type="submit" loading={saving}>提交设置</Button>
```

默认 `variant="primary"`、`size="md"`、`type="button"`、`loading={false}`、`entrance={true}`。小、中、大尺寸的最小高度分别为 26、32、40px。

## 外观、颜色与状态

| 维度     | 属性                  | 用法                                                       |
| -------- | --------------------- | ---------------------------------------------------------- |
| 操作外观 | `variant`             | primary、secondary、outline、ghost，按操作层级选择         |
| 语义颜色 | `tone`                | brand、neutral、info、success、warning、danger，默认 brand |
| 尺寸     | `size`                | sm、md、lg，默认 md                                        |
| 执行状态 | `loading`、`disabled` | 执行中与业务不可用；加载时自动禁用重复激活                 |
| 持续选择 | `aria-pressed`        | 用于开关或切换按钮，由业务状态控制                         |
| 展开状态 | `aria-expanded`       | 仅在按钮控制关联内容展开时使用                             |
| 入场     | `entrance`            | 默认开启，密集列表或静态预览可关闭                         |

新用法通过 `tone="danger"` 表达危险操作，可配合不同外观。`variant="danger"` 保留原有轮廓与行为，固定使用危险色并优先于 `tone`，作为兼容写法单独说明。`variant="ghost"` 表示低强调的无静态边框按钮，不等同于其他组件库的同名属性。

```tsx
<Button tone="danger">删除记录</Button>
<Button variant="outline" tone="danger">移除关联</Button>
```

悬停、键盘聚焦和瞬时按压由实际交互触发，不作为额外业务状态保存。颜色由 `AigProvider.palette` 配置；outline 和 ghost 的交互填充保留珍珠白，语义色作用于文字和边缘。完整色表见[主题说明](../../theme/README.md)。

## 图标与内容

`leadingIcon` 和 `trailingIcon` 提供固定大小的前后图标槽位，使用 `currentColor` 继承操作层级颜色。图标作为装饰，操作名称由文字或 `aria-label` 提供。长文字在两侧图标之间自然换行。

```tsx
<Button leadingIcon={<Plus size={16} />} trailingIcon={<ArrowRight size={16} />}>
  创建项目
</Button>
<Button variant="outline" aria-pressed={selected} onClick={() => setSelected(!selected)}>
  图形视图
</Button>
```

## 加载与禁用

`loading` 会设置 `aria-busy` 并禁用重复激活，加载标记显示在预留的左侧状态位，按钮文字、图标槽位和整体尺寸继续保留。`disabled` 用于业务禁用。加载时基线持续扫描（1.7 秒一遍），选择标记让出加载状态位；加载与禁用期间高亮面隐藏，恢复可用后按实际交互状态展示。禁用保留静态轮廓，实际请求与幂等由应用负责。

`loadingIcon` 接受 React 内容，推荐使用带 `viewBox` 和 `currentColor` 的 SVG。图标处于装饰区域，按钮文本或 `aria-label` 提供名称。

```tsx
<Button
  loading
  loadingIcon={
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeDasharray="12 7" />
    </svg>
  }
>
  正在保存
</Button>
```

加载图标优先级为本按钮的 `loadingIcon`、最近的 `AigProvider.brand.loadingIcon`、品牌图形、默认线绘标记。IconButton 加载时显示加载图标并保持正方形尺寸。

## 品牌与交互

挂载时以 8% 概率尝试播放入场：同一批按钮按视觉行从左到右间隔 120ms，最多延迟 360ms。单按钮前 600ms 按 40ms 帧格闪切，后段收束，总长 1000ms；选中项保留底色，其他项退回透明。方形 IconButton 默认关闭入场，保留完整操作边界。

每次悬停或键盘聚焦以 8% 概率尝试闪切，未命中时直接高亮。入场与交互共享 15 秒冷却，作用于当前页面内所有按钮；切换视图、重新挂载和加载恢复不会重置冷却。冷却结束后由下一次入场或交互重新抽取，不定时自动播放。outline 保留完整细框，ghost 默认和选中均无底线。按压收拢，选中或展开保留底色和左侧标记。边缘亮头及尾迹在 hover 或键盘聚焦后显示，离开后三秒收回。

几何比例固定为：两个相邻三角单元组成基础平行四边形，其上、下边长度与单个三角形底边一致；三个单元可组成梯形。属于同一梯形的单元合并渲染，不再独立闪切。

`AigProvider.brand.color` 设置装饰色，`accentColor` 设置文字、焦点与品牌衬底颜色，`mark` 设置品牌 SVG 节点。`style` 中的 `--aig-` Token 具有更高优先级。

支持原生属性、ref、Enter、Space 和可见焦点。环境线条保持稳定亮度。系统减少动态效果时直接展示稳定轮廓、悬停高亮与实际状态；强制颜色模式使用系统边框和选中色。

高亮使用交替朝向的等腰三角网格，共用统一斜率，按种子生成原始块归属与采样表。每个闪切采样点随机点亮至多两组独立块，组间保留至少两个网格单元的距离。梯形及边缘填充合并为完整多边形，只统一显现和收束。块面与文字遮罩均不额外描边，并用 `plus-lighter` 累加共边覆盖率；底色层单独隔离，闪切与半透明收束阶段也不留下浅色接缝。按实际按钮宽高适配坐标，字体与换行变化后仍保持规则几何。边缘细线与文字共享区域遮罩，高亮覆盖处显示浅色，外围细线继续保留。

密集场景中，未交互按钮只保留空轨迹容器。首次 hover 或键盘聚焦时从文档级模板创建三组亮头与尾迹，并同步浅色遮罩副本；离开后三秒收回，后续进入复用节点和停止位置。刻面、文字遮罩及其观察器仍按实例维护，`entrance={false}` 可关闭挂载入场。测量入口为预览站的 `button-performance.html?count=200`。
