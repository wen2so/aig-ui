# CopyButton

复制真实传入的文本，成功后反馈，失败时保留可手动复制的原文。

从 `aig-ui/copy-button` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 copy-button.tsx，可编译示例见 copy-button.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

默认复制图标位于文字前槽位。复制过程中保留按钮尺寸和文字，成功后绘制对勾并显示成功色与“已复制”；失败后显示危险色和可选中的原文。状态反馈紧邻操作，文本域在下一行自然展开。

`leadingIcon` 可覆盖默认复制图标，`trailingIcon` 可补充方向提示。按钮复用 Button 的三角碎片入场、矩形边框、基线扫描和原生键盘行为，动态装饰遵循系统减少动态效果偏好。
