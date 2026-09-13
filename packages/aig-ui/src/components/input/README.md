# Input

原生单行输入，保留受控值、自动填充、错误与中文输入事件。

从 `aig-ui/input` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 input.tsx，可编译示例见 input.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

视觉表现：单行输入是一把基线尺——主基线两端立起短刻度，线上有稀疏标尺痕，一枚光点沿线缓慢巡航；聚焦和错误状态优先呈现并停止环境运动，文字与输入位置保持稳定。 动态装饰遵循系统减少动态效果偏好。
