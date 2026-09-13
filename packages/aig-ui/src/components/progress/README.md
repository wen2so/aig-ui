# Progress

展示真实已知进度，非法或未知数值降级为未定进度。

从 `aig-ui/progress` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 progress.tsx，可编译示例见 progress.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.0 线框视觉：发丝轨道与玫瑰进度值；未定进度复用加载标记的扫光带。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
