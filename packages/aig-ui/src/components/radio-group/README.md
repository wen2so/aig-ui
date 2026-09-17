# RadioGroup

以原生 fieldset 和 radio 展示互斥选项，支持方向键和表单提交。

从 `aig-ui/radio-group` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 radio-group.tsx，可编译示例见 radio-group.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：圆环与内核表达互斥选择，选中时核心建立，标签位置保持稳定。动态效果遵循系统减少动态效果偏好。

传入 `value` 时由宿主控制选中值；仅传入 `defaultValue` 时使用原生非受控 radio，表单 `reset()` 恢复默认项，父级重渲染保留重置结果。`form` 同时关联组内每个输入，支持放在表单外的选项组。
