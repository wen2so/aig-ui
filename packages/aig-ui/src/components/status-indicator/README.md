# StatusIndicator

以文字和状态点表达真实业务状态，支持忙碌提示。

从 `aig-ui/status-indicator` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 status-indicator.tsx，可编译示例见 status-indicator.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：圆点和语义色表达状态，忙碌时建立旋转轨道，普通状态保持稳定。动态效果遵循系统减少动态效果偏好。
