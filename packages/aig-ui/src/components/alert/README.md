# Alert

在内容区域展示说明、警告或错误，保留恢复操作。

从 `aig-ui/alert` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 alert.tsx，可编译示例见 alert.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：提示以语义色边界、侧线与轻微底色区分状态，文字和节点保持稳定。动态效果遵循系统减少动态效果偏好。
