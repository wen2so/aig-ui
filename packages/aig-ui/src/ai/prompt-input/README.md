# PromptInput

输入与发送、停止入口，识别中文输入法并在失败后保留草稿。

从 `aig-ui/ai/prompt-input` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 prompt-input.tsx，可编译示例见 prompt-input.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.0 视觉：边缘轨迹、步骤连接、来源序号、版本和消息阅读层。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
