# Textarea

原生多行编辑，允许纵向调整高度并保留输入内容。

从 `aig-ui/textarea` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 textarea.tsx，可编译示例见 textarea.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：文本域保留完整边界，聚焦时建立基线，支持纵向调整尺寸并保持长文本可读。动态效果遵循系统减少动态效果偏好。
