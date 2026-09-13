# StatusIndicator

以文字和状态点表达真实业务状态，支持忙碌提示。

从 `aig-ui/status-indicator` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 status-indicator.tsx，可编译示例见 status-indicator.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：内核圆点外是一圈缺口轨道，静止时缓慢巡行、忙碌时加快；文字保持稳定，语义状态由宿主提供。 动态装饰遵循系统减少动态效果偏好。
