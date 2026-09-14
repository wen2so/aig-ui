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

悬停或键盘聚焦时，八块不规则三角面拼成高亮表面，面间保留细缝，文字与图标保持稳定。指针每次移入重新分配各面的明度，较深的面更早开始；每面以 380ms 阶跃动画完成闪切，叠加延迟后约 600ms 稳定为完整亮面。持续悬停保留高亮，悬停与焦点均离开后恢复静止轮廓。静止态呈现边框与基线扫描。方形 IconButton 隐藏横向高亮面，保持适合图标操作的轮廓。

稳定轮廓按操作层级区分：primary 为矩形框加端部刻线，secondary 为上下双横轨，outline 为连续细框，ghost 为带端封的基线，danger 使用危险色与加厚底线。鼠标移入重新分配高亮明度；悬停和键盘聚焦扩展边框并扫描基线一次；按压收拢边框，松开回位。`aria-pressed="true"` 与 `aria-expanded="true"` 保留左侧选择标记和加厚底线；悬停和键盘聚焦也显示该标记。

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
