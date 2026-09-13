# Select

基于 Base UI 的单选下拉，支持键盘、空选项和已失效值提示。

从 `aig-ui/select` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 select.tsx，可编译示例见 select.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：触发器采用四角括线，右侧箭头在展开与收起时转向。浮层以边缘角标和顶边巡线界定内容，选项保留键盘和禁用语义。动态装饰遵循系统减少动态效果偏好。
