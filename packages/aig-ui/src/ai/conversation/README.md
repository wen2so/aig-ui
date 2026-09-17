# Conversation

在底部跟随消息，向上阅读时保持位置，支持历史插入与回到底部。

从 `aig-ui/ai/conversation` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 conversation.tsx，可编译示例见 conversation.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.0 线框视觉：极淡阅读底与发丝界线。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。

`firstMessageId` 标识历史插入，`lastMessageId` 标识追加消息。流式正文或消息状态变化时更新 `contentVersion`，普通父级重渲染保持该值不变。向上阅读时，历史插入补偿滚动位置，追加和流式更新显示未读提示；Registry AI 助手以最后一条消息的正文和状态生成更新标识。
