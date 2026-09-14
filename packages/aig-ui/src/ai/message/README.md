# Message

展示用户或助手消息，支持纯文本、安全 Markdown 和消息操作。

从 `aig-ui/ai/message` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 message.tsx，可编译示例见 message.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：作者节点和助手侧线保持稳定，流式生成期间启用节点旋转与侧线扫描。动态效果遵循系统减少动态效果偏好。
