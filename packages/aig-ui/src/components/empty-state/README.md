# EmptyState

区分初次使用和筛选为空，显示下一步引导。

从 `aig-ui/empty-state` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 empty-state.tsx，可编译示例见 empty-state.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：Lucide 状态图标、内容说明和下一步操作保持稳定，间距建立阅读层次。动态效果遵循系统减少动态效果偏好。
