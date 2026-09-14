# Pagination

受控分页与边界按钮，数据请求和页大小由宿主管理。

从 `aig-ui/pagination` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 pagination.tsx，可编译示例见 pagination.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：上下细线组织页码，当前页由品牌色与静态节点标记。动态效果遵循系统减少动态效果偏好。
