# Checkbox

原生复选框，支持受控值、真实表单值和中间状态。

从 `aig-ui/checkbox` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 checkbox.tsx，可编译示例见 checkbox.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：方形细线结构容纳对勾或中间态，右上定位节点与缺角对齐，选中后补全轮廓。边线持续巡行，禁用时降低亮度并延长周期，文字保持稳定。动态装饰遵循系统减少动态效果偏好。
