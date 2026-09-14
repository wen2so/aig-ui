# Button

用于提交、确认和普通操作，IconButton 与 CopyButton 复用同一按钮实现。

## 基本用法

```tsx
import { Button } from 'aig-ui';
import 'aig-ui/styles.css';

<Button onClick={save}>保存草稿</Button>
<Button type="submit" loading={saving}>提交设置</Button>
```

默认 `variant="primary"`、`size="md"`、`type="button"`、`loading={false}`。小、中、大尺寸的最小高度分别为 26、32、40px。

首次悬停或键盘聚焦播放局部刻面闪切，后续交互直接显示稳定高亮。四段边缘细线在挂载时随机确定布局和运动参数，重复交互复用配置。按压收拢边框，松开回位；选中与展开状态保留左侧标记和加厚底线。

`tone` 支持 brand、neutral、info、success、warning、danger，默认 brand；`variant="danger"` 固定使用危险色。语义色统一作用于文字、边框、细线和高亮，主题通过 `AigProvider.palette` 配置，完整色表见[主题说明](../../theme/README.md)。

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

`AigProvider.brand.color` 设置装饰色，`accentColor` 设置文字和焦点色，`mark` 设置品牌 SVG 节点。`style` 中的 `--aig-` Token 具有更高优先级。

支持原生属性、ref、Enter、Space 和可见焦点。环境线条保持稳定亮度。系统减少动态效果时直接展示稳定轮廓、悬停高亮与实际状态；强制颜色模式使用系统边框和选中色。


语义高亮保留三档深浅刻面；相邻边缘以同色描边轻微重叠，保持连续表面。边缘细线与文字共享区域遮罩，高亮覆盖处显示浅色，伸缩位置与原始细线一致。
