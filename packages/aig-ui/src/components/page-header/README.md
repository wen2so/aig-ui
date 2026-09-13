# PageHeader

组织标题、说明和主要操作，窄屏下自然换行。

从 `aig-ui/page-header` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 page-header.tsx，可编译示例见 page-header.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：固定方向的品牌节点与底部细线界定标题区域，标题、说明与操作保持清晰层级。静态文字采用自然字距，操作反馈遵循系统减少动态效果设置。
