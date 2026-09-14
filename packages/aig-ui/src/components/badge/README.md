# Badge

用文字和语义色表达分类与状态，长标签可自然换行。

从 `aig-ui/badge` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 badge.tsx，可编译示例见 badge.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：胶囊轮廓与静态菱形节点呈现紧凑状态，文字和语义色共同表达含义。动态效果遵循系统减少动态效果偏好。
