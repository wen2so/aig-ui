# Checkbox

原生复选框，支持受控值、真实表单值和中间状态。

从 `aig-ui/checkbox` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 checkbox.tsx，可编译示例见 checkbox.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：方形细线容纳 Lucide 对勾或中间态，选中时标记建立，静态与禁用保持稳定。动态效果遵循系统减少动态效果偏好。
