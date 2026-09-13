# Field

为原生控件关联标签、说明、必填信息与稳定错误 ID。

从 `aig-ui/field` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 field.tsx，可编译示例见 field.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：标签节点保持方向，控件获得焦点时建立实心标记，错误信息以左侧短线定位。文字采用自然字距，保留键盘、禁用和长文本行为，并遵循系统减少动态效果设置。
