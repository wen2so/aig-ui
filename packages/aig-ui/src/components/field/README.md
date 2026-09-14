# Field

为原生控件关联标签、说明、必填信息与稳定错误 ID。

从 `aig-ui/field` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 field.tsx，可编译示例见 field.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：标签通过颜色响应聚焦，错误信息由语义文字和左侧短线定位。动态效果遵循系统减少动态效果偏好。
