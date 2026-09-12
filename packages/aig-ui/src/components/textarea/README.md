# Textarea

原生多行编辑，允许纵向调整高度并保留输入内容。

从 `aig-ui/textarea` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 textarea.tsx，可编译示例见 textarea.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.0 视觉：菱形标签、输入激活线、选择状态与稳定阅读底。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
