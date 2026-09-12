# Popover

在触发元素旁展示补充操作，支持焦点恢复和越界定位。

从 `aig-ui/popover` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 popover.tsx，可编译示例见 popover.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.0 视觉：共享玻璃、边缘坐标、分段建立、弧线与显隐过渡。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
