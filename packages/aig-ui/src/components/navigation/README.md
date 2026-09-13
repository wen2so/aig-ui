# Navigation

原生导航与可组合链接，标记当前页面并支持长文本换行。

从 `aig-ui/navigation` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 navigation.tsx，可编译示例见 navigation.stories.tsx。

示例链接定位到真实内容区，并更新当前标记。应用中用当前路由设置 `current`，每个 `href` 对应可访问的页面或内容锚点。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：下划线沿导航边界展开并持续巡行，固定方向的节点标记当前位置。当前项采用实心节点与品牌色下划线，保留键盘和长文本行为，并遵循系统减少动态效果设置。
