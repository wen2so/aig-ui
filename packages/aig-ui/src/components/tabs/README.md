# Tabs

使用可控值组织同一区域的不同视图，支持方向键与面板关联。

从 `aig-ui/tabs` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 tabs.tsx，可编译示例见 tabs.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：基线随触达与激活延展，固定节点标记当前位置，面板平滑进入。动态效果遵循系统减少动态效果偏好。
