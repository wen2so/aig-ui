# Select

基于 Base UI 的单选下拉，支持键盘、空选项和已失效值提示。

从 `aig-ui/select` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 select.tsx，可编译示例见 select.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：触发器保留完整边界，聚焦时基线延展，箭头随展开转向，浮层选项保留定位侧线。动态效果遵循系统减少动态效果偏好。
