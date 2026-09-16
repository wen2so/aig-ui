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

挂载时播放一次入场：同一批按钮按视觉行从左到右间隔 120ms，最多延迟 360ms。单按钮前 600ms 按 40ms 帧格闪切，后段收束，总长 1000ms；选中项保留底色，其他项退回透明。密集列表或静态预览可设置 `entrance={false}`。方形 IconButton 默认关闭入场，保留完整操作边界。

每次重新悬停或键盘聚焦生成新一轮随机组合，持续停留时保持高亮。一轮内保持基础网格，闪切采样点改变亮块和缺口的组合；四段边线布局在挂载期间固定。primary 使用外围短标，outline 保留完整细框；按压收拢，选中与展开保留实底、左侧标记和底线。

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

几何比例固定为：两个相邻三角单元组成基础平行四边形，其上、下边长度与单个三角形底边一致；再接一个单元组成梯形。更多单元可以形成整倍数的连续区域，按钮边缘允许裁切。

`AigProvider.brand.color` 设置装饰色，`accentColor` 设置文字、焦点与品牌衬底颜色，`mark` 设置品牌 SVG 节点。`style` 中的 `--aig-` Token 具有更高优先级。

支持原生属性、ref、Enter、Space 和可见焦点。环境线条保持稳定亮度。系统减少动态效果时直接展示稳定轮廓、悬停高亮与实际状态；强制颜色模式使用系统边框和选中色。

高亮使用交替朝向的等腰三角网格，共用统一斜率。每个闪切采样点随机选择一至两组相邻单元，每组一至三个，作为亮块或缺口；每轮同时更新网格整体偏移、朝向与采样表，不再从有限分区模板中轮换。合并的单元采用相同满亮度和同色描边，保持连续表面。按实际按钮宽高适配坐标，字体与换行变化后仍保持内部规则几何。边缘细线与文字共享区域遮罩，高亮覆盖处显示浅色，伸缩位置与原始细线一致；最终收束为完整底色。
