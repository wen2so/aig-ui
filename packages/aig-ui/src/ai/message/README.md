# Message

展示用户或助手消息，支持纯文本、安全 Markdown 和消息操作。

从 `aig-ui/ai/message` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 message.tsx，可编译示例见 message.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.2 线框视觉：作者菱形节点（流式时自转）与助手侧玫瑰轨道线（带缓慢下巡光点）。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
