# PromptInput

输入与发送、停止入口，识别中文输入法并在失败后保留草稿。

从 `aig-ui/ai/prompt-input` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 prompt-input.tsx，可编译示例见 prompt-input.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：完整输入边界与聚焦基线组织编辑区域，运行中提示节点旋转。动态效果遵循系统减少动态效果偏好。
