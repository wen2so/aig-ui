# Switch

即时二元状态，使用原生 checkbox 保留键盘和表单值。

从 `aig-ui/switch` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 switch.tsx，可编译示例见 switch.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：发丝胶囊轨道内的刻线缓慢滑行，菱形核心通过平移表达开闭，开启后核心外浮起缓慢自转的虚线轨道。原生开关语义继续生效。 动态装饰遵循系统减少动态效果偏好。
