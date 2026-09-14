# Input

原生单行输入，保留受控值、自动填充、错误与中文输入事件。

从 `aig-ui/input` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 input.tsx，可编译示例见 input.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：输入框保留完整细线边界，聚焦时基线延展，文字和输入位置保持稳定。动态效果遵循系统减少动态效果偏好。
