# Icon

统一线性图标尺寸，区分装饰图标和具名图像。

从 `aig-ui/icon` 导入，并在宿主导入 `aig-ui/styles.css`。公共类型和默认值见 icon.tsx，可编译示例见 icon.stories.tsx。

支持原生属性、className、style 和 ref；主题通过 --aig- 语义 Token 设置。

当前为实验性 alpha，完整浏览器与发布边界见 docs/progress.md。

方案 2.0 视觉：操作底线、图标细线、标题标记、自然换行与焦点反馈。公共样式保留键盘、禁用、错误和长文本的适用行为；静态文字采用自然字距，动态装饰遵循系统减少动态效果设置。
